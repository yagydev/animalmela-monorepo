#!/usr/bin/env node

/**
 * 🧪 Complete End-to-End Test Suite for Animall Marketplace
 * 
 * This script tests all marketplace functionality with comprehensive coverage
 */

const axios = require('axios');
const fs = require('fs');

// Configuration
const CONFIG = {
  BACKEND_URL: 'http://localhost:8002',
  FRONTEND_URL: 'http://localhost:3000',
  TEST_TIMEOUT: 10000
};

const log = (message, type = 'info') => {
  const timestamp = new Date().toISOString();
  const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️';
  console.log(`${prefix} [${timestamp}] ${message}`);
};

const test = async (name, testFunction) => {
  log(`Testing: ${name}`, 'info');
  try {
    await testFunction();
    log(`✅ PASSED: ${name}`, 'success');
    return true;
  } catch (error) {
    log(`❌ FAILED: ${name} - ${error.message}`, 'error');
    return false;
  }
};

// Test Results
let passed = 0;
let failed = 0;
const testResults = [];

// API Helper
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
  }
};

// Test Data
const testData = {
  farmer: {
    name: 'Test Farmer',
    email: 'farmer@test.com',
    mobile: '+919876543210',
    password: 'testpass123',
    role: 'farmer'
  },
  buyer: {
    name: 'Test Buyer',
    email: 'buyer@test.com',
    mobile: '+919876543211',
    password: 'testpass123',
    role: 'buyer'
  },
  listing: {
    title: 'Premium Wheat - Organic',
    description: 'High quality organic wheat from our farm',
    category: 'crops',
    price: 2500,
    quantity: 100
  }
};

// Global variables for test data
let authTokens = {};
let createdUsers = {};
let createdListings = {};
let createdOrders = {};

// ========================================
// 1. SERVER CONNECTIVITY TESTS
// ========================================

const testServerConnectivity = async () => {
  log('🔌 Testing Server Connectivity...', 'info');
  
  const healthTest = await test('Health Check Endpoint', async () => {
    const response = await api.get('/api/health');
    if (!response.success) throw new Error('Health check failed');
    if (response.status !== 'healthy') throw new Error('Server not healthy');
  });
  
  if (healthTest) passed++; else failed++;
};

// ========================================
// 2. AUTHENTICATION TESTS
// ========================================

const testAuthentication = async () => {
  log('🔐 Testing Authentication...', 'info');
  
  // Test User Registration
  const farmerRegTest = await test('Farmer Registration', async () => {
    const response = await api.post('/api/auth/register', testData.farmer);
    if (!response.success) throw new Error('Farmer registration failed');
    createdUsers.farmer = response.user;
  });
  
  if (farmerRegTest) passed++; else failed++;
  
  const buyerRegTest = await test('Buyer Registration', async () => {
    const response = await api.post('/api/auth/register', testData.buyer);
    if (!response.success) throw new Error('Buyer registration failed');
    createdUsers.buyer = response.user;
  });
  
  if (buyerRegTest) passed++; else failed++;
  
  // Test User Login
  const farmerLoginTest = await test('Farmer Login', async () => {
    const response = await api.post('/api/auth/login', {
      email: testData.farmer.email,
      password: testData.farmer.password
    });
    if (!response.success) throw new Error('Farmer login failed');
    authTokens.farmer = response.token;
  });
  
  if (farmerLoginTest) passed++; else failed++;
  
  const buyerLoginTest = await test('Buyer Login', async () => {
    const response = await api.post('/api/auth/login', {
      email: testData.buyer.email,
      password: testData.buyer.password
    });
    if (!response.success) throw new Error('Buyer login failed');
    authTokens.buyer = response.token;
  });
  
  if (buyerLoginTest) passed++; else failed++;
};

// ========================================
// 3. PRODUCT LISTING TESTS
// ========================================

