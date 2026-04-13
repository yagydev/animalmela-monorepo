# Livestock Marketplace — Product Specification

**Route:** `/marketplace/livestock`  
**Document version:** 2.0  
**Last updated:** 2026-04-13  
**Status:** MVP shipped · Phase 2 in planning

---

## 1. Product vision

Build India's most trusted livestock trading surface by combining:

- A **verified** animal marketplace
- **Direct** buyer–seller connection (call, WhatsApp, structured leads)
- **AI + data-driven** pricing hints and discovery
- **Offline mela** presence with **online** discovery and follow-up

Positioned as a **high-ticket** vertical: even modest transaction volume drives meaningful revenue when paired with mela events and trust layers.

---

## 2. Competitive landscape

### Pashushala.com — key observations (audited April 2026)

| What they do well | Our response |
|---|---|
| HOT DEAL badge — ₹99/5 days lifts to top + removes "Unverified" | Build Boost Listing (Phase 2) |
| State → District geo filter (36 states) | Build geo filter (Phase 2) |
| Buy-intent on enquiry form ("Buy within 15/30/>30 days") | Add to lead form (Phase 2 quick win) |
| Source tracking on enquiries (8 channels) | Add to leads API (Phase 2 quick win) |
| PashuGuru.AI — livestock advisory chatbot | Build PashuGyan AI (Phase 2) |
| Ration Calculator — daily stickiness tool | Build (Phase 2) |
| Pashumitra — field agent / affiliate program | Plan (Phase 3) |
| 11 language support | Plan (Phase 3) |

| What they're missing (our edge) | Status |
|---|---|
| Price intelligence / market comparison | ✅ Built |
| Milk yield / lactation / pregnancy filters | ✅ Built |
| Seller dashboard with lead management | ✅ Built |
| Lead status management (contacted/closed/spam) | ✅ Built |
| Save / favourite animals | ✅ Built |
| Direct WhatsApp + Call on listing (no forced form) | ✅ Built |
| Animal comparison feature | Phase 2 |
| Buyer alerts (price drop, new match) | Phase 3 |

### Differentiation vs generic classifieds

| Dimension | Generic | Pashushala | KisaanMela |
|---|---|---|---|
| Listings | Text + photo | Rich metadata | Rich + verified + price intel |
| Trust | None | Unverified badge | Verification flow + badges |
| Discovery | Manual browse | State/breed filter | Smart filters + AI |
| Conversion | Contact form | Enquiry form | WhatsApp + Call + Lead + Save |
| Intelligence | None | None | Price insights + AI advisor |
| Offline | None | None | Mela integration |
| Seller tools | None | Basic | Dashboard + analytics + boost |

---

## 3. User personas

### Farmer (seller)
- Wants to sell quickly at a fair price
- Mobile-first, limited time
- Needs price signal and simple listing flow

### Trader
- Bulk buying/selling
- Needs leads, repeat relationships, efficiency
- Values seller analytics and lead management

### Buyer
- Wants healthy, verified animals
- Values location, health/vaccination signals, clear pricing
- Needs comparison tools and saved wishlist

### Field Agent (Pashumitra — Phase 3)
- On-ground data entry on behalf of farmers
- Commission-based, needs mobile-optimised listing flow

---

## 4. Core features

### 4.1 Animal listing system

**Fields — implemented ✅**

| Field | Notes |
|---|---|
| Animal type | cow, buffalo, goat, sheep, poultry, other |
| Breed | Auto-suggest from controlled vocabulary |
| Age | years + months |
| Lactation status | free text |
| Milk yield | litres/day |
| Pregnant status | boolean |
| Health condition | free text |
| Vaccination summary | free text |
| Price | with negotiable flag |
| Location | city, state, optional lat/lng |
| Images | up to 10 URLs |
| Video URL | optional |
| Seller type | farmer / trader |
| Verified listing | boolean badge |

**Fields — planned (Phase 2)**

- State + district (structured geo, replaces free-text location)
- Ear tag / animal ID
- Weight estimate
- Vaccination records as structured checklist + file upload

