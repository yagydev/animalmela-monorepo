import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { mobile, otp } = await request.json();

    if (!mobile || !otp) {
      return NextResponse.json(
        { success: false, error: 'Mobile number and OTP are required' },
        { status: 400 }
      );
    }

    // In production, verify OTP against stored value
    // For now, we'll accept any 6-digit OTP
    if (otp === '123456') {
      return NextResponse.json({
        success: true,
        message: 'OTP verified successfully'
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid OTP' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('OTP verify error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify OTP' },
      { status: 500 }
    );
  }
}
