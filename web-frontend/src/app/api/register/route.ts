import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/database';
import { attachAuthCookies, attachLegacyTokenCookie } from '@/lib/auth/cookies';
import { authSignupPassword } from '@/lib/auth/service';

/** Legacy POST /api/register — delegates to unified signup + sets auth cookies. */
export async function POST(request: NextRequest) {
  try {
    const { name, email, mobile, password, role = 'buyer' } = await request.json();

    if (!name || !email || !mobile) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and mobile are required', data: {} },
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

    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(mobile)) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid 10-digit mobile number', data: {} },
        { status: 400 }
      );
    }

    const validRoles = ['farmer', 'buyer', 'seller', 'service', 'admin'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { success: false, message: 'Invalid role specified', data: {} },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters', data: {} },
        { status: 400 }
      );
    }

    try {
      await connectDB();
    } catch (dbError: unknown) {
      console.warn('MongoDB connection failed, using demo mode:', (dbError as Error).message);
      const demoUser = {
        id: 'demo-user-' + Date.now(),
        name: name.trim(),
        email: email.toLowerCase().trim(),
        mobile: mobile.trim(),
        role: role === 'admin' ? 'buyer' : role,
        profileComplete: false,
        isActive: true,
        createdAt: new Date().toISOString(),
      };
      return NextResponse.json(
        {
          success: true,
          message: 'User registered successfully (demo mode)',
          data: { user: demoUser, token: 'demo-token-' + Date.now() },
        },
        { status: 201 }
      );
    }

    const safeRole = role === 'admin' ? 'buyer' : role;
    const r = await authSignupPassword({
      name: name.trim(),
      mobile: mobile.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: safeRole,
    });

    if (!r.ok) {
      return NextResponse.json({ success: false, message: r.message, data: {} }, { status: r.status });
    }

    const res = NextResponse.json(
      {
        success: true,
        message: r.message || 'User registered successfully',
        data: {
          user: r.data.user,
          token: r.data.accessToken,
          accessToken: r.data.accessToken,
          refreshToken: r.data.refreshToken,
        },
      },
      { status: 201 }
    );
    attachAuthCookies(res, {
      accessToken: r.data.accessToken,
      refreshToken: r.data.refreshToken,
    });
    attachLegacyTokenCookie(res, r.data.accessToken);
    return res;
  } catch (error: unknown) {
    console.error('Registration error:', error);
    const err = error as { code?: number; keyPattern?: Record<string, unknown> };
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern || {})[0];
      return NextResponse.json(
        { success: false, message: `${field || 'Field'} already exists`, data: {} },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, message: 'Registration failed. Please try again.', data: {} },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Registration endpoint. Use POST method with user data.', data: {} },
    { status: 405 }
  );
}
