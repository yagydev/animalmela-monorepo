import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { mobile } = await request.json();

    if (!mobile) {
      return NextResponse.json(
        { success: false, error: 'Mobile number is required' },
        { status: 400 }
      );
    }

    // In production, you would integrate with an SMS service like Twilio, AWS SNS, etc.
    // For now, we'll simulate sending an OTP
    const otp = '123456'; // In production, generate a random 6-digit OTP
    
    console.log(`OTP sent to ${mobile}: ${otp}`);
    
    // Store OTP in session/cache for verification (in production, use Redis or database)
    // For now, we'll just return success
    
    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
      otp: otp // Only for testing - remove in production
    });

  } catch (error) {
    console.error('OTP send error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send OTP' },
      { status: 500 }
    );
  }
}
