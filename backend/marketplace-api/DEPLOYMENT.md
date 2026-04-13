# Agri Marketplace API — deployment & operations

## Prerequisites

- Node.js 22.x
- PostgreSQL 15+
- Optional: Redis (URL reserved for future caching; not required to boot the API)

## One-shot local setup (Docker + DB + checks + run)

1. **Docker Desktop** running.
2. **Copy env:** `cp .env.example .env` (defaults match `docker-compose.yml`: Postgres `localhost:5433`, Redis `6380`).
3. From `backend/marketplace-api`:

```bash
npm ci
npm run db:setup    # postgres container (db:up), migrate deploy, seed
npm run verify      # lint:ci, build, unit tests, e2e (needs DB still up)
npm run dev         # API at http://localhost:4000/api — Swagger at http://localhost:4000/docs
```

Or everything after `npm ci` in one line (will fail if Docker/DB is down):

```bash
npm run setup
```

## End-to-end tests

E2E suites live under `test/*.e2e-spec.ts` and require a running PostgreSQL instance matching `DATABASE_URL` (see `docker-compose.yml`). With the DB up and migrations applied:

```bash
export OTP_DEV_CODE=123456   # optional if already in .env
npm run test:e2e
```

`ConfigModule` loads `.env` when the Nest app boots, so `OTP_DEV_CODE` in `.env` is enough for e2e.

E2E loads env via `test/setup-e2e-env.js` (same process as tests) and `test/global-setup-e2e.js` **waits for Postgres** on TCP. If the monorepo root `.env` sets `DATABASE_URL` to MongoDB, set **`AGRI_DATABASE_URL`** to the PostgreSQL URL (see `.env.example`). If Docker is not running, the error tells you to start Docker Desktop and run `npm run db:up`. Override wait with `E2E_DB_WAIT_MS=60000`.

CI runs `prisma migrate deploy`, `prisma db seed`, then `npm run test:e2e` against a Postgres service container.

## Local development

1. Copy environment: `cp .env.example .env` and set `DATABASE_URL`, `JWT_SECRET`, etc.
2. Start Postgres (and Redis if you use it):

   ```bash
   docker compose up -d
   ```

3. Apply schema and seed:

   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

4. Run API:

   ```bash
   npm run start:dev
   ```

- REST base: `http://localhost:4000/api`
- OpenAPI UI: `http://localhost:4000/docs`

## Docker (API only)

Build and run (set `DATABASE_URL` to a reachable Postgres, e.g. host `host.docker.internal` on Mac):

```bash
docker build -t kisaanmela-marketplace-api .
docker run --rm -p 4000:4000 \
  -e DATABASE_URL="postgresql://..." \
  -e JWT_SECRET="your-secret-at-least-32-chars" \
  kisaanmela-marketplace-api
```

The container runs `prisma migrate deploy` before `node dist/main.js`.

## CI/CD (GitHub Actions)

Workflow `.github/workflows/agri-marketplace-api.yml` (paths under `backend/marketplace-api/`) runs lint, unit tests, build, and e2e tests against a Postgres service container. Integrate this API from clients as needed (the main Next.js app does not ship a Nest-backed marketplace hub). For production deploy:

1. Push images to your registry (extend the workflow with `docker/build-push-action` or deploy to Fly.io / ECS / Railway).
2. Inject secrets: `DATABASE_URL`, `JWT_SECRET`, `RAZORPAY_*`, `AWS_*`, `CORS_ORIGIN`.
3. Run migrations as a release step (same as Dockerfile CMD) or a one-off job before traffic.

## Production checklist

- Strong `JWT_SECRET`, HTTPS only, narrow `CORS_ORIGIN`.
- Razorpay: use live keys; verify webhook signatures (extend `PaymentsModule`).
- S3: `POST /api/storage/presign-product-image` (SELLER) returns a presigned PUT URL; configure `AWS_S3_BUCKET`, `AWS_REGION`, and IAM `s3:PutObject` on `product-images/*`. Optional `PUBLIC_CDN_BASE` for CloudFront URLs stored in `ProductImage.url`.
- Rate limits: global throttler is enabled; tune `ThrottlerModule` per route if needed.
- Redis: wire cache layer for product list / category tree when ready.
