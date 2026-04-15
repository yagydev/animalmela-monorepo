import { NextRequest } from 'next/server';
import { attachAuthCookies, attachLegacyTokenCookie } from '@/lib/auth/cookies';
import { tryDemoOfflineLogin } from '@/lib/auth/demoOfflineLogin';
import { authLoginPassword } from '@/lib/auth/service';
import { jsonError, jsonOk } from '@/lib/auth/http';

/** POST /api/auth/login — username or email + password. */
export async function POST(request: NextRequest) {
  let body: { login?: string; password?: string; rememberMe?: boolean };
  try {
    body = await request.json();
  } catch {
    return jsonError('Invalid JSON body', 400);
  }

  const ua = request.headers.get('user-agent') || undefined;
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || undefined;

  try {
    const r = await authLoginPassword(body, {
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
    const demo = tryDemoOfflineLogin(body?.login, body?.password);
    if (demo) {
      const res = jsonOk(
        {
          user: demo.user,
          accessToken: demo.accessToken,
          refreshToken: null,
        },
        'Signed in with demo account (database offline).'
      );
      attachLegacyTokenCookie(res, demo.accessToken);
      return res;
    }
    console.error('auth login', e);
    return jsonError('Server error', 500);
  }
}
