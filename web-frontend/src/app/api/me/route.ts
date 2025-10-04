import { NextRequest, NextResponse } from 'next/server';
const { verifyToken } = require('../../../../lib/jwt');

// Get current user profile
export async function GET(request: NextRequest) {
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
      // Verify JWT token
      const userData = verifyToken(token);
      
      // Return user data
      return NextResponse.json({
        success: true,
        data: {
          user: {
            id: userData.id,
            email: userData.email,
            name: userData.name,
            role: userData.role,
            mobile: userData.mobile
          }
        }
      });

    } catch (decodeError) {
      return NextResponse.json({
        success: false,
        message: 'Invalid or expired token'
      }, { status: 401 });
    }

  } catch (error) {
    console.error('Get user profile error:', error);

    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}
