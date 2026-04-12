# Advanced Livestock Marketplace — Product Specification

**Route (target):** `/marketplace/livestock`  
**Status:** Product vision & MVP blueprint (implementation TBD)

---

## 1. Product vision

Build India’s most trusted livestock trading surface by combining:

- A **verified** animal marketplace  
- **Direct** buyer–seller connection (call, WhatsApp, structured leads)  
- **AI + data-driven** pricing hints and discovery  
- **Offline mela** presence with **online** discovery and follow-up  

This module is positioned as a **high-ticket** vertical: even a modest volume of qualified leads and transactions can drive meaningful revenue when paired with events (melas) and trust layers.

---

## 2. Differentiation vs basic listing sites

| Dimension | Typical platforms | This product |
|-----------|-------------------|--------------|
| Listings | Simple text + photo | Rich, structured, verifiable |
| Trust | Low / unknown sellers | Verification, ratings, badges |
| Discovery | Manual browse | Smart filters, sort, optional AI |
| Conversion | Weak CTAs | WhatsApp, call, saved leads |
| Offline | None or ad-hoc | Mela integration, same brand journey |

---

## 3. User personas

### Farmer (seller)

- Wants to sell cattle (or other livestock) **quickly**  
- Needs a **fair, transparent** price signal  
- Often mobile-first, limited time for complex UIs  

### Trader

- **Bulk** buying and selling  
- Needs **leads**, repeat relationships, and efficiency  

### Buyer

- Wants **healthy, verified** animals  
- Values **location**, **health/vaccination** signals, and **clear pricing**  

---

## 4. Core features (detailed)

### 4.1 Animal listing system (advanced)

**Core fields (MVP+):**

- Animal type: cow, buffalo, goat, sheep (extensible)  
- Breed (with **auto-suggest** from a controlled vocabulary)  
- Age (years / months)  
- Lactation status  
- Milk yield (litres/day), where relevant  
- Pregnant status (where relevant)  
- Health condition (structured + free text)  
- Vaccination records (structured checklist + uploads)  
- Price (fixed / negotiable)  
- Location: city, state, optional **GPS**  
- Images: **5–10** per listing  
- Video: **required for premium** tier (policy-driven)  
- Seller type: farmer / trader  

**Smart add-ons (post-MVP where noted):**

- Auto breed suggestions  
- Price recommendation engine (location + breed + signals)  
- Duplicate / near-duplicate detection  

---

### 4.2 Search & discovery

**Filters:**

- Location (manual + optional auto-detect)  
- Animal type  
- Breed  
- Price range  
- Milk capacity (where applicable)  
- Lactation stage  
- **Verified only** toggle  

**Sorting:**

- Nearest first (when coordinates available)  
- Price: low → high  
- Best rated  
- Recently added  

---

### 4.3 Animal detail page (conversion-focused)

**Sections:**

1. **Media** — image carousel, optional video  
2. **Animal details** — breed, age, milk output, health, vaccination summary  
3. **Seller** — name, rating, total listings, verification badges  

**Primary CTAs:**

- WhatsApp seller  
- Save / favourite  
- Call  

**Conversion boosters (phased):**

- Social proof: “N buyers viewed this today” (privacy-safe aggregation)  
- “Similar animals nearby”  

---

### 4.4 Trust & verification

**Verification types (phased):**

- Vet certificate upload + review  
- Location verification (policy: selfie at location, OTP, or third-party)  
- Real-time / recent photo validation (policy + ops)  

**Badge system (examples):**

- Verified seller  
- Top trader  
- Trusted listing  

---

### 4.5 Lead & inquiry system

**Flow:**

1. User taps **Interested**  
2. Lead is created server-side  
3. Seller is notified (in-app + WhatsApp template where integrated)  

**Lead record (conceptual):**

- `buyer_id`  
- `seller_id`  
- `animal_id` (listing id)  
- `timestamp`  
- `status` (new, contacted, closed, spam, etc.)  

---

### 4.6 Seller dashboard

- My listings (draft / live / rejected)  
- Leads received  
- Boost / feature listing (monetization)  
- Analytics: views, clicks, WhatsApp taps  

---

### 4.7 Buyer dashboard

- Saved animals  
- Inquiry / lead history  
- Alerts: new animals near me (opt-in, rate-limited)  

---

### 4.8 Price intelligence (differentiator)

**Surfaced to users:**

- Average price in region (breed + type bucket)  
- Simple trend (e.g. last 30 days) where data allows  
- Plain-language hint: “Looks like a good deal” / “Priced above typical range” (always with caveats)  

---

### 4.9 Logistics & services (future monetization)

- Transport booking  
- Animal insurance partnerships  
- Documentation / compliance assistance  

---

## 5. UI structure

### 5.1 Main listing page (`livestock-layout`)

