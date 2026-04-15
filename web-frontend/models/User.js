import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * Marketplace user + auth fields.
 * - `role`: legacy marketplace persona (farmer, buyer, seller, …)
 * - `authRole`: coarse gate for APIs — USER | ADMIN
 */
const userSchema = new mongoose.Schema({
  authRole: {
    type: String,
    enum: ['USER', 'ADMIN'],
    default: 'USER',
  },
  role: {
    type: String,
    enum: ['farmer', 'buyer', 'seller', 'service', 'admin'],
    required: true,
    default: 'buyer',
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    sparse: true,
    unique: true,
  },
  username: {
    type: String,
    lowercase: true,
    trim: true,
    sparse: true,
    unique: true,
  },
  password: {
    type: String,
    required: false,
    select: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  otpHash: {
    type: String,
    select: false,
  },
  otpExpiresAt: {
    type: Date,
    select: false,
  },
  kyc: {
    aadhaar: {
      type: String,
      trim: true,
    },
    pan: {
      type: String,
      trim: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  totalRatings: {
    type: Number,
    default: 0,
  },
  location: {
    state: { type: String, trim: true },
    district: { type: String, trim: true },
    village: { type: String, trim: true },
    pincode: { type: String, trim: true },
    coordinates: {
      lat: Number,
      lng: Number,
    },
  },
  farmAddress: {
    type: String,
    trim: true,
  },
  farmDetails: {
    size: { type: Number, min: 0 },
    unit: { type: String, enum: ['acres', 'hectares', 'sqft'] },
    crops: [String],
    livestock: [String],
  },
  paymentPreferences: {
    type: [String],
    enum: ['upi', 'bank_transfer', 'cash', 'wallet'],
    default: ['upi', 'cash'],
  },
  profileComplete: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  if (this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  if (this.role === 'admin' && this.authRole !== 'ADMIN') {
    this.authRole = 'ADMIN';
  }
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.User || mongoose.model('User', userSchema);
