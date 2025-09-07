#!/usr/bin/env node

// End-to-End Authentication Test Script for AnimalMela
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

// Test configuration
const BACKEND_URL = 'http://localhost:5001';
const FRONTEND_URL = 'http://localhost:3000';
const TEST_TIMEOUT = 30000;

// Test data
const timestamp = Date.now();
const testUsers = {
  validUser: {
    name: 'Test User',
    email: `test${timestamp}@animalmela.com`,
    mobile: `+919876543${timestamp.toString().slice(-3)}`,
    password: 'TestPassword123!',
    role: 'buyer'
  },
  invalidUser: {
    email: 'invalid@test.com',
    password: 'wrongpassword'
  },
  duplicateUser: {
    name: 'Duplicate User',
    email: `test${timestamp}@animalmela.com`, // Same as validUser
    mobile: `+919876543${(timestamp + 1).toString().slice(-3)}`,
    password: 'TestPassword123!',
    role: 'seller'
  }
};

// Test results storage
const testResults = {
  backend: [],
  frontend: [],
  integration: [],
  overall: { passed: 0, failed: 0, total: 0 }
};

// Utility functions
const log = (message, type = 'info') => {
  const timestamp = new Date().toISOString();
  const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
  console.log(`${prefix} [${timestamp}] ${message}`);
};

const recordTest = (category, testName, passed, details = '') => {
  const result = { testName, passed, details, timestamp: new Date() };
  testResults[category].push(result);
  testResults.overall.total++;
  if (passed) {
    testResults.overall.passed++;
    log(`PASSED: ${testName}`, 'success');
  } else {
    testResults.overall.failed++;
    log(`FAILED: ${testName} - ${details}`, 'error');
  }
};

// Backend API Tests
const testBackendAuth = async () => {
  log('Starting Backend Authentication Tests...');
  
  try {
    // Test 1: User Registration
    try {
      const registerResponse = await axios.post(`${BACKEND_URL}/api/auth/register`, testUsers.validUser, {
        timeout: TEST_TIMEOUT
      });
      
      const registrationSuccess = registerResponse.status === 201 && registerResponse.data.success;
      recordTest('backend', 'User Registration API', registrationSuccess, 
        registrationSuccess ? 'User registered successfully' : 'Registration failed');
      
      if (registrationSuccess) {
        testUsers.validUser.token = registerResponse.data.token;
        testUsers.validUser.id = registerResponse.data.user._id;
      }
    } catch (error) {
      recordTest('backend', 'User Registration API', false, error.response?.data?.error || error.message);
    }

    // Test 2: Duplicate User Registration
    try {
      await axios.post(`${BACKEND_URL}/api/auth/register`, testUsers.duplicateUser, {
        timeout: TEST_TIMEOUT
      });
      recordTest('backend', 'Duplicate User Registration', false, 'Should have failed but succeeded');
    } catch (error) {
      const expectedError = error.response?.status === 400 && error.response?.data?.error?.includes('already exists');
      recordTest('backend', 'Duplicate User Registration', expectedError, 
        expectedError ? 'Correctly rejected duplicate user' : 'Unexpected error');
    }

    // Test 3: User Login with Email/Password
    try {
      const loginResponse = await axios.post(`${BACKEND_URL}/api/auth/login`, {
        email: testUsers.validUser.email,
        password: testUsers.validUser.password
      }, { timeout: TEST_TIMEOUT });
      
      const loginSuccess = loginResponse.status === 200 && loginResponse.data.success;
      recordTest('backend', 'User Login (Email/Password)', loginSuccess,
        loginSuccess ? 'Login successful' : 'Login failed');
    } catch (error) {
      recordTest('backend', 'User Login (Email/Password)', false, error.response?.data?.error || error.message);
    }

    // Test 4: Invalid Login Credentials
    try {
      await axios.post(`${BACKEND_URL}/api/auth/login`, testUsers.invalidUser, {
        timeout: TEST_TIMEOUT
      });
      recordTest('backend', 'Invalid Login Credentials', false, 'Should have failed but succeeded');
    } catch (error) {
      const expectedError = error.response?.status === 401;
      recordTest('backend', 'Invalid Login Credentials', expectedError,
        expectedError ? 'Correctly rejected invalid credentials' : 'Unexpected error');
    }

    // Test 5: OTP Send
    try {
      const otpResponse = await axios.post(`${BACKEND_URL}/api/auth/otp/send`, {
        mobile: testUsers.validUser.mobile
      }, { timeout: TEST_TIMEOUT });
      
      const otpSuccess = otpResponse.status === 200 && otpResponse.data.success;
      recordTest('backend', 'OTP Send API', otpSuccess,
        otpSuccess ? 'OTP sent successfully' : 'OTP send failed');
      
      if (otpSuccess) {
        testUsers.validUser.otp = otpResponse.data.otp; // Store OTP for verification
      }
    } catch (error) {
      recordTest('backend', 'OTP Send API', false, error.response?.data?.error || error.message);
    }

    // Test 6: OTP Verification
    if (testUsers.validUser.otp) {
      try {
        const verifyResponse = await axios.post(`${BACKEND_URL}/api/auth/otp/verify`, {
          mobile: testUsers.validUser.mobile,
          otp: testUsers.validUser.otp
        }, { timeout: TEST_TIMEOUT });
        
        const verifySuccess = verifyResponse.status === 200 && verifyResponse.data.success;
        recordTest('backend', 'OTP Verification API', verifySuccess,
          verifySuccess ? 'OTP verified successfully' : 'OTP verification failed');
      } catch (error) {
        recordTest('backend', 'OTP Verification API', false, error.response?.data?.error || error.message);
      }
    }

    // Test 7: JWT Token Validation
    if (testUsers.validUser.token) {
      try {
        const meResponse = await axios.get(`${BACKEND_URL}/api/me`, {
          headers: { 'Authorization': `Bearer ${testUsers.validUser.token}` },
          timeout: TEST_TIMEOUT
        });
        
        const tokenValid = meResponse.status === 200 && meResponse.data.success;
        recordTest('backend', 'JWT Token Validation', tokenValid,
          tokenValid ? 'Token is valid' : 'Token validation failed');
      } catch (error) {
        recordTest('backend', 'JWT Token Validation', false, error.response?.data?.error || error.message);
      }
    }

  } catch (error) {
    recordTest('backend', 'Backend Auth Tests Setup', false, error.message);
  }
};

