import { NextRequest } from 'next/server';
import { readAccessToken } from '@/lib/auth/request';
import { authMe } from '@/lib/auth/service';
import { jsonError, jsonOk } from '@/lib/auth/http';

/** GET /api/auth/me — current user from Bearer or auth cookies. */
export async function GET(request: NextRequest) {
  try {
    const token = readAccessToken(request);
    const r = await authMe(token);
    if (!r.ok) return jsonError(r.message, r.status);
    return jsonOk({ user: r.data.user }, '');
  } catch (e) {
    console.error('auth me', e);
    return jsonError('Server error', 500);
  }
}
