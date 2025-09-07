import connectDB from '../../lib/mongodb';
import User from '../../models/User';
import { withAuth } from '../../lib/auth';

async function handler(req, res) {
  try {
    // Connect to database
    await connectDB();

    if (req.method === 'GET') {
      // Get user settings
      const user = await User.findById(req.user._id).select('settings');
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Default settings if none exist
      const defaultSettings = {
        notifications: {
          email: true,
          sms: false,
          push: true,
          marketing: false,
        },
        privacy: {
          profileVisibility: 'public',
          showEmail: false,
          showPhone: false,
        },
        security: {
          twoFactorEnabled: false,
          loginAlerts: true,
        },
      };

      res.status(200).json({
        success: true,
        settings: user.settings || defaultSettings
      });

    } else if (req.method === 'PUT') {
      // Update user settings
      const { notifications, privacy, security } = req.body;

      const updateData = {};
      if (notifications) updateData['settings.notifications'] = notifications;
      if (privacy) updateData['settings.privacy'] = privacy;
      if (security) updateData['settings.security'] = security;

      const user = await User.findByIdAndUpdate(
        req.user._id,
        { $set: updateData },
        { new: true, runValidators: true }
      ).select('settings');

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Settings updated successfully',
        settings: user.settings
      });

    } else {
      res.status(405).json({
        success: false,
        message: 'Method not allowed'
      });
    }

  } catch (error) {
    console.error('Settings API error:', error);

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

