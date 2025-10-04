#!/usr/bin/env node

/**
 * 🧪 Comprehensive End-to-End Testing Script for Animall Marketplace
 * 
 * This script tests all functionality including:
 * - Authentication & User Management
 * - Product Listing & Management
 * - Shopping Cart & Checkout
 * - Order Management
 * - Payment Processing
 * - Messaging System
 * - Notifications
 * - Admin Panel
 * - Rating & Feedback
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  BACKEND_URL: 'http://localhost:3001',
  FRONTEND_URL: 'http://localhost:3000',
  MOBILE_URL: 'http://localhost:8081',
  TEST_TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3
};

// Test Results Storage
const testResults = {
  passed: 0,
  failed: 0,
  skipped: 0,
  tests: []
};

// Utility Functions
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const log = (message, type = 'info') => {
  const timestamp = new Date().toISOString();
  const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️';
  console.log(`${prefix} [${timestamp}] ${message}`);
};

const test = async (name, testFunction) => {
  log(`Testing: ${name}`, 'info');
  try {
    await testFunction();
    testResults.passed++;
    testResults.tests.push({ name, status: 'PASSED', error: null });
    log(`✅ PASSED: ${name}`, 'success');
  } catch (error) {
    testResults.failed++;
    testResults.tests.push({ name, status: 'FAILED', error: error.message });
    log(`❌ FAILED: ${name} - ${error.message}`, 'error');
  }
};

const skip = (name, reason) => {
  testResults.skipped++;
  testResults.tests.push({ name, status: 'SKIPPED', error: reason });
  log(`⏭️ SKIPPED: ${name} - ${reason}`, 'warning');
};

// API Helper Functions
const api = {
  get: async (endpoint, headers = {}) => {
    const response = await axios.get(`${CONFIG.BACKEND_URL}${endpoint}`, { headers, timeout: CONFIG.TEST_TIMEOUT });
    return response.data;
  },
  
  post: async (endpoint, data, headers = {}) => {
    const response = await axios.post(`${CONFIG.BACKEND_URL}${endpoint}`, data, { headers, timeout: CONFIG.TEST_TIMEOUT });
    return response.data;
  },
  
  put: async (endpoint, data, headers = {}) => {
    const response = await axios.put(`${CONFIG.BACKEND_URL}${endpoint}`, data, { headers, timeout: CONFIG.TEST_TIMEOUT });
    return response.data;
  },
  
  patch: async (endpoint, data, headers = {}) => {
    const response = await axios.patch(`${CONFIG.BACKEND_URL}${endpoint}`, data, { headers, timeout: CONFIG.TEST_TIMEOUT });
    return response.data;
  },
  
  delete: async (endpoint, headers = {}) => {
    const response = await axios.delete(`${CONFIG.BACKEND_URL}${endpoint}`, { headers, timeout: CONFIG.TEST_TIMEOUT });
    return response.data;
  }
};

// Test Data
const testData = {
  farmer: {
    name: 'Test Farmer',
    email: 'farmer@test.com',
    mobile: '+919876543210',
    password: 'testpass123',
    role: 'farmer',
    farmDetails: {
      farmName: 'Test Farm',
      farmSize: '10 acres',
      farmingExperience: 5,
      cropsGrown: ['wheat', 'rice'],
      livestockOwned: ['cattle', 'goats']
    },
    location: {
      state: 'Punjab',
      district: 'Ludhiana',
      pincode: '141001',
      village: 'Test Village',
      farmAddress: 'Test Farm Address'
    },
    paymentPreferences: {
      preferredMethods: ['upi', 'bank_transfer'],
      upiId: 'testfarmer@upi'
    }
  },
  
  buyer: {
    name: 'Test Buyer',
    email: 'buyer@test.com',
    mobile: '+919876543211',
    password: 'testpass123',
    role: 'buyer'
  },
  
  admin: {
    name: 'Test Admin',
    email: 'admin@test.com',
    mobile: '+919876543212',
    password: 'testpass123',
    role: 'admin'
  },
  
  listing: {
    title: 'Premium Wheat - Organic',
    category: 'crops',
    subcategory: 'wheat',
    price: 2500,
    unit: 'quintal',
    quantity: 100,
    minimumOrder: 5,
    description: 'High quality organic wheat from our farm',
    quality: {
      grade: 'premium',
      organic: true,
      certified: true
    },
    harvestDate: new Date(),
    shelfLife: 365,
    storageConditions: 'Cool and dry place'
  }
};

// Global variables for test data
let authTokens = {};
let createdUsers = {};
let createdListings = {};
let createdOrders = {};
let createdCarts = {};

// ========================================
// 1. AUTHENTICATION & USER MANAGEMENT TESTS
// ========================================

const testAuthentication = async () => {
  log('🔐 Starting Authentication Tests...', 'info');
  
  // Test 1: User Registration
  await test('User Registration - Farmer', async () => {
    const response = await api.post('/api/auth/register', testData.farmer);
    if (!response.success) throw new Error('Registration failed');
    createdUsers.farmer = response.user;
    log(`Created farmer user: ${response.user._id}`);
  });
  
  await test('User Registration - Buyer', async () => {
    const response = await api.post('/api/auth/register', testData.buyer);
    if (!response.success) throw new Error('Registration failed');
    createdUsers.buyer = response.user;
    log(`Created buyer user: ${response.user._id}`);
  });
  
  await test('User Registration - Admin', async () => {
    const response = await api.post('/api/auth/register', testData.admin);
    if (!response.success) throw new Error('Registration failed');
    createdUsers.admin = response.user;
    log(`Created admin user: ${response.user._id}`);
  });
  
  // Test 2: User Login
  await test('User Login - Farmer', async () => {
    const response = await api.post('/api/auth/login', {
      email: testData.farmer.email,
      password: testData.farmer.password
    });
    if (!response.success) throw new Error('Login failed');
    authTokens.farmer = response.token;
    log(`Farmer logged in successfully`);
  });
  
  await test('User Login - Buyer', async () => {
    const response = await api.post('/api/auth/login', {
      email: testData.buyer.email,
      password: testData.buyer.password
    });
    if (!response.success) throw new Error('Login failed');
    authTokens.buyer = response.token;
    log(`Buyer logged in successfully`);
  });
  
  await test('User Login - Admin', async () => {
    const response = await api.post('/api/auth/login', {
      email: testData.admin.email,
      password: testData.admin.password
    });
    if (!response.success) throw new Error('Login failed');
    authTokens.admin = response.token;
    log(`Admin logged in successfully`);
  });
  
  // Test 3: OTP Authentication
  await test('OTP Send', async () => {
    const response = await api.post('/api/auth/otp/send', {
      mobile: testData.farmer.mobile
    });
    if (!response.success) throw new Error('OTP send failed');
    log(`OTP sent to ${testData.farmer.mobile}`);
  });
  
  // Test 4: Profile Management
  await test('Get User Profile', async () => {
    const headers = { Authorization: `Bearer ${authTokens.farmer}` };
    const response = await api.get('/api/user/profile', headers);
    if (!response.success) throw new Error('Get profile failed');
    log(`Retrieved farmer profile: ${response.user.name}`);
  });
  
  await test('Update User Profile', async () => {
    const headers = { Authorization: `Bearer ${authTokens.farmer}` };
    const updateData = {
      farmDetails: {
        ...testData.farmer.farmDetails,
        farmingExperience: 6
      }
    };
    const response = await api.put('/api/user/profile', updateData, headers);
    if (!response.success) throw new Error('Update profile failed');
    log(`Updated farmer profile successfully`);
  });
};

// ========================================
// 2. PRODUCT LISTING & MANAGEMENT TESTS
// ========================================

const testProductListing = async () => {
  log('📦 Starting Product Listing Tests...', 'info');
  
  // Test 1: Create Product Listing
  await test('Create Product Listing', async () => {
    const headers = { Authorization: `Bearer ${authTokens.farmer}` };
    const listingData = {
      ...testData.listing,
      sellerId: createdUsers.farmer._id
    };
    const response = await api.post('/api/listings', listingData, headers);
    if (!response.success) throw new Error('Create listing failed');
    createdListings.wheat = response.listing;
    log(`Created listing: ${response.listing._id}`);
  });
  
  // Test 2: Get All Listings
  await test('Get All Listings', async () => {
    const response = await api.get('/api/listings');
    if (!response.success) throw new Error('Get listings failed');
    if (response.listings.length === 0) throw new Error('No listings found');
    log(`Retrieved ${response.listings.length} listings`);
  });
  
  // Test 3: Get Single Listing
  await test('Get Single Listing', async () => {
    const response = await api.get(`/api/listings/${createdListings.wheat._id}`);
    if (!response.success) throw new Error('Get single listing failed');
    log(`Retrieved listing: ${response.listing.title}`);
  });
  
  // Test 4: Update Listing
  await test('Update Listing', async () => {
    const headers = { Authorization: `Bearer ${authTokens.farmer}` };
    const updateData = { price: 2600 };
    const response = await api.put(`/api/listings/${createdListings.wheat._id}`, updateData, headers);
    if (!response.success) throw new Error('Update listing failed');
    log(`Updated listing price to ${updateData.price}`);
  });
  
  // Test 5: Search and Filter Listings
  await test('Search Listings by Category', async () => {
    const response = await api.get('/api/listings?category=crops');
    if (!response.success) throw new Error('Search by category failed');
    log(`Found ${response.listings.length} crop listings`);
  });
  
  await test('Search Listings by Price Range', async () => {
    const response = await api.get('/api/listings?priceMin=2000&priceMax=3000');
    if (!response.success) throw new Error('Search by price range failed');
    log(`Found ${response.listings.length} listings in price range`);
  });
};

// ========================================
// 3. SHOPPING CART & CHECKOUT TESTS
// ========================================

const testShoppingCart = async () => {
  log('🛒 Starting Shopping Cart Tests...', 'info');
  
  // Test 1: Add Item to Cart
  await test('Add Item to Cart', async () => {
    const headers = { Authorization: `Bearer ${authTokens.buyer}` };
    const cartData = {
      listingId: createdListings.wheat._id,
      quantity: 10
    };
    const response = await api.post('/api/cart/add', cartData, headers);
    if (!response.success) throw new Error('Add to cart failed');
    createdCarts.buyer = response.cart;
    log(`Added item to cart: ${cartData.quantity} units`);
  });
  
  // Test 2: Get Cart Items
  await test('Get Cart Items', async () => {
    const headers = { Authorization: `Bearer ${authTokens.buyer}` };
    const response = await api.get('/api/cart/items', headers);
    if (!response.success) throw new Error('Get cart items failed');
    if (response.items.length === 0) throw new Error('Cart is empty');
    log(`Cart contains ${response.items.length} items`);
  });
  
  // Test 3: Update Cart Item Quantity
  await test('Update Cart Item Quantity', async () => {
    const headers = { Authorization: `Bearer ${authTokens.buyer}` };
    const updateData = {
      listingId: createdListings.wheat._id,
      quantity: 15
    };
    const response = await api.post('/api/cart/update', updateData, headers);
    if (!response.success) throw new Error('Update cart item failed');
    log(`Updated cart item quantity to ${updateData.quantity}`);
  });
  
  // Test 4: Create Checkout Order
  await test('Create Checkout Order', async () => {
    const headers = { Authorization: `Bearer ${authTokens.buyer}` };
    const checkoutData = {
      shippingAddress: {
        fullName: 'Test Buyer',
        mobile: testData.buyer.mobile,
        address: '123 Test Street',
        city: 'Test City',
        state: 'Test State',
        pincode: '123456',
        landmark: 'Near Test Landmark'
      },
      paymentMethod: 'cash_on_delivery',
      orderItems: [{
        listingId: createdListings.wheat._id,
        quantity: 15,
        unitPrice: 2600,
        totalPrice: 39000
      }]
    };
    const response = await api.post('/api/checkout/place-order', checkoutData, headers);
    if (!response.success) throw new Error('Place order failed');
    createdOrders.buyer = response.orders[0];
    log(`Created order: ${response.orders[0]._id}`);
  });
  
  // Test 5: Clear Cart
  await test('Clear Cart', async () => {
    const headers = { Authorization: `Bearer ${authTokens.buyer}` };
    const response = await api.put('/api/cart/clear', {}, headers);
    if (!response.success) throw new Error('Clear cart failed');
    log(`Cart cleared successfully`);
  });
};

// ========================================
// 4. ORDER MANAGEMENT TESTS
// ========================================

const testOrderManagement = async () => {
  log('📋 Starting Order Management Tests...', 'info');
  
  // Test 1: Get Orders (Buyer)
  await test('Get Orders - Buyer', async () => {
    const headers = { Authorization: `Bearer ${authTokens.buyer}` };
    const response = await api.get('/api/orders', headers);
    if (!response.success) throw new Error('Get orders failed');
    if (response.data.length === 0) throw new Error('No orders found');
    log(`Buyer has ${response.data.length} orders`);
  });
  
  // Test 2: Get Orders (Seller)
  await test('Get Orders - Seller', async () => {
    const headers = { Authorization: `Bearer ${authTokens.farmer}` };
    const response = await api.get('/api/orders', headers);
    if (!response.success) throw new Error('Get seller orders failed');
    log(`Seller has ${response.data.length} orders`);
  });
  
  // Test 3: Update Order Status
  await test('Update Order Status - Confirm', async () => {
    const headers = { Authorization: `Bearer ${authTokens.farmer}` };
    const updateData = {
      status: 'confirmed',
      reason: 'Order confirmed by farmer'
    };
    const response = await api.patch(`/api/orders/${createdOrders.buyer._id}/status`, updateData, headers);
    if (!response.success) throw new Error('Update order status failed');
    log(`Order status updated to: ${updateData.status}`);
  });
  
  // Test 4: Update Order Tracking
  await test('Update Order Tracking', async () => {
    const headers = { Authorization: `Bearer ${authTokens.farmer}` };
    const trackingData = {
      trackingNumber: 'TRK123456789',
      carrier: 'Test Logistics',
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    };
    const response = await api.patch(`/api/orders/${createdOrders.buyer._id}/tracking`, trackingData, headers);
    if (!response.success) throw new Error('Update tracking failed');
    log(`Tracking updated: ${trackingData.trackingNumber}`);
  });
  
  // Test 5: Get Order Status Summary
  await test('Get Order Status Summary', async () => {
    const headers = { Authorization: `Bearer ${authTokens.buyer}` };
    const response = await api.get('/api/orders/status', headers);
    if (!response.success) throw new Error('Get order status summary failed');
    log(`Order status summary retrieved`);
  });
  
  // Test 6: Get Order Tracking
  await test('Get Order Tracking', async () => {
    const headers = { Authorization: `Bearer ${authTokens.buyer}` };
    const response = await api.get(`/api/orders/tracking?orderId=${createdOrders.buyer._id}`, headers);
    if (!response.success) throw new Error('Get order tracking failed');
    log(`Order tracking retrieved: ${response.data.trackingInfo.trackingNumber}`);
  });
};

// ========================================
// 5. PAYMENT PROCESSING TESTS
// ========================================

const testPaymentProcessing = async () => {
  log('💳 Starting Payment Processing Tests...', 'info');
  
  // Test 1: Create Payment Order (Razorpay)
  await test('Create Razorpay Payment Order', async () => {
    const headers = { Authorization: `Bearer ${authTokens.buyer}` };
    const paymentData = {
      amount: 39000,
      currency: 'INR',
      orderId: createdOrders.buyer._id
    };
    const response = await api.post('/api/payments/create-order', paymentData, headers);
    if (!response.success) throw new Error('Create payment order failed');
    log(`Payment order created: ${response.razorpayOrderId}`);
  });
  
  // Test 2: Verify Payment
  await test('Verify Payment', async () => {
    const headers = { Authorization: `Bearer ${authTokens.buyer}` };
    const verifyData = {
      razorpayOrderId: 'order_test123',
      razorpayPaymentId: 'pay_test123',
      razorpaySignature: 'test_signature',
      orderIds: [createdOrders.buyer._id]
    };
    const response = await api.post('/api/checkout/verify-payment', verifyData, headers);
    if (!response.success) throw new Error('Verify payment failed');
    log(`Payment verified successfully`);
  });
};

// ========================================
// 6. MESSAGING SYSTEM TESTS
// ========================================

const testMessagingSystem = async () => {
  log('💬 Starting Messaging System Tests...', 'info');
  
  // Test 1: Send Message
  await test('Send Message', async () => {
    const headers = { Authorization: `Bearer ${authTokens.buyer}` };
    const messageData = {
      receiverId: createdUsers.farmer._id,
      message: 'Hello, I am interested in your wheat listing.',
      type: 'text'
    };
    const response = await api.post('/api/messages', messageData, headers);
    if (!response.success) throw new Error('Send message failed');
    log(`Message sent successfully`);
  });
  
  // Test 2: Get Messages
  await test('Get Messages', async () => {
    const headers = { Authorization: `Bearer ${authTokens.buyer}` };
    const response = await api.get('/api/messages', headers);
    if (!response.success) throw new Error('Get messages failed');
    log(`Retrieved ${response.messages.length} messages`);
  });
};

// ========================================
// 7. NOTIFICATION SYSTEM TESTS
// ========================================

const testNotificationSystem = async () => {
  log('🔔 Starting Notification System Tests...', 'info');
  
  // Test 1: Get Notifications
  await test('Get Notifications', async () => {
    const headers = { Authorization: `Bearer ${authTokens.buyer}` };
    const response = await api.get('/api/notifications', headers);
    if (!response.success) throw new Error('Get notifications failed');
    log(`Retrieved ${response.notifications.length} notifications`);
  });
  
  // Test 2: Get Unread Count
  await test('Get Unread Notifications Count', async () => {
    const headers = { Authorization: `Bearer ${authTokens.buyer}` };
    const response = await api.get('/api/notifications/unread', headers);
    if (!response.success) throw new Error('Get unread count failed');
    log(`Unread notifications: ${response.unreadCount}`);
  });
  
  // Test 3: Mark Notification as Read
  await test('Mark Notification as Read', async () => {
    const headers = { Authorization: `Bearer ${authTokens.buyer}` };
    const response = await api.get('/api/notifications/mark-read?notificationId=test123', headers);
    if (!response.success) throw new Error('Mark as read failed');
    log(`Notification marked as read`);
  });
  
  // Test 4: Send Notification (Admin)
  await test('Send Notification - Admin', async () => {
    const headers = { Authorization: `Bearer ${authTokens.admin}` };
    const notificationData = {
      targetUsers: [createdUsers.buyer._id],
      type: 'system',
      title: 'Test Notification',
      message: 'This is a test notification from admin',
      channels: ['email', 'sms']
    };
    const response = await api.post('/api/admin/notifications', notificationData, headers);
    if (!response.success) throw new Error('Send notification failed');
    log(`Notification sent successfully`);
  });
};

// ========================================
// 8. ADMIN PANEL TESTS
// ========================================

const testAdminPanel = async () => {
  log('👨‍💼 Starting Admin Panel Tests...', 'info');
  
  // Test 1: Get Dashboard Stats
  await test('Get Dashboard Statistics', async () => {
    const headers = { Authorization: `Bearer ${authTokens.admin}` };
    const response = await api.get('/api/admin/dashboard', headers);
    if (!response.success) throw new Error('Get dashboard stats failed');
    log(`Dashboard stats retrieved: ${response.data.overview.totalUsers} users`);
  });
  
  // Test 2: Get Users
  await test('Get Users - Admin', async () => {
    const headers = { Authorization: `Bearer ${authTokens.admin}` };
    const response = await api.get('/api/admin/users', headers);
    if (!response.success) throw new Error('Get users failed');
    log(`Retrieved ${response.data.length} users`);
  });
  
  // Test 3: Get Listings
  await test('Get Listings - Admin', async () => {
    const headers = { Authorization: `Bearer ${authTokens.admin}` };
    const response = await api.get('/api/admin/listings', headers);
    if (!response.success) throw new Error('Get listings failed');
    log(`Retrieved ${response.data.length} listings`);
  });
  
  // Test 4: Get Orders
  await test('Get Orders - Admin', async () => {
    const headers = { Authorization: `Bearer ${authTokens.admin}` };
    const response = await api.get('/api/admin/orders', headers);
    if (!response.success) throw new Error('Get orders failed');
    log(`Retrieved ${response.data.length} orders`);
  });
  
  // Test 5: Get Categories
  await test('Get Categories', async () => {
    const headers = { Authorization: `Bearer ${authTokens.admin}` };
    const response = await api.get('/api/admin/categories', headers);
    if (!response.success) throw new Error('Get categories failed');
    log(`Retrieved ${response.data.length} categories`);
  });
  
  // Test 6: Create Category
  await test('Create Category', async () => {
    const headers = { Authorization: `Bearer ${authTokens.admin}` };
    const categoryData = {
      name: 'Test Category',
      subcategories: ['sub1', 'sub2']
    };
    const response = await api.post('/api/admin/categories', categoryData, headers);
    if (!response.success) throw new Error('Create category failed');
    log(`Category created: ${response.data.name}`);
  });
  
  // Test 7: Update User
  await test('Update User - Admin', async () => {
    const headers = { Authorization: `Bearer ${authTokens.admin}` };
    const updateData = {
      role: 'farmer',
      kyc: { verified: true }
    };
    const response = await api.patch(`/api/admin/users/${createdUsers.buyer._id}`, updateData, headers);
    if (!response.success) throw new Error('Update user failed');
    log(`User updated successfully`);
  });
  
  // Test 8: Moderate Listing
  await test('Moderate Listing', async () => {
    const headers = { Authorization: `Bearer ${authTokens.admin}` };
    const moderateData = {
      action: 'approve',
      reason: 'Listing approved by admin'
    };
    const response = await api.patch(`/api/admin/listings/${createdListings.wheat._id}`, moderateData, headers);
    if (!response.success) throw new Error('Moderate listing failed');
    log(`Listing moderated successfully`);
  });
  
  // Test 9: Get Reports
  await test('Get Reports', async () => {
    const headers = { Authorization: `Bearer ${authTokens.admin}` };
    const response = await api.get('/api/admin/reports', headers);
    if (!response.success) throw new Error('Get reports failed');
    log(`Reports retrieved successfully`);
  });
};

// ========================================
// 9. RATING & FEEDBACK TESTS
// ========================================

const testRatingFeedback = async () => {
  log('⭐ Starting Rating & Feedback Tests...', 'info');
  
  // Test 1: Create Review
  await test('Create Review', async () => {
    const headers = { Authorization: `Bearer ${authTokens.buyer}` };
    const reviewData = {
      toUser: createdUsers.farmer._id,
      orderId: createdOrders.buyer._id,
      rating: 5,
      comment: 'Excellent quality wheat, fast delivery!'
    };
    const response = await api.post('/api/reviews', reviewData, headers);
    if (!response.success) throw new Error('Create review failed');
    log(`Review created with rating: ${reviewData.rating}`);
  });
  
  // Test 2: Get Reviews
  await test('Get Reviews', async () => {
    const response = await api.get(`/api/reviews?userId=${createdUsers.farmer._id}`);
    if (!response.success) throw new Error('Get reviews failed');
    log(`Retrieved ${response.reviews.length} reviews`);
  });
};

// ========================================
// 10. FRONTEND INTEGRATION TESTS
// ========================================

const testFrontendIntegration = async () => {
  log('🌐 Starting Frontend Integration Tests...', 'info');
  
  // Test 1: Check Frontend Server
  await test('Frontend Server Status', async () => {
    const response = await axios.get(`${CONFIG.FRONTEND_URL}`, { timeout: 5000 });
    if (response.status !== 200) throw new Error('Frontend server not responding');
    log(`Frontend server responding on ${CONFIG.FRONTEND_URL}`);
  });
  
  // Test 2: Check Marketplace Page
  await test('Marketplace Page Load', async () => {
    const response = await axios.get(`${CONFIG.FRONTEND_URL}/marketplace`, { timeout: 5000 });
    if (response.status !== 200) throw new Error('Marketplace page not loading');
    log(`Marketplace page loaded successfully`);
  });
  
  // Test 3: Check Login Page
  await test('Login Page Load', async () => {
    const response = await axios.get(`${CONFIG.FRONTEND_URL}/login`, { timeout: 5000 });
    if (response.status !== 200) throw new Error('Login page not loading');
    log(`Login page loaded successfully`);
  });
  
  // Test 4: Check Register Page
  await test('Register Page Load', async () => {
    const response = await axios.get(`${CONFIG.FRONTEND_URL}/register`, { timeout: 5000 });
    if (response.status !== 200) throw new Error('Register page not loading');
    log(`Register page loaded successfully`);
  });
};

// ========================================
// MAIN TEST EXECUTION
// ========================================

const runAllTests = async () => {
  log('🚀 Starting Comprehensive End-to-End Testing...', 'info');
  log(`Backend URL: ${CONFIG.BACKEND_URL}`, 'info');
  log(`Frontend URL: ${CONFIG.FRONTEND_URL}`, 'info');
  
  try {
    // Wait for servers to be ready
    log('⏳ Waiting for servers to be ready...', 'info');
    await delay(5000);
    
    // Run all test suites
    await testAuthentication();
    await testProductListing();
    await testShoppingCart();
    await testOrderManagement();
    await testPaymentProcessing();
    await testMessagingSystem();
    await testNotificationSystem();
    await testAdminPanel();
    await testRatingFeedback();
    await testFrontendIntegration();
    
    // Generate test report
    generateTestReport();
    
  } catch (error) {
    log(`❌ Test execution failed: ${error.message}`, 'error');
    process.exit(1);
  }
};

// ========================================
// TEST REPORT GENERATION
// ========================================

const generateTestReport = () => {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total: testResults.passed + testResults.failed + testResults.skipped,
      passed: testResults.passed,
      failed: testResults.failed,
      skipped: testResults.skipped,
      successRate: ((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(2)
    },
    tests: testResults.tests,
    configuration: CONFIG
  };
  
  // Save report to file
  const reportPath = path.join(__dirname, 'test-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  // Display summary
  log('📊 TEST EXECUTION COMPLETE', 'info');
  log(`Total Tests: ${report.summary.total}`, 'info');
  log(`✅ Passed: ${report.summary.passed}`, 'success');
  log(`❌ Failed: ${report.summary.failed}`, 'error');
  log(`⏭️ Skipped: ${report.summary.skipped}`, 'warning');
  log(`📈 Success Rate: ${report.summary.successRate}%`, 'info');
  log(`📄 Report saved to: ${reportPath}`, 'info');
  
  if (testResults.failed > 0) {
    log('❌ Some tests failed. Check the report for details.', 'error');
    process.exit(1);
  } else {
    log('🎉 All tests passed successfully!', 'success');
    process.exit(0);
  }
};

// ========================================
// ERROR HANDLING
// ========================================

process.on('unhandledRejection', (reason, promise) => {
  log(`Unhandled Rejection at: ${promise}, reason: ${reason}`, 'error');
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  log(`Uncaught Exception: ${error.message}`, 'error');
  process.exit(1);
});

// ========================================
// START TESTING
// ========================================

if (require.main === module) {
  runAllTests();
}

module.exports = {
  runAllTests,
  testAuthentication,
  testProductListing,
  testShoppingCart,
  testOrderManagement,
  testPaymentProcessing,
  testMessagingSystem,
  testNotificationSystem,
  testAdminPanel,
  testRatingFeedback,
  testFrontendIntegration
};
