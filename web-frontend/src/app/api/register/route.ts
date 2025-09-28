import { NextRequest, NextResponse } from 'next/server';

// Temporary standalone register API for kisaanmela.com
export async function POST(request: NextRequest) {
  try {
    const { name, email, password, phone, role } = await request.json();

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json({
        success: false,
        message: 'Name, email, and password are required'
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

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json({
        success: false,
        message: 'Password must be at least 6 characters long'
      }, { status: 400 });
    }

    // In a real app, you would:
    // 1. Check if email already exists
    // 2. Hash the password
    // 3. Save to database
    // 4. Send verification email

    // For demo purposes, simulate successful registration
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      phone: phone || '',
      role: role || 'farmer',
      verified: false,
      createdAt: new Date().toISOString()
    };

    // Create a simple token
    const token = Buffer.from(JSON.stringify({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    })).toString('base64');

    return NextResponse.json({
      success: true,
      message: 'Registration successful! Welcome to Kisaan Mela.',
      data: {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          role: newUser.role,
          verified: newUser.verified
        },
        token: token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);

    return NextResponse.json({
      success: false,
      message: 'Internal server error. Please try again later.'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Registration endpoint. Use POST method with user details.'
  }, { status: 405 });
}
