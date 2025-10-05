import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Return registration form configuration
    const registrationConfig = {
      fields: [
        {
          name: 'name',
          label: 'Full Name',
          type: 'text',
          required: true,
          placeholder: 'Enter your full name'
        },
        {
          name: 'email',
          label: 'Email Address',
          type: 'email',
          required: true,
          placeholder: 'Enter your email'
        },
        {
          name: 'mobile',
          label: 'Mobile Number',
          type: 'tel',
          required: true,
          placeholder: 'Enter 10-digit mobile number'
        },
        {
          name: 'password',
          label: 'Password',
          type: 'password',
          required: true,
          placeholder: 'Create a password'
        },
        {
          name: 'role',
          label: 'Role',
          type: 'select',
          required: true,
          options: [
            { value: 'farmer', label: 'Farmer' },
            { value: 'buyer', label: 'Buyer' },
            { value: 'seller', label: 'Seller' },
            { value: 'service', label: 'Service Provider' }
          ]
        },
        {
          name: 'otp',
          label: 'OTP Verification',
          type: 'text',
          required: true,
          placeholder: 'Enter 6-digit OTP'
        }
      ],
      validation: {
        email: 'Please enter a valid email address',
        mobile: 'Please enter a valid 10-digit mobile number',
        password: 'Password must be at least 6 characters',
        otp: 'Please enter the 6-digit OTP sent to your mobile'
      },
      demoOTP: '123456',
      termsAndConditions: 'By registering, you agree to our Terms and Conditions',
      privacyPolicy: 'Read our Privacy Policy'
    };

    return NextResponse.json({
      success: true,
      config: registrationConfig
    });

  } catch (error) {
    console.error('Get registration config error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch registration configuration' },
      { status: 500 }
    );
  }
}

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