// Frontend UI Tests
const testFrontendAuth = async () => {
  log('Starting Frontend Authentication Tests...');
  
  try {
    // Test 1: Login Page Load
    try {
      const loginPageResponse = await axios.get(`${FRONTEND_URL}/login`, { timeout: TEST_TIMEOUT });
      const pageLoadSuccess = loginPageResponse.status === 200;
      recordTest('frontend', 'Login Page Load', pageLoadSuccess,
        pageLoadSuccess ? 'Login page loaded successfully' : 'Login page failed to load');
    } catch (error) {
      recordTest('frontend', 'Login Page Load', false, error.message);
    }

    // Test 2: Registration Page Load
    try {
      const registerPageResponse = await axios.get(`${FRONTEND_URL}/register`, { timeout: TEST_TIMEOUT });
      const pageLoadSuccess = registerPageResponse.status === 200;
      recordTest('frontend', 'Registration Page Load', pageLoadSuccess,
        pageLoadSuccess ? 'Registration page loaded successfully' : 'Registration page failed to load');
    } catch (error) {
      recordTest('frontend', 'Registration Page Load', false, error.message);
    }

    // Test 3: Frontend API Integration - Login
    try {
      const frontendLoginResponse = await axios.post(`${FRONTEND_URL}/api/login`, {
        email: testUsers.validUser.email,
        password: testUsers.validUser.password
      }, { timeout: TEST_TIMEOUT });
      
      const frontendLoginSuccess = frontendLoginResponse.status === 200 && frontendLoginResponse.data.success;
      recordTest('frontend', 'Frontend Login API Integration', frontendLoginSuccess,
        frontendLoginSuccess ? 'Frontend login API working' : 'Frontend login API failed');
    } catch (error) {
      recordTest('frontend', 'Frontend Login API Integration', false, error.response?.data?.error || error.message);
    }

    // Test 4: Frontend API Integration - Registration
    try {
      const frontendRegisterResponse = await axios.post(`${FRONTEND_URL}/api/register`, {
        name: 'Frontend Test User',
        email: 'frontend@animalmela.com',
        password: 'FrontendTest123!'
      }, { timeout: TEST_TIMEOUT });
      
      const frontendRegisterSuccess = frontendRegisterResponse.status === 201 && frontendRegisterResponse.data.success;
      recordTest('frontend', 'Frontend Registration API Integration', frontendRegisterSuccess,
        frontendRegisterSuccess ? 'Frontend registration API working' : 'Frontend registration API failed');
    } catch (error) {
      recordTest('frontend', 'Frontend Registration API Integration', false, error.response?.data?.error || error.message);
    }

  } catch (error) {
    recordTest('frontend', 'Frontend Auth Tests Setup', false, error.message);
  }
};

