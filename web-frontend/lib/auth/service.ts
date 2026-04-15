import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { connectDB } from '../database';
import User from '../../models/User';
import RefreshToken from '../../models/RefreshToken';
import { signAccessToken, signRefreshToken, verifyRefreshToken, verifyToken } from '../jwt';
import { generateOtp6, hashOtp } from './otp';
import { assertOtpSendAllowed } from './rateLimitOtp';
import { sendOtpSms } from './sms';
import {
  loginPasswordSchema,
  sendOtpSchema,
  signupOtpInitSchema,
  signupPasswordSchema,
  verifyOtpSchema,
} from './schemas';

const OTP_TTL_MS = 5 * 60 * 1000;

export type ServiceResult<T> =
  | { ok: true; data: T; message?: string }
  | { ok: false; message: string; status: number };

function publicUser(u: {
  _id: unknown;
  name: string;
  email?: string | null;
  username?: string | null;
  mobile: string;
  role: string;
  authRole?: string;
  isVerified?: boolean;
  profileComplete?: boolean;
  location?: unknown;
  rating?: number;
  totalRatings?: number;
}) {
  const authRole =
    u.authRole === 'ADMIN' || u.role === 'admin' ? ('ADMIN' as const) : ('USER' as const);
  return {
    id: String(u._id),
    _id: String(u._id),
    name: u.name,
    email: u.email ?? null,
    username: u.username ?? null,
    mobile: u.mobile,
    role: u.role,
    authRole,
    isVerified: Boolean(u.isVerified),
    profileComplete: Boolean(u.profileComplete),
    location: u.location ?? null,
    rating: u.rating ?? 0,
    totalRatings: u.totalRatings ?? 0,
  };
}

async function issueTokens(
  user: {
    _id: unknown;
    name: string;
    email?: string | null;
    mobile: string;
    role: string;
    authRole?: string;
    profileComplete?: boolean;
    location?: unknown;
    rating?: number;
    totalRatings?: number;
  },
  opts: { rememberMe?: boolean; userAgent?: string; ip?: string }
) {
  const authRole =
    user.authRole === 'ADMIN' || user.role === 'admin' ? ('ADMIN' as const) : ('USER' as const);
  const accessToken = signAccessToken({
    sub: String(user._id),
    id: String(user._id),
    name: user.name,
    email: user.email,
    mobile: user.mobile,
    role: user.role,
    authRole,
  });
  const jti = crypto.randomUUID();
  const refreshExp = opts.rememberMe ? '30d' : undefined;
  const refreshToken = signRefreshToken(
    {
      sub: String(user._id),
      jti,
    },
    refreshExp
  );
  const decoded = jwt.decode(refreshToken) as { exp?: number };
  const expSec = decoded?.exp ?? Math.floor(Date.now() / 1000) + 7 * 24 * 3600;
  const expiresAt = new Date(expSec * 1000);
  await RefreshToken.create({
    userId: user._id,
    jti,
    expiresAt,
    revoked: false,
    userAgent: opts.userAgent,
    ip: opts.ip,
  });
  return { accessToken, refreshToken, user: publicUser(user) };
}

/** Password + profile signup (email optional). */
export async function authSignupPassword(
  body: unknown
): Promise<
  ServiceResult<{ user: ReturnType<typeof publicUser>; accessToken: string; refreshToken: string }>
> {
  const parsed = signupPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message || 'Invalid input', status: 400 };
  }
  const { name, mobile, password, role } = parsed.data;
  const email = parsed.data.email?.trim() || undefined;
  const username = parsed.data.username?.trim() || undefined;

  await connectDB();

  const dup = await User.findOne({
    $or: [
      { mobile },
      ...(email ? [{ email: email.toLowerCase() }] : []),
      ...(username ? [{ username: username.toLowerCase() }] : []),
    ],
  });
  if (dup) {
    return { ok: false, message: 'An account with this phone, email, or username already exists', status: 409 };
  }

  const doc: Record<string, unknown> = {
    name,
    mobile,
    password,
    role: role || 'buyer',
    isVerified: true,
    isActive: true,
    profileComplete: false,
  };
  if (email) doc.email = email.toLowerCase();
  if (username) doc.username = username.toLowerCase();
  const user = await User.create(doc);

  const tokens = await issueTokens(user, {});
  return { ok: true, message: 'Registered successfully', data: tokens };
}

