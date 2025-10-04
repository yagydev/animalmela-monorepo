#!/usr/bin/env node

/**
 * 🧪 Frontend Integration Test for Farmers Market
 * 
 * This script tests only the frontend pages to verify they load correctly
 */

const axios = require('axios');

// Configuration
const CONFIG = {
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

// ========================================
// FRONTEND INTEGRATION TESTS
// ========================================

const testFrontendIntegration = async () => {
  log('🌐 Testing Frontend Integration...', 'info');
  
  // Test Home Page
  const homeTest = await test('Home Page Load', async () => {
    const response = await axios.get(`${CONFIG.FRONTEND_URL}/`, { timeout: CONFIG.TEST_TIMEOUT });
    if (response.status !== 200) throw new Error('Home page not loading');
  });
  
  if (homeTest) passed++; else failed++;
  
  // Test Farmers Market Page
  const farmersMarketTest = await test('Farmers Market Page Load', async () => {
    const response = await axios.get(`${CONFIG.FRONTEND_URL}/farmers-market`, { timeout: CONFIG.TEST_TIMEOUT });
    if (response.status !== 200) throw new Error('Farmers market page not loading');
  });
  
  if (farmersMarketTest) passed++; else failed++;
  
  // Test Dashboard Page
  const dashboardTest = await test('Dashboard Page Load', async () => {
    const response = await axios.get(`${CONFIG.FRONTEND_URL}/farmers-market/dashboard`, { timeout: CONFIG.TEST_TIMEOUT });
    if (response.status !== 200) throw new Error('Dashboard page not loading');
  });
  
  if (dashboardTest) passed++; else failed++;
  
  // Test Checkout Page
  const checkoutTest = await test('Checkout Page Load', async () => {
    const response = await axios.get(`${CONFIG.FRONTEND_URL}/farmers-market/checkout`, { timeout: CONFIG.TEST_TIMEOUT });
    if (response.status !== 200) throw new Error('Checkout page not loading');
  });
  
  if (checkoutTest) passed++; else failed++;
  
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
  
  // Test Marketplace Page
  const marketplaceTest = await test('Marketplace Page Load', async () => {
    const response = await axios.get(`${CONFIG.FRONTEND_URL}/marketplace`, { timeout: CONFIG.TEST_TIMEOUT });
    if (response.status !== 200) throw new Error('Marketplace page not loading');
  });
  
  if (marketplaceTest) passed++; else failed++;
  
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
// PERFORMANCE TESTS
// ========================================

const testPerformance = async () => {
  log('⚡ Testing Performance...', 'info');
  
  // Test Frontend Load Times
  const frontendPerformanceTest = await test('Frontend Load Times', async () => {
    const startTime = Date.now();
    await axios.get(`${CONFIG.FRONTEND_URL}/farmers-market`, { timeout: CONFIG.TEST_TIMEOUT });
    const responseTime = Date.now() - startTime;
    
    if (responseTime > 5000) throw new Error(`Frontend load too slow: ${responseTime}ms`);
  });
  
  if (frontendPerformanceTest) passed++; else failed++;
};

// ========================================
// MAIN TEST EXECUTION
// ========================================

const runFrontendTests = async () => {
  log('🚀 Starting Frontend Integration Testing...', 'info');
  log(`Frontend URL: ${CONFIG.FRONTEND_URL}`, 'info');
  
  try {
    // Wait for server to be ready
    log('⏳ Waiting for server to be ready...', 'info');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Run test suites
    await testFrontendIntegration();
    await testPerformance();
    
    // Display results
    log('📊 FRONTEND TEST RESULTS', 'info');
    log(`Total Tests: ${passed + failed}`, 'info');
    log(`✅ Passed: ${passed}`, 'success');
    log(`❌ Failed: ${failed}`, 'error');
    log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(2)}%`, 'info');
    
    if (failed === 0) {
      log('🎉 All frontend tests passed! Farmers Market UI is fully functional.', 'success');
    } else {
      log('⚠️ Some frontend tests failed. Check the errors above.', 'warning');
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
  runFrontendTests();
}

module.exports = { runFrontendTests };
