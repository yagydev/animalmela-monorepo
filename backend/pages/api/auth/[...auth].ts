const { NextApiRequest, NextApiResponse } = require('next');
const { User } = require('../../../models');
const { generateToken, verifyOTP } = require('../../../middleware/auth');
const connectDB = require('../../../lib/mongodb');
const bcrypt = require('bcryptjs');

export default async function handler(req, res) {
  // Connect to database
  await connectDB();
  const { method } = req;

  switch (method) {
    case 'POST':
      if (req.query.auth && req.query.auth[0] === 'otp' && req.query.auth[1] === 'send') {
        return await sendOTP(req, res);
      } else if (req.query.auth && req.query.auth[0] === 'otp' && req.query.auth[1] === 'verify') {
        return await verifyOTPLogin(req, res);
      } else if (req.query.auth && req.query.auth[0] === 'register') {
        return await register(req, res);
      } else if (req.query.auth && req.query.auth[0] === 'login') {
        return await login(req, res);
      }
      break;
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).json({ success: false, error: `Method ${method} not allowed` });
  }
}

// @desc    Send OTP to mobile number
// @route   POST /api/auth/otp/send
// @access  Public
async function sendOTP(req, res) {
  try {
    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({
        success: false,
        error: 'Mobile number is required'
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // In a real implementation, you would send this OTP via SMS
    console.log(`OTP for ${mobile}: ${otp}`);

    res.json({
      success: true,
      message: 'OTP sent successfully',
      otp: otp // Remove this in production
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Verify OTP and login/register
// @route   POST /api/auth/otp/verify
// @access  Public
async function verifyOTPLogin(req, res) {
  try {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
      return res.status(400).json({
        success: false,
        error: 'Mobile number and OTP are required'
      });
    }

    // In a real implementation, verify OTP against stored OTP
    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid OTP'
      });
    }

    // Check if user exists
    let user = await User.findOne({ mobile });

    if (!user) {
      // Create new user if doesn't exist
      user = await User.create({
        mobile,
        email: `${mobile.replace('+', '')}@animalmela.com`, // Generate email from mobile
        name: `User ${mobile.slice(-4)}`, // Temporary name
        role: 'buyer'
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'OTP verified successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        mobile: user.mobile,
        email: user.email,
        role: user.role,
        kyc: user.kyc,
        rating: user.rating,
        location: user.location,
        languages: user.languages
      }
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
async function register(req, res) {
  try {
    const { name, mobile, email, password, role = 'buyer' } = req.body;

    if (!name || !mobile || !email) {
      return res.status(400).json({
        success: false,
        error: 'Name, mobile, and email are required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { mobile }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User already exists with this email or mobile'
      });
    }

    // Hash password if provided
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const user = await User.create({
      name,
      mobile,
      email,
      password: hashedPassword,
      role
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        mobile: user.mobile,
        email: user.email,
        role: user.role,
        kyc: user.kyc,
        rating: user.rating,
        location: user.location,
        languages: user.languages
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
async function login(req, res) {
  try {
    const { email, password, mobile } = req.body;

    if (!email && !mobile) {
      return res.status(400).json({
        success: false,
        error: 'Email or mobile is required'
      });
    }

    // Find user by email or mobile
    const user = await User.findOne({
      $or: [{ email }, { mobile }]
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check password if provided
    if (password && user.password) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        mobile: user.mobile,
        email: user.email,
        role: user.role,
        kyc: user.kyc,
        rating: user.rating,
        location: user.location,
        languages: user.languages
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}