import { NextRequest } from 'next/server';
import { attachAuthCookies, attachLegacyTokenCookie } from '@/lib/auth/cookies';
import { authVerifyOtp } from '@/lib/auth/service';
import { jsonError, jsonOk } from '@/lib/auth/http';

/** POST /api/auth/verify-otp — verify code, issue tokens, set cookies. */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const ua = request.headers.get('user-agent') || undefined;
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || undefined;
    const r = await authVerifyOtp(body, {
      rememberMe: Boolean(body?.rememberMe),
      userAgent: ua,
      ip,
    });
    if (!r.ok) return jsonError(r.message, r.status);

    const res = jsonOk(
      {
        user: r.data.user,
        accessToken: r.data.accessToken,
        refreshToken: r.data.refreshToken,
      },
      r.message || ''
    );
    attachAuthCookies(
      res,
      { accessToken: r.data.accessToken, refreshToken: r.data.refreshToken },
      { rememberMe: Boolean(body?.rememberMe) }
    );
    attachLegacyTokenCookie(res, r.data.accessToken);
    return res;
  } catch (e) {
    console.error('verify-otp', e);
    return jsonError('Server error', 500);
  }
}
