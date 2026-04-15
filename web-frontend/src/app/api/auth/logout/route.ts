import { NextRequest } from 'next/server';
import { clearAuthCookies } from '@/lib/auth/cookies';
import { readRefreshToken } from '@/lib/auth/request';
import { authLogout } from '@/lib/auth/service';
import { jsonError, jsonOk } from '@/lib/auth/http';

/** POST /api/auth/logout — revoke refresh session + clear cookies. */
export async function POST(request: NextRequest) {
  try {
    const refresh = readRefreshToken(request);
    const r = await authLogout(refresh);
    if (!r.ok) return jsonError(r.message, r.status);
    const res = jsonOk(r.data, r.message || '');
    clearAuthCookies(res);
    return res;
  } catch (e) {
    console.error('auth logout', e);
    return jsonError('Server error', 500);
  }
}
