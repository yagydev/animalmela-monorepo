#!/usr/bin/env node

/**
 * 🧪 Quick End-to-End Test Script for Animall Marketplace
 * 
 * This script performs basic connectivity and functionality tests
 */

const axios = require('axios');
const fs = require('fs');

// Configuration
const CONFIG = {
  BACKEND_URL: 'http://localhost:8001',
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
// BASIC CONNECTIVITY TESTS
// ========================================

const testServerConnectivity = async () => {
  log('🔌 Testing Server Connectivity...', 'info');
  
  // Test Backend Server
  const backendTest = await test('Backend Server Status', async () => {
    const response = await axios.get(`${CONFIG.BACKEND_URL}/api/health`, { timeout: CONFIG.TEST_TIMEOUT });
    if (response.status !== 200) throw new Error('Backend server not responding');
  });
  
  if (backendTest) passed++; else failed++;
  
  // Test Frontend Server
  const frontendTest = await test('Frontend Server Status', async () => {
    const response = await axios.get(`${CONFIG.FRONTEND_URL}`, { timeout: CONFIG.TEST_TIMEOUT });
    if (response.status !== 200) throw new Error('Frontend server not responding');
  });
  
  if (frontendTest) passed++; else failed++;
};

// ========================================
// API ENDPOINT TESTS
// ========================================

const testAPIEndpoints = async () => {
  log('🔗 Testing API Endpoints...', 'info');
  
  // Test Health Check
  const healthTest = await test('Health Check Endpoint', async () => {
    const response = await axios.get(`${CONFIG.BACKEND_URL}/api/health`, { timeout: CONFIG.TEST_TIMEOUT });
    if (!response.data.success) throw new Error('Health check failed');
  });
  
  if (healthTest) passed++; else failed++;
  
  // Test Listings Endpoint
  const listingsTest = await test('Listings Endpoint', async () => {
    const response = await axios.get(`${CONFIG.BACKEND_URL}/api/listings`, { timeout: CONFIG.TEST_TIMEOUT });
    if (!response.data.success) throw new Error('Listings endpoint failed');
  });
  
  if (listingsTest) passed++; else failed++;
  
  // Test Categories Endpoint
  const categoriesTest = await test('Categories Endpoint', async () => {
    const response = await axios.get(`${CONFIG.BACKEND_URL}/api/categories`, { timeout: CONFIG.TEST_TIMEOUT });
    if (!response.data.success) throw new Error('Categories endpoint failed');
  });
  
  if (categoriesTest) passed++; else failed++;
};

// ========================================
// FRONTEND PAGE TESTS
// ========================================

const testFrontendPages = async () => {
  log('🌐 Testing Frontend Pages...', 'info');
  
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
};

// ========================================
// DATABASE CONNECTIVITY TEST
// ========================================

const testDatabaseConnectivity = async () => {
  log('🗄️ Testing Database Connectivity...', 'info');
  
  // Test Database Connection via API
  const dbTest = await test('Database Connection', async () => {
    const response = await axios.get(`${CONFIG.BACKEND_URL}/api/health`, { timeout: CONFIG.TEST_TIMEOUT });
    if (!response.data.database) throw new Error('Database not connected');
  });
  
  if (dbTest) passed++; else failed++;
};

// ========================================
// MAIN TEST EXECUTION
// ========================================

const runQuickTests = async () => {
  log('🚀 Starting Quick End-to-End Tests...', 'info');
  log(`Backend URL: ${CONFIG.BACKEND_URL}`, 'info');
  log(`Frontend URL: ${CONFIG.FRONTEND_URL}`, 'info');
  
  try {
    // Wait a moment for servers to be ready
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Run test suites
    await testServerConnectivity();
    await testAPIEndpoints();
    await testFrontendPages();
    await testDatabaseConnectivity();
    
    // Display results
    log('📊 QUICK TEST RESULTS', 'info');
    log(`Total Tests: ${passed + failed}`, 'info');
    log(`✅ Passed: ${passed}`, 'success');
    log(`❌ Failed: ${failed}`, 'error');
    
    if (failed === 0) {
      log('🎉 All quick tests passed! Ready for comprehensive testing.', 'success');
    } else {
      log('⚠️ Some tests failed. Check server status and configuration.', 'warning');
    }
    
  } catch (error) {
    log(`❌ Test execution failed: ${error.message}`, 'error');
  }
};

// ========================================
// START TESTING
// ========================================

if (require.main === module) {
  runQuickTests();
}

module.exports = { runQuickTests };
