import { NextApiRequest, NextApiResponse } from 'next';
const { withAuth } = require('../../../lib/auth');

async function logoutHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // In a stateless JWT system, logout is handled client-side
    // by removing the token from storage. However, we can implement
    // token blacklisting here if needed for enhanced security.

    res.json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: 'Logout failed'
    });
  }
}

export default withAuth(logoutHandler);
