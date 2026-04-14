# KisaanMela Livestock Marketplace — Cloud Architecture & Deployment Guide

**Document type:** Infrastructure & operations  
**Audience:** Engineering, DevOps, security  
**Last updated:** 2026-04-14 (gap-closure pass)  
**Related:** [Livestock product specification](./livestock-marketplace-product-spec.md) (APIs, data model, moderation workflow)

---

## 1. Objective

Deploy a **scalable, secure, production-ready** livestock marketplace with:

| Goal | Approach |
|------|----------|
| **High availability** | Multi-AZ / regional redundancy, health checks, autoscaling |
| **Admin moderation** | Listings created as `pending` → admin approve/reject → public `approved` only |
| **Media (images/videos)** | Object storage + CDN; optional pre-signed uploads |
| **Fast API** | Caching, pagination, indexes, connection pooling, CDN for static assets |

---

## 2. Current feature status (as of 2026-04-14)

This section maps the live codebase at `http://localhost:3000/marketplace/livestock` to the architecture blueprint.

### 2.1 Fully implemented

| Feature | Notes |
|---------|-------|
| Browse page `/marketplace/livestock` | Search, animal-type chips, sidebar filters (breed, price range, min milk, location, verified, sort) |
| Listing detail `/marketplace/livestock/[id]` | View increment, seller info, related listings, PashuGyanChat AI |
| Lead submission | `buyerName`, `buyerPhone`, `buyerMessage`, `buyWithin` (15d/30d/later), `source` — all stored in DB |
| Sell / list page `/marketplace/livestock/sell` | File-upload zone → S3 pre-signed PUT; price suggestion hint; state/district dropdowns; `lactationStatus`, `ageMonths`, `pregnant`, `videoUrl`, `sellerType` |
| Seller+buyer dashboard `/marketplace/livestock/dashboard` | Phone-auth; listings with status/views/lead count; boost buttons (3d/5d/10d); inline delete with confirm; buyer inquiry history |
| Boost | `POST /api/marketplace/livestock/boost` — phone-auth ownership, sets `boostedUntil`, extendable |
| Admin moderation | `PATCH /api/marketplace/livestock/[id]/status` — Bearer JWT with `role: admin`; approve / reject / pending + optional `reason` |
| Seller listing edit | `PATCH /api/marketplace/livestock/[id]` — phone-auth, allowed fields only, resets to `pending` |
| Seller listing delete | `DELETE /api/marketplace/livestock/[id]` — phone-auth soft-delete (`status=archived`) |
| S3 pre-signed upload | `GET /api/marketplace/livestock/upload-url` — validates type/size, returns `{ uploadUrl, objectUrl }` |
| Health endpoint | `GET /api/health` — returns `{ status, db }` for ALB/K8s probes |
| `sellerPhone` required on creation | `POST /api/marketplace/livestock` now rejects requests without a valid 10-digit phone |
| Price intelligence | `GET /api/marketplace/livestock/insights` — avg/min/max + colour-coded tone label |
| Breed suggestions | `GET /api/marketplace/livestock/breeds?animalType=` |
| Lead status management | `PATCH /api/marketplace/livestock/leads/[id]` — seller phone-auth |
| JWT-auth leads | `GET /api/marketplace/livestock/leads/mine` |

### 2.2 Remaining gaps

| Gap | Impact | Priority |
|-----|--------|----------|
| **No rate limiting** | Public `POST /livestock` and `POST /leads` unprotected against spam/abuse | P1 in production |
| **Notifications on lead creation** | Seller receives no WhatsApp/SMS/email when a buyer submits interest | P2 |
| **Admin pending-queue UI/route** | No `GET /api/marketplace/livestock/admin/pending` to list all pending listings; admins must use DB directly | P2 |
| **No geo/distance search** | Location filter is regex-only; no radius-from-me search | P3 |
| **Full JWT auth on listing creation** | `sellerPhone` is required but not cryptographically verified; a spoofed phone can still post | P2 — needs OTP or session |

### 2.3 What to build next

1. **Rate limiting** — Upstash Redis + Next.js middleware (`/api/marketplace/livestock` POST, `/api/marketplace/livestock/leads` POST)
2. **Lead notification worker** — SQS/BullMQ job enqueued after `POST /leads`; sends WhatsApp to `sellerPhone` via Twilio
3. **Admin pending queue** — `GET /api/marketplace/livestock/admin/pending` (Bearer JWT, `role: admin`) + simple admin dashboard page
4. **OTP verification on listing creation** — verify seller phone via SMS OTP before accepting `POST`

