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

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Users: ${users.length}`);
    console.log(`- Farmers: ${farmers.length}`);
    console.log(`- Events: ${events.length}`);
    console.log(`- Vendors: ${vendors.length}`);
    console.log(`- Products: ${createdProducts.length}`);

    console.log('\n🔑 Demo Login Credentials:');
    console.log('Farmer: rajesh@kisaanmela.com / farmer123');
    console.log('Buyer: sunita@kisaanmela.com / buyer123');
    console.log('Admin: admin@kisaanmela.com / admin123');

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