import mongoose, { Document, Schema } from 'mongoose';

export interface IMarketplaceListing extends Document {
  _id: string;
  name: string;
  description: string;
  category: 'equipment' | 'livestock' | 'product';
  condition: 'new' | 'used';
  price: number;
  images: string[];
  location: string;
  sellerId: string;
  sellerName?: string;
  sellerPhone?: string;
  status: 'pending' | 'approved' | 'rejected';
  featured: boolean;
  tags: string[];
  quantity?: number;
  unit?: string;
  specifications?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const MarketplaceListingSchema = new Schema<IMarketplaceListing>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  category: {
    type: String,
    required: true,
    enum: ['equipment', 'livestock', 'product'],
    index: true
  },
  condition: {
    type: String,
    required: true,
    enum: ['new', 'used'],
    index: true
  },
  price: {
    type: Number,
    required: true,
    min: 0,
    index: true
  },
  images: [{
    type: String,
    required: true
  }],
  location: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  sellerId: {
    type: String,
    required: true,
    index: true
  },
  sellerName: {
    type: String,
    trim: true
  },
  sellerPhone: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
    index: true
  },
  featured: {
    type: Boolean,
    default: false,
    index: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  quantity: {
    type: Number,
    min: 0
  },
  unit: {
    type: String,
    trim: true
  },
  specifications: {
    type: Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
MarketplaceListingSchema.index({ category: 1, status: 1 });
MarketplaceListingSchema.index({ price: 1, status: 1 });
MarketplaceListingSchema.index({ location: 1, status: 1 });
MarketplaceListingSchema.index({ createdAt: -1, status: 1 });
MarketplaceListingSchema.index({ name: 'text', description: 'text', tags: 'text' });

// Virtual for formatted price
MarketplaceListingSchema.virtual('formattedPrice').get(function() {
  return `₹${this.price.toLocaleString('en-IN')}`;
});

// Virtual for primary image
MarketplaceListingSchema.virtual('primaryImage').get(function() {
  return this.images && this.images.length > 0 ? this.images[0] : '/images/placeholder.jpg';
});

// Static method to get listings by category with filters
MarketplaceListingSchema.statics.findByCategory = function(category: string, filters: any = {}) {
  const query: any = { category, status: 'approved' };
  
  if (filters.condition) query.condition = filters.condition;
  if (filters.minPrice) query.price = { ...query.price, $gte: filters.minPrice };
  if (filters.maxPrice) query.price = { ...query.price, $lte: filters.maxPrice };
  if (filters.location) query.location = { $regex: filters.location, $options: 'i' };
  if (filters.search) {
    query.$text = { $search: filters.search };
  }
  
  return this.find(query).sort({ featured: -1, createdAt: -1 });
};

const MarketplaceListing = mongoose.models.MarketplaceListing || mongoose.model<IMarketplaceListing>('MarketplaceListing', MarketplaceListingSchema);

export default MarketplaceListing;