/** Create unverified user for mobile OTP registration. */
export async function authSignupOtpInit(body: unknown): Promise<ServiceResult<{ next: 'send_otp' }>> {
  const parsed = signupOtpInitSchema.safeParse(body);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message || 'Invalid input', status: 400 };
  }
  const { name, mobile, role } = parsed.data;
  await connectDB();

  const existing = await User.findOne({ mobile });
  if (existing) {
    return { ok: false, message: 'This mobile number is already registered. Try logging in.', status: 409 };
  }

  await User.create({
    name,
    mobile,
    role: role || 'buyer',
    isVerified: false,
    isActive: true,
    profileComplete: false,
  });

  return { ok: true, message: 'Account created. Verify OTP sent to your phone.', data: { next: 'send_otp' } };
}

export async function authSendOtp(
  body: unknown,
  _meta?: { purpose?: 'login' | 'register' }
): Promise<ServiceResult<{ demoOtp?: boolean; otp?: string }>> {
  const parsed = sendOtpSchema.safeParse(body);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message || 'Invalid input', status: 400 };
  }
  const phone = parsed.data.phone;
  await connectDB();
  await assertOtpSendAllowed(phone);

  const user = await User.findOne({ mobile: phone });
  if (!user) {
    return { ok: false, message: 'No account found for this number. Please sign up first.', status: 404 };
  }

  const otp = generateOtp6();
  const otpHash = hashOtp(phone, otp);
  user.otpHash = otpHash;
  user.otpExpiresAt = new Date(Date.now() + OTP_TTL_MS);
  await user.save();

  const sms = await sendOtpSms(phone, otp);
  const exposeOtp =
    process.env.NODE_ENV !== 'production' || sms.provider === 'mock' || process.env.EXPOSE_OTP_IN_API === 'true';

  return {
    ok: true,
    message: 'OTP sent',
    data: exposeOtp ? { demoOtp: sms.provider === 'mock', otp } : {},
  };
}

export async function authVerifyOtp(
  body: unknown,
  opts: { rememberMe?: boolean; userAgent?: string; ip?: string }
): Promise<
  ServiceResult<{ user: ReturnType<typeof publicUser>; accessToken: string; refreshToken: string }>
> {
  const parsed = verifyOtpSchema.safeParse(body);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message || 'Invalid input', status: 400 };
  }
  const { phone, otp } = parsed.data;
  const nameOverride = parsed.data.name;

  await connectDB();
  const user = await User.findOne({ mobile: phone }).select('+otpHash +otpExpiresAt +password');
  if (!user || !user.otpHash || !user.otpExpiresAt) {
    return { ok: false, message: 'No OTP pending for this number. Request a new code.', status: 400 };
  }
  if (user.otpExpiresAt.getTime() < Date.now()) {
    return { ok: false, message: 'OTP has expired. Request a new one.', status: 400 };
  }
  if (user.otpHash !== hashOtp(phone, otp)) {
    return { ok: false, message: 'Invalid OTP', status: 400 };
  }

  user.otpHash = undefined;
  user.otpExpiresAt = undefined;
  user.isVerified = true;
  if (nameOverride) user.name = nameOverride;
  user.lastLogin = new Date();
  await user.save();

  const tokens = await issueTokens(user, opts);
  return { ok: true, message: 'Verified successfully', data: tokens };
}

export async function authLoginPassword(
  body: unknown,
  opts: { rememberMe?: boolean; userAgent?: string; ip?: string }
): Promise<
  ServiceResult<{ user: ReturnType<typeof publicUser>; accessToken: string; refreshToken: string }>
