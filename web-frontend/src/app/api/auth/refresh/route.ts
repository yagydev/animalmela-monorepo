import { NextRequest } from 'next/server';
import { attachAuthCookies, attachLegacyTokenCookie } from '@/lib/auth/cookies';
import { readRefreshToken } from '@/lib/auth/request';
import { authRefresh } from '@/lib/auth/service';
import { jsonError, jsonOk } from '@/lib/auth/http';

/** POST /api/auth/refresh — rotate refresh token + new access (cookie or body). */
export async function POST(request: NextRequest) {
  try {
    let refresh = readRefreshToken(request);
    if (!refresh) {
      try {
        const body = await request.json();
        refresh = body?.refreshToken as string | undefined;
      } catch {
        /* no json body */
      }
    }
    const ua = request.headers.get('user-agent') || undefined;
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || undefined;
    const r = await authRefresh(refresh, { userAgent: ua, ip });
    if (!r.ok) return jsonError(r.message, r.status);

    const res = jsonOk(
      {
        user: r.data.user,
        accessToken: r.data.accessToken,
        refreshToken: r.data.refreshToken,
      },
      r.message || ''
    );
    attachAuthCookies(res, {
      accessToken: r.data.accessToken,
      refreshToken: r.data.refreshToken,
    });
    attachLegacyTokenCookie(res, r.data.accessToken);
    return res;
  } catch (e) {
    console.error('auth refresh', e);
    return jsonError('Server error', 500);
  }
}
