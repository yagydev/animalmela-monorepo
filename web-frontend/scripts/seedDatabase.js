const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection configuration
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/kisaanmela';
    console.log(`Attempting to connect to MongoDB: ${mongoUri.replace(/\/\/.*@/, '//***:***@')}`);
    
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB connected successfully!');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    return false;
  }
};

// User Schema
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
    required: false
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
  totalRatings: {
    type: Number,
    default: 0
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
    village: {
      type: String,
      trim: true
    },
    pincode: {
      type: String,
      trim: true
    },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  farmAddress: {
    type: String,
    trim: true
  },
  farmDetails: {
    size: {
      type: Number,
      min: 0
    },
    unit: {
      type: String,
      enum: ['acres', 'hectares', 'sqft']
    },
    crops: [String],
    livestock: [String]
  },
  paymentPreferences: {
    type: [String],
    enum: ['upi', 'bank_transfer', 'cash', 'wallet'],
    default: ['upi', 'cash']
  },
  profileComplete: {
    type: Boolean,
    default: false
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

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  if (this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

// Farmer Schema (for farmers market API)
const farmerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Farmer name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    trim: true,
    match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number']
  },
  location: {
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true
    },
    district: {
      type: String,
      required: [true, 'District is required'],
      trim: true
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required'],
      trim: true,
      match: [/^\d{6}$/, 'Please enter a valid 6-digit pincode']
    },
    village: {
      type: String,
      required: [true, 'Village is required'],
      trim: true
    }
  },
  products: [{
    type: String,
    trim: true
  }],
  images: [{
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(v) || 
               /^https?:\/\/images\.unsplash\.com\/.+$/i.test(v);
      },
      message: 'Please provide a valid image URL'
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
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
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for farmer's full address
farmerSchema.virtual('fullAddress').get(function() {
  return `${this.location.village}, ${this.location.district}, ${this.location.state} - ${this.location.pincode}`;
});

const Farmer = mongoose.models.Farmer || mongoose.model('Farmer', farmerSchema);

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
  }
}, {
  timestamps: true
});

const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);

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

const Vendor = mongoose.models.Vendor || mongoose.model('Vendor', vendorSchema);

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
  }
}, {
  timestamps: true
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

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
    required: true,
    enum: ['government', 'ngo', 'private', 'cooperative', 'research']
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
    twitter: String,
    linkedin: String,
    youtube: String
  },
  services: [String],
  certifications: [String],
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'active'
  },
  verified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Organization = mongoose.models.Organization || mongoose.model('Organization', organizationSchema);

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
    name: {
      type: String,
      required: true
    },
    email: String,
    avatar: String
  },
  category: {
    type: String,
    required: true,
    enum: ['news', 'blog', 'policy', 'technology', 'success_story', 'innovation']
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
  meta: {
    title: String,
    description: String,
    keywords: [String]
  }
}, {
  timestamps: true
});

const NewsUpdate = mongoose.models.NewsUpdate || mongoose.model('NewsUpdate', newsUpdateSchema);

// Stall Schema
const stallSchema = new mongoose.Schema({
  stallNumber: {
    type: String,
    required: true,
    unique: true
  },
  location: {
    type: String,
    required: true
  },
  size: {
    type: String,
    required: true,
    enum: ['small', 'medium', 'large', 'premium']
  },
  amenities: [String],
  price: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR'
  },
  status: {
    type: String,
    enum: ['available', 'booked', 'maintenance'],
    default: 'available'
  },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor'
  },
  bookingDate: Date,
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }
}, {
  timestamps: true
});

const Stall = mongoose.models.Stall || mongoose.model('Stall', stallSchema);

// Marketplace User Schema
const marketplaceUserSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor'
  },
  role: {
    type: String,
    enum: ['vendor', 'buyer', 'admin'],
    required: true
  },
  permissions: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true }
    },
    language: {
      type: String,
      default: 'en'
    },
    currency: {
      type: String,
      default: 'INR'
    }
  }
}, {
  timestamps: true
});

const MarketplaceUser = mongoose.models.MarketplaceUser || mongoose.model('MarketplaceUser', marketplaceUserSchema);

// Sample data
const sampleFarmers = [
  {
    name: 'Rajesh Kumar',
    email: 'rajesh@kisaanmela.com',
    mobile: '9876543210',
    location: {
      state: 'Punjab',
      district: 'Ludhiana',
      village: 'Model Town',
      pincode: '141001'
    },
    products: ['Wheat', 'Rice', 'Corn', 'Mustard'],
    images: [
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop'
    ],
    rating: {
      average: 4.5,
      count: 12
    },
    isActive: true
  },
  {
    name: 'Priya Sharma',
    email: 'priya@kisaanmela.com',
    mobile: '9876543211',
    location: {
      state: 'Haryana',
      district: 'Karnal',
      village: 'Village B',
      pincode: '132001'
    },
    products: ['Rice', 'Vegetables', 'Fruits'],
    images: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop'
    ],
    rating: {
      average: 4.2,
      count: 8
    },
    isActive: true
  },
  {
    name: 'Amit Singh',
    email: 'amit@kisaanmela.com',
    mobile: '9876543212',
    location: {
      state: 'Uttar Pradesh',
      district: 'Meerut',
      village: 'Village C',
      pincode: '250001'
    },
    products: ['Sugarcane', 'Potatoes', 'Onions'],
    images: [
      'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&h=300&fit=crop'
    ],
    rating: {
      average: 4.8,
      count: 15
    },
    isActive: true
  },
  {
    name: 'Sunita Devi',
    email: 'sunita@kisaanmela.com',
    mobile: '9876543213',
    location: {
      state: 'Bihar',
      district: 'Patna',
      village: 'Village D',
      pincode: '800001'
    },
    products: ['Rice', 'Lentils', 'Spices'],
    images: [
      'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=300&h=200&fit=crop'
    ],
    rating: {
      average: 4.3,
      count: 10
    },
    isActive: true
  },
  {
    name: 'Vikram Patel',
    email: 'vikram@kisaanmela.com',
    mobile: '9876543214',
    location: {
      state: 'Gujarat',
      district: 'Ahmedabad',
      village: 'Village E',
      pincode: '380001'
    },
    products: ['Cotton', 'Groundnuts', 'Sesame'],
    images: [
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300&h=200&fit=crop'
    ],
    rating: {
      average: 4.6,
      count: 20
    },
    isActive: true
  }
];

