import { NextApiRequest, NextApiResponse } from 'next';
const connectDB = require('../../lib/mongodb');
const { User } = require('../../models');
const jwt = require('jsonwebtoken');
const emailService = require('../../services/emailService');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();
  const { method } = req;

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  switch (method) {
    case 'OPTIONS':
      // Handle CORS preflight
      res.status(200).json({
        success: true,
        message: 'CORS preflight successful',
        allowedMethods: ['POST', 'OPTIONS']
      });
      break;
    case 'POST':
      return await forgotPassword(req, res);
    default:
      res.setHeader('Allow', ['POST', 'OPTIONS']);
      res.status(405).json({ 
        success: false, 
        error: `Method ${method} not allowed`,
        allowedMethods: ['POST', 'OPTIONS']
      });
  }
}

// @desc    Forgot password
// @route   POST /api/forgot-password
// @access  Public
async function forgotPassword(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required',
        received: req.body
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format',
        received: email
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found with this email address'
      });
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '1h' }
    );

    // Store reset token in user document with expiration
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    console.log(`📧 Password reset requested for: ${email}`);
    console.log(`🔑 Reset token generated for user: ${user._id}`);

    // Send password reset email
    try {
      const emailResult = await emailService.sendPasswordResetEmail(
        email, 
        resetToken, 
        user.name || user.firstName || 'User'
      );
      
      console.log('✅ Password reset email sent successfully');
      
      res.json({
        success: true,
        message: 'Password reset email sent successfully. Please check your inbox.',
        email: email,
        // Include token in development for testing
        resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined,
        previewUrl: emailResult.previewUrl,
        debug: {
          endpoint: 'POST /api/forgot-password',
          timestamp: new Date().toISOString(),
          userId: user._id,
          emailSent: true,
          messageId: emailResult.messageId
        }
      });
    } catch (emailError) {
      console.error('❌ Failed to send password reset email:', emailError.message);
      
      // Still return success but indicate email issue
      res.json({
        success: true,
        message: 'Password reset token generated. Email service temporarily unavailable.',
        email: email,
        resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined,
        warning: 'Email could not be sent. Please contact support.',
        debug: {
          endpoint: 'POST /api/forgot-password',
          timestamp: new Date().toISOString(),
          userId: user._id,
          emailSent: false,
          emailError: emailError.message
        }
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
}
