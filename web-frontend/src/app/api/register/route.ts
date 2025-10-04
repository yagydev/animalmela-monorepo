import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/database';
import User from '../../../../models/User';
import { generateToken } from '../../../../lib/jwt';

// MongoDB-connected registration API for kisaanmela.com
export async function POST(request: NextRequest) {
  try {
    const { name, email, mobile, password, role = 'buyer' } = await request.json();

    // Validate required fields
    if (!name || !email || !mobile) {
      return NextResponse.json({
        success: false,
        message: 'Name, email, and mobile are required'
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

    // Validate mobile format (Indian mobile numbers)
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(mobile)) {
      return NextResponse.json({
        success: false,
        message: 'Please enter a valid 10-digit mobile number'
      }, { status: 400 });
    }

    // Validate role
    const validRoles = ['farmer', 'buyer', 'seller', 'service', 'admin'];
    if (!validRoles.includes(role)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid role specified'
      }, { status: 400 });
    }

    // Connect to MongoDB
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { mobile: mobile }
      ]
    });

    if (existingUser) {
      if (existingUser.email === email.toLowerCase()) {
        return NextResponse.json({
          success: false,
          message: 'User with this email already exists'
        }, { status: 409 });
      } else {
        return NextResponse.json({
          success: false,
          message: 'User with this mobile number already exists'
        }, { status: 409 });
      }
    }

    // Create new user
    const userData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      mobile: mobile.trim(),
      role: role,
      password: password || undefined, // Optional password for OTP-only users
      profileComplete: false,
      isActive: true
    };

    const user = new User(userData);
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

    // Successful registration
    return NextResponse.json({
      success: true,
      message: 'Registration successful',
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          mobile: user.mobile,
          profileComplete: user.profileComplete
        },
        token: token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);

    // Handle MongoDB validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json({
        success: false,
        message: 'Validation error',
        errors: errors
      }, { status: 400 });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json({
        success: false,
        message: `User with this ${field} already exists`
      }, { status: 409 });
    }

    return NextResponse.json({
      success: false,
      message: 'Internal server error. Please try again later.'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Registration endpoint. Use POST method with user data.'
  }, { status: 405 });
}