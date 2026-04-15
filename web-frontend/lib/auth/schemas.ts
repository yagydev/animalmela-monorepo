import { z } from 'zod';

const phoneIn = z
  .string()
  .trim()
  .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number');

const emptyToUndef = (v: unknown) => (v === '' || v === undefined || v === null ? undefined : v);

export const signupPasswordSchema = z.object({
  name: z.string().trim().min(1).max(120),
  mobile: phoneIn,
  email: z.preprocess(emptyToUndef, z.string().trim().email().optional()),
  username: z.preprocess(
    emptyToUndef,
    z
      .string()
      .trim()
      .min(3)
      .max(32)
      .regex(/^[a-z0-9_]+$/, 'Username: lowercase letters, numbers, underscore only')
      .optional()
  ),
  password: z.string().min(6).max(128),
  role: z.enum(['farmer', 'buyer', 'seller', 'service', 'admin']).optional(),
});

export const signupOtpInitSchema = z.object({
  name: z.string().trim().min(1).max(120),
  mobile: phoneIn,
  role: z.enum(['farmer', 'buyer', 'seller', 'service']).optional(),
});

export const sendOtpSchema = z.object({
  phone: phoneIn,
});

export const verifyOtpSchema = z.object({
  phone: phoneIn,
  otp: z.string().regex(/^\d{6}$/, 'OTP must be 6 digits'),
  name: z.string().trim().min(1).max(120).optional(),
});

export const loginPasswordSchema = z.object({
  login: z.string().trim().min(1), // email or username
  password: z.string().min(1),
  rememberMe: z.boolean().optional(),
});
