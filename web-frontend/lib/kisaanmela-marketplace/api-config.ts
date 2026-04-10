/**
 * KisaanMela multi-vendor marketplace API (Nest + Prisma + Postgres).
 * Runs alongside the main site; default dev port 4000.
 */
export function getMarketplaceApiBase(): string {
  const raw =
    process.env.NEXT_PUBLIC_KISAANMELA_MARKETPLACE_API_URL ||
    process.env.NEXT_PUBLIC_AGRI_MARKETPLACE_API_URL ||
    process.env.NEXT_PUBLIC_MARKETPLACE_API_URL;
  if (raw) return raw.replace(/\/$/, '');
  return 'http://localhost:4000/api';
}
