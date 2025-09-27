import connectDB from '../../../../lib/mongodb';
import User from '../../../../models/User';
import { createTokenResponse } from '../../../../lib/jwt';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    // Connect to database
    await connectDB();

    const { mobile, otp, name } = req.body;

    // Validate required fields
    if (!mobile || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Mobile number and OTP are required'
      });
    }

    // Validate OTP format
    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 6-digit OTP'
      });
    }

    // In a real implementation, verify OTP against stored OTP
    // For now, we'll accept any 6-digit OTP for testing
    console.log(`Verifying OTP ${otp} for mobile ${mobile}`);

    // Check if user exists
    let user = await User.findOne({ mobile });

    if (!user) {
      // Create new user if doesn't exist
      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'Name is required for new users'
        });
      }

      user = new User({
        mobile,
        email: `${mobile.replace('+', '')}@animalmela.com`, // Generate email from mobile
        name: name.trim(),
        role: 'buyer',
        isVerified: true, // OTP verification counts as verification
        password: undefined // Don't set password for OTP users
      });

      await user.save();
    }

    // Generate token and return response
    const response = createTokenResponse(user, 200);
    
    return res.status(200).json(response);

  } catch (error) {
    console.error('Verify OTP error:', error);

    // Handle specific MongoDB errors
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'User with this mobile number already exists'
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    // Generic server error
    return res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
}
