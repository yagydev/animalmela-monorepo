import mongoose from 'mongoose';

// Marketplace User Schema
const marketplaceUserSchema = new mongoose.Schema({
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
  businessName: {
    type: String,
    required: true
  },
  location: {
    address: String,
    city: String,
    state: String,
    pincode: String
  },
  role: {
    type: String,
    enum: ['vendor', 'buyer', 'admin'],
    default: 'vendor'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Stall Schema
const stallSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MarketplaceUser',
    required: true
  },
  location: {
    address: String,
    city: String,
    state: String,
    pincode: String
  },
  price: {
    type: Number,
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  amenities: [String],
  images: [String],
  availability: {
    startTime: String,
    endTime: String,
    days: [String]
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'booked', 'maintenance'],
    default: 'active'
  },
  bookings: [{
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MarketplaceUser'
    },
    startDate: Date,
    endDate: Date,
    totalAmount: Number,
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create models
export const MarketplaceUser = mongoose.models.MarketplaceUser || mongoose.model('MarketplaceUser', marketplaceUserSchema);
export const Stall = mongoose.models.Stall || mongoose.model('Stall', stallSchema);

// Export with different names for compatibility
export const User = MarketplaceUser;
export const Product = MarketplaceUser; // Using MarketplaceUser as Product for now
export const Order = MarketplaceUser; // Using MarketplaceUser as Order for now
export const Analytics = MarketplaceUser; // Using MarketplaceUser as Analytics for now
export const Scheme = MarketplaceUser; // Using MarketplaceUser as Scheme for now