---

## 3. High-level architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  Clients: Web (Next.js) · Mobile (React Native)                  │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  CDN: CloudFront / Cloudflare (static assets, media, optional API)│
└────────────────────────────┬────────────────────────────────────┘
                             │
         ┌───────────────────┴───────────────────┐
         ▼                                       ▼
┌─────────────────────┐               ┌─────────────────────────────┐
│  Frontend           │               │  API / BFF                   │
│  Next.js            │──────────────▶│  Next Route Handlers / Node  │
│  Vercel or S3+CF   │               │  ECS / EC2 / Lambda / K8s    │
└─────────────────────┘               └──────────────┬──────────────┘
                                                    │
         ┌──────────────────────────────────────────┼──────────────────┐
         ▼                                          ▼                  ▼
┌─────────────────────┐               ┌─────────────────────┐  ┌──────────────┐
│  MongoDB Atlas      │               │  S3 (media)         │  │  Redis       │
│  (primary datastore)│               │  + optional Cloudinary │  │  (cache)  │
└─────────────────────┘               └─────────────────────┘  └──────────────┘
```

**Monorepo note (this codebase):** Livestock APIs are implemented as **Next.js App Router route handlers** under `web-frontend/src/app/api/marketplace/livestock/`. In production you may keep them on the same Next deployment (simple) or **extract** them behind a dedicated API service and domain (`api.kisaanmela.com`) as you scale.

---

## 4. Infrastructure components

### 4.1 Frontend hosting

| Option | When to use | Notes |
|--------|----------------|-------|
| **A — Vercel (recommended for Next.js)** | Fastest path for App Router, previews, edge | GitHub → auto deploy; env vars in dashboard; `next.config` `images.remotePatterns` already allow S3 |
| **B — S3 + CloudFront** | Full AWS control, static export or SSR via Lambda@Edge / separate compute | Build `next build`; use standalone output or platform docs for SSR on AWS |

This repo's frontend lives in **`web-frontend/`** (`npm run build`, `npm run start`).

### 4.2 Backend / API hosting

| Option | Pattern | Notes |
|--------|---------|-------|
| **A — Single EC2** | Node + **Nginx** reverse proxy, TLS at ALB or Nginx | Good for early production; add systemd or PM2 |
| **B — ECS Fargate** | **Docker** image, ALB, auto scaling | Recommended for horizontal scale without managing servers |
| **C — Kubernetes (EKS / GKE)** | Helm / manifests, HPA | For teams already on K8s |

The monorepo also contains **`backend/`** and **`backend/marketplace-api/`**; livestock listing **MVP APIs** referenced in the product spec are colocated in **web-frontend** route handlers. Plan split when traffic, compliance, or team boundaries require it.

### 4.3 Database

| Role | Recommendation |
|------|----------------|
| **Primary** | **MongoDB Atlas** (M10+ for production), VPC peering or IP allowlist |
| **Alternative** | AWS DocumentDB (Mongo-compatible; operational tradeoffs) |
| **Optional** | PostgreSQL on RDS for billing, analytics, or future relational domains |

**Operational:** Enable **TLS**, least-privilege DB user, **indexes** on hot query paths (`category`, `status`, `specifications.animalType`, geo fields when added). See product spec for `MarketplaceListing` fields.

### 4.4 Media storage

| Need | Pattern |
|------|---------|
| **Images / short video** | **S3** bucket (private), **pre-signed PUT** URLs from API; store **HTTPS URLs** in Mongo |
| **Delivery** | **CloudFront** (or Cloudflare) origin = S3; cache-control headers |
| **Transforms** | Optional **Cloudinary** / **Imgix** for thumbnails and adaptive quality |

**Workflow:** Client requests upload URL from `GET /api/marketplace/livestock/upload-url?filename=&contentType=&size=` → uploads directly to S3 via pre-signed PUT → finalizes listing with `objectUrl` → admin moderation unchanged.

**Current state:** ✅ Implemented. Sell page shows a click-to-upload zone; files PUT directly to S3. URL-paste fallback available in `<details>`. Requires `AWS_S3_BUCKET` and `AWS_REGION` env vars; falls back to `503` gracefully if bucket is not configured.

### 4.5 CDN

- **CloudFront** or **Cloudflare** in front of frontend and media origins.
- Cache **immutable** hashed assets under `/_next/static/`.
- **Do not** over-cache authenticated JSON; use short TTLs or bypass cache for private routes.

---

## 5. Livestock workflow in the cloud

Aligns with the product spec and current data model (`status`: `pending` | `approved` | `rejected` | `archived`).

```
Seller submits listing
        │
        ▼
