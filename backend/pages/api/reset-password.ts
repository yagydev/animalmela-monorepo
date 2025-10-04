import { NextApiRequest, NextApiResponse } from 'next';
const connectDB = require('../../lib/mongodb');
const { User } = require('../../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();
  const { method } = req;

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  switch (method) {
    case 'OPTIONS':
      res.status(200).json({
        success: true,
        message: 'CORS preflight successful',
        allowedMethods: ['POST', 'GET', 'OPTIONS']
      });
      break;
    case 'GET':
      return await validateResetToken(req, res);
    case 'POST':
      return await resetPassword(req, res);
    default:
      res.setHeader('Allow', ['POST', 'GET', 'OPTIONS']);
      res.status(405).json({ 
        success: false, 
        error: `Method ${method} not allowed`,
        allowedMethods: ['POST', 'GET', 'OPTIONS']
      });
  }
}

// @desc    Validate reset token
// @route   GET /api/reset-password?token=TOKEN
// @access  Public
async function validateResetToken(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'Reset token is required'
      });
    }

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    } catch (jwtError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired reset token'
      });
    }

    // Find user with valid reset token
    const user = await User.findOne({
      _id: decoded.userId,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Reset token is invalid or has expired'
      });
    }

    res.json({
      success: true,
      message: 'Reset token is valid',
      email: user.email,
      userId: user._id
    });
  } catch (error) {
    console.error('Validate reset token error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
}

// @desc    Reset password with token
// @route   POST /api/reset-password
// @access  Public
async function resetPassword(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { token, password, confirmPassword } = req.body;

    if (!token || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        error: 'Token, password, and confirm password are required'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: 'Passwords do not match'
      });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long'
      });
    }

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    } catch (jwtError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired reset token'
      });
    }

    // Find user with valid reset token
    const user = await User.findOne({
      _id: decoded.userId,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Reset token is invalid or has expired'
      });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Update user password and clear reset token
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.passwordChangedAt = new Date();
    await user.save();

    console.log(`✅ Password reset successful for user: ${user.email}`);

    res.json({
      success: true,
      message: 'Password has been reset successfully. You can now login with your new password.',
      email: user.email,
      debug: {
        endpoint: 'POST /api/reset-password',
        timestamp: new Date().toISOString(),
        userId: user._id
      }
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
}
