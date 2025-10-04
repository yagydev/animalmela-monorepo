#!/usr/bin/env node

/**
 * 🧪 Simple Test Server for Frontend Testing
 * 
 * This creates a minimal test server without database dependency
 */

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8002;

// Middleware
app.use(cors());
app.use(express.json());

// Mock data
const mockUsers = [
  { id: 1, name: 'Test Farmer', email: 'farmer@test.com', role: 'farmer' },
  { id: 2, name: 'Test Buyer', email: 'buyer@test.com', role: 'buyer' }
];

const mockListings = [
  {
    id: 1,
    title: 'Premium Wheat - Organic',
    description: 'High quality organic wheat from our farm',
    category: 'crops',
    price: 2500,
    quantity: 100,
    seller: { name: 'Test Farmer', email: 'farmer@test.com' }
  },
  {
    id: 2,
    title: 'Fresh Tomatoes',
    description: 'Fresh red tomatoes from greenhouse',
    category: 'vegetables',
    price: 50,
    quantity: 500,
    seller: { name: 'Test Farmer', email: 'farmer@test.com' }
  }
];

const mockOrders = [
  {
    id: 1,
    buyerId: 2,
    sellerId: 1,
    listingId: 1,
    quantity: 10,
    totalAmount: 25000,
    status: 'pending'
  }
];

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: 'mock'
  });
});

// Auth endpoints
app.post('/api/auth/register', (req, res) => {
  const { name, email, mobile, password, role } = req.body;
  
  // Check if user already exists
  const existingUser = mockUsers.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'User already exists' });
  }
  
  // Create new user
  const newUser = {
    id: mockUsers.length + 1,
    name,
    email,
    mobile,
    role: role || 'buyer'
  };
  
  mockUsers.push(newUser);
  
  res.json({ success: true, user: newUser });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Find user
  const user = mockUsers.find(u => u.email === email);
  if (!user) {
    return res.status(400).json({ success: false, message: 'Invalid credentials' });
  }
  
  // Generate mock token
  const token = `mock-token-${user.id}-${Date.now()}`;
  
  res.json({ 
    success: true, 
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role }
  });
});

// Listings endpoints
app.get('/api/listings', (req, res) => {
  res.json({ success: true, listings: mockListings });
});

app.post('/api/listings', (req, res) => {
  const { title, description, category, price, quantity, sellerId } = req.body;
  
  const newListing = {
    id: mockListings.length + 1,
    title,
    description,
    category,
    price,
    quantity,
    sellerId,
    seller: mockUsers.find(u => u.id === sellerId),
    status: 'active',
    createdAt: new Date().toISOString()
  };
  
  mockListings.push(newListing);
  
  res.json({ success: true, listing: newListing });
});

// Orders endpoints
app.get('/api/orders', (req, res) => {
  res.json({ success: true, data: mockOrders });
});

app.post('/api/orders', (req, res) => {
  const { buyerId, sellerId, listingId, quantity, totalAmount } = req.body;
  
  const newOrder = {
    id: mockOrders.length + 1,
    buyerId,
    sellerId,
    listingId,
    quantity,
    totalAmount,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  mockOrders.push(newOrder);
  
  res.json({ success: true, order: newOrder });
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

// ========================================
// FARMERS MARKET API ENDPOINTS
// ========================================

// Send OTP
app.post('/api/farmers-market/send-otp', (req, res) => {
  const { mobile, type } = req.body;
  console.log(`OTP sent to ${mobile}: 123456`);
  res.json({
    success: true,
    message: 'OTP sent successfully',
    otp: '123456' // Only for testing
  });
});

// Register User
app.post('/api/farmers-market/register', (req, res) => {
  const { name, email, mobile, password, role, otp } = req.body;
  
  // Check if user already exists
  const existingUser = mockUsers.find(user => user.email === email || user.mobile === mobile);
  if (existingUser) {
    return res.status(400).json({ 
      success: false, 
      message: 'User already exists with this email or mobile' 
    });
  }
  
  // Validate OTP
  if (otp !== '123456') {
    return res.status(400).json({ success: false, message: 'Invalid OTP' });
  }
  
  // Create new user
  const newUser = {
    id: mockUsers.length + 1,
    name,
    email,
    mobile,
    role: role || 'buyer',
    isVerified: true,
    createdAt: new Date().toISOString()
  };
  
  mockUsers.push(newUser);
  
  // Generate mock token
  const token = `mock-token-${newUser.id}-${Date.now()}`;
  
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    user: {
      _id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      mobile: newUser.mobile,
      role: newUser.role
    },
    token
  });
});

// Login User
app.post('/api/farmers-market/login', (req, res) => {
  const { email, password } = req.body;
  
  // Find user
  const user = mockUsers.find(u => u.email === email);
  if (!user) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid credentials' 
    });
  }
  
  // Generate mock token
  const token = `mock-token-${user.id}-${Date.now()}`;
  
  res.json({
    success: true,
    message: 'Login successful',
    user: {
      _id: user.id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      profileComplete: true
    },
    token
  });
});

