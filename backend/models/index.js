const mongoose = require('mongoose');

// User Schema - Enhanced for farmer-buyer marketplace
const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['farmer', 'buyer', 'seller', 'service', 'admin'],
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
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: false // Optional if OTP only
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
    village: {
      type: String,
      trim: true
    },
    farmAddress: {
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
  // Farmer-specific fields
  farmDetails: {
    farmName: {
      type: String,
      trim: true
    },
    farmSize: {
      type: String, // acres/hectares
      trim: true
    },
    farmingExperience: {
      type: Number, // years
      default: 0
    },
    cropsGrown: [{
      type: String,
      trim: true
    }],
    livestockOwned: [{
      type: String,
      trim: true
    }]
  },
  // Payment preferences
  paymentPreferences: {
    preferredMethods: [{
      type: String,
      enum: ['cash', 'upi', 'bank_transfer', 'wallet', 'card']
    }],
    bankDetails: {
      accountNumber: {
        type: String,
        trim: true
      },
      ifscCode: {
        type: String,
        trim: true
      },
      bankName: {
        type: String,
        trim: true
      },
      accountHolderName: {
        type: String,
        trim: true
      }
    },
    upiId: {
      type: String,
      trim: true
    }
  },
  languages: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Listing Schema - Enhanced for agricultural products
const listingSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['crops', 'livestock', 'seeds', 'fertilizers', 'equipment', 'tools', 'feed', 'other'],
    trim: true
  },
  subcategory: {
    type: String,
    required: true,
    trim: true
  },
  // For livestock listings
  species: {
    type: String,
    trim: true
  },
  breed: {
    type: String,
    trim: true
  },
  sex: {
    type: String,
    enum: ['male', 'female', 'castrated']
  },
  age: {
    type: Number,
    min: 0
  },
  teeth: {
    type: Number,
    min: 0
  },
  weight: {
    type: Number,
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
  unit: {
    type: String,
    required: true,
    enum: ['kg', 'quintal', 'ton', 'piece', 'dozen', 'litre', 'bag', 'acre', 'hectare', 'head', 'pair'],
    default: 'kg'
  },
  minimumOrder: {
    type: Number,
    default: 1
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
  // Product quality and specifications
  quality: {
    grade: {
      type: String,
      enum: ['premium', 'grade_a', 'grade_b', 'grade_c', 'standard'],
      default: 'standard'
    },
    organic: {
      type: Boolean,
      default: false
    },
    certified: {
      type: Boolean,
      default: false
    },
    specifications: {
      type: mongoose.Schema.Types.Mixed
    }
  },
  // Harvest and availability
  harvestDate: {
    type: Date
  },
  shelfLife: {
    type: Number, // days
    default: 30
  },
  storageConditions: {
    type: String,
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

// Cart Schema - For shopping cart functionality
const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    unitPrice: {
      type: Number,
      required: true
    },
    totalPrice: {
      type: Number,
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  totalAmount: {
    type: Number,
    default: 0
  },
  itemCount: {
    type: Number,
    default: 0
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

// Order Schema - Enhanced for comprehensive order management
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
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  shippingCost: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'refunded'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded', 'partial'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['cash_on_delivery', 'upi', 'bank_transfer', 'wallet', 'card', 'razorpay'],
    trim: true
  },
  shippingAddress: {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    mobile: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    pincode: {
      type: String,
      required: true,
      trim: true
    },
    landmark: {
      type: String,
      trim: true
    }
  },
  trackingInfo: {
    trackingNumber: {
      type: String,
      trim: true
    },
    carrier: {
      type: String,
      trim: true
    },
    estimatedDelivery: {
      type: Date
    },
    actualDelivery: {
      type: Date
    }
  },
  notes: {
    type: String,
    trim: true
  },
  expectedDispatchTime: {
    type: Date
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
const Listing = mongoose.models.Listing || mongoose.model('Listing', listingSchema);
const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema);
const Lead = mongoose.models.Lead || mongoose.model('Lead', leadSchema);
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
const TransportJob = mongoose.models.TransportJob || mongoose.model('TransportJob', transportJobSchema);
const VetRequest = mongoose.models.VetRequest || mongoose.model('VetRequest', vetRequestSchema);
const InsuranceLead = mongoose.models.InsuranceLead || mongoose.model('InsuranceLead', insuranceLeadSchema);
const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);
const AdminAction = mongoose.models.AdminAction || mongoose.model('AdminAction', adminActionSchema);

module.exports = {
  User,
  Listing,
  Cart,
  Lead,
  Order,
  TransportJob,
  VetRequest,
  InsuranceLead,
  Review,
  AdminAction
};