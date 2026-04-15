import type { NextRequest } from 'next/server';
import { readAccessToken } from './request';
import { verifyToken } from '../jwt';

/** Returns null if caller is an ADMIN auth user; otherwise an error message. */
export function assertAdmin(request: NextRequest): string | null {
  const token = readAccessToken(request);
  if (!token) return 'Authentication required';
  try {
    const p = verifyToken(token) as { authRole?: string; role?: string };
    if (p.authRole === 'ADMIN' || p.role === 'admin') return null;
    return 'Admin access required';
  } catch {
    return 'Invalid or expired session';
  }
}
