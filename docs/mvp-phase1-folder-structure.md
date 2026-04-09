# Kisaan Mela - Phase 1 MVP Structure

## Backend (`backend-mvp`)

```
backend-mvp/
  src/
    config/env.ts
    db/pool.ts
    db/schema.sql
    middleware/auth.ts
    routes/auth.ts
    routes/events.ts
    routes/stalls.ts
    routes/leads.ts
    routes/whatsapp.ts
    server.ts
  package.json
  tsconfig.json
  README.md
```

## Frontend (`web-frontend`)

```
web-frontend/src/
  app/mvp/events/page.tsx
  app/mvp/events/[id]/page.tsx
  app/mvp/leads/page.tsx
  components/mvp/EventCard.tsx
  components/mvp/LeadCard.tsx
  components/mvp/BookingModal.tsx
```

## Core API Routes

- `POST /api/auth/login`
- `GET /api/events`
- `GET /api/events/:id`
- `POST /api/stalls/book`
- `GET /api/stalls/bookings`
- `POST /api/leads`
- `GET /api/leads`
- `GET /api/whatsapp/link`