// Integration Tests
const testIntegration = async () => {
  log('Starting Integration Tests...');
  
  try {
    // Test 1: End-to-End Registration Flow
    try {
      const integrationUser = {
        name: 'Integration Test User',
        email: 'integration@animalmela.com',
        mobile: '+919876543220',
        password: 'IntegrationTest123!',
        role: 'buyer'
      };

      // Step 1: Register user
      const registerResponse = await axios.post(`${BACKEND_URL}/api/auth/register`, integrationUser, {
        timeout: TEST_TIMEOUT
      });

      if (registerResponse.status === 201 && registerResponse.data.success) {
        const token = registerResponse.data.token;
        
        // Step 2: Verify token works
        const meResponse = await axios.get(`${BACKEND_URL}/api/me`, {
          headers: { 'Authorization': `Bearer ${token}` },
          timeout: TEST_TIMEOUT
        });

        const integrationSuccess = meResponse.status === 200 && meResponse.data.success;
        recordTest('integration', 'End-to-End Registration Flow', integrationSuccess,
          integrationSuccess ? 'Complete registration flow working' : 'Registration flow failed');
      } else {
        recordTest('integration', 'End-to-End Registration Flow', false, 'Registration step failed');
      }
    } catch (error) {
      recordTest('integration', 'End-to-End Registration Flow', false, error.message);
    }

    // Test 2: End-to-End Login Flow
    try {
      // Step 1: Login with credentials
      const loginResponse = await axios.post(`${BACKEND_URL}/api/auth/login`, {
        email: testUsers.validUser.email,
        password: testUsers.validUser.password
      }, { timeout: TEST_TIMEOUT });

      if (loginResponse.status === 200 && loginResponse.data.success) {
        const token = loginResponse.data.token;
        
        // Step 2: Use token to access protected resource
        const protectedResponse = await axios.get(`${BACKEND_URL}/api/me`, {
          headers: { 'Authorization': `Bearer ${token}` },
          timeout: TEST_TIMEOUT
        });

        const loginFlowSuccess = protectedResponse.status === 200 && protectedResponse.data.success;
        recordTest('integration', 'End-to-End Login Flow', loginFlowSuccess,
          loginFlowSuccess ? 'Complete login flow working' : 'Login flow failed');
      } else {
        recordTest('integration', 'End-to-End Login Flow', false, 'Login step failed');
      }
    } catch (error) {
      recordTest('integration', 'End-to-End Login Flow', false, error.message);
    }

    // Test 3: Database Schema Validation
    try {
      // Test if user data matches expected schema
      const userResponse = await axios.get(`${BACKEND_URL}/api/me`, {
        headers: { 'Authorization': `Bearer ${testUsers.validUser.token}` },
        timeout: TEST_TIMEOUT
      });

      if (userResponse.status === 200 && userResponse.data.success) {
        const user = userResponse.data.user;
        const hasRequiredFields = user._id && user.name && user.email && user.role;
        const schemaValid = hasRequiredFields && 
                           ['buyer', 'seller', 'service', 'admin'].includes(user.role);
        
        recordTest('integration', 'Database Schema Validation', schemaValid,
          schemaValid ? 'User schema matches expected format' : 'User schema validation failed');
      } else {
        recordTest('integration', 'Database Schema Validation', false, 'Failed to fetch user data');
      }
    } catch (error) {
      recordTest('integration', 'Database Schema Validation', false, error.message);
    }

    // Test 4: Error Handling
    try {
      // Test various error scenarios
      const errorTests = [
        { name: 'Empty Email', data: { password: 'test123' }, expectedStatus: 400 },
        { name: 'Empty Password', data: { email: 'test@test.com' }, expectedStatus: 400 },
        { name: 'Invalid Email Format', data: { email: 'invalid-email', password: 'test123' }, expectedStatus: 400 },
        { name: 'Non-existent User', data: { email: 'nonexistent@test.com', password: 'test123' }, expectedStatus: 401 }
      ];

      let errorHandlingScore = 0;
      for (const test of errorTests) {
        try {
          await axios.post(`${BACKEND_URL}/api/auth/login`, test.data, { timeout: TEST_TIMEOUT });
          // If we get here, the test should have failed
        } catch (error) {
          if (error.response?.status === test.expectedStatus) {
            errorHandlingScore++;
          }
        }
      }

      const errorHandlingSuccess = errorHandlingScore === errorTests.length;
      recordTest('integration', 'Error Handling', errorHandlingSuccess,
        errorHandlingSuccess ? 'All error scenarios handled correctly' : `${errorHandlingScore}/${errorTests.length} error scenarios handled`);
    } catch (error) {
      recordTest('integration', 'Error Handling', false, error.message);
    }

  } catch (error) {
    recordTest('integration', 'Integration Tests Setup', false, error.message);
  }
};

