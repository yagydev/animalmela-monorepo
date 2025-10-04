#!/usr/bin/env node

/**
 * 🔍 Login Debugging & Verification Script
 * 
 * This script helps debug login issues and provides clear test results
 */

const axios = require('axios');

const CONFIG = {
  FRONTEND_URL: 'http://localhost:3000',
  TEST_TIMEOUT: 10000
};

const log = (message, type = 'info') => {
  const timestamp = new Date().toISOString();
  const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️';
  console.log(`${prefix} [${timestamp}] ${message}`);
};

const testLogin = async (email, password, expectedResult = 'success') => {
  try {
    const response = await axios.post(`${CONFIG.FRONTEND_URL}/api/login`, {
      email,
      password
    }, { timeout: CONFIG.TEST_TIMEOUT });
    
    if (expectedResult === 'success') {
      if (response.status === 200 && response.data.success) {
        log(`✅ SUCCESS: ${email} - Status: ${response.status}`, 'success');
        log(`   User: ${response.data.data.user.name} (${response.data.data.user.role})`, 'success');
        return true;
      } else {
        log(`❌ FAILED: ${email} - Expected success but got failure`, 'error');
        return false;
      }
    } else {
      log(`❌ UNEXPECTED: ${email} - Expected failure but got success`, 'error');
      return false;
    }
  } catch (error) {
    if (expectedResult === 'failure') {
      log(`✅ SUCCESS: ${email} - Correctly rejected (${error.response?.status})`, 'success');
      return true;
    } else {
      log(`❌ FAILED: ${email} - ${error.response?.status}: ${error.response?.data?.message || error.message}`, 'error');
      return false;
    }
  }
};

const runLoginDebug = async () => {
  log('🔍 Starting Login Debug & Verification...', 'info');
  log(`Testing against: ${CONFIG.FRONTEND_URL}`, 'info');
  
  let passed = 0;
  let total = 0;
  
  // Test all valid demo accounts
  log('\n📋 Testing Valid Demo Accounts:', 'info');
  const validAccounts = [
    { email: 'admin@kisaanmela.com', password: 'admin123', role: 'admin' },
    { email: 'farmer@kisaanmela.com', password: 'farmer123', role: 'farmer' },
    { email: 'buyer@kisaanmela.com', password: 'buyer123', role: 'buyer' },
    { email: 'demo@kisaanmela.com', password: 'demo123', role: 'farmer' }
  ];
  
  for (const account of validAccounts) {
    total++;
    const result = await testLogin(account.email, account.password, 'success');
    if (result) passed++;
  }
  
  // Test invalid accounts
  log('\n🚫 Testing Invalid Accounts:', 'info');
  const invalidAccounts = [
    { email: 'wrong@email.com', password: 'wrongpassword' },
    { email: 'demo@kisaanmela.com', password: 'wrongpassword' },
    { email: 'nonexistent@kisaanmela.com', password: 'demo123' }
  ];
  
  for (const account of invalidAccounts) {
    total++;
    const result = await testLogin(account.email, account.password, 'failure');
    if (result) passed++;
  }
  
  // Test validation errors
  log('\n⚠️ Testing Validation Errors:', 'info');
  const validationTests = [
    { email: '', password: 'demo123', description: 'Empty email' },
    { email: 'demo@kisaanmela.com', password: '', description: 'Empty password' },
    { email: 'invalid-email', password: 'demo123', description: 'Invalid email format' }
  ];
  
  for (const test of validationTests) {
    total++;
    const result = await testLogin(test.email, test.password, 'failure');
    if (result) passed++;
  }
  
  // Results
  log('\n📊 DEBUG RESULTS:', 'info');
  log(`Total Tests: ${total}`, 'info');
  log(`✅ Passed: ${passed}`, 'success');
  log(`❌ Failed: ${total - passed}`, 'error');
  log(`📈 Success Rate: ${((passed / total) * 100).toFixed(2)}%`, 'info');
  
  if (passed === total) {
    log('\n🎉 All login tests passed! The API is working correctly.', 'success');
    log('\n📝 VALID LOGIN CREDENTIALS:', 'info');
    log('   Email: demo@kisaanmela.com', 'info');
    log('   Password: demo123', 'info');
    log('   Role: farmer', 'info');
    log('\n   Email: admin@kisaanmela.com', 'info');
    log('   Password: admin123', 'info');
    log('   Role: admin', 'info');
    log('\n   Email: farmer@kisaanmela.com', 'info');
    log('   Password: farmer123', 'info');
    log('   Role: farmer', 'info');
    log('\n   Email: buyer@kisaanmela.com', 'info');
    log('   Password: buyer123', 'info');
    log('   Role: buyer', 'info');
  } else {
    log('\n⚠️ Some tests failed. Check the errors above.', 'warning');
  }
  
  // Test frontend pages
  log('\n🌐 Testing Frontend Pages:', 'info');
  try {
    const loginPage = await axios.get(`${CONFIG.FRONTEND_URL}/login`, { timeout: CONFIG.TEST_TIMEOUT });
    log(`✅ Login Page: ${loginPage.status}`, 'success');
  } catch (error) {
    log(`❌ Login Page: ${error.message}`, 'error');
  }
  
  try {
    const registerPage = await axios.get(`${CONFIG.FRONTEND_URL}/register`, { timeout: CONFIG.TEST_TIMEOUT });
    log(`✅ Register Page: ${registerPage.status}`, 'success');
  } catch (error) {
    log(`❌ Register Page: ${error.message}`, 'error');
  }
  
  try {
    const farmersMarketPage = await axios.get(`${CONFIG.FRONTEND_URL}/farmers-market`, { timeout: CONFIG.TEST_TIMEOUT });
    log(`✅ Farmers Market Page: ${farmersMarketPage.status}`, 'success');
  } catch (error) {
    log(`❌ Farmers Market Page: ${error.message}`, 'error');
  }
};

if (require.main === module) {
  runLoginDebug();
}

module.exports = { runLoginDebug };
