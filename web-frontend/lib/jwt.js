import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
const LEGACY_EXPIRES = process.env.JWT_EXPIRES_IN || '24h';

/** Resolve at call time so missing env does not crash module load (Vercel cold start). */
function accessSecret() {
  const s = process.env.JWT_ACCESS_SECRET?.trim() || process.env.JWT_SECRET?.trim();
  if (!s) {
    throw new Error('JWT_SECRET or JWT_ACCESS_SECRET environment variable is not set');
  }
  return s;
}

function refreshSecret() {
  const explicit = process.env.JWT_REFRESH_SECRET?.trim();
  if (explicit) return explicit;
  const base = process.env.JWT_SECRET?.trim();
  if (!base) {
    throw new Error('JWT_SECRET or JWT_REFRESH_SECRET environment variable is not set');
  }
  return `${base}_refresh`;
}

/** Legacy single token (backward compatible). */
export const generateToken = (payload) => {
  return jwt.sign(payload, accessSecret(), {
    expiresIn: LEGACY_EXPIRES,
  });
};

export const signAccessToken = (payload) => {
  return jwt.sign(
    { ...payload, typ: 'access' },
    accessSecret(),
    { expiresIn: ACCESS_EXPIRES }
  );
};

export const signRefreshToken = (payload, expiresInOverride) => {
  return jwt.sign(
    { ...payload, typ: 'refresh' },
    refreshSecret(),
    { expiresIn: expiresInOverride || REFRESH_EXPIRES }
  );
};

/** Verify access / legacy bearer token (no strict `typ` for older JWTs). */
export const verifyToken = (token) => {
  return jwt.verify(token, accessSecret());
};

export const verifyAccessToken = (token) => {
  const decoded = jwt.verify(token, accessSecret());
  if (decoded.typ === 'refresh') {
    throw new Error('Invalid access token');
  }
  if (decoded.typ && decoded.typ !== 'access') {
    throw new Error('Invalid access token');
  }
  return decoded;
};

export const verifyRefreshToken = (token) => {
  const decoded = jwt.verify(token, refreshSecret());
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
