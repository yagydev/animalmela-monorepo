const mongoose = require('mongoose');

// User Schema with role-based access
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['farmer', 'buyer', 'admin'],
    default: 'buyer'
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: { type: String, default: 'India' }
  },
  profileImage: String,
  isVerified: {
    type: Boolean,
    default: false
  },
  wallet: {
    balance: { type: Number, default: 0 },
    transactions: [{
      type: { type: String, enum: ['credit', 'debit'] },
      amount: Number,
      description: String,
      timestamp: { type: Date, default: Date.now }
    }]
  },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Product Schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    enum: ['kg', 'quintal', 'ton', 'piece', 'dozen', 'box'],
    default: 'kg'
  },
  category: {
    type: String,
    enum: ['crops', 'vegetables', 'fruits', 'grains', 'spices', 'livestock', 'dairy', 'other'],
    required: true
  },
  images: [{
    url: String,
    alt: String
  }],
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    city: String,
    state: String,
    pincode: String
  },
  availability: {
    type: String,
    enum: ['available', 'out_of_stock', 'seasonal'],
    default: 'available'
  },
  harvestDate: Date,
  organic: {
    type: Boolean,
    default: false
  },
  reviews: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    comment: String,
    images: [String],
    createdAt: { type: Date, default: Date.now }
  }],
  averageRating: {
    type: Number,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Order Schema
const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    required: true
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    },
    totalPrice: {
      type: Number,
      required: true
    }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    phone: String
  },
  paymentMethod: {
    type: String,
    enum: ['upi', 'wallet', 'card', 'cod'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  trackingNumber: String,
  estimatedDelivery: Date,
  deliveredAt: Date
}, {
  timestamps: true
});

// Stall Schema for vendor dashboard
const stallSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  stallNumber: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'booked', 'pending', 'reserved'],
    default: 'available'
  },
  mapCoordinates: {
    x: { type: Number, required: true },
    y: { type: Number, required: true }
  },
  size: {
    width: { type: Number, required: true },
    height: { type: Number, required: true }
  },
  price: {
    type: Number,
    required: true
  },
  amenities: [String],
  bookingDate: Date,
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Analytics Schema
const analyticsSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  },
  sponsorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    enum: ['click', 'registration', 'engagement', 'purchase'],
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  metadata: {
    source: String,
    campaign: String,
    device: String,
    location: String
  },
  value: Number,
  timestamp: { type: Date, default: Date.now }
});

// Government Scheme Schema
const schemeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  category: {
    type: String,
    enum: ['pm_kisan', 'agristack', 'state_scheme', 'loan', 'subsidy'],
    required: true
  },
  eligibility: [String],
  benefits: [String],
  applicationProcess: String,
  documentsRequired: [String],
  lastDate: Date,
  status: {
    type: String,
    enum: ['active', 'inactive', 'upcoming'],
    default: 'active'
  },
  source: String,
  externalId: String,
  cachedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Create models - use different names to avoid conflicts
const MarketplaceUser = mongoose.models.MarketplaceUser || mongoose.model('MarketplaceUser', userSchema);
const MarketplaceProduct = mongoose.models.MarketplaceProduct || mongoose.model('MarketplaceProduct', productSchema);
const MarketplaceOrder = mongoose.models.MarketplaceOrder || mongoose.model('MarketplaceOrder', orderSchema);
const Stall = mongoose.models.Stall || mongoose.model('Stall', stallSchema);
const Analytics = mongoose.models.Analytics || mongoose.model('Analytics', analyticsSchema);
const Scheme = mongoose.models.Scheme || mongoose.model('Scheme', schemeSchema);

module.exports = {
  User: MarketplaceUser,
  Product: MarketplaceProduct,
  Order: MarketplaceOrder,
  Stall,
  Analytics,
  Scheme
};