const sampleUsers = [
  {
    role: 'farmer',
    name: 'Rajesh Kumar',
    mobile: '9876543210',
    email: 'rajesh@kisaanmela.com',
    password: 'farmer123',
    kyc: {
      aadhaar: '123456789012',
      pan: 'ABCDE1234F',
      verified: true
    },
    rating: 4.5,
    totalRatings: 12,
    location: {
      state: 'Punjab',
      district: 'Ludhiana',
      village: 'Model Town',
      pincode: '141001',
      coordinates: { lat: 30.9010, lng: 75.8573 }
    },
    farmAddress: 'Village Model Town, Ludhiana, Punjab',
    farmDetails: {
      size: 15,
      unit: 'acres',
      crops: ['Wheat', 'Rice', 'Corn', 'Mustard'],
      livestock: ['Cows', 'Buffaloes']
    },
    paymentPreferences: ['upi', 'bank_transfer'],
    profileComplete: true,
    isActive: true
  },
  {
    role: 'farmer',
    name: 'Priya Sharma',
    mobile: '9876543211',
    email: 'priya@kisaanmela.com',
    password: 'farmer123',
    kyc: {
      aadhaar: '123456789013',
      pan: 'ABCDE1235F',
      verified: true
    },
    rating: 4.2,
    totalRatings: 8,
    location: {
      state: 'Haryana',
      district: 'Karnal',
      village: 'Village B',
      pincode: '132001',
      coordinates: { lat: 29.6857, lng: 76.9905 }
    },
    farmAddress: 'Village B, Karnal, Haryana',
    farmDetails: {
      size: 8,
      unit: 'acres',
      crops: ['Rice', 'Vegetables', 'Fruits'],
      livestock: []
    },
    paymentPreferences: ['upi', 'cash'],
    profileComplete: true,
    isActive: true
  },
  {
    role: 'buyer',
    name: 'Sunita Devi',
    mobile: '9876543213',
    email: 'sunita@kisaanmela.com',
    password: 'buyer123',
    kyc: {
      aadhaar: '123456789015',
      pan: 'ABCDE1237F',
      verified: true
    },
    rating: 4.3,
    totalRatings: 10,
    location: {
      state: 'Bihar',
      district: 'Patna',
      village: 'Village D',
      pincode: '800001',
      coordinates: { lat: 25.5941, lng: 85.1376 }
    },
    paymentPreferences: ['upi', 'wallet'],
    profileComplete: true,
    isActive: true
  },
  {
    role: 'admin',
    name: 'Admin User',
    mobile: '9876543215',
    email: 'admin@kisaanmela.com',
    password: 'admin123',
    kyc: {
      aadhaar: '123456789017',
      pan: 'ABCDE1239F',
      verified: true
    },
    rating: 5.0,
    totalRatings: 1,
    location: {
      state: 'Delhi',
      district: 'New Delhi',
      village: 'Central Delhi',
      pincode: '110001',
      coordinates: { lat: 28.6139, lng: 77.2090 }
    },
    paymentPreferences: ['upi'],
    profileComplete: true,
    isActive: true
  }
];

