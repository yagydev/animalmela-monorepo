# Backend

- **This folder** — Next.js 14 API + MongoDB (`animall-backend`, port **8000** by default).
- **`marketplace-api/`** — NestJS + Prisma + PostgreSQL KisaanMela multi-vendor marketplace (port **4000**). Consume via Swagger at `/docs` or from other apps; the main Next.js app uses Mongo-backed routes under `/marketplace` and related pages instead of a dedicated Nest UI hub.

Run the marketplace API from the monorepo root:

```bash
npm run dev:marketplace-api
```

Or:

```bash
cd backend/marketplace-api && npm run start:dev
```

See `marketplace-api/DEPLOYMENT.md` for Docker, migrations, and e2e tests.
