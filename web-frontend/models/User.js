import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: false, // Make password optional
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false // Don't include password in queries by default
  },
  avatar: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: ['buyer', 'seller', 'service', 'admin'],
    default: 'buyer'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date,
    default: null
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  kyc: {
    aadhaar: {
      type: String,
      trim: true
    },
    pan: {
      type: String,
      trim: true
    },
    verified: {
      type: Boolean,
      default: false
    }
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  location: {
    state: {
      type: String,
      trim: true
    },
    district: {
      type: String,
      trim: true
    },
    pincode: {
      type: String,
      trim: true
    },
    lat: {
      type: Number
    },
    lng: {
      type: Number
    }
  },
  languages: [{
    type: String,
    trim: true
  }],
  settings: {
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true },
      marketing: { type: Boolean, default: false }
    },
    privacy: {
      profileVisibility: { 
        type: String, 
        enum: ['public', 'private', 'friends'], 
        default: 'public' 
      },
      showEmail: { type: Boolean, default: false },
      showPhone: { type: Boolean, default: false }
    },
    security: {
      twoFactorEnabled: { type: Boolean, default: false },
      loginAlerts: { type: Boolean, default: true }
    }
  }
}, {
  timestamps: true
});

// Index for better query performance
userSchema.index({ email: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Ensure email is lowercase before saving
userSchema.pre('save', function(next) {
  if (this.email) {
    this.email = this.email.toLowerCase();
  }
  next();
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to get public profile (without sensitive data)
userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

// Static method to find user by email
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
