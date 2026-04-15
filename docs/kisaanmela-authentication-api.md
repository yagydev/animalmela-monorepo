# KisaanMela — Authentication API (production)

**Implementation:** Next.js App Router in `web-frontend/` (`src/app/api/auth/*`, shared logic in `web-frontend/lib/auth/`).  
**Storage:** MongoDB (`models/User.js`, `models/RefreshToken.js`, `models/OtpRateWindow.js`).  
**Client:** HttpOnly cookies `km_access`, `km_refresh` (+ legacy `token` for Bearer-based API calls). JSON responses also include `accessToken` / `refreshToken` for clients that still send `Authorization: Bearer`.

## Response shape

```json
{ "success": true, "message": "", "data": { } }
```

Errors: `success: false`, HTTP 4xx/5xx, `message` human-readable.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/signup` | `mode: "otp_init"` + `name`, `mobile` → create unverified user. Otherwise password signup: `name`, `mobile`, `password`, optional `email`, `username`, optional `role` (not `admin`). Sets cookies on password path. |
| POST | `/api/auth/send-otp` | Body `{ "phone": "9876543210" }`. Rate-limited per phone per hour. OTP hashed in DB; SMS via Twilio or mock. |
| POST | `/api/auth/verify-otp` | `{ "phone", "otp", "name?", "rememberMe?" }`. Issues access + refresh, sets cookies. |
| POST | `/api/auth/login` | `{ "login": "email-or-username", "password", "rememberMe?" }`. |
| POST | `/api/auth/refresh` | Reads `km_refresh` cookie or JSON `{ refreshToken }`. Rotates refresh token. |
| POST | `/api/auth/logout` | Revokes refresh session, clears cookies. |
| GET | `/api/auth/me` | Current user from `km_access` / legacy `token` cookie or `Authorization: Bearer`. |

Legacy aliases (unchanged paths for older clients):

- `POST /api/login` — email + password; sets cookies.
- `POST /api/register` — uses unified signup service.
- `POST /api/auth/otp/send` — forwards to send-otp pipeline (`phone` or `mobile` in body).
- `POST /api/auth/otp/verify` — forwards to verify-otp.

## Roles

- **`authRole`:** `USER` \| `ADMIN` (JWT + `/api/auth/me`). `ADMIN` when `role === 'admin'` on user document.
- **`role`:** marketplace persona (`farmer`, `buyer`, `seller`, `service`, `admin`).

Use `lib/auth/requireAdmin.ts` in route handlers for admin-only operations.

## Environment

See `web-frontend/.env.auth.example`.

## Postman

Import `docs/postman/kisaanmela-auth.postman_collection.json` and set `baseUrl`.

## Standalone Express

The repo’s `backend/` package is Next-based. A separate Express service is optional; the canonical auth implementation is the Next API layer above. For a dedicated Node gateway, proxy these paths to the Next deployment or port the Mongoose logic from `web-frontend/lib/auth/service.ts`.
