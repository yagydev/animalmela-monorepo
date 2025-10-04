import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { name, email, mobile, password, role, otp } = await request.json();

    if (!name || !email || !mobile || !password || !otp) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate OTP
    if (otp !== '123456') {
      return NextResponse.json(
        { success: false, error: 'Invalid OTP' },
        { status: 400 }
      );
    }

    // Mock user creation
    const newUser = {
      id: Date.now(),
      name,
      email,
      mobile,
      role: role || 'buyer',
      isVerified: true,
      createdAt: new Date().toISOString()
    };

    // Mock token
    const token = `mock-token-${newUser.id}-${Date.now()}`;

    return NextResponse.json({
      success: true,
      message: 'User registered successfully',
      user: {
        _id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        mobile: newUser.mobile,
        role: newUser.role
      },
      token
    });

  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to register user' },
      { status: 500 }
    );
  }
}