**Smart add-ons — planned**

- Price suggestion on sell form (reuses existing `/insights` API) — Phase 2
- Duplicate / near-duplicate detection — Phase 3

---

### 4.2 Search & discovery

**Filters — implemented ✅**

- Animal type (chips + dropdown)
- Breed (searchable datalist)
- Price range (min/max)
- Location (text match — city/state)
- Milk yield minimum
- Verified only toggle
- Sort: recently added, price asc/desc, milk yield desc

**Filters — planned (Phase 2)**

- State → District structured geo filter
- Age range
- Lactation stage
- Pregnant only toggle
- Nearest first (requires lat/lng on listings)

---

### 4.3 Animal detail page

**Implemented ✅**

- Image carousel with dot indicators
- Animal type label, price (with negotiable), location, view count
- Price check box (market comparison insight — colour-coded)
- Animal details: breed, age, milk yield, lactation, pregnant, health, vaccination, seller type
- Seller block: name, rating, location, verified badge
- Primary CTAs: **WhatsApp seller**, **Call**, **Save / ♥ Favourite** (localStorage)
- Video link (if present)
- Lead form: name + phone + optional message → POST `/api/marketplace/livestock/leads`
- "Similar nearby" grid (up to 6 related listings)
- Social proof: "N+ views recently"

**Planned (Phase 2)**

- Buy-intent on lead form: "Buy within: 15 days / 30 days / later"
- Animal comparison (add to compare, side-by-side modal)
- Share to WhatsApp / social

---

### 4.4 Trust & verification

**Implemented ✅**

- `verifiedListing` boolean flag on listings (set by seller at submission, approved by admin)
- Verified badge on listing cards and detail page

**Planned (Phase 2)**

- Phone OTP verification for sellers → "Verified Seller" badge (distinct from listing badge)
- Seller verification tier: Phone verified → Location verified → Vet cert uploaded

**Planned (Phase 3)**

- Vet certificate upload + admin review
- Real-time photo validation (timestamp + GPS watermark)
- Ear tag / animal ID registry

**Badge system**

| Badge | Trigger | Phase |
|---|---|---|
| Verified listing | Admin approves | ✅ Now |
| Phone verified seller | OTP confirmed | Phase 2 |
| Top trader | 10+ completed leads | Phase 2 |
| Vet certified | Vet cert uploaded + reviewed | Phase 3 |

---

### 4.5 Lead & inquiry system

**Implemented ✅**

- POST `/api/marketplace/livestock/leads` — buyer name + phone + optional message
- Lead schema: `listingId`, `sellerId`, `sellerPhone`, `buyerId`, `buyerName`, `buyerPhone`, `buyerMessage`, `status`
- Lead statuses: `new` → `contacted` → `closed` / `spam`
- PATCH `/api/marketplace/livestock/leads/[id]` — seller updates status (phone-based auth)
- GET `/api/marketplace/livestock/leads/mine` — JWT-auth buyer/seller scoped list

**Planned (Phase 2)**

- `buyWithin` field on lead: `'15d' | '30d' | 'later'`
- `source` field: `'web' | 'whatsapp' | 'mela' | 'referral'`
- Seller WhatsApp notification on new lead (WhatsApp Business API)

---

### 4.6 Seller dashboard

**Implemented ✅** — `/marketplace/livestock/dashboard`

- Tab: Seller
  - Phone-based login (no JWT required for MVP)
  - My listings table: name, price, status badge (pending/approved/rejected), featured flag, view count, date, link
  - My leads list: buyer name + phone, message, listing name, date
  - Per-lead status dropdown (new/contacted/closed/spam) — live PATCH
  - WhatsApp + Call buyer directly from lead card
- Tab: Buyer
  - My enquiries: listing snapshot, price, location, lead status, link to listing

**Planned (Phase 2)**

- Listing analytics per listing: views, WhatsApp taps, lead count, conversion rate
- "Boost this listing" CTA from dashboard
- Edit listing flow