const sampleEvents = [
  {
    title: 'Kisaan Mela 2024 - Ludhiana',
    slug: 'kisaan-mela-2024-ludhiana',
    description: 'Annual agricultural fair showcasing latest farming technologies and products',
    content: 'Join us for the biggest agricultural fair in Punjab. Meet farmers, vendors, and agricultural experts. Learn about latest farming techniques, equipment, and organic farming methods.',
    date: new Date('2024-12-15'),
    endDate: new Date('2024-12-17'),
    location: {
      name: 'Punjab Agricultural University Ground',
      address: 'PAU Campus, Ludhiana',
      city: 'Ludhiana',
      state: 'Punjab',
      pincode: '141004',
      coordinates: { lat: 30.9010, lng: 75.8573 }
    },
    image: {
      url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=600&fit=crop',
      alt: 'Kisaan Mela 2024',
      caption: 'Annual Agricultural Fair'
    },
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop',
        alt: 'Farmers at Mela',
        caption: 'Farmers showcasing their products'
      },
      {
        url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop',
        alt: 'Agricultural Equipment',
        caption: 'Latest farming equipment on display'
      }
    ],
    status: 'published',
    featured: true,
    tags: ['agriculture', 'fair', 'technology', 'farming'],
    meta: {
      title: 'Kisaan Mela 2024 - Ludhiana | Agricultural Fair',
      description: 'Annual agricultural fair in Ludhiana showcasing latest farming technologies',
      keywords: ['agriculture', 'fair', 'farming', 'technology', 'ludhiana']
    }
  },
  {
    title: 'Organic Farming Workshop',
    slug: 'organic-farming-workshop',
    description: 'Learn sustainable organic farming techniques from experts',
    content: 'Comprehensive workshop covering organic farming methods, soil health, pest management, and certification processes.',
    date: new Date('2024-11-20'),
    endDate: new Date('2024-11-20'),
    location: {
      name: 'Green Valley Farm',
      address: 'Village Model Town',
      city: 'Ludhiana',
      state: 'Punjab',
      pincode: '141001',
      coordinates: { lat: 30.9010, lng: 75.8573 }
    },
    image: {
      url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&h=600&fit=crop',
      alt: 'Organic Farming Workshop',
      caption: 'Sustainable Farming Techniques'
    },
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&h=300&fit=crop',
        alt: 'Organic Farm',
        caption: 'Organic farming demonstration'
      }
    ],
    status: 'published',
    featured: false,
    tags: ['organic', 'workshop', 'sustainable', 'farming'],
    meta: {
      title: 'Organic Farming Workshop | Sustainable Agriculture',
      description: 'Learn organic farming techniques from experts',
      keywords: ['organic', 'farming', 'workshop', 'sustainable']
    }
  },
  {
    title: 'Modern Irrigation Techniques Workshop',
    slug: 'modern-irrigation-techniques-workshop',
    description: 'Master water-efficient irrigation methods including drip irrigation, sprinkler systems, and smart farming',
    content: 'Learn about modern irrigation techniques that can help you save water and increase crop yields. Topics include drip irrigation system design, water usage optimization, smart irrigation controllers, and cost-benefit analysis.',
    date: new Date('2024-12-20'),
    endDate: new Date('2024-12-20'),
    location: {
      name: 'Krishi Vigyan Kendra',
      address: 'KVK Campus, Punjab',
      city: 'Ludhiana',
      state: 'Punjab',
      pincode: '141004',
      coordinates: { lat: 30.9010, lng: 75.8573 }
    },
    image: {
      url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&h=600&fit=crop',
      alt: 'Modern Irrigation Workshop',
      caption: 'Water-Efficient Farming Techniques'
    },
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop',
        alt: 'Drip Irrigation',
        caption: 'Drip irrigation system demonstration'
      }
    ],
    status: 'published',
    featured: true,
    tags: ['irrigation', 'water-management', 'technology'],
    meta: {
      title: 'Modern Irrigation Techniques Workshop | Water Management',
      description: 'Learn water-efficient irrigation methods for better crop yields',
      keywords: ['irrigation', 'water management', 'farming technology']
    }
  },
  {
    title: 'Digital Marketing for Farmers',
    slug: 'digital-marketing-for-farmers',
    description: 'Learn to market your produce online, build your brand, and reach customers directly',
    content: 'Comprehensive training on digital marketing strategies for farmers. Learn social media marketing, building online presence, direct-to-consumer sales, and digital payment methods.',
    date: new Date('2024-12-25'),
    endDate: new Date('2024-12-25'),
    location: {
      name: 'Online Workshop',
      address: 'Virtual Event',
      city: 'Online',
      state: 'India',
      pincode: '000000',
      coordinates: { lat: 0, lng: 0 }
    },
    image: {
      url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
      alt: 'Digital Marketing Workshop',
      caption: 'Online Marketing for Farmers'
    },
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
        alt: 'Digital Marketing',
        caption: 'Digital marketing strategies for farmers'
      }
    ],
    status: 'published',
    featured: false,
    tags: ['marketing', 'digital', 'online', 'business'],
    meta: {
      title: 'Digital Marketing for Farmers | Online Business',
      description: 'Learn digital marketing strategies to grow your farming business',
      keywords: ['digital marketing', 'online business', 'farmer marketing']
    }
  },
  {
    title: 'Livestock Health Management Training',
    slug: 'livestock-health-management-training',
    description: 'Comprehensive training on animal health, disease prevention, and veterinary care basics',
    content: 'Learn about common livestock diseases, preventive healthcare measures, basic veterinary procedures, and nutrition and feeding management for healthy animals.',
    date: new Date('2025-01-05'),
    endDate: new Date('2025-01-05'),
    location: {
      name: 'Veterinary College',
      address: 'Vet College Campus, Mumbai',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      coordinates: { lat: 19.0760, lng: 72.8777 }
    },
    image: {
      url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&h=600&fit=crop',
      alt: 'Livestock Health Training',
      caption: 'Animal Health Management'
    },
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop',
        alt: 'Livestock Care',
        caption: 'Proper livestock care techniques'
      }
    ],
    status: 'published',
    featured: true,
    tags: ['livestock', 'health', 'veterinary', 'animal-care'],
    meta: {
      title: 'Livestock Health Management Training | Animal Care',
      description: 'Comprehensive training on livestock health and veterinary care',
      keywords: ['livestock', 'animal health', 'veterinary care', 'farming']
    }
  },
  {
    title: 'Government Schemes & Subsidies Workshop',
    slug: 'government-schemes-subsidies-workshop',
    description: 'Understand various government agricultural schemes, subsidies, and how to apply for them',
    content: 'Learn about PM-KISAN scheme details, crop insurance programs, equipment subsidy schemes, and the complete application process and documentation required.',
    date: new Date('2025-01-10'),
    endDate: new Date('2025-01-10'),
    location: {
      name: 'District Agriculture Office',
      address: 'DAO Office, UP',
      city: 'Lucknow',
      state: 'Uttar Pradesh',
      pincode: '226001',
      coordinates: { lat: 26.8467, lng: 80.9462 }
    },
    image: {
      url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&h=600&fit=crop',
      alt: 'Government Schemes Workshop',
      caption: 'Government Agricultural Schemes'
    },
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=300&fit=crop',
        alt: 'Government Office',
        caption: 'Government agricultural office'
      }
    ],
    status: 'published',
    featured: false,
    tags: ['government', 'subsidies', 'schemes', 'policy'],
    meta: {
      title: 'Government Schemes & Subsidies Workshop | Policy Guide',
      description: 'Learn about government agricultural schemes and subsidy programs',
      keywords: ['government schemes', 'agricultural subsidies', 'policy', 'farmers']
    }
  },
  {
    title: 'Precision Agriculture & IoT Technology',
    slug: 'precision-agriculture-iot-technology',
    description: 'Explore cutting-edge technologies like IoT sensors, drones, and data analytics in farming',
    content: 'Discover IoT sensors for soil monitoring, drone technology in agriculture, data analytics and interpretation, and smart farming automation systems.',
    date: new Date('2025-01-15'),
    endDate: new Date('2025-01-15'),
    location: {
      name: 'IIT Delhi Campus',
      address: 'IIT Delhi, Hauz Khas',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110016',
      coordinates: { lat: 28.5455, lng: 77.1927 }
    },
    image: {
      url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop',
      alt: 'Precision Agriculture Workshop',
      caption: 'IoT and Smart Farming Technology'
    },
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop',
        alt: 'IoT Sensors',
        caption: 'IoT sensors for agriculture'
      }
    ],
    status: 'published',
    featured: true,
    tags: ['technology', 'IoT', 'precision-agriculture', 'smart-farming'],
    meta: {
      title: 'Precision Agriculture & IoT Technology | Smart Farming',
      description: 'Explore cutting-edge IoT and precision agriculture technologies',
      keywords: ['precision agriculture', 'IoT', 'smart farming', 'technology']
    }
  }
];

