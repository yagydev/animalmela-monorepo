import { NextApiRequest, NextApiResponse } from 'next';
const connectDB = require('../../../lib/mongodb');
const { User } = require('../../../models');
const { createTokenResponse } = require('../../../lib/jwt');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();
  const { method } = req;

  switch (method) {
    case 'POST':
      return await facebookLogin(req, res);
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).json({ success: false, error: `Method ${method} not allowed` });
  }
}

// @desc    Facebook OAuth login
// @route   POST /api/auth/facebook
// @access  Public
async function facebookLogin(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { facebookId, email, name, profilePic } = req.body;

    if (!facebookId || !name) {
      return res.status(400).json({
        success: false,
        error: 'Facebook ID and name are required'
      });
    }

    // Find user by Facebook ID or email (if provided)
    let user = await User.findOne({
      $or: [
        { 'socialIds.facebookId': facebookId },
        ...(email ? [{ email: email.toLowerCase() }] : [])
      ]
    });

    if (!user) {
      // Create new user
      user = await User.create({
        ...(email && { email: email.toLowerCase() }),
        name,
        profilePic,
        socialIds: {
          facebookId
        },
        role: 'buyer'
      });
    } else {
      // Update existing user with Facebook ID if not present
      if (!user.socialIds.facebookId) {
        user.socialIds.facebookId = facebookId;
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
    console.error('Facebook login error:', error);
    res.status(500).json({
      success: false,
      error: 'Facebook login failed'
    });
  }
}
