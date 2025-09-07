import { NextApiRequest, NextApiResponse } from 'next';
const connectDB = require('../../../lib/mongodb');
const { Settings } = require('../../../models');
const { withAuth } = require('../../../lib/auth');

async function updateSettingsHandler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();
  
  try {
    const userId = req.user._id;
    const updates = req.body;

    // Validate language if provided
    const validLanguages = ['en', 'hi', 'te', 'ta', 'bn', 'gu', 'mr', 'pa', 'or', 'as'];
    if (updates.language && !validLanguages.includes(updates.language)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid language code'
      });
    }

    // Validate theme if provided
    const validThemes = ['light', 'dark', 'auto'];
    if (updates.theme && !validThemes.includes(updates.theme)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid theme'
      });
    }

    // Find or create settings
    let settings = await Settings.findOne({ userId });

    if (!settings) {
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

    // Update settings
    if (updates.notifications) {
      settings.notifications = { ...settings.notifications, ...updates.notifications };
    }
    if (updates.language) {
      settings.language = updates.language;
    }
    if (updates.privacy) {
      settings.privacy = { ...settings.privacy, ...updates.privacy };
    }
    if (updates.theme) {
      settings.theme = updates.theme;
    }

    await settings.save();

    res.json({
      success: true,
      message: 'Settings updated successfully',
      settings: {
        notifications: settings.notifications,
        language: settings.language,
        privacy: settings.privacy,
        theme: settings.theme
      }
    });

  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update settings'
    });
  }
}

export default withAuth(updateSettingsHandler);