const sampleVendors = [
  {
    vendorName: 'Green Valley Organic Farm',
    slug: 'green-valley-organic-farm',
    stallNumber: 'A-001',
    productType: 'organic',
    description: 'Premium organic vegetables and fruits grown using traditional methods',
    contactInfo: {
      name: 'Rajesh Kumar',
      phone: '9876543210',
      email: 'rajesh@greenvalley.com',
      website: 'https://greenvalley.com'
    },
    location: {
      address: 'Village Model Town',
      city: 'Ludhiana',
      state: 'Punjab',
      pincode: '141001'
    },
    image: {
      url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop',
      alt: 'Green Valley Organic Farm'
    },
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop',
        alt: 'Farm Field'
      },
      {
        url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop',
        alt: 'Organic Vegetables'
      }
    ],
    rating: {
      average: 4.5,
      count: 12
    },
    status: 'active',
    verified: true,
    socialMedia: {
      facebook: 'https://facebook.com/greenvalley',
      instagram: 'https://instagram.com/greenvalley'
    }
  },
  {
    vendorName: 'Fresh Dairy Products',
    slug: 'fresh-dairy-products',
    stallNumber: 'B-002',
    productType: 'dairy',
    description: 'Fresh milk, cheese, and dairy products from local farms',
    contactInfo: {
      name: 'Priya Sharma',
      phone: '9876543211',
      email: 'priya@freshdairy.com',
      website: 'https://freshdairy.com'
    },
    location: {
      address: 'Village B',
      city: 'Karnal',
      state: 'Haryana',
      pincode: '132001'
    },
    image: {
      url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop',
      alt: 'Fresh Dairy Products'
    },
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop',
        alt: 'Dairy Farm'
      }
    ],
    rating: {
      average: 4.2,
      count: 8
    },
    status: 'active',
    verified: true,
    socialMedia: {
      facebook: 'https://facebook.com/freshdairy',
      instagram: 'https://instagram.com/freshdairy'
    }
  },
  {
    vendorName: 'Punjab Seeds & Equipment',
    slug: 'punjab-seeds-equipment',
    stallNumber: 'C-003',
    productType: 'seeds',
    description: 'High-quality seeds, fertilizers, and agricultural equipment for modern farming',
    contactInfo: {
      name: 'Amit Singh',
      phone: '9876543212',
      email: 'amit@punjabseeds.com',
      website: 'https://punjabseeds.com'
    },
    location: {
      address: 'Industrial Area',
      city: 'Meerut',
      state: 'Uttar Pradesh',
      pincode: '250001'
    },
    image: {
      url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&h=300&fit=crop',
      alt: 'Punjab Seeds & Equipment'
    },
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&h=300&fit=crop',
        alt: 'Seed Storage'
      },
      {
        url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
        alt: 'Farming Equipment'
      }
    ],
    rating: {
      average: 4.8,
      count: 15
    },
    status: 'active',
    verified: true,
    socialMedia: {
      facebook: 'https://facebook.com/punjabseeds',
      instagram: 'https://instagram.com/punjabseeds'
    }
  },
  {
    vendorName: 'Bihar Spice Traders',
    slug: 'bihar-spice-traders',
    stallNumber: 'D-004',
    productType: 'processed',
    description: 'Premium spices, lentils, and processed food products from Bihar',
    contactInfo: {
      name: 'Sunita Devi',
      phone: '9876543213',
      email: 'sunita@biharspices.com',
      website: 'https://biharspices.com'
    },
    location: {
      address: 'Spice Market',
      city: 'Patna',
      state: 'Bihar',
      pincode: '800001'
    },
    image: {
      url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop',
      alt: 'Bihar Spice Traders'
    },
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop',
        alt: 'Spice Collection'
      }
    ],
    rating: {
      average: 4.3,
      count: 10
    },
    status: 'active',
    verified: true,
    socialMedia: {
      facebook: 'https://facebook.com/biharspices',
      instagram: 'https://instagram.com/biharspices'
    }
  },
  {
    vendorName: 'Gujarat Cotton & Oilseeds',
    slug: 'gujarat-cotton-oilseeds',
    stallNumber: 'E-005',
    productType: 'crops',
    description: 'Premium cotton, groundnuts, sesame, and oilseeds from Gujarat',
    contactInfo: {
      name: 'Vikram Patel',
      phone: '9876543214',
      email: 'vikram@gujaratcotton.com',
      website: 'https://gujaratcotton.com'
    },
    location: {
      address: 'Cotton Market',
      city: 'Ahmedabad',
      state: 'Gujarat',
      pincode: '380001'
    },
    image: {
      url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
      alt: 'Gujarat Cotton & Oilseeds'
    },
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
        alt: 'Cotton Fields'
      }
    ],
    rating: {
      average: 4.6,
      count: 20
    },
    status: 'active',
    verified: true,
    socialMedia: {
      facebook: 'https://facebook.com/gujaratcotton',
      instagram: 'https://instagram.com/gujaratcotton'
    }
  },
  {
    vendorName: 'Maharashtra Livestock Farm',
    slug: 'maharashtra-livestock-farm',
    stallNumber: 'F-006',
    productType: 'livestock',
    description: 'Healthy cattle, poultry, and farm animals with proper documentation',
    contactInfo: {
      name: 'Ravi Deshmukh',
      phone: '9876543215',
      email: 'ravi@mahlivestock.com',
      website: 'https://mahlivestock.com'
    },
    location: {
      address: 'Livestock Market',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411001'
    },
    image: {
      url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop',
      alt: 'Maharashtra Livestock Farm'
    },
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop',
        alt: 'Cattle Farm'
      }
    ],
    rating: {
      average: 4.7,
      count: 18
    },
    status: 'active',
    verified: true,
    socialMedia: {
      facebook: 'https://facebook.com/mahlivestock',
      instagram: 'https://instagram.com/mahlivestock'
    }
  }
];

