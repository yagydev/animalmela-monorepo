import { NextRequest, NextResponse } from 'next/server';

// Standalone reset password API for kisaanmela.com
export async function POST(request: NextRequest) {
  try {
    const { token, password, confirmPassword } = await request.json();

    // Validate required fields
    if (!token || !password || !confirmPassword) {
      return NextResponse.json({
        success: false,
        message: 'Token, password, and confirm password are required'
      }, { status: 400 });
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json({
        success: false,
        message: 'Password must be at least 6 characters long'
      }, { status: 400 });
    }

    // Validate password match
    if (password !== confirmPassword) {
      return NextResponse.json({
        success: false,
        message: 'Passwords do not match'
      }, { status: 400 });
    }

    try {
      // Decode and validate token
      const tokenData = JSON.parse(Buffer.from(token, 'base64').toString());
      
      // Check if token is expired
      if (tokenData.exp && Date.now() > tokenData.exp) {
        return NextResponse.json({
          success: false,
          message: 'Reset token has expired. Please request a new password reset.'
        }, { status: 400 });
      }

      // Check if token is for password reset
      if (tokenData.type !== 'password_reset') {
        return NextResponse.json({
          success: false,
          message: 'Invalid reset token'
        }, { status: 400 });
      }

      // In a real application, you would:
      // 1. Hash the new password
      // 2. Update the user's password in the database
      // 3. Invalidate the reset token
      // 4. Send confirmation email

      // For demo purposes, simulate successful password reset
      console.log(`Password reset successful for ${tokenData.email}`);

      return NextResponse.json({
        success: true,
        message: 'Password has been reset successfully. You can now login with your new password.',
        data: {
          email: tokenData.email
        }
      });

    } catch (decodeError) {
      return NextResponse.json({
        success: false,
        message: 'Invalid or corrupted reset token'
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Reset password error:', error);

    return NextResponse.json({
      success: false,
      message: 'Internal server error. Please try again later.'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Reset password endpoint. Use POST method with token and new password.'
  }, { status: 405 });
}
