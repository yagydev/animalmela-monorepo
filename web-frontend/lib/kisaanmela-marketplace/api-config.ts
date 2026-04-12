/**
 * KisaanMela multi-vendor marketplace API (Nest + Prisma + Postgres).
 * Local default: http://localhost:4000/api
 * Production default (when unset): https://api.kisaanmela.com/api (see DEPLOYMENT_GUIDE.md)
 */

const PRODUCTION_DEFAULT_MARKETPLACE_API = 'https://api.kisaanmela.com/api';

function trimSlash(s: string) {
  return s.replace(/\/$/, '');
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
    return trimSlash(PRODUCTION_DEFAULT_MARKETPLACE_API);
  }

  return 'http://localhost:4000/api';
}
