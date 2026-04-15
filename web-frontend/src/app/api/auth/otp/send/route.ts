import { NextRequest } from 'next/server';
import { authSendOtp } from '@/lib/auth/service';
import { jsonError, jsonOk } from '@/lib/auth/http';

/**
 * Legacy POST /api/auth/otp/send — forwards to unified OTP pipeline (hashed OTP, rate limit, SMS/mock).
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const phone = body?.mobile || body?.phone;
    const r = await authSendOtp({ phone });
    if (!r.ok) {
      return jsonError(r.message, r.status);
    }
    return jsonOk(
      {
        ...r.data,
        demo: Boolean((r.data as { demoOtp?: boolean }).demoOtp),
      },
      r.message || 'OTP sent successfully'
    );
  } catch (e) {
    const status = (e as Error & { statusCode?: number }).statusCode;
    if (status === 429) {
      return jsonError((e as Error).message, 429);
    }
    console.error('OTP send error:', e);
    return jsonError('Failed to send OTP', 500);
  }
}
