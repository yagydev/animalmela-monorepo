import type { NextRequest } from 'next/server';
import { COOKIE_ACCESS, COOKIE_REFRESH, COOKIE_LEGACY } from './cookies';

export function readAccessToken(request: NextRequest): string | undefined {
  const h = request.headers.get('authorization');
  if (h?.toLowerCase().startsWith('bearer ')) return h.slice(7).trim();
  return (
    request.cookies.get(COOKIE_ACCESS)?.value ||
    request.cookies.get(COOKIE_LEGACY)?.value ||
    undefined
  );
}

export function readRefreshToken(request: NextRequest): string | undefined {
  return request.cookies.get(COOKIE_REFRESH)?.value || undefined;
}