---

### 4.7 Buyer dashboard

**Implemented ✅**

- Inquiry / lead history (in dashboard buyer tab)
- Save / favourite via localStorage on detail page

**Planned (Phase 2)**

- Saved animals page (reads `livestock_saved` from localStorage, fetches listing data)
- Price-drop alerts (opt-in, email/WhatsApp)
- New animal alerts matching saved search

---

### 4.8 Price intelligence

**Implemented ✅**

- GET `/api/marketplace/livestock/insights?price=&breed=&animalType=`
- Returns: `averagePrice`, `minPrice`, `maxPrice`, `sampleSize`, `insightLabel`, `insightTone`
- Colour-coded box on detail page: green (below range) / amber (above range) / grey (neutral)

**Planned (Phase 2)**

- Surface price suggestion inside sell form: "Typical range for [breed] in [state]: ₹X–₹Y"
- 30-day trend chart on detail page (requires price history indexing)

---

### 4.9 Boost / featured listings (monetization)

**Planned (Phase 2)** — highest priority revenue item

**Flow:**

1. Seller sees "Boost this listing" CTA in dashboard or sell confirmation
2. Selects duration: 3 days (₹49) / 5 days (₹99) / 10 days (₹199)
3. Pays via Razorpay
4. Listing gets `featured: true` + elevated sort position + "HOT" badge
5. On expiry, `featured` resets automatically

**Schema addition:** `boostedUntil: Date` on MarketplaceListing

---

### 4.10 AI advisor — PashuGyan (differentiator)

**Planned (Phase 2)**

- Claude-powered chat widget on livestock pages
- Use cases:
  - "What's a fair price for a 4yr Sahiwal with 12L/day in Punjab?"
  - "What vaccinations should a pregnant buffalo have?"
  - "How do I write a good listing for my Murrah?"
- Context: injects current listing data when on detail page
- Powered by Claude API (`claude-sonnet-4-6`)

---

### 4.11 Ration calculator

**Planned (Phase 2)**

- Simple tool: select breed + weight + lactation stage → daily feed recommendation
- Stickiness driver (farmers return daily)
- Route: `/marketplace/livestock/tools/ration`

---

### 4.12 Animal comparison

**Planned (Phase 2)**

- "Add to compare" button on listing cards (up to 3 animals)
- Floating compare bar at bottom when 2+ selected
- Side-by-side modal: price, breed, age, milk, location, health, seller rating

---

### 4.13 Demand posts — reverse marketplace

**Planned (Phase 3)**

- Buyer posts requirement: "I want Murrah buffalo, 10L+, ₹80K budget, Ludhiana"
- Sellers browse demand feed and respond
- Closes the liquidity gap — works even when supply is thin

---

### 4.14 Transport marketplace

**Planned (Phase 3)**

- Connect truck owners with buyers/sellers
- Distance-based pricing, vehicle type selection
- Post-deal booking flow

---

### 4.15 Token booking & escrow

**Planned (Phase 3)**

- Buyer pays ₹500–₹2,000 token to reserve animal
- Seller confirms → animal removed from marketplace
- Escrow: full payment via platform, released after deal confirmation
- Razorpay integration

---

## 5. UI structure

### Current routes

```
/marketplace/livestock/              # browse + filters
/marketplace/livestock/[id]/         # detail page
/marketplace/livestock/sell/         # create listing form
/marketplace/livestock/dashboard/    # seller + buyer dashboard
```

### Planned routes (Phase 2)

```
/marketplace/livestock/tools/ration  # ration calculator
/marketplace/livestock/saved/        # buyer saved animals
/marketplace/livestock/demand/       # reverse marketplace feed
```

### Component map

