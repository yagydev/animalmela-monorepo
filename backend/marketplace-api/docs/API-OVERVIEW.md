# API overview

Base URL (local): `http://localhost:4000/api`  
Interactive docs: `http://localhost:4000/docs` (OpenAPI + Swagger UI).

Global: JWT bearer auth on protected routes; `Authorization: Bearer <token>`. Throttling applies globally (see `AppModule`).

## Auth (`/api/auth`)

| Method | Path | Notes |
|--------|------|--------|
| POST | `/auth/otp/send` | Send OTP (dev code from `OTP_DEV_CODE`) |
| POST | `/auth/otp/verify` | Verify OTP → JWT |

## Users (`/api/users`)

Profile, addresses, order history — buyer-focused; JWT required where noted in Swagger.

## Sellers (`/api/sellers`)

KYC submission, store creation (after KYC approved), seller-scoped operations.

## Products (`/api/products`)

Public listing with filters (category, price, state, district, sort: latest, price, popularity). Seller CRUD for own store.

## Storage — AWS S3 (`/api/storage`)

| Method | Path | Notes |
|--------|------|--------|
| POST | `/storage/presign-product-image` | **SELLER** + JWT. Body `{ "contentType": "image/jpeg" \| "image/png" \| "image/webp" \| "image/gif" }` → presigned PUT URL + `publicUrl` for `imageUrls` on product create. Requires `AWS_S3_BUCKET`, `AWS_REGION`, and credentials. |

## Cart (`/api/cart`)

Authenticated buyer cart; multi-product / multi-store via line items.

## Orders (`/api/orders`)

Checkout from cart, order detail, status updates (seller/admin where implemented).

## Payments (`/api/payments`)

Razorpay order creation; mock complete path for local testing without keys.

## Reviews (`/api/reviews`)

Product and seller (store) reviews.

## Chat (`/api/chat`)

Buyer–seller threads and messages.

## Events (`/api/events`)

Agri mela / fair listings (public + admin create).

## Admin (`/api/admin`)

User/seller/product/KYC moderation, summary stats — `ADMIN` role.

## Health (`/api/health`)

Liveness check for load balancers and CI.

For request/response shapes and DTO validation rules, use **Swagger UI** as the source of truth.

---

## Product specification coverage (high level)

| Area | Status in repo | Where |
|------|----------------|--------|
| **Auth: OTP + JWT, roles Buyer/Seller/Admin** | Implemented | `auth/*`, `Role` in Prisma, `JwtAuthGuard` + `RolesGuard` |
| **User: profile, addresses, order history** | Implemented | `users/*`, `Address` model |
| **Seller: KYC, store, dashboard-style data** | Partial API | `sellers/*`, `SellerProfile`, `Store`; dedicated analytics dashboard TBD |
| **Product CRUD, SKU, stock, location, images** | Implemented | `products/*`, `Product`, `ProductImage`; S3 presigned upload `storage/presign-product-image` |
| **Category hierarchy** | Implemented + seed | `Category`, `prisma/seed.ts` (animals, seeds, tools, land + children) |
| **Search & filters** | Implemented (DB) | Text `q`, category, state/district, price range; sort latest, price, popularity |
| **Cart & checkout (multi-vendor lines)** | Implemented | `cart/*`, `orders/*` checkout from cart |
| **Payments: Razorpay** | Partial | `payments/*`; mock path for local; production webhook hardening as needed |
| **Orders: placed→packed→shipped→delivered, tracking** | Model + API (verify seller/admin paths in Swagger) | `OrderStatus`, `trackingId` |
| **Reviews: product + seller** | Implemented | `reviews/*`, `ProductReview`, `SellerReview` |
| **Chat / inquiry** | Implemented | `chat/*`, threads per buyer–store |
| **Admin: users, sellers, products, commission** | Implemented | `admin/*`, `CommissionLedger`, `Store.commissionRate` |
| **Mela / events** | Implemented | `events/*`, `AgriEvent` |
| **Notifications SMS/Email** | Not wired | Use provider hooks from order/payment events (future) |
| **Redis API cache** | Not wired | Compose may include Redis; app cache layer TBD |
| **Elasticsearch** | Not used | Optional; DB search via `q` today |
| **Security** | Partial | `ValidationPipe`, `ThrottlerModule`, RBAC; tune per route in production |
| **ER diagram** | Delivered | [ER-DIAGRAM.md](./ER-DIAGRAM.md) |
| **Deployment + CI/CD** | Delivered | [DEPLOYMENT.md](../DEPLOYMENT.md), `.github/workflows/agri-marketplace-api.yml` |
| **Next.js mobile-first UI** | Partial | `web-frontend` → `/marketplace`, `/farmers-market`, vendor flows; Nest catalog/cart flows via Swagger/API unless a new client is added |

**Interactive OpenAPI:** `http://localhost:4000/docs` after `npm run dev:marketplace-api` (from monorepo root or `backend/marketplace-api`).
