# Express auth service (optional)

KisaanMela **production auth** is implemented in **`web-frontend`** as Next.js route handlers (`/api/auth/*`) with MongoDB — see `docs/kisaanmela-authentication-api.md`.

This folder is reserved if you later split auth behind a dedicated Express or Fastify process (same Mongoose models, same JWT/cookie contract). Until then, run:

```bash
cd web-frontend && npm run dev
```

and call `http://localhost:3000/api/auth/...`.
