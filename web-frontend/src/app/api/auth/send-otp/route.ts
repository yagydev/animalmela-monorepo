import { NextRequest } from 'next/server';
import { authSendOtp } from '@/lib/auth/service';
import { jsonError, jsonOk } from '@/lib/auth/http';

/** POST /api/auth/send-otp — rate-limited OTP to registered mobile. */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const r = await authSendOtp(body);
    if (!r.ok) return jsonError(r.message, r.status);
    return jsonOk(r.data, r.message || 'OTP sent');
  } catch (e) {
    const status = (e as Error & { statusCode?: number }).statusCode;
    if (status === 429) {
      return jsonError((e as Error).message, 429);
    }
    console.error('send-otp', e);
    return jsonError('Server error', 500);
  }
}
