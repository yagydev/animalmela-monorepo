import OtpRateWindow from '../../models/OtpRateWindow';

const MAX_PER_HOUR = Math.min(20, Math.max(1, Number(process.env.OTP_RATE_LIMIT_PER_HOUR || 5)));

function hourKey() {
  return new Date().toISOString().slice(0, 13);
}

/** Throws with statusCode 429 if phone exceeded OTP sends for current UTC hour bucket. */
export async function assertOtpSendAllowed(phone: string) {
  const hk = hourKey();
  let doc = await OtpRateWindow.findOne({ phone, hourKey: hk });
  if (!doc) {
    doc = await OtpRateWindow.create({ phone, hourKey: hk, count: 0 });
  }
  if (doc.count >= MAX_PER_HOUR) {
    const err = new Error('Too many OTP requests. Try again in a little while.');
    (err as Error & { statusCode?: number }).statusCode = 429;
    throw err;
  }
  doc.count += 1;
  await doc.save();
}
