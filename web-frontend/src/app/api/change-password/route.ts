import { NextRequest, NextResponse } from 'next/server';

// Standalone change password API for kisaanmela.com
export async function POST(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        message: 'Authorization token required'
      }, { status: 401 });
    }

    // Extract token
    const token = authHeader.substring(7);
    
    try {
      // Decode the simple token (in production, use proper JWT verification)
      const userData = JSON.parse(Buffer.from(token, 'base64').toString());
      
      // Check if token is expired
      if (userData.exp && Date.now() > userData.exp) {
        return NextResponse.json({
          success: false,
          message: 'Token expired'
        }, { status: 401 });
      }

      const { currentPassword, newPassword, confirmPassword } = await request.json();

      // Validate required fields
      if (!currentPassword || !newPassword || !confirmPassword) {
        return NextResponse.json({
          success: false,
          message: 'Current password, new password, and confirm password are required'
        }, { status: 400 });
      }

      // Validate new password strength
      if (newPassword.length < 6) {
        return NextResponse.json({
          success: false,
          message: 'New password must be at least 6 characters long'
        }, { status: 400 });
      }

      // Validate password match
      if (newPassword !== confirmPassword) {
        return NextResponse.json({
          success: false,
          message: 'New passwords do not match'
        }, { status: 400 });
      }

      // Demo password validation (in production, verify against hashed password in database)
      const demoPasswords = {
        'admin@kisaanmela.com': 'admin123',
        'farmer@kisaanmela.com': 'farmer123',
        'buyer@kisaanmela.com': 'buyer123',
        'demo@kisaanmela.com': 'demo123'
      };

      const expectedPassword = demoPasswords[userData.email as keyof typeof demoPasswords];
      if (currentPassword !== expectedPassword) {
        return NextResponse.json({
          success: false,
          message: 'Current password is incorrect'
        }, { status: 400 });
      }

      // In a real application, you would:
      // 1. Hash the new password
      // 2. Update the user's password in the database
      // 3. Optionally invalidate existing tokens
      // 4. Send confirmation email

      // For demo purposes, simulate successful password change
      console.log(`Password changed successfully for ${userData.email}`);

      return NextResponse.json({
        success: true,
        message: 'Password changed successfully'
      });

    } catch (decodeError) {
      return NextResponse.json({
        success: false,
        message: 'Invalid token'
      }, { status: 401 });
    }

  } catch (error) {
    console.error('Change password error:', error);

    return NextResponse.json({
      success: false,
      message: 'Internal server error. Please try again later.'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Change password endpoint. Use POST method with current and new passwords.'
  }, { status: 405 });
}
