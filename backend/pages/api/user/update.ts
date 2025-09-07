import { NextApiRequest, NextApiResponse } from 'next';
const connectDB = require('../../../lib/mongodb');
const { User } = require('../../../models');
const { withAuth } = require('../../../lib/auth');

async function updateProfileHandler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();
  
  try {
    const userId = req.user._id;
    const updates = req.body;

    // Remove sensitive fields that shouldn't be updated directly
    const allowedFields = [
      'name', 'email', 'profilePic', 'kyc', 'farmAddress', 
      'gst', 'location', 'languages'
    ];
    
    const filteredUpdates = {};
    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    });

    // If email is being updated, check for uniqueness
    if (filteredUpdates.email) {
      const existingUser = await User.findOne({ 
        email: filteredUpdates.email.toLowerCase(),
        _id: { $ne: userId }
      });
      
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'Email already exists'
        });
      }
      
      filteredUpdates.email = filteredUpdates.email.toLowerCase();
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      filteredUpdates,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        mobile: updatedUser.mobile,
        role: updatedUser.role,
        profilePic: updatedUser.profilePic,
        kyc: updatedUser.kyc,
        farmAddress: updatedUser.farmAddress,
        gst: updatedUser.gst,
        rating: updatedUser.rating,
        location: updatedUser.location,
        languages: updatedUser.languages,
        isActive: updatedUser.isActive,
        lastLogin: updatedUser.lastLogin,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update profile'
    });
  }
}

export default withAuth(updateProfileHandler);
