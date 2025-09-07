const smsService = require('../../../../lib/smsService');

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    const { mobile } = req.body;

    // Validate required fields
    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: 'Mobile number is required'
      });
    }

    // Validate mobile format (basic validation)
    const mobileRegex = /^\+?[1-9]\d{1,14}$/;
    if (!mobileRegex.test(mobile)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid mobile number'
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Send SMS via SMS service
    let smsResult;
    try {
      if (smsService.isConfigured()) {
        smsResult = await smsService.sendOTP(mobile, otp);
        console.log(`SMS sent to ${mobile} via ${smsResult.provider}: ${smsResult.message}`);
      } else {
        // Development mode - just log the OTP
        console.log(`OTP for ${mobile}: ${otp}`);
        smsResult = {
          success: true,
          message: 'OTP logged to console (development mode)',
          provider: 'Console'
        };
      }
    } catch (smsError) {
      console.error('SMS sending failed:', smsError.message);
      smsResult = {
        success: false,
        message: 'SMS service temporarily unavailable',
        provider: 'None'
      };
    }

    // Prepare response
    const response = {
      success: true,
      message: 'OTP sent successfully',
      smsProvider: smsResult.provider
    };

    // In development mode, include OTP for testing
    if (process.env.NODE_ENV === 'development') {
      response.otp = otp;
      response.debug = {
        smsResult,
        availableProviders: smsService.getAvailableProviders(),
        environment: process.env.NODE_ENV
      };
    }

    res.status(200).json(response);

  } catch (error) {
    console.error('Send OTP error:', error);

    // Generic server error
    return res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