API validates input — sellerPhone (10 digits) required ✅
        │
        ├── Photos uploaded via GET /upload-url → PUT to S3 ✅
        │
        ▼
Persist MongoDB (status = pending) ✅
        │
        ▼
Seller can edit (PATCH /[id], phone-auth) ✅  or  remove (DELETE /[id], soft-archive) ✅
        │
        ▼
Admin reviews via PATCH /[id]/status (Bearer JWT, role=admin) ✅
        │
        ├── APPROVED ──▶ visible on GET browse (status=approved only) ✅
        │                Seller can boost listing (POST /boost, phone-auth) ✅
        │
        └── REJECTED ──▶ listing hidden; adminNote stored ✅
                │        Seller notification (WhatsApp/SMS) ── ⚠️  not yet wired
                ▼
        Buyer submits lead (POST /leads)
        Fields: buyerName, buyerPhone, buyerMessage, buyWithin, source ✅ all stored
                │
                ▼
        Seller sees lead in dashboard; updates status ✅
        (PATCH /leads/[id], phone-auth: new → contacted → closed → spam)
                │
                └── Seller WhatsApp/SMS notification on new lead ── ⚠️  not yet wired
```

**Production rule:** Public marketplace **GET** routes default to **`approved`** only; use explicit `includePending` (or equivalent) only for admin tools, never for anonymous catalog. Already enforced in `GET /api/marketplace/livestock`.

---

## 6. API layer — complete route map

### 6.1 Implemented routes

Base path: **`/api/marketplace/livestock`**

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/marketplace/livestock` | None | Browse `approved` listings. Filters: `animalType`, `breed`, `minPrice`, `maxPrice`, `location`, `minMilk`, `verifiedOnly`, `sortBy`, `q`, `page`, `limit` |
| `POST` | `/api/marketplace/livestock` | sellerPhone required | Create listing (`status=pending`). Requires `name`, `description`, `price`, `location`, `sellerId`, valid 10-digit `sellerPhone`, ≥1 image URL |
| `GET` | `/api/marketplace/livestock/[id]` | None | Detail + 6 related + increments `viewsCount` |
| `PATCH` | `/api/marketplace/livestock/[id]` | Phone match | Seller edits listing. Allowed: `name`, `description`, `price`, `images`, `location`, `tags`, `specifications`, `videoUrl`. Resets status to `pending` |
| `DELETE` | `/api/marketplace/livestock/[id]` | Phone match | Soft-delete — sets `status=archived` |
| `PATCH` | `/api/marketplace/livestock/[id]/status` | Bearer JWT `role=admin` | Admin approve / reject / pending. Optional `reason` stored as `adminNote` |
| `POST` | `/api/marketplace/livestock/boost` | Phone match | Sets `boostedUntil = now + days` (3/5/10). Extends existing boost if still active |
| `GET` | `/api/marketplace/livestock/upload-url` | None | Returns S3 pre-signed PUT URL (5 min, 25 MB limit). Requires `AWS_S3_BUCKET` env var |
| `GET` | `/api/marketplace/livestock/breeds` | None | `?animalType=cow` → breed list |
| `GET` | `/api/marketplace/livestock/insights` | None | `?price=&breed=&animalType=` → avg/min/max price + tone label |
| `POST` | `/api/marketplace/livestock/leads` | None | Submit buyer interest. All fields stored: `listingId`, `buyerName`, `buyerPhone`, `buyerMessage`, `buyWithin` (15d/30d/later), `source` |
| `PATCH` | `/api/marketplace/livestock/leads/[id]` | Phone match | Seller updates lead status: `new`→`contacted`→`closed`→`spam` |
| `GET` | `/api/marketplace/livestock/leads/mine` | Bearer JWT | Buyer or seller's own leads |
| `GET` | `/api/marketplace/livestock/dashboard` | Phone param | Combined seller+buyer dashboard (listings + leads + analytics + boost status) |
| `GET` | `/api/health` | None | Liveness probe — `{ status: 'ok'|'degraded'|'error', db }`. Used by ALB / K8s |

