# Kisaan Mela Backend MVP (Express + PostgreSQL)

## Run

1. Create DB and apply schema:
   - Run SQL from `src/db/schema.sql`
2. Configure env:
   - `PORT=5050`
   - `DATABASE_URL=postgres://postgres:postgres@localhost:5432/kisaanmela_mvp`
   - `JWT_SECRET=change-me`
3. Start:
   - `npm install`
   - `npm run dev`

## API Routes

- `POST /api/auth/login`
- `GET /api/events`
- `GET /api/events/:id`
- `POST /api/stalls/book`
- `GET /api/stalls/bookings`
- `POST /api/leads`
- `GET /api/leads`
- `GET /api/whatsapp/link`