const sampleProducts = [
  {
    name: 'Fresh Organic Tomatoes',
    slug: 'fresh-organic-tomatoes',
    description: 'Premium organic tomatoes grown without pesticides',
    price: 80,
    currency: 'INR',
    unit: 'kg',
    category: 'vegetables',
    subcategory: 'tomatoes',
    image: {
      url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=300&fit=crop',
      alt: 'Fresh Organic Tomatoes'
    },
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=300&fit=crop',
        alt: 'Tomatoes Close-up'
      }
    ],
    availability: {
      inStock: true,
      quantity: 100,
      minOrder: 1
    },
    quality: 'premium',
    organic: true,
    certifications: ['Organic Certification', 'FSSAI'],
    tags: ['organic', 'fresh', 'premium'],
    status: 'active',
    featured: true
  },
  {
    name: 'Premium Basmati Rice',
    slug: 'premium-basmati-rice',
    description: 'High quality basmati rice, perfect for cooking',
    price: 120,
    currency: 'INR',
    unit: 'kg',
    category: 'crops',
    subcategory: 'rice',
    image: {
      url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop',
      alt: 'Premium Basmati Rice'
    },
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop',
        alt: 'Rice Grains'
      }
    ],
    availability: {
      inStock: true,
      quantity: 200,
      minOrder: 5
    },
    quality: 'premium',
    organic: false,
    certifications: ['FSSAI', 'AGMARK'],
    tags: ['basmati', 'premium', 'rice'],
    status: 'active',
    featured: true
  },
  {
    name: 'Fresh Cow Milk',
    slug: 'fresh-cow-milk',
    description: 'Fresh cow milk, delivered daily',
    price: 60,
    currency: 'INR',
    unit: 'litre',
    category: 'dairy',
    subcategory: 'milk',
    image: {
      url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop',
      alt: 'Fresh Cow Milk'
    },
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop',
        alt: 'Milk Bottles'
      }
    ],
    availability: {
      inStock: true,
      quantity: 50,
      minOrder: 1
    },
    quality: 'standard',
    organic: false,
    certifications: ['FSSAI'],
    tags: ['fresh', 'milk', 'daily'],
    status: 'active',
    featured: false
  },
  {
    name: 'Organic Wheat Seeds',
    slug: 'organic-wheat-seeds',
    description: 'High-yield organic wheat seeds for better crop production',
    price: 150,
    currency: 'INR',
    unit: 'kg',
    category: 'seeds',
    subcategory: 'wheat',
    image: {
      url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&h=300&fit=crop',
      alt: 'Organic Wheat Seeds'
    },
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&h=300&fit=crop',
        alt: 'Wheat Seeds'
      }
    ],
    availability: {
      inStock: true,
      quantity: 500,
      minOrder: 10
    },
    quality: 'premium',
    organic: true,
    certifications: ['Organic Certification', 'Seed Certification'],
    tags: ['organic', 'seeds', 'wheat', 'high-yield'],
    status: 'active',
    featured: true
  },
  {
    name: 'Premium Turmeric Powder',
    slug: 'premium-turmeric-powder',
    description: 'Pure turmeric powder from Bihar, rich in curcumin',
    price: 200,
    currency: 'INR',
    unit: 'kg',
    category: 'processed',
    subcategory: 'spices',
    image: {
      url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop',
      alt: 'Premium Turmeric Powder'
    },
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop',
        alt: 'Turmeric Powder'
      }
    ],
    availability: {
      inStock: true,
      quantity: 100,
      minOrder: 1
    },
    quality: 'premium',
    organic: false,
    certifications: ['FSSAI', 'AGMARK'],
    tags: ['turmeric', 'spices', 'curcumin', 'bihar'],
    status: 'active',
    featured: false
  },
  {
    name: 'Cotton Bales',
    slug: 'cotton-bales',
    description: 'Premium quality cotton bales from Gujarat',
    price: 4500,
    currency: 'INR',
    unit: 'quintal',
    category: 'crops',
    subcategory: 'cotton',
    image: {
      url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
      alt: 'Cotton Bales'
    },
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
        alt: 'Cotton Fields'
      }
    ],
    availability: {
      inStock: true,
      quantity: 50,
      minOrder: 1
    },
    quality: 'premium',
    organic: false,
    certifications: ['Cotton Corporation of India'],
    tags: ['cotton', 'bales', 'gujarat', 'premium'],
    status: 'active',
    featured: true
  },
  {
    name: 'Healthy Jersey Cow',
    slug: 'healthy-jersey-cow',
    description: 'Healthy Jersey cow with proper vaccination and documentation',
    price: 45000,
    currency: 'INR',
    unit: 'piece',
    category: 'livestock',
    subcategory: 'cattle',
    image: {
      url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop',
      alt: 'Healthy Jersey Cow'
    },
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop',
        alt: 'Jersey Cow'
      }
    ],
    availability: {
      inStock: true,
      quantity: 5,
      minOrder: 1
    },
    quality: 'premium',
    organic: false,
    certifications: ['Veterinary Certificate', 'Breed Certificate'],
    tags: ['cattle', 'jersey', 'dairy', 'healthy'],
    status: 'active',
    featured: true
  },
  {
    name: 'Fresh Organic Spinach',
    slug: 'fresh-organic-spinach',
    description: 'Fresh organic spinach leaves, rich in iron and vitamins',
    price: 40,
    currency: 'INR',
    unit: 'kg',
    category: 'vegetables',
    subcategory: 'leafy-greens',
    image: {
      url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop',
      alt: 'Fresh Organic Spinach'
    },
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop',
        alt: 'Spinach Leaves'
      }
    ],
    availability: {
      inStock: true,
      quantity: 80,
      minOrder: 1
    },
    quality: 'premium',
    organic: true,
    certifications: ['Organic Certification', 'FSSAI'],
    tags: ['organic', 'spinach', 'leafy-greens', 'vitamins'],
    status: 'active',
    featured: false
  },
  {
    name: 'Groundnut Oil',
    slug: 'groundnut-oil',
    description: 'Pure groundnut oil extracted from premium groundnuts',
    price: 180,
    currency: 'INR',
    unit: 'litre',
    category: 'processed',
    subcategory: 'oil',
    image: {
      url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
      alt: 'Groundnut Oil'
    },
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
        alt: 'Oil Bottles'
      }
    ],
    availability: {
      inStock: true,
      quantity: 200,
      minOrder: 1
    },
    quality: 'standard',
    organic: false,
    certifications: ['FSSAI', 'AGMARK'],
    tags: ['oil', 'groundnut', 'cooking', 'pure'],
    status: 'active',
    featured: false
  },
  {
    name: 'Fresh Organic Carrots',
    slug: 'fresh-organic-carrots',
    description: 'Fresh organic carrots, rich in beta-carotene and vitamins',
    price: 60,
    currency: 'INR',
    unit: 'kg',
    category: 'vegetables',
    subcategory: 'root-vegetables',
    image: {
      url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=300&fit=crop',
      alt: 'Fresh Organic Carrots'
    },
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=300&fit=crop',
        alt: 'Carrots'
      }
    ],
    availability: {
      inStock: true,
      quantity: 120,
      minOrder: 1
    },
    quality: 'premium',
    organic: true,
    certifications: ['Organic Certification', 'FSSAI'],
    tags: ['organic', 'carrots', 'beta-carotene', 'vitamins'],
    status: 'active',
    featured: true
  }
];