### 6.2 Routes still to build

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/marketplace/livestock/admin/pending` | Admin: paginated list of all `status=pending` listings for review queue |

### 6.3 Future split API (optional)

If you move to a dedicated host:

- **Public base:** `https://api.kisaanmela.com`
- **Example mapping:** `GET https://api.kisaanmela.com/v1/livestock` proxies to same handlers or Node service.
- Keep **CORS** allowlist to your web + mobile origins only.

---

## 7. Security setup

| Layer | Control | Status |
|-------|---------|--------|
| **Authentication** | JWT (access) + refresh rotation; httpOnly cookies if same-site; short access TTL | Partial — `leads/mine` uses JWT; admin routes require `role=admin` JWT; listing creation requires valid `sellerPhone` |
| **API** | Rate limiting (ALB / API Gateway / **Nginx** `limit_req` / middleware), **CORS** strict allowlist | ⚠️ Rate limiting not yet implemented — add Upstash middleware on public write routes |
| **Transport** | **HTTPS only**; ACM certificates on ALB / CloudFront | Production-only |
| **Data** | TLS to MongoDB; **no secrets** in client bundles; use IAM roles for S3 from compute | TLS to Atlas ✅; `AWS_S3_BUCKET` must be set for uploads; use IRSA/instance profile in production |
| **Admin** | Separate `role=admin` JWT claim required for status mutations | ✅ Admin status route built — IP allowlist / VPN recommended in production |

---

## 8. Deployment steps

### 8.1 Frontend (Next.js)

```bash
cd web-frontend
npm ci
npm run build
npm run start   # or platform-specific: vercel deploy, container, etc.
```

Set production env vars in the hosting provider (see §9).

### 8.2 Seed data

```bash
# From web-frontend/
node scripts/seed-marketplace-livestock.js   # 15 livestock listings → MongoDB Atlas
node scripts/seedMelaEvents.js               # 35 kisan mela events
node scripts/seed-news.js                    # 22 news articles
```

### 8.3 Backend API (Docker / ECS example)

```bash
docker build -t kisaanmela-api:latest -f Dockerfile.api .
docker tag kisaanmela-api:latest <ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com/kisaanmela-api:latest
docker push <ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com/kisaanmela-api:latest
# ECS service update / new task definition deploy
```

Use **health check** endpoint (`GET /api/health`) on ALB target group. ✅ Built — returns `{ status, db }`, 503 on DB degraded.

### 8.4 Database & storage

1. Create **Atlas cluster**; whitelist app egress IPs or use VPC peering.  
2. Create **S3** bucket; block public access; bucket policy for CloudFront OAC (origin access) if using CF.  
3. Run migrations / ensure **indexes** (see product spec).

---

## 9. Environment variables (reference)

Set in Vercel / ECS task definition / secrets manager — **never** commit real values.

| Variable | Purpose |
|----------|---------|
| `NODE_ENV` | `production` |
| `MONGODB_URI` / `DATABASE_URL` | Mongo connection (Atlas) |
| `JWT_SECRET` | Signing (used by `leads/mine` and sell page auth) |
| `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` | Only if not using IAM roles; prefer **IRSA** / instance profile |
| `AWS_S3_BUCKET` | Media bucket — **required** for `GET /upload-url`; route returns `503` gracefully if missing |
| `AWS_CDN_URL` | Optional CloudFront base URL (e.g. `https://d1xxx.cloudfront.net`); defaults to S3 path |
| `NEXT_PUBLIC_*` | Only non-sensitive client-visible config (e.g. public analytics id) |
| `SENTRY_DSN` | Error monitoring (optional) |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Rate limiting via Upstash (when added) |

**This repo:** `web-frontend/next.config.js` merges parent `.env` for some Mongo keys during build — document your **canonical** secret store for production (AWS Secrets Manager, Doppler, etc.).

---

## 10. Scaling strategy

| Tier | Action |
|------|--------|
| **App** | Horizontal replicas behind ALB; CPU/memory-based autoscaling |
| **MongoDB** | Atlas vertical tier (M10 → M50+); **read replicas** for read-heavy reporting |
| **Cache** | **Redis** (ElastiCache / Upstash): listing fragments, filter facets, rate-limit counters |
| **CDN** | Offload static + media; consider **stale-while-revalidate** for semi-static JSON |

