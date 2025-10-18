import mongoose from 'mongoose';

// Event Schema
const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  location: {
    name: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
    },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  image: {
    url: {
      type: String,
      required: true
    },
    alt: String,
    caption: String
  },
  gallery: [{
    url: String,
    alt: String,
    caption: String
  }],
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization'
  },
  vendors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor'
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  featured: {
    type: Boolean,
    default: false
  },
  tags: [String],
  meta: {
    title: String,
    description: String,
    keywords: [String]
  },
  seo: {
    title: String,
    description: String,
    keywords: [String],
    canonical: String
  }
}, {
  timestamps: true
});

// Vendor Schema
const vendorSchema = new mongoose.Schema({
  vendorName: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  stallNumber: {
    type: String,
    required: true
  },
  productType: {
    type: String,
    required: true,
    enum: ['crops', 'vegetables', 'fruits', 'livestock', 'dairy', 'seeds', 'equipment', 'organic', 'processed']
  },
  description: {
    type: String,
    required: true
  },
  contactInfo: {
    name: String,
    phone: String,
    email: String,
    website: String
  },
  location: {
    address: String,
    city: String,
    state: String,
    pincode: String
  },
  image: {
    url: String,
    alt: String
  },
  gallery: [{
    url: String,
    alt: String
  }],
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'active'
  },
  verified: {
    type: Boolean,
    default: false
  },
  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String,
    youtube: String
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
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
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
  currency: {
    type: String,
    default: 'INR'
  },
  unit: {
    type: String,
    required: true,
    enum: ['kg', 'quintal', 'ton', 'piece', 'dozen', 'litre', 'gram', 'box', 'bundle']
  },
  category: {
    type: String,
    required: true,
    enum: ['crops', 'vegetables', 'fruits', 'livestock', 'dairy', 'seeds', 'equipment', 'organic', 'processed']
  },
  subcategory: String,
  image: {
    url: {
      type: String,
      required: true
    },
    alt: String
  },
  gallery: [{
    url: String,
    alt: String
  }],
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  availability: {
    inStock: {
      type: Boolean,
      default: true
    },
    quantity: {
      type: Number,
      default: 0
    },
    minOrder: {
      type: Number,
      default: 1
    }
  },
  quality: {
    type: String,
    enum: ['premium', 'standard', 'budget'],
    default: 'standard'
  },
  organic: {
    type: Boolean,
    default: false
  },
  certifications: [String],
  tags: [String],
  status: {
    type: String,
    enum: ['active', 'inactive', 'out_of_stock'],
    default: 'active'
  },
  featured: {
    type: Boolean,
    default: false
  },
  seo: {
    title: String,
    description: String,
    keywords: [String]
  }
}, {
  timestamps: true
});

// Organization Schema
const organizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['government', 'ngo', 'cooperative', 'private', 'educational'],
    required: true
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
  contactInfo: {
    phone: String,
    email: String,
    website: String,
    contactPerson: String
  },
  logo: {
    url: String,
    alt: String
  },
  image: {
    url: String,
    alt: String
  },
  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String,
    linkedin: String,
    youtube: String
  },
  services: [String],
  certifications: [String],
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  verified: {
    type: Boolean,
    default: false
  },
  seo: {
    title: String,
    description: String,
    keywords: [String]
  }
}, {
  timestamps: true
});

// News Update Schema
const newsUpdateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  excerpt: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    name: String,
    email: String,
    avatar: String
  },
  category: {
    type: String,
    enum: ['agriculture', 'technology', 'policy', 'market', 'weather', 'events'],
    required: true
  },
  tags: [String],
  image: {
    url: String,
    alt: String,
    caption: String
  },
  gallery: [{
    url: String,
    alt: String,
    caption: String
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  featured: {
    type: Boolean,
    default: false
  },
  publishedAt: Date,
  views: {
    type: Number,
    default: 0
  },
  seo: {
    title: String,
    description: String,
    keywords: [String],
    canonical: String
  }
}, {
  timestamps: true
});

// Add indexes for better performance
eventSchema.index({ slug: 1, status: 1 });
eventSchema.index({ date: 1, status: 1 });
eventSchema.index({ 'location.city': 1, 'location.state': 1 });

vendorSchema.index({ slug: 1, status: 1 });
vendorSchema.index({ productType: 1, status: 1 });
vendorSchema.index({ 'location.city': 1, 'location.state': 1 });

productSchema.index({ slug: 1, status: 1 });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ vendor: 1, status: 1 });
productSchema.index({ price: 1 });

organizationSchema.index({ slug: 1, status: 1 });
organizationSchema.index({ type: 1, status: 1 });

newsUpdateSchema.index({ slug: 1, status: 1 });
newsUpdateSchema.index({ category: 1, status: 1 });
newsUpdateSchema.index({ publishedAt: -1, status: 1 });

// Create models
const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);
const Vendor = mongoose.models.Vendor || mongoose.model('Vendor', vendorSchema);
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
const Organization = mongoose.models.Organization || mongoose.model('Organization', organizationSchema);
const NewsUpdate = mongoose.models.NewsUpdate || mongoose.model('NewsUpdate', newsUpdateSchema);

export {
  Event,
  Vendor,
  Product,
  Organization,
  NewsUpdate
};

// Default export for CommonJS compatibility
export default {
  Event,
  Vendor,
  Product,
  Organization,
  NewsUpdate
};