const sampleOrganizations = [
  {
    name: 'Ministry of Agriculture & Farmers Welfare',
    slug: 'ministry-of-agriculture-farmers-welfare',
    description: 'Government organization promoting agricultural development and farmer welfare across India',
    type: 'government',
    address: {
      street: 'Krishi Bhavan',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110001',
      country: 'India'
    },
    contactInfo: {
      phone: '+91-11-2338xxxx',
      email: 'info@agriculture.gov.in',
      website: 'https://agriculture.gov.in',
      contactPerson: 'Agricultural Officer'
    },
    logo: {
      url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=200&h=200&fit=crop',
      alt: 'Ministry of Agriculture Logo'
    },
    image: {
      url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&h=300&fit=crop',
      alt: 'Ministry of Agriculture'
    },
    socialMedia: {
      facebook: 'ministryofagriculture',
      twitter: 'agriculturegov',
      linkedin: 'ministry-of-agriculture'
    },
    services: ['Agricultural Policy', 'Farmer Support', 'Research & Development', 'Subsidies'],
    certifications: ['ISO 9001', 'Government Certified'],
    status: 'active',
    verified: true
  },
  {
    name: 'Punjab Agricultural University',
    slug: 'punjab-agricultural-university',
    description: 'Premier agricultural research and education institution in Punjab',
    type: 'research',
    address: {
      street: 'PAU Campus',
      city: 'Ludhiana',
      state: 'Punjab',
      pincode: '141004',
      country: 'India'
    },
    contactInfo: {
      phone: '+91-161-2401960',
      email: 'info@pau.edu',
      website: 'https://pau.edu',
      contactPerson: 'Registrar'
    },
    logo: {
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
      alt: 'PAU Logo'
    },
    image: {
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
      alt: 'Punjab Agricultural University'
    },
    socialMedia: {
      facebook: 'punjabagriculturaluniversity',
      twitter: 'pau_ludhiana',
      linkedin: 'punjab-agricultural-university'
    },
    services: ['Agricultural Research', 'Education', 'Extension Services', 'Seed Development'],
    certifications: ['NAAC A+', 'ICAR Recognition'],
    status: 'active',
    verified: true
  },
  {
    name: 'Green Earth Foundation',
    slug: 'green-earth-foundation',
    description: 'NGO promoting sustainable agriculture and environmental conservation',
    type: 'ngo',
    address: {
      street: 'Eco Park Road',
      city: 'Chandigarh',
      state: 'Punjab',
      pincode: '160002',
      country: 'India'
    },
    contactInfo: {
      phone: '+91-172-1234567',
      email: 'info@greenearth.org',
      website: 'https://greenearth.org',
      contactPerson: 'Program Director'
    },
    logo: {
      url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=200&h=200&fit=crop',
      alt: 'Green Earth Foundation Logo'
    },
    image: {
      url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
      alt: 'Green Earth Foundation'
    },
    socialMedia: {
      facebook: 'greenearthfoundation',
      twitter: 'greenearthngo',
      linkedin: 'green-earth-foundation'
    },
    services: ['Environmental Education', 'Sustainable Farming', 'Community Development', 'Conservation'],
    certifications: ['FCRA Registration', '80G Certificate'],
    status: 'active',
    verified: true
  }
];

