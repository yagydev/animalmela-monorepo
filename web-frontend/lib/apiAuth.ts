import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './jwt';

export type AuthedUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  mobile?: string;
};

/**
 * Pulls a Bearer token off the request, verifies it, and returns the decoded
 * user payload. Returns a NextResponse if auth fails so callers can early-return.
 */
export function requireAuth(
  request: NextRequest
): { user: AuthedUser } | { error: NextResponse } {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return {
      error: NextResponse.json(
        { success: false, message: 'Authorization token required' },
        { status: 401 }
      ),
    };
  }

  try {
    const decoded = verifyToken(authHeader.substring(7)) as AuthedUser;
    return { user: decoded };
  } catch {
    return {
      error: NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      ),
    };
  }
}

export function requireRole(
  user: AuthedUser,
  allowed: string[]
): NextResponse | null {
  if (!allowed.includes(user.role)) {
    return NextResponse.json(
      { success: false, message: 'Forbidden: insufficient permissions' },
      { status: 403 }
    );
  }
  return null;
}