// Update Profile
app.post('/api/farmers-market/profile', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }
  
  const updateData = req.body;
  
  res.json({
    success: true,
    message: 'Profile updated successfully',
    user: {
      _id: 1,
      name: 'Test User',
      email: 'test@test.com',
      mobile: '+919876543210',
      role: 'farmer',
      location: updateData.location,
      paymentPreferences: updateData.paymentPreferences,
      profileComplete: true
    }
  });
});

// Create Listing
app.post('/api/farmers-market/listings', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }
  
  const listingData = req.body;
  
  const newListing = {
    id: mockListings.length + 1,
    ...listingData,
    sellerId: 1,
    status: 'active',
    createdAt: new Date().toISOString()
  };
  
  mockListings.push(newListing);
  
  res.status(201).json({
    success: true,
    message: 'Product listed successfully',
    listing: newListing
  });
});

// Update Listing
app.put('/api/farmers-market/listings', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }
  
  const { id } = req.query;
  const updateData = req.body;
  
  const listingIndex = mockListings.findIndex(l => l.id == id);
  if (listingIndex === -1) {
    return res.status(404).json({ success: false, message: 'Listing not found' });
  }
  
  mockListings[listingIndex] = { ...mockListings[listingIndex], ...updateData };
  
  res.json({
    success: true,
    message: 'Listing updated successfully',
    listing: mockListings[listingIndex]
  });
});

// Delete Listing
app.delete('/api/farmers-market/listings', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }
  
  const { id } = req.query;
  
  const listingIndex = mockListings.findIndex(l => l.id == id);
  if (listingIndex === -1) {
    return res.status(404).json({ success: false, message: 'Listing not found' });
  }
  
  mockListings.splice(listingIndex, 1);
  
  res.json({
    success: true,
    message: 'Listing deleted successfully'
  });
});

// Get Marketplace Listings
app.get('/api/farmers-market/marketplace', (req, res) => {
  const { category, minPrice, maxPrice, sortBy, page = 1, limit = 20 } = req.query;
  
  let filteredListings = [...mockListings];
  
  // Apply filters
  if (category) {
    filteredListings = filteredListings.filter(l => l.category === category);
  }
  
  if (minPrice) {
    filteredListings = filteredListings.filter(l => l.price >= Number(minPrice));
  }
  
  if (maxPrice) {
    filteredListings = filteredListings.filter(l => l.price <= Number(maxPrice));
  }
  
  // Apply sorting
  if (sortBy === 'price_low') {
    filteredListings.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price_high') {
    filteredListings.sort((a, b) => b.price - a.price);
  }
  
  // Apply pagination
  const skip = (Number(page) - 1) * Number(limit);
  const paginatedListings = filteredListings.slice(skip, skip + Number(limit));
  
  res.json({
    success: true,
    listings: paginatedListings,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total: filteredListings.length,
      pages: Math.ceil(filteredListings.length / Number(limit))
    }
  });
});

// Add to Cart
app.post('/api/farmers-market/cart', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }
  
  const { listingId, quantity } = req.body;
  
  const listing = mockListings.find(l => l.id == listingId);
  if (!listing) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  
  const cartItem = {
    listingId: listing.id,
    quantity,
    unitPrice: listing.price,
    totalPrice: quantity * listing.price,
    addedAt: new Date().toISOString()
  };
  
  res.json({
    success: true,
    message: 'Item added to cart',
    cart: {
      items: [cartItem],
      totalAmount: cartItem.totalPrice,
      itemCount: quantity
    }
  });
});

// Get Cart
app.get('/api/farmers-market/cart', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }
  
  res.json({
    success: true,
    cart: {
      items: mockListings.slice(0, 2).map(listing => ({
        listingId: listing,
        quantity: 2,
        unitPrice: listing.price,
        totalPrice: 2 * listing.price,
        addedAt: new Date().toISOString()
      })),
      totalAmount: mockListings.slice(0, 2).reduce((sum, l) => sum + (2 * l.price), 0),
      itemCount: 4
    }
  });
});