// Generate comprehensive test report
const generateReport = async () => {
  const report = {
    timestamp: new Date().toISOString(),
    summary: testResults.overall,
    categories: {
      backend: {
        total: testResults.backend.length,
        passed: testResults.backend.filter(t => t.passed).length,
        failed: testResults.backend.filter(t => !t.passed).length,
        tests: testResults.backend
      },
      frontend: {
        total: testResults.frontend.length,
        passed: testResults.frontend.filter(t => t.passed).length,
        failed: testResults.frontend.filter(t => !t.passed).length,
        tests: testResults.frontend
      },
      integration: {
        total: testResults.integration.length,
        passed: testResults.integration.filter(t => t.passed).length,
        failed: testResults.integration.filter(t => !t.passed).length,
        tests: testResults.integration
      }
    },
    recommendations: generateRecommendations()
  };
  
  // Save report to file
  await fs.writeFile(
    path.join(__dirname, 'auth-test-report.json'),
    JSON.stringify(report, null, 2)
  );
  
  // Print summary
  log('\n=== AUTHENTICATION TEST SUMMARY ===');
  log(`Total Tests: ${testResults.overall.total}`);
  log(`Passed: ${testResults.overall.passed}`, 'success');
  log(`Failed: ${testResults.overall.failed}`, testResults.overall.failed > 0 ? 'error' : 'success');
  log(`Success Rate: ${((testResults.overall.passed / testResults.overall.total) * 100).toFixed(2)}%`);
  
  log('\n=== CATEGORY BREAKDOWN ===');
  Object.entries(report.categories).forEach(([category, data]) => {
    const successRate = ((data.passed / data.total) * 100).toFixed(2);
    log(`${category.toUpperCase()}: ${data.passed}/${data.total} (${successRate}%)`);
  });
  
  log('\n=== RECOMMENDATIONS ===');
  report.recommendations.forEach(rec => log(`• ${rec}`));
  
  return report;
};

const generateRecommendations = () => {
  const recommendations = [];
  
  const backendFailures = testResults.backend.filter(t => !t.passed).length;
  const frontendFailures = testResults.frontend.filter(t => !t.passed).length;
  const integrationFailures = testResults.integration.filter(t => !t.passed).length;
  
  if (backendFailures > 0) {
    recommendations.push('Fix backend API endpoints - check database connection and authentication logic');
  }
  
  if (frontendFailures > 0) {
    recommendations.push('Fix frontend API integration - ensure proper error handling and data flow');
  }
  
  if (integrationFailures > 0) {
    recommendations.push('Improve end-to-end integration - test complete user flows');
  }
  
  if (testResults.overall.passed === testResults.overall.total) {
    recommendations.push('All authentication tests passed! System is ready for production.');
  }
  
  return recommendations;
};

// Main test execution
const runAuthTests = async () => {
  log('🔐 Starting AnimalMela Authentication End-to-End Test Suite');
  log(`Testing Backend: ${BACKEND_URL}`);
  log(`Testing Frontend: ${FRONTEND_URL}`);
  
  try {
    await testBackendAuth();
    await testFrontendAuth();
    await testIntegration();
    
    const report = await generateReport();
    
    log('\n✅ Authentication tests completed!');
    log(`📊 Report saved to: auth-test-report.json`);
    
    // Exit with appropriate code
    process.exit(testResults.overall.failed > 0 ? 1 : 0);
    
  } catch (error) {
    log(`❌ Test suite failed: ${error.message}`, 'error');
    process.exit(1);
  }
};

// Run tests if called directly
if (require.main === module) {
  runAuthTests();
}

module.exports = {
  runAuthTests,
  testBackendAuth,
  testFrontendAuth,
  testIntegration,
  generateReport
};
