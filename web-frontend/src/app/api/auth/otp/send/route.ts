import { NextRequest, NextResponse } from 'next/server';
import { generateOtp, saveOtp } from '../../../../../../lib/otpStore';

export async function POST(request: NextRequest) {
  try {
    const { mobile } = await request.json();

    if (!mobile) {
      return NextResponse.json(
        { success: false, error: 'Mobile number is required' },
        { status: 400 }
      );
    }

    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(mobile)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid 10-digit mobile number' },
        { status: 400 }
      );
    }

    const otp = generateOtp();
    saveOtp(mobile, otp);

    // TODO: integrate real SMS provider (Twilio, MSG91, etc.) using process.env.SMS_*
    // For development, log to server console only — never return OTP to the client.
    console.log(`[OTP] ${mobile} -> ${otp}`);

    const isDev = process.env.NODE_ENV !== 'production';

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
      // Expose OTP only in development to ease local testing.
      ...(isDev ? { devOtp: otp } : {}),
    });
  } catch (error) {
    console.error('OTP send error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send OTP' },
      { status: 500 }
    );
  }
}
