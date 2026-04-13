# KisaanMela marketplace — architecture (spec-aligned)

This document mirrors the product specification so engineers can navigate the monorepo by **module**. The canonical API contract is **Swagger** at `/docs` when the Nest app is running.

---

## Tech stack

| Layer | Choice | Location |
|--------|--------|----------|
| Frontend | Next.js + Tailwind + TypeScript | `web-frontend/` |
| Backend | Node.js (NestJS) | `backend/marketplace-api/` |
| Database | PostgreSQL + Prisma ORM | `backend/marketplace-api/prisma/` |
| Auth | JWT + OTP (mobile-first) | `backend/marketplace-api/src/auth/` |
| Storage | AWS S3 (presigned PUT via `@aws-sdk/client-s3`) | `backend/marketplace-api/src/storage/` · env: `AWS_S3_BUCKET`, `AWS_REGION`, credentials |
| Payments | Razorpay | `backend/marketplace-api/src/payments/` |

---

## Core modules

### 1. Auth system

- Mobile OTP login, JWT, roles **Buyer / Seller / Admin**
- **API:** `src/auth/` (`auth.controller.ts`, `auth.service.ts`, DTOs, JWT strategy)
- **UI (Next.js):** No dedicated Nest-auth pages in `web-frontend`; use site `/login` for app auth where applicable, or call Nest `POST /api/auth/*` from a future client.

### 2. User module

- Profile, addresses, order history
- **API:** `src/users/`
- **Prisma:** `User`, `Address`, `Order` relations

### 3. Seller module

- Onboarding, KYC, store (name, logo, description), dashboard data via APIs
- **API:** `src/sellers/`
- **Prisma:** `SellerProfile`, `Store`, `SellerKycStatus`
- **UI:** Primarily API/Swagger today; Next.js seller dashboard pages TBD

### 4. Product module

- CRUD, title/description/price/category/images/stock/location, SKU, category tree
- **Images:** sellers call `POST /api/storage/presign-product-image` (JWT, SELLER), upload with PUT to `uploadUrl`, then submit `publicUrl` in `CreateProductDto.imageUrls`
- **API:** `src/products/`, `src/storage/`
- **Prisma:** `Product`, `ProductImage`, `Category`
- **UI (Next.js):** Mongo listing browse at `web-frontend/src/app/marketplace/`; farmer product detail at `web-frontend/src/app/farmers-market/product/[id]/`. Shared cards under `web-frontend/src/components/marketplace/`.

### 5. Marketplace features

- Search (`q`), filters (price, category, state, district), sort (latest, price, popularity)
- **API:** `GET /api/products` — `ProductQueryDto` / `ProductsService.listPublic`
- **Optional:** Elasticsearch — not integrated; DB ILIKE search today

### 6. Cart & checkout

- Multi-vendor line items, address selection, Razorpay, order placement
- **API:** `src/cart/`, `src/orders/`, `src/payments/`
- **UI:** No Next.js cart wired to Nest in-repo; full checkout + Razorpay UI flow TBD

### 7. Order management

- Status: placed → packed → shipped → delivered (+ cancelled), tracking ID, history
- **Prisma:** `OrderStatus`, `Order.trackingId`
- **API:** `src/orders/`

### 8. Reviews system

- Product reviews, seller (store) ratings
- **API:** `src/reviews/`
- **Prisma:** `ProductReview`, `SellerReview`

### 9. Chat system

- Buyer–seller threads and messages (inquiry-style)
- **API:** `src/chat/`
- **Prisma:** `ChatThread`, `ChatMessage`

### 10. Admin panel

- Users, sellers, product approval, orders, commission, analytics-style endpoints
- **API:** `src/admin/` (ADMIN role)
- **Prisma:** `CommissionLedger`, `ProductStatus`, KYC fields
- **UI:** Admin Next.js console TBD (Swagger for now)

### 11. Agri-specific features

- State/district on products; categories animals, seeds, tools, land (+ seed children)
- **Seed:** `backend/marketplace-api/prisma/seed.ts`
- **Events / melas (two stores):**
  - **Site CMS (MongoDB, Mongoose)** — collection `events`, model `Event` in `web-frontend/lib/models/CMSModels.ts`. Public melas list: `/api/cms/events`. Seed file `web-frontend/data/mela-seed.json`, loader `npm run seed:melas` → `scripts/seedMelaEvents.js`. **Not Prisma** — Mongo only here.
  - **Marketplace API (PostgreSQL, Prisma)** — `AgriEvent` in `backend/marketplace-api`, `src/events/`
- **UI:** Main site `/events` (CMS / Mongo); Prisma `AgriEvent` via Nest API as needed
- **Load demo + melas into Atlas:** from `web-frontend` run `npm run seed:all` (uses monorepo root `.env`). Check with `npm run db:mongo:status`. In **Compass**, open database **`kisaanmela_db_dev`** (name in your URI path), not `admin` / `local`.

### 12. Notifications

- SMS + email, order updates, seller alerts
- **Status:** Not wired — add workers/webhooks calling providers from order/payment services

### 13. Performance & scaling

- Lazy loading / image CDN: Next.js + deployment config
- API caching (Redis): optional; compose may include Redis — app cache layer TBD

### 14. Security

- Input validation: global `ValidationPipe` in `main.ts`
- Rate limiting: `ThrottlerModule` + `APP_GUARD` in `app.module.ts`
- RBAC: `RolesGuard`, `@Roles()` — see `src/common/`

---

## Deliverables

| Item | Where |
|------|--------|
| Modular Nest architecture | `backend/marketplace-api/src/*` modules wired in `app.module.ts` |
| REST + Swagger | `http://localhost:4000/docs` (global prefix `/api`) |
| Reusable UI components | `web-frontend/src/components/marketplace/` |
| Marketplace listing UI | `web-frontend/src/app/marketplace/`, `web-frontend/src/app/farmers-market/` |
| Category seed data | `prisma/seed.ts` |
| ER diagram | `backend/marketplace-api/docs/ER-DIAGRAM.md` |
| API documentation | `backend/marketplace-api/docs/API-OVERVIEW.md` |
| Docker + CI/CD | `backend/marketplace-api/DEPLOYMENT.md`, `.github/workflows/agri-marketplace-api.yml` |

---

## Mobile-first rural UX

- Primary browse: **`/marketplace`** and **`/farmers-market`** (site-wide header/footer)
- Large tap targets, simple copy, OTP-first sign-in where the main app implements it (`/login`)
