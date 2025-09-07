const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Generate JWT token
 * @param {Object} payload - The payload to encode
 * @param {string} expiresIn - Token expiration time
 * @returns {string} JWT token
 */
function generateToken(payload, expiresIn = JWT_EXPIRES_IN) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

/**
 * Verify JWT token
 * @param {string} token - The token to verify
 * @returns {Object} Decoded token payload
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

/**
 * Extract token from Authorization header
 * @param {string} authHeader - Authorization header value
 * @returns {string|null} Extracted token or null
 */
function extractTokenFromHeader(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

/**
 * Create response with token
 * @param {Object} user - User object
 * @param {number} statusCode - HTTP status code
 * @returns {Object} Response object with token
 */
function createTokenResponse(user, statusCode = 200) {
  const token = generateToken({ 
    userId: user._id, 
    email: user.email,
    role: user.role 
  });

  return {
    success: true,
    message: statusCode === 201 ? 'User created successfully' : 'Login successful',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      profilePic: user.profilePic,
      kyc: user.kyc,
      rating: user.rating
    }
  };
}

module.exports = {
  generateToken,
  verifyToken,
  extractTokenFromHeader,
  createTokenResponse
};
