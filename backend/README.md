# Backend

- **This folder** — Next.js 14 API + MongoDB (`animall-backend`, port **8000** by default).
- **`marketplace-api/`** — NestJS + Prisma + PostgreSQL KisaanMela multi-vendor marketplace (port **4000**). UI is integrated in `web-frontend` at **`/marketplace/kisaan`** (same Header/Footer as the rest of the site).

Run the marketplace API from the monorepo root:

```bash
npm run dev:marketplace-api
```

Or:

```bash
cd backend/marketplace-api && npm run start:dev
```

See `marketplace-api/DEPLOYMENT.md` for Docker, migrations, and e2e tests.
