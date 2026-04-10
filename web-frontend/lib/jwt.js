import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set');
}
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Generate JWT token
export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

// Verify JWT token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Extract token from request headers
export const extractToken = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
};

/**
 * App Router helper — reads Bearer token from NextRequest and returns the
 * decoded payload.  Returns { error: NextResponse } on failure so callers can
 * do an early return:
 *
 *   const auth = requireAuth(request);
 *   if ('error' in auth) return auth.error;
 *   const { id } = auth.payload;
 */
export const requireAuth = (request) => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return {
      error: NextResponse.json(
        { success: false, error: 'Authorization header missing or malformed' },
        { status: 401 },
      ),
    };
  }
  const token = authHeader.slice(7);
  try {
    const payload = verifyToken(token);
    return { payload };
  } catch {
    return {
      error: NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 },
      ),
    };
  }
};