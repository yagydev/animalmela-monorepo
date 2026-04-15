import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/database';
import { attachAuthCookies, attachLegacyTokenCookie } from '@/lib/auth/cookies';
import { tryDemoOfflineLogin } from '@/lib/auth/demoOfflineLogin';
import { authLoginPassword } from '@/lib/auth/service';

/**
 * Legacy POST /api/login — email + password (same as /api/auth/login with login=email).
 * Sets httpOnly cookies and returns access + refresh in JSON for backward compatibility.
 */
export async function POST(request: NextRequest) {
  try {
    const { email, password, rememberMe } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required', data: {} },
        { status: 400 }
      );
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid email address', data: {} },
        { status: 400 }
      );
    }

    try {
      await connectDB();
    } catch (dbError: unknown) {
      const errMsg = (dbError as Error).message || String(dbError);
      console.error('MongoDB connection failed for /api/login:', errMsg);

      const isDeployed =
        process.env.VERCEL === '1' || process.env.VERCEL === 'true' || process.env.NODE_ENV === 'production';

      const demo = tryDemoOfflineLogin(email, password);
      if (demo) {
        const res = NextResponse.json({
          success: true,
          message: 'Login successful (demo mode — database offline)',
          data: {
            user: demo.user,
            token: demo.accessToken,
            accessToken: demo.accessToken,
          },
        });
        attachLegacyTokenCookie(res, demo.accessToken);
        return res;
      }

      // Production: DB down or misconfigured — 503 is correct; message should not imply "wrong password"
      const userMessage = isDeployed
        ? 'Sign-in is temporarily unavailable. Please try again in a few minutes.'
        : 'Database not reachable from this server. For local dev without MongoDB, use demo@kisaanmela.com / demo123 (see API message) or start MongoDB and set MONGODB_URI.';

      return NextResponse.json(
        {
          success: false,
          message: userMessage,
          data: {
            code: 'DATABASE_UNAVAILABLE',
            // Safe hint for deployers (no secrets)
            hint: isDeployed
              ? 'Owner: confirm MONGODB_URI or DATABASE_URL on Vercel (Production) and Atlas Network Access (e.g. 0.0.0.0/0).'
              : errMsg,
          },
        },
        { status: 503 }
      );
    }

    const ua = request.headers.get('user-agent') || undefined;
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || undefined;
    const r = await authLoginPassword(
      { login: email.toLowerCase(), password, rememberMe: Boolean(rememberMe) },
      { rememberMe: Boolean(rememberMe), userAgent: ua, ip }
    );

    if (!r.ok) {
      return NextResponse.json({ success: false, message: r.message, data: {} }, { status: r.status });
    }

    const res = NextResponse.json({
      success: true,
      message: r.message || 'Login successful',
      data: {
        user: r.data.user,
        token: r.data.accessToken,
        accessToken: r.data.accessToken,
        refreshToken: r.data.refreshToken,
      },
    });

    attachAuthCookies(
      res,
      { accessToken: r.data.accessToken, refreshToken: r.data.refreshToken },
      { rememberMe: Boolean(rememberMe) }
    );
    attachLegacyTokenCookie(res, r.data.accessToken);
    return res;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error. Please try again later.', data: {} },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Login endpoint. Use POST method with email and password.', data: {} },
    { status: 405 }
  );
}
