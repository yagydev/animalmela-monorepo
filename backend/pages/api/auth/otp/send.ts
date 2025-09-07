import { NextApiRequest, NextApiResponse } from 'next';
const connectDB = require('../../../../lib/mongodb');
const { User, OtpSession } = require('../../../../models');

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

    // In production, send SMS via Twilio or similar service
    // For now, we'll just log it (remove in production)
    console.log(`OTP for ${mobile}: ${otp}`);

    // TODO: Integrate with SMS service
    // await sendSMS(mobile, `Your Pashu Marketplace OTP is: ${otp}`);

    res.json({
      success: true,
      message: 'OTP sent successfully',
      // In development, include OTP for testing
      ...(process.env.NODE_ENV === 'development' && { otp })
    });

  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send OTP'
    });
  }
}