> {
  const parsed = loginPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message || 'Invalid input', status: 400 };
  }
  const login = parsed.data.login.toLowerCase();
  const { password, rememberMe } = parsed.data;

  await connectDB();
  const user = await User.findOne({
    $or: [{ email: login }, { username: login }],
  }).select('+password');

  if (!user || !user.password) {
    return { ok: false, message: 'Invalid credentials', status: 401 };
  }
  if (!user.isActive) {
    return { ok: false, message: 'Account is deactivated', status: 401 };
  }
  const ok = await user.comparePassword(password);
  if (!ok) {
    return { ok: false, message: 'Invalid credentials', status: 401 };
  }

  user.lastLogin = new Date();
  await user.save();

  const tokens = await issueTokens(user, { rememberMe, ...opts });
  return { ok: true, message: 'Login successful', data: tokens };
}

export async function authRefresh(
  refreshToken: string | undefined,
  opts: { rememberMe?: boolean; userAgent?: string; ip?: string }
): Promise<ServiceResult<{ accessToken: string; refreshToken: string; user: ReturnType<typeof publicUser> }>> {
  if (!refreshToken) {
    return { ok: false, message: 'Refresh token required', status: 401 };
  }
  let payload: { sub: string; jti: string };
  try {
    payload = verifyRefreshToken(refreshToken) as { sub: string; jti: string };
  } catch {
    return { ok: false, message: 'Invalid or expired refresh token', status: 401 };
  }

  await connectDB();
  const record = await RefreshToken.findOne({ jti: payload.jti, revoked: false });
  if (!record || record.expiresAt.getTime() < Date.now()) {
    return { ok: false, message: 'Refresh token revoked or expired', status: 401 };
  }

  record.revoked = true;
  await record.save();

  const user = await User.findById(payload.sub);
  if (!user || !user.isActive) {
    return { ok: false, message: 'User not found', status: 401 };
  }

  const tokens = await issueTokens(user, opts);
  return { ok: true, message: 'Token refreshed', data: tokens };
}

export async function authLogout(refreshToken: string | undefined): Promise<ServiceResult<{ loggedOut: true }>> {
  if (refreshToken) {
    try {
      const payload = verifyRefreshToken(refreshToken) as { jti: string };
      await connectDB();
      await RefreshToken.updateOne({ jti: payload.jti }, { $set: { revoked: true } });
    } catch {
      /* ignore */
    }
  }
  return { ok: true, message: 'Logged out', data: { loggedOut: true } };
}

export async function authLogoutAll(userId: string): Promise<ServiceResult<{ loggedOut: true }>> {
  await connectDB();
  await RefreshToken.updateMany({ userId }, { $set: { revoked: true } });
  return { ok: true, message: 'All sessions ended', data: { loggedOut: true } };
}

export async function authMe(accessToken: string | undefined): Promise<ServiceResult<{ user: ReturnType<typeof publicUser> }>> {
  if (!accessToken) {
    return { ok: false, message: 'Not authenticated', status: 401 };
  }
  try {
    const payload = verifyToken(accessToken) as {
      id?: string;
      sub?: string;
      demo?: boolean;
      name?: string;
      email?: string | null;
      mobile?: string;
      role?: string;
      authRole?: string;
    };
    if (payload.demo === true) {
      const id = String(payload.sub || payload.id || 'demo');
      return {
        ok: true,
        data: {
          user: publicUser({
            _id: id,
            name: String(payload.name || 'Demo User'),
            email: payload.email ?? null,
            username: null,
            mobile: String(payload.mobile || '9876543210'),
            role: String(payload.role || 'buyer'),
            authRole: payload.authRole === 'ADMIN' ? 'ADMIN' : 'USER',
            isVerified: true,
            profileComplete: true,
            location: null,
          }),
        },
      };
    }
    const id = payload.sub || payload.id;
    if (!id) {
      return { ok: false, message: 'Invalid token', status: 401 };
    }
    await connectDB();
    const user = await User.findById(id);
    if (!user || !user.isActive) {
      return { ok: false, message: 'User not found', status: 401 };
    }
    return { ok: true, data: { user: publicUser(user) } };
  } catch {
    return { ok: false, message: 'Invalid or expired token', status: 401 };
  }
}
