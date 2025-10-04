#!/usr/bin/env node

/**
 * Create Test User Script
 * Creates a test user for testing forgot password functionality
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to database
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kisaanmela_dev');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

// User schema (simplified)
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  role: { type: String, default: 'buyer' },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function createTestUser() {
  try {
    await connectDB();

    const testEmail = 'test@kisaanmela.com';
    const testPassword = 'password123';

    // Check if user already exists
    const existingUser = await User.findOne({ email: testEmail });
    if (existingUser) {
      console.log('✅ Test user already exists:', testEmail);
      return existingUser;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(testPassword, 12);

    // Create test user
    const testUser = new User({
      name: 'Test User',
      email: testEmail,
      password: hashedPassword,
      phone: '+919876543210',
      role: 'buyer'
    });

    await testUser.save();
    console.log('✅ Test user created successfully:');
    console.log(`   Email: ${testEmail}`);
    console.log(`   Password: ${testPassword}`);
    console.log(`   ID: ${testUser._id}`);

    return testUser;
  } catch (error) {
    console.error('❌ Failed to create test user:', error.message);
    throw error;
  } finally {
    await mongoose.connection.close();
  }
}

// Run if called directly
if (require.main === module) {
  createTestUser().catch(error => {
    console.error('Script failed:', error.message);
    process.exit(1);
  });
}

module.exports = { createTestUser };