---

## 11. Performance optimization

- **Images:** Compress client-side or server-side before storage; WebP/AVIF where supported (`next/image` remote patterns already include S3).
- **UI:** Lazy load below-the-fold media; paginate lists (`limit` default 12, max 48 in API).
- **API:** Pagination + indexed queries; optional Redis for hot keys.
- **Next.js:** Production build; avoid shipping dev source maps publicly unless needed.
- **Browse query:** Add compound MongoDB index `{ category: 1, status: 1, 'specifications.animalType': 1, createdAt: -1 }` for the primary browse filter path.

---

## 12. CI/CD pipeline (recommended)

| Stage | Tooling |
|-------|---------|
| Trigger | **GitHub Actions** on `main` / tags |
| Quality | `npm test`, `npm run lint`, `type-check` |
| Build | Docker build + `next build` artifact as needed |
| Registry | **ECR** / GHCR |
| Deploy | ECS deploy, or Vercel Git integration |
| Post-deploy | **CloudFront invalidation** for `/*` or hashed paths only |

Store **OIDC** to AWS from GitHub Actions instead of static AWS keys where possible.

---

## 13. Notifications (cloud)

| Channel | Service | Status |
|---------|---------|--------|
| SMS | **AWS SNS** | Not yet wired |
| WhatsApp | **Twilio** / Meta Cloud API | Not yet wired |
| Email | SES | Not yet wired |

Wire webhooks or queue workers so notification failures do not block listing creation. A background worker approach:

```
POST /api/marketplace/livestock/leads
  → persist lead
  → enqueue job (SQS / BullMQ)
  → worker picks up → sends WhatsApp to seller.sellerPhone
```

---

## 14. Monitoring & logging

| Type | Options |
|------|---------|
| **Metrics & logs** | CloudWatch, Datadog, Grafana Cloud |
| **APM** | Datadog APM, New Relic, AWS X-Ray |
| **Errors** | **Sentry** (frontend + API) |
| **Audit** | Admin approve/reject events → append-only log or collection |

---

## 15. Backup strategy

- **MongoDB Atlas:** continuous backup / point-in-time restore (by tier).  
- **S3:** versioning + lifecycle to Glacier for old media (cost control).  
- **Runbooks:** document RTO/RPO and restore drills.

---

## 16. Testing environments

| Env | Purpose |
|-----|---------|
| **Development** | Local + shared dev Atlas cluster (`kisaanmela` DB) — seed with `npm run seed:listings` |
| **Staging** | Production-like config, smaller SKUs; test migrations here first |
| **Production** | Hardened secrets, monitoring, on-call |

---

## 17. Cost optimization

- Right-size Atlas and ECS tasks; use **autoscaling** min/max wisely.  
- S3 lifecycle policies; CloudFront price class by audience geography.  
- Optional **Spot** for fault-tolerant batch workers (not for single primary API without design).

---

## 18. Repository layout (reference)

**Backend-style modules (conceptual or split services):**

```
src/
 ├── modules/
 │    ├── livestock/
 │    ├── user/
 │    ├── admin/
 ├── middleware/
 ├── utils/
 └── config/
```

**This monorepo (livestock-related):**

