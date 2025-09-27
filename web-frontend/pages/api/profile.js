import connectDB from '../../lib/mongodb';
import User from '../../models/User';
import { withAuth } from '../../lib/auth';

async function handler(req, res) {
  try {
    // Connect to database
    await connectDB();

    if (req.method === 'GET') {
      // Get user profile
      const user = await User.findById(req.user._id).select('-password');
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        user: user.getPublicProfile()
      });

    } else if (req.method === 'PUT') {
      // Update user profile
      const { name, email, mobile, role, location, languages } = req.body;

      const updateData = {};
      if (name) updateData.name = name.trim();
      if (email) updateData.email = email.toLowerCase().trim();
      if (mobile) updateData.mobile = mobile.trim();
      if (role) updateData.role = role;
      if (location) updateData.location = location;
      if (languages) updateData.languages = languages;

      const user = await User.findByIdAndUpdate(
        req.user._id,
        updateData,
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        user: user.getPublicProfile()
      });

    } else {
      res.status(405).json({
        success: false,
        message: 'Method not allowed'
      });
    }

  } catch (error) {
    console.error('Profile API error:', error);

    // Handle specific MongoDB errors
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Email or mobile number already exists'
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

export default withAuth(handler);