const sampleNewsUpdates = [
  {
    title: 'New Agricultural Policy Announced for 2024',
    slug: 'new-agricultural-policy-announced-2024',
    excerpt: 'Government announces comprehensive new policies to support farmers and promote sustainable agricultural practices',
    content: 'The Government of India has announced a comprehensive new agricultural policy for 2024 that focuses on sustainable farming practices, digital agriculture, and farmer welfare. The policy includes increased subsidies for organic farming, better crop insurance schemes, and enhanced support for small and marginal farmers. This policy aims to double farmer income by 2025 while promoting environmentally friendly agricultural practices.',
    author: {
      name: 'Agricultural Reporter',
      email: 'reporter@agriculture.gov.in',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
    },
    category: 'policy',
    tags: ['policy', 'government', 'agriculture', 'sustainability'],
    image: {
      url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
      alt: 'Agricultural Policy',
      caption: 'New agricultural policy announcement'
    },
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=600&fit=crop',
        alt: 'Policy Meeting',
        caption: 'Policy makers discussing agricultural reforms'
      }
    ],
    status: 'published',
    featured: true,
    publishedAt: new Date('2024-01-15'),
    views: 1250,
    meta: {
      title: 'New Agricultural Policy 2024 | Government Announcements',
      description: 'Comprehensive new agricultural policy announced by the government',
      keywords: ['agricultural policy', 'government', 'farmers', 'sustainability']
    }
  },
  {
    title: 'Success Story: Organic Farming Transforms Village Economy',
    slug: 'success-story-organic-farming-transforms-village',
    excerpt: 'How a small village in Punjab adopted organic farming and increased their income by 300%',
    content: 'The village of Model Town in Ludhiana district has become a shining example of how organic farming can transform rural economies. Led by progressive farmer Rajesh Kumar, the village has completely transitioned to organic farming methods over the past five years. The results have been remarkable - farmers have seen a 300% increase in their income while improving soil health and reducing input costs. The village now exports organic produce to major cities and has become a model for other farming communities.',
    author: {
      name: 'Rural Development Reporter',
      email: 'rural@kisaanmela.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'
    },
    category: 'success_story',
    tags: ['success story', 'organic farming', 'village development', 'income increase'],
    image: {
      url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=600&fit=crop',
      alt: 'Organic Farm Success',
      caption: 'Organic farming success in Model Town village'
    },
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&h=600&fit=crop',
        alt: 'Organic Vegetables',
        caption: 'Fresh organic vegetables from the village'
      },
      {
        url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&h=600&fit=crop',
        alt: 'Happy Farmers',
        caption: 'Farmers celebrating their success'
      }
    ],
    status: 'published',
    featured: true,
    publishedAt: new Date('2024-02-10'),
    views: 890,
    meta: {
      title: 'Organic Farming Success Story | Village Transformation',
      description: 'How organic farming transformed a village economy in Punjab',
      keywords: ['organic farming', 'success story', 'village development', 'income']
    }
  },
  {
    title: 'Innovation Hub: AI-Powered Crop Monitoring System',
    slug: 'innovation-hub-ai-powered-crop-monitoring',
    excerpt: 'New AI technology helps farmers monitor crop health and predict yields with 95% accuracy',
    content: 'A revolutionary AI-powered crop monitoring system has been developed by agricultural researchers at Punjab Agricultural University. This system uses satellite imagery, drone technology, and machine learning algorithms to monitor crop health, detect diseases early, and predict yields with 95% accuracy. The system has been successfully tested on over 1000 farms across Punjab and has helped farmers increase their yields by 25% while reducing pesticide use by 40%. The technology is now being made available to farmers at subsidized rates through government schemes.',
    author: {
      name: 'Technology Reporter',
      email: 'tech@kisaanmela.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
    },
    category: 'innovation',
    tags: ['innovation', 'AI', 'technology', 'crop monitoring', 'yield prediction'],
    image: {
      url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&h=600&fit=crop',
      alt: 'AI Crop Monitoring',
      caption: 'AI-powered crop monitoring system in action'
    },
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
        alt: 'Drone Technology',
        caption: 'Drone technology for crop monitoring'
      },
      {
        url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
        alt: 'Data Analysis',
        caption: 'AI analyzing crop data'
      }
    ],
    status: 'published',
    featured: true,
    publishedAt: new Date('2024-03-05'),
    views: 2100,
    meta: {
      title: 'AI Crop Monitoring System | Agricultural Innovation',
      description: 'Revolutionary AI technology for crop monitoring and yield prediction',
      keywords: ['AI', 'crop monitoring', 'agricultural technology', 'innovation']
    }
  },
  {
    title: 'Farmer Story: From Struggling to Successful Entrepreneur',
    slug: 'farmer-story-struggling-to-successful-entrepreneur',
    excerpt: 'Priya Sharma shares her journey from a struggling farmer to a successful agricultural entrepreneur',
    content: 'Priya Sharma\'s story is one of determination, innovation, and success. Starting with just 2 acres of land in Karnal, Haryana, she faced numerous challenges including crop failures, market fluctuations, and lack of access to modern farming techniques. However, through her determination and willingness to learn, she transformed her small farm into a thriving agricultural business. Today, she runs a successful organic farming operation, supplies fresh produce to major cities, and mentors other women farmers in her community. Her story inspires thousands of farmers across the country.',
    author: {
      name: 'Women Empowerment Reporter',
      email: 'women@kisaanmela.com',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop'
    },
    category: 'blog',
    tags: ['farmer story', 'women empowerment', 'entrepreneurship', 'success'],
    image: {
      url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&h=600&fit=crop',
      alt: 'Priya Sharma',
      caption: 'Priya Sharma in her organic farm'
    },
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&h=600&fit=crop',
        alt: 'Fresh Produce',
        caption: 'Fresh organic produce from Priya\'s farm'
      },
      {
        url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&h=600&fit=crop',
        alt: 'Women Farmers',
        caption: 'Priya mentoring other women farmers'
      }
    ],
    status: 'published',
    featured: false,
    publishedAt: new Date('2024-03-20'),
    views: 650,
    meta: {
      title: 'Farmer Success Story | Women in Agriculture',
      description: 'Inspiring story of a woman farmer\'s journey to success',
      keywords: ['farmer story', 'women empowerment', 'agricultural entrepreneurship']
    }
  }
];

const sampleStalls = [
  {
    stallNumber: 'A-001',
    location: 'Main Pavilion',
    size: 'premium',
    amenities: ['Electricity', 'Water', 'Storage', 'Display Rack'],
    price: 5000,
    currency: 'INR',
    status: 'booked',
    bookingDate: new Date('2024-12-15')
  },
  {
    stallNumber: 'A-002',
    location: 'Main Pavilion',
    size: 'large',
    amenities: ['Electricity', 'Water', 'Storage'],
    price: 4000,
    currency: 'INR',
    status: 'booked',
    bookingDate: new Date('2024-12-15')
  },
  {
    stallNumber: 'B-001',
    location: 'Secondary Pavilion',
    size: 'medium',
    amenities: ['Electricity', 'Water'],
    price: 3000,
    currency: 'INR',
    status: 'available'
  },
  {
    stallNumber: 'B-002',
    location: 'Secondary Pavilion',
    size: 'medium',
    amenities: ['Electricity', 'Water'],
    price: 3000,
    currency: 'INR',
    status: 'available'
  },
  {
    stallNumber: 'C-001',
    location: 'Outdoor Area',
    size: 'small',
    amenities: ['Electricity'],
    price: 2000,
    currency: 'INR',
    status: 'available'
  },
  {
    stallNumber: 'C-002',
    location: 'Outdoor Area',
    size: 'small',
    amenities: ['Electricity'],
    price: 2000,
    currency: 'INR',
    status: 'available'
  },
  {
    stallNumber: 'D-001',
    location: 'Food Court',
    size: 'large',
    amenities: ['Electricity', 'Water', 'Gas Connection', 'Storage'],
    price: 4500,
    currency: 'INR',
    status: 'available'
  },
  {
    stallNumber: 'D-002',
    location: 'Food Court',
    size: 'medium',
    amenities: ['Electricity', 'Water', 'Gas Connection'],
    price: 3500,
    currency: 'INR',
    status: 'available'
  }
];

