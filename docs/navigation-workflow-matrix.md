# Canonical Navigation and Workflow Matrix

This repository now uses a single source of truth for navigation in:

- `web-frontend/src/config/appMatrix.ts`

It defines:

- Route ownership (`backend`, `backend-mvp`, `web-frontend`)
- Feature domain (`events`, `marketplace`, `training`, etc.)
- Role visibility (`guest`, `farmer`, `vendor`)
- CTA/highlight metadata

## Enforcement

- Header menu is built from `headerMatrix` through `navigationConfig`.
- Footer links are built from `footerMatrix`.
- Route existence checks run at import time via `assertKnownRoutes(...)`.
- Role visibility checks are enforced through `isRouteVisibleForRole(...)`.

## Ownership Notes

- `web-frontend`: UI routes and page rendering.
- `backend`: core marketplace/vendor/catalog APIs.
- `backend-mvp`: MVP events, leads, stall booking, WhatsApp flows.

If a route is added or changed, update `routeMatrix` first, then include it in `headerMatrix` and/or `footerMatrix`.
