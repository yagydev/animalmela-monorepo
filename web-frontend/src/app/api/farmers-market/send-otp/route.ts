import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { mobile, type } = await request.json();

    if (!mobile) {
      return NextResponse.json(
        { success: false, error: 'Mobile number is required' },
        { status: 400 }
      );
    }

    // Mock OTP sending
    const otp = '123456';
    console.log(`OTP sent to ${mobile}: ${otp}`);

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
      otp: otp // Only for testing
    });

  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send OTP' },
      { status: 500 }
    );
  }
}
