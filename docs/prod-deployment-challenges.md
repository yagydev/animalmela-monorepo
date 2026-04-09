# Production Deployment Challenges and Fixes

Date: 2026-04-09  
Project: `animall-monorepo` (`web-frontend` on Vercel)

## Summary

Production deployment failed multiple times due to a mix of environment, project-linking, and build-time data-fetch behavior.  
This document records each issue, root cause, resolution, and prevention steps.

## 1) Invalid Vercel token

- **Symptom**
  - CLI error: `The specified token is not valid. Use vercel login to generate a new token.`
- **Root cause**
  - Expired/invalid token passed to `vercel --token`.
- **Fix**
  - Use a valid token or run `vercel login`.
  - Verify with `vercel whoami --token "<TOKEN>"`.
- **Applied solution used**
  - `vercel whoami --token "<NEW_VALID_TOKEN>"` returned the account successfully.
  - Subsequent deploy commands were executed only with the validated token.
- **Prevention**
  - Rotate tokens regularly and validate with `whoami` before deployment.

## 2) Wrong Vercel project context (monorepo confusion)

- **Symptom**
  - Deploys triggered for project `animalmela-monorepo-web-frontend` but builds failed with:
    - `Couldn't find any pages or app directory. Please create one under the project root`
  - Warning: `The vercel.json file should be inside of the provided root directory.`
- **Root cause**
  - Local folder was linked to a Vercel project expecting a different root/build context.
  - Monorepo has both root `vercel.json` and app-level `web-frontend/vercel.json`, causing mismatch when linked to wrong project.
- **Fix**
  - Re-link `web-frontend` directory to correct project:
    - `vercel link --project web-frontend --yes --token "<TOKEN>"`
  - Deploy again from `web-frontend` directory.
- **Applied solution used**
  - Confirmed previous link pointed to `animalmela-monorepo-web-frontend`.
  - Re-linked to `web-frontend` using:
    - `vercel link --project web-frontend --yes --token "<TOKEN>"`
  - Deployment succeeded only after this re-link.
- **Prevention**
  - Always confirm linked project:
    - `cat web-frontend/.vercel/project.json`
  - Keep one clear deployment target per app in monorepos.

## 3) Build-time prerender failure on `/mvp/leads`

- **Symptom**
  - Next build error:
    - `Error occurred prerendering page "/mvp/leads"`
    - `TypeError: fetch failed`
- **Root cause**
  - Server-side fetches in MVP pages called backend endpoints directly during build.
  - Build environment did not guarantee availability of those runtime services.
- **Fix**
  - Added safe network guards in `web-frontend/src/lib/mvpApi.ts`:
    - centralized `safeFetch(...)` wrapper
    - return graceful fallback values (`[]`, `null`, `false`) instead of throwing
  - This prevents static generation crashes when external service is unreachable.
- **Applied solution used**
  - Updated file:
    - `web-frontend/src/lib/mvpApi.ts`
  - Changes applied:
    - Added `safeFetch(...)` wrapper with `try/catch`.
    - Replaced direct `fetch(...)` calls in `fetchEvents`, `fetchEventById`, `getDemoToken`, `fetchLeadsForVendor`, `createBooking`.
    - Added null checks: `if (!response || !response.ok) ...`.
- **Prevention**
  - Any server-side build-time network calls must be wrapped with timeout/error fallback.
  - Treat external APIs as optional during build unless explicitly required.

## 4) Build-time events fetch risk

- **Symptom**
  - `/events` build path could stall/fail if base URL/service unavailable.
- **Root cause**
  - Server fetch depended on base URL assumptions and no timeout guard.
- **Fix**
  - Updated `web-frontend/src/app/events/page.tsx`:
    - safe base URL selection (`NEXT_PUBLIC_BASE_URL` or `VERCEL_URL`)
    - early return when no valid base URL
    - `AbortSignal.timeout(...)` + fallback to empty list
- **Applied solution used**
  - Updated file:
    - `web-frontend/src/app/events/page.tsx`
  - Changes applied:
    - Added `baseUrl` resolution using env.
    - Returned empty list when base URL unavailable.
    - Added timed fetch guard with:
      - `signal: AbortSignal.timeout(8000)`
    - Added non-OK response fallback to `[]`.
- **Prevention**
  - Do not hardcode localhost assumptions in production SSR/SSG data fetches.
  - Add fetch timeout and fallback for all server-rendered pages.

## 5) Local filesystem/socket noise during root deploy attempts

- **Symptom**
  - Root deploy attempt surfaced local file/socket errors involving `.local-mongodb`.
- **Root cause**
  - Deploy initiated from repo root with local runtime artifacts present.
- **Fix**
  - Deploy from app directory (`web-frontend`) linked to the correct Vercel project.
- **Prevention**
  - Avoid root-level deploys for monorepo apps unless root config is intentionally used.

## Final successful deployment path

1. Validate token:
   - `vercel whoami --token "<TOKEN>"`
2. Link correct project from app directory:
   - `cd web-frontend`
   - `vercel link --project web-frontend --yes --token "<TOKEN>"`
3. Deploy:
   - `vercel --prod --yes --token "<TOKEN>"`
4. Confirm status:
   - `vercel inspect "<DEPLOYMENT_URL>" --token "<TOKEN>"`

## Commit references (applied fixes)

- `0196e3a`  
  `fix: make MVP/event fetches prerender-safe for deployment`
  - Includes fixes in:
    - `web-frontend/src/lib/mvpApi.ts`
    - `web-frontend/src/app/events/page.tsx`

## Recommended standard operating checklist

Before every production deployment:

1. `vercel whoami --token "<TOKEN>"`
2. Verify current directory is app root (`web-frontend`).
3. Verify linked project in `.vercel/project.json`.
4. Ensure server-side fetches have timeout + fallback.
5. Run local build once:
   - `npm run build`
6. Deploy with token.
7. Smoke-test key routes after deployment.