```
src/components/marketplace/livestock/
  LivestockAnimalCard.tsx     ✅
  LivestockFilters.tsx        ✅
  index.ts                    ✅

src/app/marketplace/livestock/
  page.tsx                    ✅  browse
  [id]/page.tsx               ✅  detail
  sell/page.tsx               ✅  create listing
  dashboard/page.tsx          ✅  seller + buyer dashboard

src/app/api/marketplace/livestock/
  route.ts                    ✅  GET list, POST create
  [id]/route.ts               ✅  GET detail + related
  leads/route.ts              ✅  POST lead
  leads/[id]/route.ts         ✅  PATCH lead status
  leads/mine/route.ts         ✅  GET buyer/seller leads (JWT)
  breeds/route.ts             ✅  GET breeds by type
  insights/route.ts           ✅  GET price insight
  dashboard/route.ts          ✅  GET seller/buyer dashboard data
```

---

## 6. Data model

### MarketplaceListing (Mongoose)

| Field | Type | Notes |
|---|---|---|
| `category` | string | `'livestock'` |
| `name` | string | max 200 |
| `description` | string | max 2000 |
| `price` | number | |
| `images` | string[] | max 10 URLs |
| `location` | string | free text (geo fields in spec) |
| `sellerId` | string | |
| `sellerName` | string | |
| `sellerPhone` | string | |
| `status` | enum | `pending / approved / rejected` |
| `featured` | boolean | boosted listings |
| `viewsCount` | number | incremented on detail load |
| `specifications` | Mixed | livestock-specific sub-fields |
| `boostedUntil` | Date | Phase 2 — boost expiry |

**`specifications` livestock sub-fields:**
`animalType`, `breed`, `ageYears`, `ageMonths`, `lactationStatus`, `milkYieldPerDay`, `pregnant`, `healthSummary`, `vaccinationSummary`, `sellerType`, `videoUrl`, `negotiable`, `verifiedListing`, `lat`, `lng`, `city`, `state`

### LivestockLead (Mongoose)

| Field | Type | Notes |
|---|---|---|
| `listingId` | ObjectId | ref MarketplaceListing |
| `sellerId` | string | |
| `sellerPhone` | string | |
| `buyerId` | string | optional, from JWT |
| `buyerName` | string | |
| `buyerPhone` | string | |
| `buyerMessage` | string | max 2000 |
| `status` | enum | `new / contacted / closed / spam` |
| `buyWithin` | string | Phase 2: `15d / 30d / later` |
| `source` | string | Phase 2: `web / whatsapp / mela / referral` |

---

## 7. API reference

### Implemented ✅

| Method | Path | Description |
|---|---|---|
| GET | `/api/marketplace/livestock` | Browse listings with filters + pagination |
| POST | `/api/marketplace/livestock` | Create listing (→ pending) |
| GET | `/api/marketplace/livestock/[id]` | Detail + related + view increment |
| POST | `/api/marketplace/livestock/leads` | Create buyer lead |
| PATCH | `/api/marketplace/livestock/leads/[id]` | Update lead status (phone auth) |
| GET | `/api/marketplace/livestock/leads/mine` | Buyer/seller scoped leads (JWT) |
| GET | `/api/marketplace/livestock/dashboard` | Phone-based seller/buyer dashboard data |
| GET | `/api/marketplace/livestock/breeds` | Breed list by animal type |
| GET | `/api/marketplace/livestock/insights` | Price market comparison |

### Planned (Phase 2)

| Method | Path | Description |
|---|---|---|
| POST | `/api/marketplace/livestock/boost` | Create boost order (Razorpay) |
| POST | `/api/marketplace/livestock/[id]/verify-otp` | Seller phone OTP verification |
| GET | `/api/marketplace/livestock/demand` | Browse demand posts |
| POST | `/api/marketplace/livestock/demand` | Post buyer requirement |

---

## 8. Monetization

| Lever | Price (INR) | Phase |
|---|---|---|
| Boost listing — 3 days | ₹49 | Phase 2 |
| Boost listing — 5 days | ₹99 | Phase 2 |
| Boost listing — 10 days | ₹199 | Phase 2 |
| Featured placement (admin-set) | ₹500–₹2,000 | Phase 2 |
| Token booking fee | ₹500–₹2,000 | Phase 3 |
| Qualified lead charge (traders) | ~₹100/lead | Phase 3 |
| Platform take rate | 1–3% on facilitated transactions | Phase 3 |
| Transport booking | ₹500–₹5,000+ | Phase 3 |
| Insurance referral | Commission | Phase 3 |

