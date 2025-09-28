import { NextRequest, NextResponse } from 'next/server';

// Temporary standalone login API for kisaanmela.com
// This provides basic authentication until full backend is deployed

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json({
        success: false,
        message: 'Email and password are required'
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

    // Demo authentication - In production, this would connect to your database
    const demoUsers = [
      { email: 'admin@kisaanmela.com', password: 'admin123', role: 'admin', name: 'Admin User' },
      { email: 'farmer@kisaanmela.com', password: 'farmer123', role: 'farmer', name: 'Demo Farmer' },
      { email: 'buyer@kisaanmela.com', password: 'buyer123', role: 'buyer', name: 'Demo Buyer' },
      { email: 'demo@kisaanmela.com', password: 'demo123', role: 'farmer', name: 'Demo User' }
    ];

    // Check if user exists and password matches
    const user = demoUsers.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'Invalid email or password'
      }, { status: 401 });
    }

    // Create a simple JWT-like token (in production, use proper JWT)
    const token = Buffer.from(JSON.stringify({
      id: user.email,
      email: user.email,
      name: user.name,
      role: user.role,
      exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    })).toString('base64');

    // Successful login
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.email,
          email: user.email,
          name: user.name,
          role: user.role
        },
        token: token
      }
    });

  } catch (error) {
    console.error('Login error:', error);

    return NextResponse.json({
      success: false,
      message: 'Internal server error. Please try again later.'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Login endpoint. Use POST method with email and password.'
  }, { status: 405 });
}
