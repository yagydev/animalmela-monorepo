import crypto from 'crypto';

function pepper() {
  return process.env.OTP_PEPPER || process.env.JWT_SECRET || 'dev-otp-pepper';
}

/** Hash OTP before persisting (never store plain OTP). */
export function hashOtp(phone: string, otp: string) {
  return crypto.createHash('sha256').update(`${pepper()}:${phone}:${otp}`).digest('hex');
}

export function generateOtp6() {
  return String(Math.floor(100000 + Math.random() * 900000));
}
