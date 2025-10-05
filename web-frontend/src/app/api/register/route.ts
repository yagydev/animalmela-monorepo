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

    // Try to connect to MongoDB, fallback to demo mode if unavailable
    try {
      await connectDB();
    } catch (dbError) {
      console.warn('MongoDB connection failed, using demo mode:', dbError.message);
      
      // Demo mode - simple registration for testing
      const demoUser = {
        id: 'demo-user-' + Date.now(),
        name: name.trim(),
        email: email.toLowerCase().trim(),
        mobile: mobile.trim(),
        role: role,
        profileComplete: false,
        isActive: true,
        createdAt: new Date().toISOString()
      };
      
      return NextResponse.json({
        success: true,
        message: 'User registered successfully (demo mode)',
        data: {
          user: demoUser,
          token: 'demo-token-' + Date.now()
        }
      }, { status: 201 });
    }

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
          message: 'Email already registered'
        }, { status: 409 });
      } else {
        return NextResponse.json({
          success: false,
          message: 'Mobile number already registered'
        }, { status: 409 });
      }
    }

    // Hash password if provided
    let hashedPassword = undefined;
    if (password) {
      const bcrypt = require('bcryptjs');
      const saltRounds = 10;
      hashedPassword = await bcrypt.hash(password, saltRounds);
    }

    // Create new user
    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      mobile: mobile.trim(),
      password: hashedPassword,
      role: role,
      isActive: true,
      profileComplete: false,
      createdAt: new Date()
    });

    await newUser.save();

    // Generate JWT token
    const tokenPayload = {
      id: newUser._id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      mobile: newUser.mobile
    };

    const token = generateToken(tokenPayload);

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: newUser._id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          mobile: newUser.mobile,
          profileComplete: newUser.profileComplete
        },
        token: token
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle specific MongoDB errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json({
        success: false,
        message: `${field} already exists`
      }, { status: 409 });
    }
    
    return NextResponse.json({
      success: false,
      message: 'Registration failed. Please try again.'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Registration endpoint. Use POST method with user data.'
  }, { status: 405 });
}