```
web-frontend/
 ├── src/app/marketplace/livestock/
 │    ├── page.tsx                    ← browse (filters, chips, grid)
 │    ├── [id]/page.tsx               ← detail + PashuGyanChat AI + lead form
 │    ├── sell/page.tsx               ← create listing (price hints, state/district dropdowns)
 │    └── dashboard/page.tsx         ← seller+buyer phone-auth dashboard
 │
 ├── src/app/api/marketplace/livestock/
 │    ├── route.ts                    ← GET browse / POST create (sellerPhone required)
 │    ├── [id]/route.ts               ← GET detail · PATCH edit · DELETE soft-archive
 │    ├── [id]/status/route.ts        ← PATCH admin approve/reject (role=admin JWT)
 │    ├── boost/route.ts              ← POST set boostedUntil (phone-auth)
 │    ├── upload-url/route.ts         ← GET S3 pre-signed PUT URL
 │    ├── breeds/route.ts             ← GET breed list by type
 │    ├── insights/route.ts           ← GET price intelligence
 │    ├── dashboard/route.ts          ← GET seller+buyer dashboard
 │    ├── leads/route.ts              ← POST submit lead (buyWithin+source stored)
 │    ├── leads/[id]/route.ts         ← PATCH update lead status (phone-auth)
 │    └── leads/mine/route.ts         ← GET my leads (JWT)
 │
 ├── src/app/api/health/
 │    └── route.ts                    ← GET liveness probe
 │
 ├── src/components/marketplace/livestock/
 │    ├── LivestockAnimalCard.tsx      ← browse card
 │    ├── LivestockFilters.tsx         ← sidebar/sheet filter panel
 │    └── PashuGyanChat.tsx           ← AI chat widget on detail page
 │
 ├── lib/livestock/
 │    ├── livestockSpecifications.ts  ← ANIMAL_TYPES, BREEDS_BY_TYPE, priceInsightLabel
 │    └── indiaGeoData.ts             ← INDIA_STATES, DISTRICTS_BY_STATE
 │
 ├── lib/models/
 │    ├── MarketplaceListing.ts       ← Mongoose model; status: pending|approved|rejected|archived; boostedUntil, adminNote added
 │    └── LivestockLead.ts            ← Mongoose model; buyWithin, source fields added
 │
 └── scripts/
      └── seed-marketplace-livestock.js  ← 15 seeded listings (Gir, Murrah, HF, etc.)

docs/
 └── livestock-marketplace-product-spec.md  ← product & API reference
```

---

## 19. Production checklist

- [ ] HTTPS everywhere; HSTS at edge  
- [ ] Secrets in manager (not repo); rotate JWT/signing keys  
- [ ] MongoDB indexes: `{ category:1, status:1, 'specifications.animalType':1, createdAt:-1 }` and `{ sellerPhone:1 }` and `{ listingId:1 }` (on leads)
- [ ] CDN for `/_next/static` and media  
- [ ] **Rate limiting on public POST/PUT** — Upstash Redis middleware still needed  
- [x] **sellerPhone required on listing creation** — 10-digit validation enforced ✅  
- [x] **Admin approve/reject route** — `PATCH /[id]/status` with `role=admin` JWT ✅  
- [x] **Boost API route** — `POST /boost` with phone-auth ownership check ✅  
- [x] **`/api/health` endpoint** — returns `{ status, db }`, 503 on degraded ✅  
- [x] **S3 pre-signed upload** — `GET /upload-url`; sell page has upload zone ✅  
- [x] **`buyWithin` + `source` stored in leads** ✅  
- [x] **Seller edit/delete** — `PATCH /[id]` and `DELETE /[id]` with phone-auth ✅  
- [ ] CORS restricted to known origins  
- [ ] Error tracking (Sentry) with PII scrubbing  
- [ ] Notification worker for seller WhatsApp/SMS on new lead  
- [ ] Admin pending-queue route + UI (`GET /admin/pending`)  
- [ ] OTP verification on seller phone before listing creation  
- [ ] Runbook for incident + rollback  

---

## 20. Future enhancements

- **ML:** Price prediction microservice (batch or real-time features) — foundation exists via `/api/marketplace/livestock/insights`  
- **Trust & safety:** **AWS Rekognition** / third-party for image moderation on uploaded photos  
- **Search:** OpenSearch / Elasticsearch for full-text and geo-radius (`find cattle within 50km`) search  
- **Realtime:** WebSockets for live view counters and instant lead notifications  
- **Verified seller badge:** OTP → Aadhaar/KYC verification flow; set `verifiedListing=true` after human review  
- **Bulk listing CSV upload** for large traders / cooperatives  
- **Auction mode:** Time-bound bidding on high-value breeding animals  

---

## 21. Optional infrastructure deliverables (not in this doc)

| Deliverable | Description |
|-------------|-------------|
| **Terraform** | VPC, ALB, ECS, S3, CloudFront, Atlas peering placeholders |
| **docker-compose** | Local Mongo + MinIO + Next for full-stack dev |
| **Kubernetes manifests** | Deployment, Service, Ingress, HPA for API |
| **GitHub Actions** | CI workflow YAML under `.github/workflows/` |
| **Redis caching** | Upstash middleware for rate limiting + listing GET cache-aside |

---

*End of document.*
