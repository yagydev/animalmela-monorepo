import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || (JWT_SECRET ? `${JWT_SECRET}_refresh` : undefined);

const ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
const LEGACY_EXPIRES = process.env.JWT_EXPIRES_IN || '24h';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set');
}
if (!JWT_REFRESH_SECRET) {
  throw new Error('JWT_REFRESH_SECRET or JWT_SECRET must be set');
}

/** Legacy single token (backward compatible). */
export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_ACCESS_SECRET, {
    expiresIn: LEGACY_EXPIRES,
  });
};

export const signAccessToken = (payload) => {
  return jwt.sign(
    { ...payload, typ: 'access' },
    JWT_ACCESS_SECRET,
    { expiresIn: ACCESS_EXPIRES }
  );
};

export const signRefreshToken = (payload, expiresInOverride) => {
  return jwt.sign(
    { ...payload, typ: 'refresh' },
    JWT_REFRESH_SECRET,
    { expiresIn: expiresInOverride || REFRESH_EXPIRES }
  );
};

/** Verify access / legacy bearer token (no strict `typ` for older JWTs). */
export const verifyToken = (token) => {
  return jwt.verify(token, JWT_ACCESS_SECRET);
};

export const verifyAccessToken = (token) => {
  const decoded = jwt.verify(token, JWT_ACCESS_SECRET);
  if (decoded.typ === 'refresh') {
    throw new Error('Invalid access token');
  }
  if (decoded.typ && decoded.typ !== 'access') {
    throw new Error('Invalid access token');
  }
  return decoded;
};

export const verifyRefreshToken = (token) => {
  const decoded = jwt.verify(token, JWT_REFRESH_SECRET);
  if (decoded.typ !== 'refresh') {
    throw new Error('Invalid refresh token');
  }
  return decoded;
};

export const extractToken = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
};

export const requireAuth = (request) => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return {
      error: NextResponse.json(
        { success: false, message: 'Authorization header missing or malformed' },
        { status: 401 }
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
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      ),
    };
  }
};
