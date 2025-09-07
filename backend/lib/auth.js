const { verifyToken, extractTokenFromHeader } = require('./jwt');
const { User } = require('../models');

/**
 * Authentication middleware for protecting routes
 * @param {Function} handler - The API route handler
 * @returns {Function} Protected handler
 */
function withAuth(handler) {
  return async (req, res) => {
    try {
      // Extract token from Authorization header
      const authHeader = req.headers.authorization;
      const token = extractTokenFromHeader(authHeader);

      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Access denied. No token provided.'
        });
      }

      // Verify token
      const decoded = verifyToken(token);
      
      // Find user by ID from token
      const user = await User.findById(decoded.userId);
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid token. User not found.'
        });
      }

      // Add user to request object
      req.user = user;
      
      // Call the original handler
      return handler(req, res);

    } catch (error) {
      console.error('Auth middleware error:', error);
      
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
  };
}

/**
 * Optional authentication middleware (doesn't fail if no token)
 * @param {Function} handler - The API route handler
 * @returns {Function} Handler with optional auth
 */
function withOptionalAuth(handler) {
  return async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      const token = extractTokenFromHeader(authHeader);

      if (token) {
        const decoded = verifyToken(token);
        const user = await User.findById(decoded.userId);
        req.user = user;
      }

      return handler(req, res);

    } catch (error) {
      // Continue without authentication
      req.user = null;
      return handler(req, res);
    }
  };
}

module.exports = {
  withAuth,
  withOptionalAuth
};