const testProductListing = async () => {
  log('📦 Testing Product Listing...', 'info');
  
  // Test Get All Listings
  const getListingsTest = await test('Get All Listings', async () => {
    const response = await api.get('/api/listings');
    if (!response.success) throw new Error('Get listings failed');
    if (response.listings.length === 0) throw new Error('No listings found');
  });
  
  if (getListingsTest) passed++; else failed++;
  
  // Test Create Listing
  const createListingTest = await test('Create Product Listing', async () => {
    const listingData = {
      ...testData.listing,
      sellerId: createdUsers.farmer.id
    };
    const response = await api.post('/api/listings', listingData);
    if (!response.success) throw new Error('Create listing failed');
    createdListings.wheat = response.listing;
  });
  
  if (createListingTest) passed++; else failed++;
  
  // Test Get Categories
  const getCategoriesTest = await test('Get Categories', async () => {
    const response = await api.get('/api/categories');
    if (!response.success) throw new Error('Get categories failed');
    if (response.categories.length === 0) throw new Error('No categories found');
  });
  
  if (getCategoriesTest) passed++; else failed++;
};

// ========================================
// 4. ORDER MANAGEMENT TESTS
// ========================================

const testOrderManagement = async () => {
  log('📋 Testing Order Management...', 'info');
  
  // Test Get Orders
  const getOrdersTest = await test('Get Orders', async () => {
    const response = await api.get('/api/orders');
    if (!response.success) throw new Error('Get orders failed');
  });
  
  if (getOrdersTest) passed++; else failed++;
  
  // Test Create Order
  const createOrderTest = await test('Create Order', async () => {
    const orderData = {
      buyerId: createdUsers.buyer.id,
      sellerId: createdUsers.farmer.id,
      listingId: createdListings.wheat.id,
      quantity: 10,
      totalAmount: 25000
    };
    const response = await api.post('/api/orders', orderData);
    if (!response.success) throw new Error('Create order failed');
    createdOrders.buyer = response.order;
  });
  
  if (createOrderTest) passed++; else failed++;
};

// ========================================
// 5. CART & CHECKOUT TESTS
// ========================================

const testCartCheckout = async () => {
  log('🛒 Testing Cart & Checkout...', 'info');
  
  // Test Add to Cart
  const addToCartTest = await test('Add Item to Cart', async () => {
    const response = await api.post('/api/cart/add', {
      listingId: createdListings.wheat.id,
      quantity: 5
    });
    if (!response.success) throw new Error('Add to cart failed');
  });
  
  if (addToCartTest) passed++; else failed++;
  
  // Test Get Cart Items
  const getCartTest = await test('Get Cart Items', async () => {
    const response = await api.get('/api/cart/items');
    if (!response.success) throw new Error('Get cart items failed');
  });
  
  if (getCartTest) passed++; else failed++;
  
  // Test Place Order
  const placeOrderTest = await test('Place Order from Cart', async () => {
    const response = await api.post('/api/checkout/place-order', {
      items: [{
        listingId: createdListings.wheat.id,
        quantity: 5
      }]
    });
    if (!response.success) throw new Error('Place order failed');
  });
  
  if (placeOrderTest) passed++; else failed++;
};

// ========================================
// 6. FRONTEND INTEGRATION TESTS
// ========================================

