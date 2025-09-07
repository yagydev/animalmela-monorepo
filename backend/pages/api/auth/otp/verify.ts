import { NextApiRequest, NextApiResponse } from 'next';
const connectDB = require('../../../../lib/mongodb');
const { User, OtpSession } = require('../../../../models');
const { createTokenResponse } = require('../../../../lib/jwt');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();
  const { method } = req;

  switch (method) {
    case 'POST':
      return await verifyOTP(req, res);
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).json({ success: false, error: `Method ${method} not allowed` });
  }
}

// @desc    Verify OTP and login/register user
// @route   POST /api/auth/otp/verify
// @access  Public
async function verifyOTP(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { mobile, otp, name } = req.body;

    if (!mobile || !otp) {
      return res.status(400).json({
        success: false,
        error: 'Mobile number and OTP are required'
      });
    }

    // Find OTP session
    const otpSession = await OtpSession.findOne({ mobile });
    
    if (!otpSession) {
      return res.status(400).json({
        success: false,
        error: 'OTP session not found. Please request OTP again.'
      });
    }

    // Check if OTP is expired
    if (new Date() > otpSession.expiresAt) {
      await OtpSession.deleteOne({ mobile });
      return res.status(400).json({
        success: false,
        error: 'OTP has expired. Please request a new OTP.'
      });
    }

    // Check attempts limit
    if (otpSession.attempts >= 3) {
      await OtpSession.deleteOne({ mobile });
      return res.status(400).json({
        success: false,
        error: 'Too many failed attempts. Please request a new OTP.'
      });
    }

    // Verify OTP
    if (otpSession.otp !== otp) {
      otpSession.attempts += 1;
      await otpSession.save();
      
      return res.status(400).json({
        success: false,
        error: 'Invalid OTP',
        attemptsLeft: 3 - otpSession.attempts
      });
    }

    // OTP is valid, mark as verified
    otpSession.verified = true;
    await otpSession.save();

    // Find or create user
    let user = await User.findOne({ mobile });
    
    if (!user) {
      // Create new user
      if (!name) {
        return res.status(400).json({
          success: false,
          error: 'Name is required for new user registration'
        });
      }

      user = await User.create({
        mobile,
        name,
        role: 'buyer' // Default role
      });
    } else {
      // Update last login
      user.lastLogin = new Date();
      await user.save();
    }

    // Generate token and return response
    const response = createTokenResponse(user, 200);
    
    // Clean up OTP session
    await OtpSession.deleteOne({ mobile });

    res.json(response);

  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to verify OTP'
    });
  }
}
