const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

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

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  if (this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

const User = mongoose.model('User', userSchema);

// Demo users data
const demoUsers = [
  {
    name: 'Admin User',
    email: 'admin@kisaanmela.com',
    mobile: '9876543210',
    password: 'admin123',
    role: 'admin',
    profileComplete: true,
    location: {
      state: 'Maharashtra',
      district: 'Pune',
      village: 'Pune City',
      pincode: '411001'
    }
  },
  {
    name: 'Demo Farmer',
    email: 'farmer@kisaanmela.com',
    mobile: '9876543211',
    password: 'farmer123',
    role: 'farmer',
    profileComplete: true,
    location: {
      state: 'Maharashtra',
      district: 'Pune',
      village: 'Baramati',
      pincode: '413102'
    },
    farmDetails: {
      size: 10,
      unit: 'acres',
      crops: ['wheat', 'rice', 'sugarcane'],
      livestock: ['cows', 'goats']
    },
    farmAddress: 'Farm House, Baramati, Maharashtra'
  },
  {
    name: 'Demo Buyer',
    email: 'buyer@kisaanmela.com',
    mobile: '9876543212',
    password: 'buyer123',
    role: 'buyer',
    profileComplete: true,
    location: {
      state: 'Maharashtra',
      district: 'Mumbai',
      village: 'Mumbai City',
      pincode: '400001'
    }
  },
  {
    name: 'Demo User',
    email: 'demo@kisaanmela.com',
    mobile: '9876543213',
    password: 'demo123',
    role: 'farmer',
    profileComplete: true,
    location: {
      state: 'Maharashtra',
      district: 'Nashik',
      village: 'Nashik City',
      pincode: '422001'
    },
    farmDetails: {
      size: 5,
      unit: 'acres',
      crops: ['tomatoes', 'onions', 'potatoes'],
      livestock: ['chickens']
    },
    farmAddress: 'Green Farm, Nashik, Maharashtra'
  },
  {
    name: 'Test User',
    email: 'test@kisaanmela.com',
    mobile: '9876543214',
    password: 'test123',
    role: 'buyer',
    profileComplete: false,
    location: {
      state: 'Karnataka',
      district: 'Bangalore',
      village: 'Bangalore City',
      pincode: '560001'
    }
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/kisaanmela';
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Insert demo users one by one to trigger password hashing
    const users = [];
    for (const userData of demoUsers) {
      const user = new User(userData);
      await user.save(); // This will trigger the pre('save') hook for password hashing
      users.push(user);
    }
    console.log(`Inserted ${users.length} demo users`);

    // Display created users
    console.log('\nCreated demo users:');
    users.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Role: ${user.role}`);
    });

    console.log('\nDemo login credentials:');
    console.log('Email: admin@kisaanmela.com, Password: admin123 (Admin)');
    console.log('Email: farmer@kisaanmela.com, Password: farmer123 (Farmer)');
    console.log('Email: buyer@kisaanmela.com, Password: buyer123 (Buyer)');
    console.log('Email: demo@kisaanmela.com, Password: demo123 (Farmer)');
    console.log('Email: test@kisaanmela.com, Password: test123 (Buyer)');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();
