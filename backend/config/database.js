const mongoose = require('mongoose');
const knex = require('knex');
require('dotenv').config();
const { logger } = require('../src/utils/logger');

// MongoDB connection configuration
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error('Database connection failed:', error);
    process.exit(1);
  }
};

// Knex configuration for PostgreSQL
const knexConfig = {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'animall_db',
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    directory: './migrations'
  },
  seeds: {
    directory: './seeds'
  }
};

// Initialize Knex instance
const db = knex(knexConfig);

// User Schema for MongoDB
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password_hash: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  avatar_url: {
    type: String
  },
  user_type: {
    type: String,
    enum: ['pet_owner', 'service_provider', 'breeder', 'admin'],
    default: 'pet_owner'
  },
  verified: {
    type: Boolean,
    default: false
  },
  email_verified: {
    type: Boolean,
    default: false
  },
  phone_verified: {
    type: Boolean,
    default: false
  },
  preferences: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  stripe_customer_id: {
    type: String
  },
  stripe_account_id: {
    type: String
  },
  last_login: {
    type: Date
  }
}, {
  timestamps: true
});

// Create User model
const User = mongoose.model('User', userSchema);

// Service Schema for MongoDB
const serviceSchema = new mongoose.Schema({
  provider_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  service_type: {
    type: String,
    enum: [
      'pet_sitting',
      'dog_walking',
      'grooming',
      'training',
      'veterinary',
      'boarding',
      'pet_taxi',
      'pet_photography',
      'pet_massage',
      'pet_yoga',
      'other'
    ],
    required: true
  },
  price: {
    type: Number,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  location: {
    lat: Number,
    lng: Number,
    address: String
  },
  availability: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  service_areas: [String],
  verified: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: true
  },
  requirements: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  photos: [String],
  features: [String],
  policies: {
    cancellation: String,
    refund: String,
    emergency: String
  },
  included: [String],
  not_included: [String]
}, {
  timestamps: true
});

// Pet Schema for MongoDB
const petSchema = new mongoose.Schema({
  owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  species: {
    type: String,
    enum: ['dog', 'cat', 'bird', 'fish', 'reptile', 'rabbit', 'hamster', 'other'],
    required: true
  },
  breed: {
    type: String,
    trim: true
  },
  age: {
    type: Number,
    min: 0
  },
  weight: {
    type: Number,
    min: 0
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'unknown']
  },
  color: {
    type: String,
    trim: true
  },
  neutered: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    trim: true
  },
  medical_notes: {
    type: String,
    trim: true
  },
  special_needs: [String],
  vaccinations: [{
    name: String,
    date: Date,
    next_due: Date
  }],
  health_info: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  behavior_traits: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  photos: [String],
  gallery: [String],
  emergency_contact: {
    name: String,
    phone: String,
    relationship: String
  },
  vet_info: {
    name: String,
    clinic: String,
    phone: String,
    address: String
  },
  available_for_adoption: {
    type: Boolean,
    default: false
  },
  adoption_fee: {
    type: Number,
    min: 0
  }
}, {
  timestamps: true
});

// Create models
const Service = mongoose.model('Service', serviceSchema);
const Pet = mongoose.model('Pet', petSchema);

module.exports = {
  connectDB,
  db,
  User,
  Service,
  Pet
};