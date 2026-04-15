import { NextRequest, NextResponse } from 'next/server';
import { attachAuthCookies, attachLegacyTokenCookie } from '@/lib/auth/cookies';
import { authSignupOtpInit, authSignupPassword } from '@/lib/auth/service';
import { jsonError, jsonOk } from '@/lib/auth/http';

/**
 * POST /api/auth/signup
 * - mode omitted or "password": password registration (optional email/username)
 * - mode "otp_init": create phone-only unverified user → then POST /api/auth/send-otp
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (body?.mode === 'otp_init') {
      const r = await authSignupOtpInit(body);
      if (!r.ok) return jsonError(r.message, r.status);
      return jsonOk(r.data, r.message || '');
    }

    const r = await authSignupPassword(body);
    if (!r.ok) return jsonError(r.message, r.status);

    const res = jsonOk(
      { user: r.data.user, accessToken: r.data.accessToken, refreshToken: r.data.refreshToken },
      r.message || 'Registered'
    );
    attachAuthCookies(res, {
      accessToken: r.data.accessToken,
      refreshToken: r.data.refreshToken,
    });
    attachLegacyTokenCookie(res, r.data.accessToken);
    return res;
  } catch (e) {
    console.error('signup', e);
    return jsonError('Server error', 500);
  }
}