- Prominent **search**  
- **Category chips:** Cow | Buffalo | Goat | Sheep  
- **Filters** (sidebar on desktop, sheet on mobile)  
- **Listings grid**  
- Optional **sticky WhatsApp** support CTA  

### 5.2 Listing card (`animal-card`)

- Hero image  
- Breed line + key stats (e.g. milk L/day, age)  
- Price  
- Location  
- Actions: **View** | **Contact**  

### 5.3 Detail page (`animal-detail`)

- Gallery + video  
- Animal + health block  
- Seller block + badges  
- WhatsApp | Call | Save  
- Similar listings  

---

## 6. Data model (conceptual)

### Animals (listings)

| Concept | Notes |
|--------|--------|
| Identity | `id`, `seller_id` |
| Taxonomy | `type`, `breed` |
| Biology / production | `age`, lactation, `milk_yield`, `pregnant` |
| Health | `health_status`, `vaccination_status` / records |
| Commerce | `price`, `negotiable` |
| Geo | `city`, `state`, `lat`, `lng` |
| Trust | `verified`, trust flags |
| Engagement | `views_count`, timestamps |

### Users

- `id`, `name`, `phone`, `role`, `rating`, `verified`  

### Leads

- `id`, `animal_id`, `buyer_id`, `seller_id`, `status`, `created_at`  

*(Actual schema should align with the chosen backend: Mongo listings vs Nest/Postgres marketplace — see `docs/marketplace-architecture.md`.)*

---

## 7. API design (REST sketch)

**Animals**

- `GET /animals` — list + filters + pagination  
- `POST /animals` — create (auth + seller role)  
- `GET /animals/:id` — detail  
- `PATCH /animals/:id` — update  

**Leads**

- `POST /leads` — create interest  
- `GET /leads/my` — buyer or seller scoped list  

**Users**

- `GET /users/:id` — public seller profile slice  

*(Paths are illustrative; global prefix e.g. `/api` and versioning depend on the implementation stack.)*

---

## 8. Frontend structure (Next.js App Router sketch)

```text
src/app/marketplace/livestock/
  page.tsx                 # listing + filters
  [id]/page.tsx            # detail
  components/              # or under src/components/marketplace/livestock/
    AnimalCard.tsx
    LivestockFilters.tsx
    LivestockDetailMedia.tsx
    SellerInfo.tsx
```

Align routing with existing patterns: today `/marketplace/[category]` covers Mongo-backed `equipment` | `livestock` | `product`. This spec may justify a **dedicated livestock hub** under `/marketplace/livestock` with richer models, or an evolution of the shared category page.

---

## 9. Monetization (summary)

| Lever | Indicative range (INR) |
|-------|-------------------------|
| Listing fees | ₹99 – ₹499 |
| Featured listings | ₹500 – ₹2,000 |
| Lead charges | ~₹100 per qualified lead |
| Take rate | 1% – 3% on facilitated transactions |
| Logistics / services | ₹500 – ₹5,000+ |

---

## 10. Growth strategy (phased)

**Phase 1 — Launch corridors**

- Focus states (e.g. Andhra + Punjab as examples)  
- WhatsApp-forward acquisition and mela tie-ins  

**Phase 2 — Trust & intelligence**

- Verification workflows  
- Price intelligence v1  

**Phase 3 — Services**

- Logistics, insurance, documentation  

---

## 11. Risks & mitigations

| Risk | Mitigation |
|------|------------|
| Fraudulent listings | Video for premium; verification; reporting; rate limits |
| Low trust | Reviews, ratings, badges, clear seller history |
| Poor liquidity | Mela + online funnel; lead products for traders |

---

## 12. Success metrics

- Listings per day / active sellers  
- Leads generated and contact rate  
- Conversion: view → lead → offline deal (track proxies)  
- Revenue: listings, boosts, leads, commission  

---

## 13. MVP checklist

- [ ] Animal listing (create + edit + submit for approval if moderated)  
- [ ] Listing browse with **core filters** (type, breed, price, location)  
- [ ] Detail page with **WhatsApp** + **call** + save  
- [ ] **Lead** capture (“Interested”) + seller notification (minimal)  
- [ ] Basic **seller** view of “my listings” and “my leads”  

**Defer to post-MVP:** full price engine, logistics, advanced verification automation, video-as-gate for all tiers.

---

## 14. Closing note

This livestock vertical is **high-ticket** and **trust-sensitive**. Pairing it with **KisaanMela melas** (offline discovery → online follow-up) is a structural advantage over generic classifieds. Implementation should reuse shared marketplace infrastructure where possible (auth, images, admin moderation) while allowing **livestock-specific** fields and UX on `/marketplace/livestock` and detail routes.

---

*Document version: 1.0 — aligned with internal roadmap; update when MVP scope is locked.*
