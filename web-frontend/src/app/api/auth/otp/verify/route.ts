import { NextRequest, NextResponse } from 'next/server';
import { verifyOtp } from '../../../../../../lib/otpStore';

export async function POST(request: NextRequest) {
  try {
    const { mobile, otp } = await request.json();

    if (!mobile || !otp) {
      return NextResponse.json(
        { success: false, error: 'Mobile number and OTP are required' },
        { status: 400 }
      );
    }

    const result = verifyOtp(mobile, otp);
    if (!result.ok) {
      return NextResponse.json(
        { success: false, error: result.reason || 'Invalid OTP' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully',
    });
  } catch (error) {
    console.error('OTP verify error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify OTP' },
      { status: 500 }
    );
  }
}
