import { NextApiRequest, NextApiResponse } from 'next';
const connectDB = require('../../../lib/mongodb');
const { User, Settings } = require('../../../models');
const { withAuth } = require('../../../lib/auth');

async function deleteAccountHandler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();
  
  try {
    const userId = req.user._id;

    // Soft delete - mark user as inactive instead of hard delete
    // This preserves data integrity for orders, reviews, etc.
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        isActive: false,
        email: `deleted_${Date.now()}_${userId}`,
        mobile: `deleted_${Date.now()}_${userId}`,
        name: 'Deleted User'
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Also delete user settings
    await Settings.deleteOne({ userId });

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });

  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete account'
    });
  }
}

export default withAuth(deleteAccountHandler);
