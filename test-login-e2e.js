#!/usr/bin/env node

/**
 * 🧪 End-to-End Login Integration Test
 * 
 * This script tests the complete login flow from frontend to backend
 */

const axios = require('axios');

// Configuration
const CONFIG = {
  FRONTEND_URL: 'http://localhost:3000',
  BACKEND_URL: 'http://localhost:8000',
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

// ========================================
// LOGIN API TESTS
// ========================================

const testLoginAPI = async () => {
  log('🔐 Testing Login API...', 'info');
  
  // Test 1: Valid Login
  const validLoginTest = await test('Valid Login API', async () => {
    const response = await axios.post(`${CONFIG.FRONTEND_URL}/api/login`, {
      email: 'demo@kisaanmela.com',
      password: 'demo123'
    }, { timeout: CONFIG.TEST_TIMEOUT });
    
    if (response.status !== 200) throw new Error(`Expected 200, got ${response.status}`);
    if (!response.data.success) throw new Error('Login should be successful');
    if (!response.data.data.user) throw new Error('User data missing');
    if (!response.data.data.token) throw new Error('Token missing');
    
    log(`Login successful for user: ${response.data.data.user.name}`, 'success');
  });
  
  if (validLoginTest) passed++; else failed++;
  
  // Test 2: Invalid Login
  const invalidLoginTest = await test('Invalid Login API', async () => {
    try {
      await axios.post(`${CONFIG.FRONTEND_URL}/api/login`, {
        email: 'wrong@email.com',
        password: 'wrongpassword'
      }, { timeout: CONFIG.TEST_TIMEOUT });
      throw new Error('Should have failed');
    } catch (error) {
      if (error.response?.status !== 401) throw new Error(`Expected 401, got ${error.response?.status}`);
      if (error.response?.data.success !== false) throw new Error('Should return success: false');
    }
  });
  
  if (invalidLoginTest) passed++; else failed++;
  
  // Test 3: Missing Email
  const missingEmailTest = await test('Missing Email Validation', async () => {
    try {
      await axios.post(`${CONFIG.FRONTEND_URL}/api/login`, {
        password: 'demo123'
      }, { timeout: CONFIG.TEST_TIMEOUT });
      throw new Error('Should have failed');
    } catch (error) {
      if (error.response?.status !== 400) throw new Error(`Expected 400, got ${error.response?.status}`);
    }
  });
  
  if (missingEmailTest) passed++; else failed++;
  
  // Test 4: Missing Password
  const missingPasswordTest = await test('Missing Password Validation', async () => {
    try {
      await axios.post(`${CONFIG.FRONTEND_URL}/api/login`, {
        email: 'demo@kisaanmela.com'
      }, { timeout: CONFIG.TEST_TIMEOUT });
      throw new Error('Should have failed');
    } catch (error) {
      if (error.response?.status !== 400) throw new Error(`Expected 400, got ${error.response?.status}`);
    }
  });
  
  if (missingPasswordTest) passed++; else failed++;
  
  // Test 5: Invalid Email Format
  const invalidEmailTest = await test('Invalid Email Format Validation', async () => {
    try {
      await axios.post(`${CONFIG.FRONTEND_URL}/api/login`, {
        email: 'invalid-email',
        password: 'demo123'
      }, { timeout: CONFIG.TEST_TIMEOUT });
      throw new Error('Should have failed');
    } catch (error) {
      if (error.response?.status !== 400) throw new Error(`Expected 400, got ${error.response?.status}`);
    }
  });
  
  if (invalidEmailTest) passed++; else failed++;
};

// ========================================
// FRONTEND INTEGRATION TESTS
// ========================================

const testFrontendIntegration = async () => {
  log('🌐 Testing Frontend Integration...', 'info');
  
  // Test Login Page
  const loginPageTest = await test('Login Page Load', async () => {
    const response = await axios.get(`${CONFIG.FRONTEND_URL}/login`, { timeout: CONFIG.TEST_TIMEOUT });
    if (response.status !== 200) throw new Error('Login page not loading');
  });
  
  if (loginPageTest) passed++; else failed++;
  
  // Test Register Page
  const registerPageTest = await test('Register Page Load', async () => {
    const response = await axios.get(`${CONFIG.FRONTEND_URL}/register`, { timeout: CONFIG.TEST_TIMEOUT });
    if (response.status !== 200) throw new Error('Register page not loading');
  });
  
  if (registerPageTest) passed++; else failed++;
  
  // Test Farmers Market Page
  const farmersMarketTest = await test('Farmers Market Page Load', async () => {
    const response = await axios.get(`${CONFIG.FRONTEND_URL}/farmers-market`, { timeout: CONFIG.TEST_TIMEOUT });
    if (response.status !== 200) throw new Error('Farmers market page not loading');
  });
  
  if (farmersMarketTest) passed++; else failed++;
};

// ========================================
// AUTHENTICATION FLOW TESTS
// ========================================

const testAuthFlow = async () => {
  log('🔑 Testing Authentication Flow...', 'info');
  
  // Test OTP Send
  const otpSendTest = await test('OTP Send API', async () => {
    const response = await axios.post(`${CONFIG.FRONTEND_URL}/api/auth/otp/send`, {
      mobile: '+919876543210'
    }, { timeout: CONFIG.TEST_TIMEOUT });
    
    if (response.status !== 200) throw new Error(`Expected 200, got ${response.status}`);
    if (!response.data.success) throw new Error('OTP send should be successful');
  });
  
  if (otpSendTest) passed++; else failed++;
  
  // Test OTP Verify
  const otpVerifyTest = await test('OTP Verify API', async () => {
    const response = await axios.post(`${CONFIG.FRONTEND_URL}/api/auth/otp/verify`, {
      mobile: '+919876543210',
      otp: '123456'
    }, { timeout: CONFIG.TEST_TIMEOUT });
    
    if (response.status !== 200) throw new Error(`Expected 200, got ${response.status}`);
    if (!response.data.success) throw new Error('OTP verify should be successful');
  });
  
  if (otpVerifyTest) passed++; else failed++;
};

// ========================================
// FARMERS MARKET API TESTS
// ========================================

const testFarmersMarketAPIs = async () => {
  log('🚜 Testing Farmers Market APIs...', 'info');
  
  // Test Marketplace API
  const marketplaceTest = await test('Marketplace API', async () => {
    const response = await axios.get(`${CONFIG.FRONTEND_URL}/api/farmers-market/marketplace`, { timeout: CONFIG.TEST_TIMEOUT });
    if (response.status !== 200) throw new Error('Marketplace API not working');
    if (!response.data.success) throw new Error('Marketplace API should return success');
    if (!response.data.listings) throw new Error('Marketplace API should return listings');
  });
  
  if (marketplaceTest) passed++; else failed++;
  
  // Test Cart API
  const cartTest = await test('Cart API', async () => {
    const response = await axios.get(`${CONFIG.FRONTEND_URL}/api/farmers-market/cart`, { timeout: CONFIG.TEST_TIMEOUT });
    if (response.status !== 200) throw new Error('Cart API not working');
    if (!response.data.success) throw new Error('Cart API should return success');
    if (!response.data.cart) throw new Error('Cart API should return cart data');
  });
  
  if (cartTest) passed++; else failed++;
};

// ========================================
// PERFORMANCE TESTS
// ========================================

const testPerformance = async () => {
  log('⚡ Testing Performance...', 'info');
  
  // Test API Response Times
  const apiPerformanceTest = await test('API Response Times', async () => {
    const startTime = Date.now();
    await axios.post(`${CONFIG.FRONTEND_URL}/api/login`, {
      email: 'demo@kisaanmela.com',
      password: 'demo123'
    }, { timeout: CONFIG.TEST_TIMEOUT });
    const responseTime = Date.now() - startTime;
    
    if (responseTime > 2000) throw new Error(`API response too slow: ${responseTime}ms`);
  });
  
  if (apiPerformanceTest) passed++; else failed++;
};

// ========================================
// MAIN TEST EXECUTION
// ========================================

const runE2ETests = async () => {
  log('🚀 Starting End-to-End Login Integration Testing...', 'info');
  log(`Frontend URL: ${CONFIG.FRONTEND_URL}`, 'info');
  log(`Backend URL: ${CONFIG.BACKEND_URL}`, 'info');
  
  try {
    // Wait for server to be ready
    log('⏳ Waiting for server to be ready...', 'info');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Run test suites
    await testLoginAPI();
    await testFrontendIntegration();
    await testAuthFlow();
    await testFarmersMarketAPIs();
    await testPerformance();
    
    // Display results
    log('📊 E2E TEST RESULTS', 'info');
    log(`Total Tests: ${passed + failed}`, 'info');
    log(`✅ Passed: ${passed}`, 'success');
    log(`❌ Failed: ${failed}`, 'error');
    log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(2)}%`, 'info');
    
    if (failed === 0) {
      log('🎉 All E2E tests passed! Login integration is fully functional.', 'success');
    } else {
      log('⚠️ Some E2E tests failed. Check the errors above.', 'warning');
    }
    
  } catch (error) {
    log(`❌ Test execution failed: ${error.message}`, 'error');
    process.exit(1);
  }
};

// ========================================
// START TESTING
// ========================================

if (require.main === module) {
  runE2ETests();
}

module.exports = { runE2ETests };
