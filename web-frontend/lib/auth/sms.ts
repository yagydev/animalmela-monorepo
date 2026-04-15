/**
 * SMS OTP — Twilio when configured, otherwise console mock (dev / staging).
 */
export async function sendOtpSms(phone: string, otp: string) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;

  if (!sid || !token || !from) {
    console.info(`[KisaanMela SMS mock] OTP for ${phone}: ${otp}`);
    return { ok: true as const, provider: 'mock' as const };
  }

  const to = phone.startsWith('+') ? phone : `+91${phone.replace(/\D/g, '').slice(-10)}`;
  const twilio = (await import('twilio')).default(sid, token);
  await twilio.messages.create({
    body: `Your KisaanMela verification code is ${otp}. Valid for 5 minutes.`,
    from,
    to,
  });
  return { ok: true as const, provider: 'twilio' as const };
}