// Place Order
app.post('/api/farmers-market/orders', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }
  
  const { items, shippingAddress, paymentMethod, paymentDetails } = req.body;
  
  const newOrder = {
    id: mockOrders.length + 1,
    buyerId: 2,
    sellerId: 1,
    items,
    totalAmount: items.reduce((sum, item) => sum + item.totalPrice, 0),
    shippingAddress,
    paymentMethod,
    paymentDetails,
    status: 'pending',
    paymentStatus: 'pending',
    createdAt: new Date().toISOString()
  };
  
  mockOrders.push(newOrder);
  
  res.status(201).json({
    success: true,
    message: 'Order placed successfully',
    orders: [newOrder]
  });
});

// Send Message
app.post('/api/farmers-market/messages', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }
  
  const { receiverId, message, type } = req.body;
  
  const messageData = {
    senderId: 1,
    receiverId,
    message,
    type,
    timestamp: new Date().toISOString(),
    read: false
  };
  
  console.log('Message sent:', messageData);
  
  res.json({
    success: true,
    message: 'Message sent successfully',
    messageData
  });
});

// Submit Rating
app.post('/api/farmers-market/ratings', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }
  
  const { orderId, rating, comment, type } = req.body;
  
  const review = {
    id: 1,
    orderId,
    reviewerId: 2,
    revieweeId: 1,
    rating,
    comment,
    type,
    createdAt: new Date().toISOString()
  };
  
  res.status(201).json({
    success: true,
    message: 'Rating submitted successfully',
    review
  });
});

// Get Reviews
app.get('/api/reviews', (req, res) => {
  const { userId } = req.query;
  
  res.json({
    success: true,
    reviews: [
      {
        id: 1,
        reviewerId: 2,
        revieweeId: userId,
        rating: 5,
        comment: 'Excellent quality product!',
        createdAt: new Date().toISOString()
      }
    ]
  });
});

// Admin Dashboard
app.get('/api/farmers-market/admin', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }
  
  const stats = {
    totalUsers: mockUsers.length,
    totalListings: mockListings.length,
    totalOrders: mockOrders.length,
    pendingOrders: mockOrders.filter(o => o.status === 'pending').length,
    totalRevenue: mockOrders.reduce((sum, o) => sum + o.totalAmount, 0)
  };
  
  res.json({
    success: true,
    stats
  });
});

// Admin Users
app.get('/api/admin/users', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }
  
  res.json({
    success: true,
    users: mockUsers
  });
});

// Admin Listings
app.get('/api/admin/listings', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }
  
  res.json({
    success: true,
    listings: mockListings
  });
});

// Admin Orders
app.get('/api/admin/orders', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }
  
  res.json({
    success: true,
    orders: mockOrders
  });
});

// Admin Categories
app.get('/api/admin/categories', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }
  
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

// Create Category
app.post('/api/admin/categories', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }
  
  const { name, subcategories } = req.body;
  
  res.json({
    success: true,
    message: 'Category created successfully',
    category: { name, subcategories }
  });
});

// Update User
app.patch('/api/admin/users/:userId', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }
  
  const { userId } = req.params;
  const updateData = req.body;
  
  res.json({
    success: true,
    message: 'User updated successfully',
    user: { id: userId, ...updateData }
  });
});

// Send Notification
app.post('/api/admin/notifications', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }
  
  const { targetUsers, type, title, message, channels } = req.body;
  
  console.log('Notification sent:', { targetUsers, type, title, message, channels });
  
  res.json({
    success: true,
    message: 'Notification sent successfully'
  });
});

// Update Order Status
app.patch('/api/orders/:orderId/status', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }
  
  const { orderId } = req.params;
  const { status, reason } = req.body;
  
  const orderIndex = mockOrders.findIndex(o => o.id == orderId);
  if (orderIndex === -1) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  
  mockOrders[orderIndex].status = status;
  mockOrders[orderIndex].reason = reason;
  
  res.json({
    success: true,
    message: 'Order status updated successfully',
    order: mockOrders[orderIndex]
  });
});

// Update Order Tracking
app.patch('/api/orders/:orderId/tracking', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }
  
  const { orderId } = req.params;
  const trackingData = req.body;
  
  const orderIndex = mockOrders.findIndex(o => o.id == orderId);
  if (orderIndex === -1) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  
  mockOrders[orderIndex].trackingInfo = trackingData;
  
  res.json({
    success: true,
    message: 'Tracking updated successfully',
    order: mockOrders[orderIndex]
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
  console.log(`🚀 Mock test server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📦 Mock data: ${mockListings.length} listings, ${mockUsers.length} users`);
});

module.exports = app;
