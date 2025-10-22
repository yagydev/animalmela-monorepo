import mongoose, { Document, Schema } from 'mongoose';

export interface IMarketplaceUser extends Document {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: 'farmer' | 'vendor' | 'buyer' | 'admin';
  location: string;
  profileImage?: string;
  isVerified: boolean;
  rating: number;
  totalListings: number;
  totalSales: number;
  joinedAt: Date;
  lastActive: Date;
  preferences: {
    categories: string[];
    notifications: boolean;
    emailUpdates: boolean;
  };
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  bankDetails?: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    accountHolderName: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const MarketplaceUserSchema = new Schema<IMarketplaceUser>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    enum: ['farmer', 'vendor', 'buyer', 'admin'],
    default: 'farmer',
    index: true
  },
  location: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  profileImage: {
    type: String,
    default: '/images/default-avatar.jpg'
  },
  isVerified: {
    type: Boolean,
    default: false,
    index: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalListings: {
    type: Number,
    default: 0,
    min: 0
  },
  totalSales: {
    type: Number,
    default: 0,
    min: 0
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  preferences: {
    categories: [{
      type: String,
      enum: ['equipment', 'livestock', 'product']
    }],
    notifications: {
      type: Boolean,
      default: true
    },
    emailUpdates: {
      type: Boolean,
      default: true
    }
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: {
      type: String,
      default: 'India'
    }
  },
  bankDetails: {
    accountNumber: String,
    ifscCode: String,
    bankName: String,
    accountHolderName: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
MarketplaceUserSchema.index({ email: 1 });
MarketplaceUserSchema.index({ phone: 1 });
MarketplaceUserSchema.index({ role: 1, isVerified: 1 });
MarketplaceUserSchema.index({ location: 1 });

// Virtual for full address
MarketplaceUserSchema.virtual('fullAddress').get(function() {
  const addr = this.address;
  if (!addr) return this.location;
  return `${addr.street}, ${addr.city}, ${addr.state} - ${addr.pincode}`;
});

// Virtual for display name
MarketplaceUserSchema.virtual('displayName').get(function() {
  return this.name || this.email.split('@')[0];
});

// Static method to find verified sellers
MarketplaceUserSchema.statics.findVerifiedSellers = function() {
  return this.find({ 
    role: { $in: ['farmer', 'vendor'] }, 
    isVerified: true 
  }).sort({ rating: -1, totalSales: -1 });
};

const MarketplaceUser = mongoose.models.MarketplaceUser || mongoose.model<IMarketplaceUser>('MarketplaceUser', MarketplaceUserSchema);

export default MarketplaceUser;
