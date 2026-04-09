// In-memory OTP store shared across API routes (single Next.js process).
// For production, replace with Redis or a database table.

type OtpEntry = {
  otp: string;
  expiresAt: number;
  attempts: number;
};

const TTL_MS = 5 * 60 * 1000; // 5 minutes
const MAX_ATTEMPTS = 5;

declare global {
  // eslint-disable-next-line no-var
  var __otpStore: Map<string, OtpEntry> | undefined;
}

const store: Map<string, OtpEntry> =
  global.__otpStore || (global.__otpStore = new Map());

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function saveOtp(key: string, otp: string): void {
  store.set(key, {
    otp,
    expiresAt: Date.now() + TTL_MS,
    attempts: 0,
  });
}

export function verifyOtp(key: string, otp: string): { ok: boolean; reason?: string } {
  const entry = store.get(key);
  if (!entry) return { ok: false, reason: 'No OTP requested for this number' };

  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return { ok: false, reason: 'OTP expired' };
  }

  entry.attempts += 1;
  if (entry.attempts > MAX_ATTEMPTS) {
    store.delete(key);
    return { ok: false, reason: 'Too many attempts' };
  }

  if (entry.otp !== otp) return { ok: false, reason: 'Invalid OTP' };

  store.delete(key);
  return { ok: true };
}
