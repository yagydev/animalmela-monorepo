import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/database';
import User from '../../../../models/User';
import { readAccessToken } from '@/lib/auth/request';
import { authMe } from '@/lib/auth/service';
import { verifyToken } from '../../../../lib/jwt';

/** GET /api/me — Bearer, km_access cookie, or legacy token cookie. */
export async function GET(request: NextRequest) {
  try {
    const token = readAccessToken(request);

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authorization token required', data: {} },
        { status: 401 }
      );
    }

    if (typeof token === 'string' && token.startsWith('demo-token-')) {
      return NextResponse.json({
        success: true,
        data: {
          user: {
            id: 'demo-user',
            email: 'demo@kisaanmela.com',
            name: 'Demo User',
            role: 'farmer',
            mobile: '9876543210',
          },
        },
      });
    }

    const r = await authMe(token);
    if (r.ok) {
      return NextResponse.json({
        success: true,
        data: { user: r.data.user },
      });
    }

    try {
      await connectDB();
      const legacy = verifyToken(token) as {
        id?: string;
        userId?: string;
        email?: string;
        name?: string;
        role?: string;
        mobile?: string;
      };
      const id = legacy.id || legacy.userId;
      if (id) {
        const user = await User.findById(id);
        if (user && user.isActive) {
          return NextResponse.json({
            success: true,
            data: {
              user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
                mobile: user.mobile,
              },
            },
          });
        }
      }
    } catch {
      /* fall through */
    }

    return NextResponse.json(
      { success: false, message: r.message, data: {} },
      { status: 401 }
    );
  } catch (error) {
    console.error('Get user profile error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', data: {} },
      { status: 500 }
    );
  }
}
