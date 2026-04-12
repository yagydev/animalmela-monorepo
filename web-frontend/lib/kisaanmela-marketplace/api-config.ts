/**
 * KisaanMela multi-vendor marketplace API (Nest + Prisma + Postgres).
 * Local default: http://localhost:4000/api
 * Production default (when unset): https://api.kisaanmela.com/api (see DEPLOYMENT_GUIDE.md)
 */

/** Public Nest base used in production when env is unset; also server GET fallback if local API is down. */
export const MARKETPLACE_API_PRODUCTION_DEFAULT = 'https://api.kisaanmela.com/api';

function trimSlash(s: string) {
  return s.replace(/\/$/, '');
}

/** Optional override for the server-only retry host (defaults to production API). */
export function getMarketplaceApiPublicFallbackBase(): string {
  const custom = process.env.KISAANMELA_MARKETPLACE_FALLBACK_API_URL?.trim();
  if (custom) return trimSlash(custom);
  return trimSlash(MARKETPLACE_API_PRODUCTION_DEFAULT);
}

export function getMarketplaceApiBase(): string {
  const serverOnly =
    process.env.MARKETPLACE_API_URL?.trim() ||
    process.env.KISAANMELA_MARKETPLACE_API_URL?.trim();
  if (serverOnly) return trimSlash(serverOnly);

  const publicConfigured =
    process.env.NEXT_PUBLIC_KISAANMELA_MARKETPLACE_API_URL?.trim() ||
    process.env.NEXT_PUBLIC_AGRI_MARKETPLACE_API_URL?.trim() ||
    process.env.NEXT_PUBLIC_MARKETPLACE_API_URL?.trim();
  if (publicConfigured) return trimSlash(publicConfigured);

  if (process.env.VERCEL === '1' || process.env.NODE_ENV === 'production') {
    return trimSlash(MARKETPLACE_API_PRODUCTION_DEFAULT);
  }

  return 'http://localhost:4000/api';
}
