import type { NextResponse } from 'next/server';

const isProd = process.env.NODE_ENV === 'production';

export const COOKIE_ACCESS = 'km_access';
export const COOKIE_REFRESH = 'km_refresh';

/** Legacy cookie name used by older middleware / clients. */
export const COOKIE_LEGACY = 'token';

type CookieOpts = { rememberMe?: boolean };

/**
 * HttpOnly cookies for access (short) + refresh (long).
 * `rememberMe` extends refresh lifetime (30d vs 7d).
 */
export function attachAuthCookies(
  res: NextResponse,
  tokens: { accessToken: string; refreshToken: string },
  opts: CookieOpts = {}
) {
  const refreshMax = opts.rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60;
  res.cookies.set(COOKIE_ACCESS, tokens.accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: 15 * 60,
  });
  res.cookies.set(COOKIE_REFRESH, tokens.refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: refreshMax,
  });
  // Short non-httpOnly not used; middleware reads httpOnly access cookie in Edge —
  // Next middleware can read httpOnly cookies set on response. Good.
}

export function attachLegacyTokenCookie(res: NextResponse, accessToken: string) {
  res.cookies.set(COOKIE_LEGACY, accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: 24 * 60 * 60,
  });
}

export function clearAuthCookies(res: NextResponse) {
  res.cookies.delete(COOKIE_ACCESS);
  res.cookies.delete(COOKIE_REFRESH);
  res.cookies.delete(COOKIE_LEGACY);
}
