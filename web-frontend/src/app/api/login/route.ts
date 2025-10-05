import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/database';
import User from '../../../../models/User';
import { generateToken } from '../../../../lib/jwt';

// MongoDB-connected login API for kisaanmela.com
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

    // Try to connect to MongoDB, fallback to demo mode if unavailable
    try {
      await connectDB();
    } catch (dbError) {
      console.warn('MongoDB connection failed, using demo mode:', dbError.message);
      
      // Demo mode - simple authentication for testing
      // Allow multiple demo users for testing
      const demoUsers = [
        { email: 'demo@kisaanmela.com', password: 'demo123', role: 'farmer' },
        { email: 'admin@kisaanmela.com', password: 'admin123', role: 'admin' },
        { email: 'buyer@kisaanmela.com', password: 'buyer123', role: 'buyer' },
        { email: 'seller@kisaanmela.com', password: 'seller123', role: 'seller' }
      ];
      
      const demoUser = demoUsers.find(user => 
        user.email === email.toLowerCase() && user.password === password
      );
      
      if (demoUser) {
        return NextResponse.json({
          success: true,
          message: 'Login successful (demo mode)',
          data: {
            user: {
              id: `demo-user-${demoUser.role}`,
              email: demoUser.email,
              name: `Demo ${demoUser.role.charAt(0).toUpperCase() + demoUser.role.slice(1)}`,
              role: demoUser.role,
              mobile: '9876543210',
              profileComplete: true,
              location: {
                state: 'Punjab',
                district: 'Ludhiana',
                pincode: '141001',
                village: 'Demo Village'
              },
              rating: { average: 4.5, count: 10 },
              totalRatings: 10
            },
            token: `demo-token-${demoUser.role}-${Date.now()}`
          }
        });
      }
      
      return NextResponse.json({
        success: false,
        message: 'MongoDB not available. Use demo@kisaanmela.com/demo123, admin@kisaanmela.com/admin123, buyer@kisaanmela.com/buyer123, or seller@kisaanmela.com/seller123 for testing'
      }, { status: 503 });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'Invalid email or password'
      }, { status: 401 });
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      }, { status: 401 });
    }

    // Check if user has a password (some users might be OTP-only)
    if (!user.password) {
      return NextResponse.json({
        success: false,
        message: 'Please use OTP login for this account'
      }, { status: 401 });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return NextResponse.json({
        success: false,
        message: 'Invalid email or password'
      }, { status: 401 });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const tokenPayload = {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      mobile: user.mobile
    };

    const token = generateToken(tokenPayload);

    // Successful login
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          mobile: user.mobile,
          profileComplete: user.profileComplete,
          location: user.location,
          rating: user.rating,
          totalRatings: user.totalRatings
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
