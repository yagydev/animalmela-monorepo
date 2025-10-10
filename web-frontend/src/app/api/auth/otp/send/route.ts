import { NextRequest, NextResponse } from 'next/server';
const smsService = require('../../../../../../lib/smsService');

export async function POST(request: NextRequest) {
  try {
    const { mobile } = await request.json();

    if (!mobile) {
      return NextResponse.json(
        { success: false, error: 'Mobile number is required' },
        { status: 400 }
      );
    }

    // Validate mobile number format (10 digits for India)
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(mobile)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid 10-digit mobile number' },
        { status: 400 }
      );
    }

    // Generate random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    console.log(`Generated OTP for ${mobile}: ${otp}`);
    
    // Check if SMS service is configured
    if (!smsService.isConfigured()) {
      console.warn('SMS service not configured, using demo mode');
      return NextResponse.json({
        success: true,
        message: 'OTP sent successfully (demo mode)',
        otp: otp, // Only for testing when SMS service is not configured
        demo: true
      });
    }

    // Send OTP via SMS service
    const smsResult = await smsService.sendOTP(mobile, otp);
    
    if (smsResult.success) {
      console.log(`OTP sent to ${mobile} via ${smsResult.provider}: ${otp}`);
      
      // Store OTP in session/cache for verification (in production, use Redis or database)
      // For now, we'll just return success
      
      return NextResponse.json({
        success: true,
        message: smsResult.message,
        provider: smsResult.provider,
        otp: otp // Only for testing - remove in production
      });
    } else {
      console.error(`Failed to send OTP to ${mobile}:`, smsResult.message);
      
      // Fallback to demo mode if SMS fails
      return NextResponse.json({
        success: true,
        message: 'OTP sent successfully (demo mode - SMS service unavailable)',
        otp: otp,
        demo: true,
        smsError: smsResult.message
      });
    }

  } catch (error) {
    console.error('OTP send error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send OTP' },
      { status: 500 }
    );
  }
}
