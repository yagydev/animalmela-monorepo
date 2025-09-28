import { NextRequest, NextResponse } from 'next/server';

// Standalone forgot password API for kisaanmela.com
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate required fields
    if (!email) {
      return NextResponse.json({
        success: false,
        message: 'Email is required'
      }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        success: false,
        message: 'Please enter a valid email address'
      }, { status: 400 });
    }

    // Demo users for validation
    const demoUsers = [
      'admin@kisaanmela.com',
      'farmer@kisaanmela.com', 
      'buyer@kisaanmela.com',
      'demo@kisaanmela.com'
    ];

    // Check if email exists in our demo system
    const userExists = demoUsers.includes(email);

    if (!userExists) {
      return NextResponse.json({
        success: false,
        message: 'No account found with this email address'
      }, { status: 404 });
    }

    // In a real application, you would:
    // 1. Generate a secure reset token
    // 2. Store it in database with expiration
    // 3. Send email with reset link
    // 4. Return success message

    // For demo purposes, simulate successful password reset request
    const resetToken = Buffer.from(JSON.stringify({
      email: email,
      exp: Date.now() + (60 * 60 * 1000), // 1 hour
      type: 'password_reset'
    })).toString('base64');

    // In production, you would send this via email
    console.log(`Password reset token for ${email}: ${resetToken}`);

    return NextResponse.json({
      success: true,
      message: 'Password reset instructions have been sent to your email address',
      data: {
        // In demo mode, return the token for testing
        resetToken: resetToken,
        resetUrl: `https://www.kisaanmela.com/reset-password?token=${resetToken}`
      }
    });

  } catch (error) {
    console.error('Forgot password error:', error);

    return NextResponse.json({
      success: false,
      message: 'Internal server error. Please try again later.'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Forgot password endpoint. Use POST method with email.'
  }, { status: 405 });
}