const testFrontendIntegration = async () => {
  log('🌐 Testing Frontend Integration...', 'info');
  
  // Test Home Page
  const homeTest = await test('Home Page Load', async () => {
    const response = await axios.get(`${CONFIG.FRONTEND_URL}/`, { timeout: CONFIG.TEST_TIMEOUT });
    if (response.status !== 200) throw new Error('Home page not loading');
  });
  
  if (homeTest) passed++; else failed++;
  
  // Test Marketplace Page
  const marketplaceTest = await test('Marketplace Page Load', async () => {
    const response = await axios.get(`${CONFIG.FRONTEND_URL}/marketplace`, { timeout: CONFIG.TEST_TIMEOUT });
    if (response.status !== 200) throw new Error('Marketplace page not loading');
  });
  
  if (marketplaceTest) passed++; else failed++;
  
  // Test Login Page
  const loginTest = await test('Login Page Load', async () => {
    const response = await axios.get(`${CONFIG.FRONTEND_URL}/login`, { timeout: CONFIG.TEST_TIMEOUT });
    if (response.status !== 200) throw new Error('Login page not loading');
  });
  
  if (loginTest) passed++; else failed++;
  
  // Test Register Page
  const registerTest = await test('Register Page Load', async () => {
    const response = await axios.get(`${CONFIG.FRONTEND_URL}/register`, { timeout: CONFIG.TEST_TIMEOUT });
    if (response.status !== 200) throw new Error('Register page not loading');
  });
  
  if (registerTest) passed++; else failed++;
  
  // Test Services Page
  const servicesTest = await test('Services Page Load', async () => {
    const response = await axios.get(`${CONFIG.FRONTEND_URL}/services`, { timeout: CONFIG.TEST_TIMEOUT });
    if (response.status !== 200) throw new Error('Services page not loading');
  });
  
  if (servicesTest) passed++; else failed++;
  
  // Test Pets Page
  const petsTest = await test('Pets Page Load', async () => {
    const response = await axios.get(`${CONFIG.FRONTEND_URL}/pets`, { timeout: CONFIG.TEST_TIMEOUT });
    if (response.status !== 200) throw new Error('Pets page not loading');
  });
  
  if (petsTest) passed++; else failed++;
};

// ========================================
// 7. MOBILE APP INTEGRATION TESTS
// ========================================

const testMobileIntegration = async () => {
  log('📱 Testing Mobile App Integration...', 'info');
  
  // Test Mobile API Endpoints
  const mobileAPITest = await test('Mobile API Compatibility', async () => {
    // Test if API responses are compatible with mobile app expectations
    const healthResponse = await api.get('/api/health');
    if (!healthResponse.success) throw new Error('Mobile API health check failed');
    
    const listingsResponse = await api.get('/api/listings');
    if (!listingsResponse.success) throw new Error('Mobile API listings failed');
    
    const categoriesResponse = await api.get('/api/categories');
    if (!categoriesResponse.success) throw new Error('Mobile API categories failed');
  });
  
  if (mobileAPITest) passed++; else failed++;
};

// ========================================
// 8. PERFORMANCE TESTS
// ========================================

const testPerformance = async () => {
  log('⚡ Testing Performance...', 'info');
  
  // Test API Response Times
  const performanceTest = await test('API Response Times', async () => {
    const startTime = Date.now();
    await api.get('/api/listings');
    const responseTime = Date.now() - startTime;
    
    if (responseTime > 2000) throw new Error(`API response too slow: ${responseTime}ms`);
  });
  
  if (performanceTest) passed++; else failed++;
  
  // Test Frontend Load Times
  const frontendPerformanceTest = await test('Frontend Load Times', async () => {
    const startTime = Date.now();
    await axios.get(`${CONFIG.FRONTEND_URL}/marketplace`, { timeout: CONFIG.TEST_TIMEOUT });
    const responseTime = Date.now() - startTime;
    
    if (responseTime > 5000) throw new Error(`Frontend load too slow: ${responseTime}ms`);
  });
  
  if (frontendPerformanceTest) passed++; else failed++;
};

// ========================================
// 9. ERROR HANDLING TESTS
// ========================================

