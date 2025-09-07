import { NextApiRequest, NextApiResponse } from 'next';
const connectDB = require('../../../lib/mongodb');
const { User } = require('../../../models');
const { withAuth } = require('../../../lib/auth');

async function getProfileHandler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();
  
  try {
    const user = req.user;

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        profilePic: user.profilePic,
        kyc: user.kyc,
        farmAddress: user.farmAddress,
        gst: user.gst,
        rating: user.rating,
        location: user.location,
        languages: user.languages,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch profile'
    });
  }
}

export default withAuth(getProfileHandler);