---

## 9. Build roadmap

### Phase 1 — MVP ✅ Complete

- [x] Animal listing (create + submit for approval)
- [x] Browse with core filters (type, breed, price, location, milk, verified)
- [x] Detail page: WhatsApp + Call + Save
- [x] Lead capture ("Interested") with seller notification path
- [x] Seller dashboard: my listings + leads with status management
- [x] Buyer dashboard: inquiry history
- [x] Price intelligence on detail page
- [x] Related listings on detail page

### Phase 2 — Revenue + Intelligence (next)

- [ ] **Boost listing** (Razorpay, ₹49–₹199) — highest revenue priority
- [ ] **State → District geo filter** — critical UX gap vs Pashushala
- [ ] **Buy-intent field** on lead form (`buyWithin`) — 1 field, high signal value
- [ ] **Source tracking** on leads (`source` field) — 1 field
- [ ] **Price suggestion in sell form** — reuses existing insights API
- [ ] **Listing analytics** in seller dashboard — views + lead count per listing
- [ ] **PashuGyan AI advisor** — Claude-powered chat widget
- [ ] **Ration calculator** — stickiness tool
- [ ] **Animal comparison** — add-to-compare, side-by-side modal
- [ ] **Seller OTP verification** → Verified Seller badge
- [ ] **Saved animals page** — reads localStorage `livestock_saved`

### Phase 3 — Ecosystem

- [ ] Demand posts (reverse marketplace)
- [ ] Token booking + escrow (Razorpay)
- [ ] Transport marketplace
- [ ] Insurance integration
- [ ] Pashumitra field agent program
- [ ] Multi-language (Hindi, Telugu, Punjabi, Tamil) via next-intl
- [ ] Voice search / audio descriptions
- [ ] WhatsApp Business API — seller notification on new lead
- [ ] Buyer price-drop + new-match alerts

---

## 10. Growth strategy

**Phase 1 — Launch corridors**
- Focus states: Andhra Pradesh + Punjab (high cattle density)
- WhatsApp-forward acquisition + mela tie-ins
- Seed supply via admin-created listings from mela data

**Phase 2 — Trust & intelligence**
- Seller verification → trust flywheel
- Price intelligence → farmers price accurately → faster sales
- Boost listings → first revenue signal

**Phase 3 — Services & network effects**
- Transport + insurance → platform becomes end-to-end
- Demand posts → reverse liquidity
- Pashumitra agents → offline supply capture

---

## 11. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Fraudulent listings | Video for premium; phone OTP; admin moderation; rate limits |
| Low trust | Verified badges, ratings, clear seller history |
| Poor liquidity | Mela funnel, demand posts, Pashumitra agents |
| Pashushala competition | Price intel + AI advisor + direct WhatsApp (not gated behind form) |
| Low seller retention | Dashboard analytics + boost nudges |

---

## 12. Success metrics

- Listings per day / active sellers
- Leads generated and contact rate
- Conversion: view → lead → contacted (proxy for deal)
- Boost purchases per week
- Revenue: boosts, leads, commission
- Seller dashboard weekly active users

---

## 13. Closing note

This livestock vertical is **high-ticket** and **trust-sensitive**. The structural advantage over Pashushala and generic classifieds is:

1. **Direct contact** (WhatsApp + Call without a forced form)
2. **Price intelligence** (no competitor has this)
3. **Mela integration** (offline → online journey)
4. **AI advisor** (planned — Claude-powered, livestock-specific)

Implementation reuses shared marketplace infrastructure (auth, images, admin moderation) while maintaining livestock-specific fields and UX under `/marketplace/livestock`.

---

*Document version: 2.0 — updated after MVP launch + Pashushala competitive audit (April 2026)*
