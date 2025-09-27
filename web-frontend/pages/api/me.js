import { withAuth } from '../../lib/auth';

async function handler(req, res) {
  try {
    // User is already available from auth middleware
    const user = req.user;

    return res.status(200).json({
      success: true,
      message: 'User profile retrieved successfully',
      user: user.getPublicProfile()
    });

  } catch (error) {
    console.error('Get user profile error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
}

export default withAuth(handler);