// Main seeding function
async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to MongoDB
    const connected = await connectDB();
    if (!connected) {
      console.log('❌ Failed to connect to MongoDB. Exiting...');
      process.exit(1);
    }

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await User.deleteMany({});
    await Farmer.deleteMany({});
    await Event.deleteMany({});
    await Vendor.deleteMany({});
    await Product.deleteMany({});
    await Organization.deleteMany({});
    await NewsUpdate.deleteMany({});
    await Stall.deleteMany({});
    await MarketplaceUser.deleteMany({});
    console.log('✅ Cleared existing data');

    // Seed Users
    console.log('👥 Seeding users...');
    const users = await User.insertMany(sampleUsers);
    console.log(`✅ Created ${users.length} users`);

    // Seed Farmers (for farmers market API)
    console.log('🚜 Seeding farmers...');
    const farmers = await Farmer.insertMany(sampleFarmers);
    console.log(`✅ Created ${farmers.length} farmers`);

    // Seed Events
    console.log('📅 Seeding events...');
    const events = await Event.insertMany(sampleEvents);
    console.log(`✅ Created ${events.length} events`);

    // Seed Vendors
    console.log('🏪 Seeding vendors...');
    const vendors = await Vendor.insertMany(sampleVendors);
    console.log(`✅ Created ${vendors.length} vendors`);

    // Seed Products (link to vendors)
    console.log('🛍️ Seeding products...');
    const products = [];
    for (let i = 0; i < sampleProducts.length; i++) {
      const product = { ...sampleProducts[i] };
      product.vendor = vendors[i % vendors.length]._id;
      products.push(product);
    }
    const createdProducts = await Product.insertMany(products);
    console.log(`✅ Created ${createdProducts.length} products`);

    // Update vendors with products
    for (let i = 0; i < vendors.length; i++) {
      const vendorProducts = createdProducts.filter(p => p.vendor.toString() === vendors[i]._id.toString());
      await Vendor.findByIdAndUpdate(vendors[i]._id, {
        products: vendorProducts.map(p => p._id)
      });
    }
    console.log('✅ Linked products to vendors');

    // Seed Organizations
    console.log('🏢 Seeding organizations...');
    const organizations = await Organization.insertMany(sampleOrganizations);
    console.log(`✅ Created ${organizations.length} organizations`);

    // Seed News Updates
    console.log('📰 Seeding news updates...');
    const newsUpdates = await NewsUpdate.insertMany(sampleNewsUpdates);
    console.log(`✅ Created ${newsUpdates.length} news updates`);

    // Seed Stalls
    console.log('🏪 Seeding stalls...');
    const stalls = await Stall.insertMany(sampleStalls);
    console.log(`✅ Created ${stalls.length} stalls`);

    // Link booked stalls to vendors
    const bookedStalls = stalls.filter(s => s.status === 'booked');
    for (let i = 0; i < bookedStalls.length && i < vendors.length; i++) {
      await Stall.findByIdAndUpdate(bookedStalls[i]._id, {
        bookedBy: vendors[i]._id,
        event: events[0]._id // Link to first event
      });
    }
    console.log('✅ Linked booked stalls to vendors');

    // Seed Marketplace Users (skip for now due to index issues)
    console.log('👤 Skipping marketplace users (index conflict)...');
    // const marketplaceUsers = [];
    // for (let i = 0; i < users.length; i++) {
    //   const user = users[i];
    //   const marketplaceUser = {
    //     userId: user._id,
    //     role: user.role === 'farmer' ? 'vendor' : user.role === 'admin' ? 'admin' : 'buyer',
    //     permissions: user.role === 'admin' ? ['read', 'write', 'delete', 'admin'] : ['read', 'write'],
    //     isActive: true,
    //     lastLogin: new Date(),
    //     preferences: {
    //       notifications: {
    //         email: true,
    //         sms: false,
    //         push: true
    //       },
    //       language: 'en',
    //       currency: 'INR'
    //     }
    //   };
      
    //   // Link vendor role users to vendors
    //   if (user.role === 'farmer' && vendors[i % vendors.length]) {
    //     marketplaceUser.vendorId = vendors[i % vendors.length]._id;
    //   }
      
    //   marketplaceUsers.push(marketplaceUser);
    // }
    // const createdMarketplaceUsers = await MarketplaceUser.insertMany(marketplaceUsers);
    // console.log(`✅ Created ${createdMarketplaceUsers.length} marketplace users`);

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Users: ${users.length}`);
    console.log(`- Farmers: ${farmers.length}`);
    console.log(`- Events: ${events.length}`);
    console.log(`- Vendors: ${vendors.length}`);
    console.log(`- Products: ${createdProducts.length}`);
    console.log(`- Organizations: ${organizations.length}`);
    console.log(`- News Updates: ${newsUpdates.length}`);
    console.log(`- Stalls: ${stalls.length}`);
    console.log(`- Marketplace Users: 0 (skipped due to index conflict)`);

    console.log('\n🔑 Demo Login Credentials:');
    console.log('Farmer: rajesh@kisaanmela.com / farmer123');
    console.log('Buyer: sunita@kisaanmela.com / buyer123');
    console.log('Admin: admin@kisaanmela.com / admin123');

    console.log('\n📱 Available Features:');
    console.log('- Events Management with Gallery and Registration');
    console.log('- Marketplace with Buy/Sell functionality');
    console.log('- Training & Learning with Workshops and Subsidies');
    console.log('- Vendors with Stall Booking and Catalog Management');
    console.log('- News & Blogs with Farmer Stories and Innovation Hub');
    console.log('- Contact Form with full functionality');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('✅ Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = seedDatabase;