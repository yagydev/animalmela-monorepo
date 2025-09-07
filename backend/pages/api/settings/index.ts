import { NextApiRequest, NextApiResponse } from 'next';
const connectDB = require('../../../lib/mongodb');
const { Settings } = require('../../../models');
const { withAuth } = require('../../../lib/auth');

async function getSettingsHandler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();
  
  try {
    const userId = req.user._id;

    let settings = await Settings.findOne({ userId });

    if (!settings) {
      // Create default settings if none exist
      settings = await Settings.create({
        userId,
        notifications: {
          email: true,
          sms: true,
          push: true,
          marketing: false
        },
        language: 'en',
        privacy: {
          showPhone: false,
          showLocation: true,
          showEmail: false
        },
        theme: 'light'
      });
    }

    res.json({
      success: true,
      settings: {
        notifications: settings.notifications,
        language: settings.language,
        privacy: settings.privacy,
        theme: settings.theme
      }
    });

  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch settings'
    });
  }
}

export default withAuth(getSettingsHandler);
