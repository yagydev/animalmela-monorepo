import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookies } from '@/lib/auth/cookies';
import { readRefreshToken } from '@/lib/auth/request';
import { authLogout } from '@/lib/auth/service';

export async function POST(request: NextRequest) {
  try {
    const refresh = readRefreshToken(request);
    await authLogout(refresh);
    const res = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
      data: {},
    });
    clearAuthCookies(res);
    return res;
  } catch (error) {
    console.error('Logout error:', error);
    const res = NextResponse.json(
      { success: false, message: 'Internal server error', data: {} },
      { status: 500 }
    );
    clearAuthCookies(res);
    return res;
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Logout endpoint. Use POST method.', data: {} }, { status: 405 });
}
