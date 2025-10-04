const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
const MONGODB_URI = 'mongodb://127.0.0.1:27017/farmers_market_test';
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB connected successfully!'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Schemas
const farmerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  location: {
    state: String,
    district: String,
    pincode: String,
    village: String
  },
  products: [String],
  createdAt: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  unit: { type: String, required: true },
  quantity: { type: Number, required: true },
  category: { type: String, required: true },
  images: [String],
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
  location: {
    state: String,
    district: String
  },
  rating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  negotiable: { type: Boolean, default: false },
  minimumOrder: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now }
});

const orderSchema = new mongoose.Schema({
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true }
  }],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  shippingAddress: {
    name: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
    mobile: String
  },
  paymentMethod: { type: String, enum: ['cod', 'online', 'upi'], default: 'cod' },
  createdAt: { type: Date, default: Date.now }
});

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true }
  }],
  totalAmount: { type: Number, default: 0 },
  itemCount: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now }
});

// Models
const Farmer = mongoose.model('Farmer', farmerSchema);
const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);
const Cart = mongoose.model('Cart', cartSchema);

// Middleware for logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health Check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Farmer Routes
app.post('/api/farmers', async (req, res) => {
  try {
    const farmer = new Farmer(req.body);
    await farmer.save();
    res.status(201).json({ success: true, farmer });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.get('/api/farmers', async (req, res) => {
  try {
    const farmers = await Farmer.find().populate('products');
    res.json({ success: true, farmers });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/farmers/:id', async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.params.id);
    if (!farmer) {
      return res.status(404).json({ success: false, error: 'Farmer not found' });
    }
    res.json({ success: true, farmer });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Product Routes
app.post('/api/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    await product.populate('sellerId', 'name email mobile location');
    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, location, sortBy = 'newest' } = req.query;
    let query = {};
    
    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (location) {
      query.$or = [
        { 'location.state': new RegExp(location, 'i') },
        { 'location.district': new RegExp(location, 'i') }
      ];
    }
    
    let sort = { createdAt: -1 };
    if (sortBy === 'price_low') sort = { price: 1 };
    if (sortBy === 'price_high') sort = { price: -1 };
    if (sortBy === 'rating') sort = { rating: -1 };
    
    const products = await Product.find(query)
      .populate('sellerId', 'name email mobile location')
      .sort(sort);
    
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('sellerId', 'name email mobile location');
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Cart Routes
app.post('/api/cart', async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    
    // Get product details
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    
    // Check if cart exists
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [], totalAmount: 0, itemCount: 0 });
    }
    
    // Check if item already exists in cart
    const existingItem = cart.items.find(item => item.productId.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.totalPrice = existingItem.quantity * existingItem.unitPrice;
    } else {
      cart.items.push({
        productId,
        quantity,
        unitPrice: product.price,
        totalPrice: product.price * quantity
      });
    }
    
    // Recalculate totals
    cart.totalAmount = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
    cart.itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cart.updatedAt = new Date();
    
    await cart.save();
    await cart.populate('items.productId', 'title price unit images');
    
    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/cart/:userId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId })
      .populate('items.productId', 'title price unit images sellerId');
    
    if (!cart) {
      return res.json({ success: true, cart: { items: [], totalAmount: 0, itemCount: 0 } });
    }
    
    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Order Routes
app.post('/api/orders', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    await order.populate('buyerId sellerId items.productId');
    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.get('/api/orders/:userId', async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ buyerId: req.params.userId }, { sellerId: req.params.userId }]
    }).populate('buyerId sellerId items.productId');
    
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Seed Data Route
app.post('/api/seed', async (req, res) => {
  try {
    // Clear existing data
    await Farmer.deleteMany({});
    await Product.deleteMany({});
    await Cart.deleteMany({});
    await Order.deleteMany({});
    
    // Create sample farmers
    const farmers = await Farmer.insertMany([
      {
        name: 'Rajesh Kumar',
        email: 'rajesh@example.com',
        mobile: '9876543210',
        location: { state: 'Punjab', district: 'Ludhiana', pincode: '141001', village: 'Village A' },
        products: ['wheat', 'rice']
      },
      {
        name: 'Priya Sharma',
        email: 'priya@example.com',
        mobile: '9876543211',
        location: { state: 'Haryana', district: 'Karnal', pincode: '132001', village: 'Village B' },
        products: ['rice', 'vegetables']
      },
      {
        name: 'Amit Singh',
        email: 'amit@example.com',
        mobile: '9876543212',
        location: { state: 'Uttar Pradesh', district: 'Meerut', pincode: '250001', village: 'Village C' },
        products: ['tomatoes', 'onions']
      }
    ]);
    
    // Create sample products
    const products = await Product.insertMany([
      {
        title: 'Fresh Organic Wheat',
        description: 'Premium quality organic wheat grown without pesticides',
        price: 2500,
        unit: 'quintal',
        quantity: 10,
        category: 'crops',
        images: ['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=200&fit=crop'],
        sellerId: farmers[0]._id,
        location: { state: 'Punjab', district: 'Ludhiana' },
        rating: 4.5,
        totalRatings: 23,
        negotiable: true,
        minimumOrder: 1
      },
      {
        title: 'Premium Rice',
        description: 'High-quality basmati rice with excellent aroma',
        price: 3000,
        unit: 'quintal',
        quantity: 5,
        category: 'crops',
        images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop'],
        sellerId: farmers[1]._id,
        location: { state: 'Haryana', district: 'Karnal' },
        rating: 4.8,
        totalRatings: 15,
        negotiable: false,
        minimumOrder: 1
      },
      {
        title: 'Fresh Tomatoes',
        description: 'Fresh, juicy tomatoes perfect for cooking',
        price: 150,
        unit: 'kg',
        quantity: 50,
        category: 'crops',
        images: ['https://images.unsplash.com/photo-1546470427-5c4b1b4b8b8b?w=300&h=200&fit=crop'],
        sellerId: farmers[2]._id,
        location: { state: 'Uttar Pradesh', district: 'Meerut' },
        rating: 4.2,
        totalRatings: 8,
        negotiable: true,
        minimumOrder: 5
      }
    ]);
    
    res.json({ 
      success: true, 
      message: 'Seed data created successfully',
      farmers: farmers.length,
      products: products.length
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 API Test Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🌱 Seed data: POST http://localhost:${PORT}/api/seed`);
});

module.exports = app;
