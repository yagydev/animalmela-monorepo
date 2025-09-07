import { NextApiRequest, NextApiResponse } from 'next';
const connectDB = require('../../../../lib/mongodb');
const { User, OtpSession } = require('../../../../models');
const smsService = require('../../../../services/smsService');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();
  const { method } = req;

  switch (method) {
    case 'POST':
      return await sendOTP(req, res);
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).json({ success: false, error: `Method ${method} not allowed` });
  }
}

// @desc    Send OTP to mobile number
// @route   POST /api/auth/otp/send
// @access  Public
async function sendOTP(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({
        success: false,
        error: 'Mobile number is required'
      });
    }

    // Validate mobile number format (Indian mobile)
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(mobile)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid mobile number format'
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Check if there's an existing OTP session
    const existingSession = await OtpSession.findOne({ mobile });
    
    if (existingSession) {
      // Update existing session
      existingSession.otp = otp;
      existingSession.expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      existingSession.verified = false;
      existingSession.attempts = 0;
      await existingSession.save();
    } else {
      // Create new OTP session
      await OtpSession.create({
        mobile,
        otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        verified: false,
        attempts: 0
      });
    }

    // Send SMS via SMS service
    let smsResult;
    if (smsService.isConfigured()) {
      try {
        smsResult = await smsService.sendOTP(mobile, otp);
        console.log(`SMS sent to ${mobile} via ${smsResult.provider}: ${smsResult.message}`);
      } catch (error) {
        console.error('SMS sending failed:', error.message);
        smsResult = {
          success: false,
          message: 'SMS service temporarily unavailable',
          provider: 'None'
        };
      }
    } else {
      // Development mode - just log the OTP
      console.log(`OTP for ${mobile}: ${otp}`);
      smsResult = {
        success: true,
        message: 'OTP logged to console (development mode)',
        provider: 'Console'
      };
    }

    // Prepare response
    const response: any = {
      success: true,
      message: 'OTP sent successfully',
      smsProvider: smsResult.provider
    };

    // In development mode, include OTP for testing
    if (process.env.NODE_ENV === 'development') {
      response.otp = otp;
      response.debug = {
        smsResult,
        availableProviders: smsService.getAvailableProviders()
      };
    }

    res.json(response);

  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send OTP'
    });
  }
}
