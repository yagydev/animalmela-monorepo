import mongoose from 'mongoose';

/** Tracks OTP send attempts per phone per hour (rate limiting). */
const otpRateWindowSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true, index: true },
    hourKey: { type: String, required: true }, // e.g. 2026-04-13T14 (UTC hour bucket)
    count: { type: Number, default: 0 },
  },
  { timestamps: true }
);

otpRateWindowSchema.index({ phone: 1, hourKey: 1 }, { unique: true });

export default mongoose.models.OtpRateWindow ||
  mongoose.model('OtpRateWindow', otpRateWindowSchema);
