import { NextRequest, NextResponse } from 'next/server';

// Logout endpoint
export async function POST(request: NextRequest) {
  try {
    // In a real application, you might:
    // 1. Invalidate the token in the database
    // 2. Add token to a blacklist
    // 3. Clear server-side sessions

    // For this demo, we just return success
    // The client should remove the token from storage
    
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout error:', error);

    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Logout endpoint. Use POST method.'
  }, { status: 405 });
}
