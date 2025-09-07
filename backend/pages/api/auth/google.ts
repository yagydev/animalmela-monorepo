import { NextApiRequest, NextApiResponse } from 'next';
const connectDB = require('../../../lib/mongodb');
const { User } = require('../../../models');
const { createTokenResponse } = require('../../../lib/jwt');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();
  const { method } = req;

  switch (method) {
    case 'POST':
      return await googleLogin(req, res);
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).json({ success: false, error: `Method ${method} not allowed` });
  }
}

// @desc    Google OAuth login
// @route   POST /api/auth/google
// @access  Public
async function googleLogin(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { googleId, email, name, profilePic } = req.body;

    if (!googleId || !email || !name) {
      return res.status(400).json({
        success: false,
        error: 'Google ID, email, and name are required'
      });
    }

    // Find user by Google ID or email
    let user = await User.findOne({
      $or: [
        { 'socialIds.googleId': googleId },
        { email: email.toLowerCase() }
      ]
    });

    if (!user) {
      // Create new user
      user = await User.create({
        email: email.toLowerCase(),
        name,
        profilePic,
        socialIds: {
          googleId
        },
        role: 'buyer'
      });
    } else {
      // Update existing user with Google ID if not present
      if (!user.socialIds.googleId) {
        user.socialIds.googleId = googleId;
        if (!user.profilePic && profilePic) {
          user.profilePic = profilePic;
        }
        await user.save();
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();
    }

    // Generate token and return response
    const response = createTokenResponse(user, 200);
    res.json(response);

  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({
      success: false,
      error: 'Google login failed'
    });
  }
}
