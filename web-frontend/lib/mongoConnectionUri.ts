/**
 * Single place for Mongo connection string resolution (used by lib/database.js + lib/dbConnect.ts).
 *
 * - Only env values that start with `mongodb` are used (avoids Postgres `DATABASE_URL` collisions).
 * - Local dev: defaults to 127.0.0.1 (avoids some IPv6/localhost issues on macOS).
 * - Vercel: missing Mongo URI throws a clear error (no silent localhost).
 */
export function getMongoConnectionUri(): string {
  const explicit = process.env.MONGODB_URI?.trim();
  if (explicit === 'demo-mode') return 'demo-mode';
  if (explicit?.startsWith('mongodb')) return explicit;

  const dbUrl = process.env.DATABASE_URL?.trim();
  if (dbUrl?.startsWith('mongodb')) return dbUrl;

  if (process.env.VERCEL === '1' || process.env.VERCEL === 'true') {
    throw new Error(
      'Missing MONGODB_URI or DATABASE_URL (must be mongodb:// or mongodb+srv://). On Vercel: Project → Settings → Environment Variables. Atlas: Network Access must allow your deployment (e.g. 0.0.0.0/0).'
    );
  }

  if (process.env.NODE_ENV === 'production') {
    return 'mongodb://mongodb:27017/kisaanmela_prod';
  }

  return 'mongodb://127.0.0.1:27017/kisaanmela';
}
