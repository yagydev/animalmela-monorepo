const mongoose = require('mongoose');

// User Schema - Enhanced for authentication requirements
const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['buyer', 'seller', 'service', 'admin'],
    required: true,
    default: 'buyer'
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: false, // Optional for OTP-only users
    unique: true,
    sparse: true, // Allow multiple null values
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: false // Optional if OTP only
  },
  profilePic: {
    type: String, // URL to profile picture
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
  farmAddress: {
    street: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    state: {
      type: String,
      trim: true
    },
    pincode: {
      type: String,
      trim: true
    },
    country: {
      type: String,
      trim: true,
      default: 'India'
    }
  },
  gst: {
    type: String,
    trim: true
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
  socialIds: {
    googleId: {
      type: String,
      trim: true
    },
    facebookId: {
      type: String,
      trim: true
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

// OTP Session Schema for mobile authentication
const otpSessionSchema = new mongoose.Schema({
  mobile: {
    type: String,
    required: true,
    trim: true
  },
  otp: {
    type: String,
    required: true,
    trim: true
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
  },
  verified: {
    type: Boolean,
    default: false
  },
  attempts: {
    type: Number,
    default: 0,
    max: 3
  }
}, {
  timestamps: true
});

// Settings Schema for user preferences
const settingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  notifications: {
    email: {
      type: Boolean,
      default: true
    },
    sms: {
      type: Boolean,
      default: true
    },
    push: {
      type: Boolean,
      default: true
    },
    marketing: {
      type: Boolean,
      default: false
    }
  },
  language: {
    type: String,
    default: 'en',
    enum: ['en', 'hi', 'te', 'ta', 'bn', 'gu', 'mr', 'pa', 'or', 'as']
  },
  privacy: {
    showPhone: {
      type: Boolean,
      default: false
    },
    showLocation: {
      type: Boolean,
      default: true
    },
    showEmail: {
      type: Boolean,
      default: false
    }
  },
  theme: {
    type: String,
    default: 'light',
    enum: ['light', 'dark', 'auto']
  }
}, {
  timestamps: true
});

// Listing Schema - Updated to match exact specifications
const listingSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  species: {
    type: String,
    required: true,
    trim: true
  },
  breed: {
    type: String,
    required: true,
    trim: true
  },
  sex: {
    type: String,
    required: true,
    enum: ['male', 'female', 'castrated']
  },
  age: {
    type: Number,
    required: true,
    min: 0
  },
  teeth: {
    type: Number,
    min: 0
  },
  weight: {
    type: Number,
    required: true,
    min: 0
  },
  milkYield: {
    type: Number,
    min: 0
  },
  lactationNo: {
    type: Number,
    min: 0
  },
  pregnancyMonths: {
    type: Number,
    min: 0,
    max: 9
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  negotiable: {
    type: Boolean,
    default: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  media: [{
    type: String // image/video URLs
  }],
  docs: [{
    type: String // document URLs
  }],
  health: {
    type: String,
    trim: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'sold'],
    default: 'active'
  },
  promoted: {
    type: {
      type: String,
      enum: ['hot', 'featured']
    },
    start: {
      type: Date
    },
    end: {
      type: Date
    }
  }
}, {
  timestamps: true
});

// Lead Schema - Updated to match exact specifications
const leadSchema = new mongoose.Schema({
  listingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: true
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  channel: {
    type: String,
    enum: ['chat', 'call', 'whatsapp'],
    required: true
  },
  status: {
    type: String,
    enum: ['new', 'responded', 'closed'],
    default: 'new'
  }
}, {
  timestamps: true
});

// Order Schema - Updated to match exact specifications
const orderSchema = new mongoose.Schema({
  listingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: true
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  deliveryStatus: {
    type: String,
    enum: ['initiated', 'in-progress', 'delivered', 'cancelled'],
    default: 'initiated'
  }
}, {
  timestamps: true
});

// TransportJob Schema - Updated to match exact specifications
const transportJobSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  transporterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quote: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['assigned', 'picked', 'in-transit', 'delivered'],
    default: 'assigned'
  },
  tracking: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// VetRequest Schema - Updated to match exact specifications
const vetRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  issue: {
    type: String,
    required: true,
    trim: true
  },
  attachments: [{
    type: String // attachment URLs
  }],
  status: {
    type: String,
    enum: ['new', 'in-progress', 'resolved'],
    default: 'new'
  }
}, {
  timestamps: true
});

// InsuranceLead Schema - Updated to match exact specifications
const insuranceLeadSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  animalInfo: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['new', 'follow-up', 'closed'],
    default: 'new'
  }
}, {
  timestamps: true
});

// Review Schema - Updated to match exact specifications
const reviewSchema = new mongoose.Schema({
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    trim: true
  }
}, {
  timestamps: { createdAt: true, updatedAt: false } // Only createdAt
});

// AdminAction Schema - Updated to match exact specifications
const adminActionSchema = new mongoose.Schema({
  actor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    trim: true // moderation, ban, approve, dispute
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  reason: {
    type: String,
    required: true,
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Create models (prevent overwrite errors)
const User = mongoose.models.User || mongoose.model('User', userSchema);
const OtpSession = mongoose.models.OtpSession || mongoose.model('OtpSession', otpSessionSchema);
const Settings = mongoose.models.Settings || mongoose.model('Settings', settingsSchema);
const Listing = mongoose.models.Listing || mongoose.model('Listing', listingSchema);
const Lead = mongoose.models.Lead || mongoose.model('Lead', leadSchema);
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
const TransportJob = mongoose.models.TransportJob || mongoose.model('TransportJob', transportJobSchema);
const VetRequest = mongoose.models.VetRequest || mongoose.model('VetRequest', vetRequestSchema);
const InsuranceLead = mongoose.models.InsuranceLead || mongoose.model('InsuranceLead', insuranceLeadSchema);
const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);
const AdminAction = mongoose.models.AdminAction || mongoose.model('AdminAction', adminActionSchema);

module.exports = {
  User,
  OtpSession,
  Settings,
  Listing,
  Lead,
  Order,
  TransportJob,
  VetRequest,
  InsuranceLead,
  Review,
  AdminAction
};