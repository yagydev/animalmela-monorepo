import { NextRequest } from 'next/server';
import { attachAuthCookies, attachLegacyTokenCookie } from '@/lib/auth/cookies';
import { authVerifyOtp } from '@/lib/auth/service';
import { jsonError, jsonOk } from '@/lib/auth/http';

/**
 * Legacy POST /api/auth/otp/verify — body: { mobile, otp, name? }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const phone = body?.mobile || body?.phone;
    const ua = request.headers.get('user-agent') || undefined;
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || undefined;
    const r = await authVerifyOtp(
      { phone, otp: body?.otp, name: body?.name },
      { rememberMe: Boolean(body?.rememberMe), userAgent: ua, ip }
    );
    if (!r.ok) {
      return jsonError(r.message, r.status);
    }
    const res = jsonOk(
      {
        user: r.data.user,
        token: r.data.accessToken,
        accessToken: r.data.accessToken,
        refreshToken: r.data.refreshToken,
      },
      r.message || 'OTP verified successfully'
    );
    attachAuthCookies(
      res,
      { accessToken: r.data.accessToken, refreshToken: r.data.refreshToken },
      { rememberMe: Boolean(body?.rememberMe) }
    );
    attachLegacyTokenCookie(res, r.data.accessToken);
    return res;
  } catch (e) {
    console.error('OTP verify error:', e);
    return jsonError('Failed to verify OTP', 500);
  }
}