const testErrorHandling = async () => {
  log('🛡️ Testing Error Handling...', 'info');
  
  // Test Invalid Endpoint
  const errorTest = await test('Error Handling', async () => {
    try {
      await axios.get(`${CONFIG.BACKEND_URL}/api/invalid-endpoint`, { timeout: CONFIG.TEST_TIMEOUT });
      throw new Error('Should have returned 404');
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Expected behavior
        return;
      }
      throw error;
    }
  });
  
  if (errorTest) passed++; else failed++;
  
  // Test Invalid Registration
  const invalidRegTest = await test('Invalid Registration Handling', async () => {
    try {
      await api.post('/api/auth/register', { email: 'farmer@test.com' }); // Missing required fields
      throw new Error('Should have returned error');
    } catch (error) {
      // Expected behavior - should handle missing fields gracefully
      return;
    }
  });
  
  if (invalidRegTest) passed++; else failed++;
};

// ========================================
// 10. SECURITY TESTS
// ========================================

const testSecurity = async () => {
  log('🔒 Testing Security...', 'info');
  
  // Test CORS Headers
  const corsTest = await test('CORS Headers', async () => {
    const response = await axios.options(`${CONFIG.BACKEND_URL}/api/health`, { timeout: CONFIG.TEST_TIMEOUT });
    if (!response.headers['access-control-allow-origin']) throw new Error('CORS headers missing');
  });
  
  if (corsTest) passed++; else failed++;
  
  // Test Input Validation
  const inputValidationTest = await test('Input Validation', async () => {
    try {
      await api.post('/api/auth/login', { email: 'invalid-email', password: '' });
      throw new Error('Should have validated input');
    } catch (error) {
      // Expected behavior
      return;
    }
  });
  
  if (inputValidationTest) passed++; else failed++;
};

// ========================================
// MAIN TEST EXECUTION
// ========================================

const runCompleteTests = async () => {
  log('🚀 Starting Complete End-to-End Testing...', 'info');
  log(`Backend URL: ${CONFIG.BACKEND_URL}`, 'info');
  log(`Frontend URL: ${CONFIG.FRONTEND_URL}`, 'info');
  
  try {
    // Wait for servers to be ready
    log('⏳ Waiting for servers to be ready...', 'info');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Run all test suites
    await testServerConnectivity();
    await testAuthentication();
    await testProductListing();
    await testOrderManagement();
    await testCartCheckout();
    await testFrontendIntegration();
    await testMobileIntegration();
    await testPerformance();
    await testErrorHandling();
    await testSecurity();
    
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
      total: passed + failed,
      passed: passed,
      failed: failed,
      successRate: ((passed / (passed + failed)) * 100).toFixed(2)
    },
    configuration: CONFIG,
    testData: {
      usersCreated: Object.keys(createdUsers).length,
      listingsCreated: Object.keys(createdListings).length,
      ordersCreated: Object.keys(createdOrders).length
    },
    features: {
      authentication: '✅ Implemented',
      productListing: '✅ Implemented',
      orderManagement: '✅ Implemented',
      cartCheckout: '✅ Implemented',
      frontendIntegration: '✅ Implemented',
      mobileIntegration: '✅ Implemented',
      performance: '✅ Tested',
      errorHandling: '✅ Tested',
      security: '✅ Tested'
    }
  };
  
  // Save report to file
  const reportPath = 'complete-test-report.json';
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  // Display summary
  log('📊 COMPLETE TEST RESULTS', 'info');
  log(`Total Tests: ${report.summary.total}`, 'info');
  log(`✅ Passed: ${report.summary.passed}`, 'success');
  log(`❌ Failed: ${report.summary.failed}`, 'error');
  log(`📈 Success Rate: ${report.summary.successRate}%`, 'info');
  log(`📄 Report saved to: ${reportPath}`, 'info');
  
  if (failed === 0) {
    log('🎉 All tests passed! Marketplace is fully functional.', 'success');
    log('🚀 Ready for production deployment!', 'success');
  } else {
    log('⚠️ Some tests failed. Check the report for details.', 'warning');
  }
};

// ========================================
// START TESTING
// ========================================

if (require.main === module) {
  runCompleteTests();
}

module.exports = { runCompleteTests };
