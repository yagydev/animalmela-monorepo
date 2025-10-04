#!/usr/bin/env node

/**
 * 🧪 Simple Test Server for Animall Marketplace
 * 
 * This creates a minimal test server to test the marketplace functionality
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 8001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/animall-test';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Simple User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['buyer', 'seller', 'farmer', 'admin'], default: 'buyer' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Simple Listing Schema
const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['active', 'inactive', 'sold'], default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

const Listing = mongoose.model('Listing', listingSchema);

// Simple Order Schema
const orderSchema = new mongoose.Schema({
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
  quantity: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Auth endpoints
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, mobile, password, role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = new User({
      name,
      email,
      mobile,
      password: hashedPassword,
      role: role || 'buyer'
    });
    
    await user.save();
    
    res.json({ success: true, user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      'test-secret-key',
      { expiresIn: '24h' }
    );
    
    res.json({ 
      success: true, 
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Listings endpoints
app.get('/api/listings', async (req, res) => {
  try {
    const listings = await Listing.find({ status: 'active' }).populate('sellerId', 'name email');
    res.json({ success: true, listings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/listings', async (req, res) => {
  try {
    const { title, description, category, price, quantity, sellerId } = req.body;
    
    const listing = new Listing({
      title,
      description,
      category,
      price,
      quantity,
      sellerId
    });
    
    await listing.save();
    await listing.populate('sellerId', 'name email');
    
    res.json({ success: true, listing });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Orders endpoints
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().populate('buyerId sellerId listingId', 'name email title');
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const { buyerId, sellerId, listingId, quantity, totalAmount } = req.body;
    
    const order = new Order({
      buyerId,
      sellerId,
      listingId,
      quantity,
      totalAmount
    });
    
    await order.save();
    await order.populate('buyerId sellerId listingId', 'name email title');
    
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Categories endpoint
app.get('/api/categories', (req, res) => {
  res.json({
    success: true,
    categories: [
      { name: 'crops', subcategories: ['wheat', 'rice', 'corn', 'sugarcane'] },
      { name: 'livestock', subcategories: ['cattle', 'goats', 'sheep', 'poultry'] },
      { name: 'seeds', subcategories: ['vegetable', 'flower', 'fruit', 'grain'] },
      { name: 'fertilizers', subcategories: ['organic', 'chemical', 'bio', 'liquid'] },
      { name: 'equipment', subcategories: ['tractor', 'harvester', 'irrigation', 'tools'] }
    ]
  });
});

// Cart endpoints
app.post('/api/cart/add', (req, res) => {
  res.json({ success: true, message: 'Item added to cart' });
});

app.get('/api/cart/items', (req, res) => {
  res.json({ success: true, items: [] });
});

// Checkout endpoints
app.post('/api/checkout/place-order', (req, res) => {
  res.json({ success: true, message: 'Order placed successfully' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Test server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
