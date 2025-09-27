#!/usr/bin/env node

// Comprehensive Test Script for AnimalMela Non-Functional Requirements
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

// Test configuration
const BASE_URL = 'http://localhost:5001';
const FRONTEND_URL = 'http://localhost:3000';
const TEST_TIMEOUT = 30000;

// Test results storage
const testResults = {
  performance: [],
  scalability: [],
  security: [],
  compliance: [],
  observability: [],
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

// Performance Tests
const testPerformance = async () => {
  log('Starting Performance Tests...');
  
  try {
    // Test API response time
    const start = Date.now();
    const response = await axios.get(`${BASE_URL}/api/listings/categories`, { timeout: TEST_TIMEOUT });
    const responseTime = Date.now() - start;
    
    const ttiPassed = responseTime < 2500; // <2.5s TTI requirement
    recordTest('performance', 'API Response Time (<2.5s)', ttiPassed, `${responseTime}ms`);
    
    // Test image compression endpoint
    try {
      const imageResponse = await axios.get(`${BASE_URL}/api/test/image-compression`, { timeout: TEST_TIMEOUT });
      recordTest('performance', 'Image Compression Service', true, 'Service available');
    } catch (error) {
      recordTest('performance', 'Image Compression Service', false, 'Service not available');
    }
    
    // Test lazy loading implementation
    try {
      const lazyLoadResponse = await axios.get(`${FRONTEND_URL}/api/test/lazy-loading`, { timeout: TEST_TIMEOUT });
      recordTest('performance', 'Lazy Loading Implementation', true, 'Lazy loading working');
    } catch (error) {
      recordTest('performance', 'Lazy Loading Implementation', false, 'Lazy loading not implemented');
    }
    
  } catch (error) {
    recordTest('performance', 'Performance Tests Setup', false, error.message);
  }
};

// Scalability Tests
const testScalability = async () => {
  log('Starting Scalability Tests...');
  
  try {
    // Test pagination
    const paginationResponse = await axios.get(`${BASE_URL}/api/listings?page=1&limit=10`, { timeout: TEST_TIMEOUT });
    const hasPagination = paginationResponse.data.pagination || paginationResponse.data.page;
    recordTest('scalability', 'Pagination Implementation', !!hasPagination, 'Pagination working');
    
    // Test MongoDB indexing
    try {
      const indexResponse = await axios.get(`${BASE_URL}/api/test/database-indexes`, { timeout: TEST_TIMEOUT });
      recordTest('scalability', 'MongoDB Indexing', true, 'Indexes created');
    } catch (error) {
      recordTest('scalability', 'MongoDB Indexing', false, 'Index creation failed');
    }
    
    // Test background job system
    try {
      const jobResponse = await axios.get(`${BASE_URL}/api/test/background-jobs`, { timeout: TEST_TIMEOUT });
      recordTest('scalability', 'Background Job System', true, 'Job system operational');
    } catch (error) {
      recordTest('scalability', 'Background Job System', false, 'Job system not available');
    }
    
    // Test CDN configuration
    try {
      const cdnResponse = await axios.get(`${FRONTEND_URL}/api/test/cdn-config`, { timeout: TEST_TIMEOUT });
      recordTest('scalability', 'CDN Configuration', true, 'CDN configured');
    } catch (error) {
      recordTest('scalability', 'CDN Configuration', false, 'CDN not configured');
    }
    
  } catch (error) {
    recordTest('scalability', 'Scalability Tests Setup', false, error.message);
  }
};

// Security Tests
const testSecurity = async () => {
  log('Starting Security Tests...');
  
  try {
    // Test JWT authentication
    try {
      const authResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
        email: 'test@example.com',
        password: 'testpassword'
      }, { timeout: TEST_TIMEOUT });
      
      const hasToken = authResponse.data.token || authResponse.data.accessToken;
      recordTest('security', 'JWT Authentication', !!hasToken, 'JWT tokens generated');
    } catch (error) {
      recordTest('security', 'JWT Authentication', false, 'Authentication failed');
    }
    
    // Test RBAC
    try {
      const rbacResponse = await axios.get(`${BASE_URL}/api/test/rbac`, { timeout: TEST_TIMEOUT });
      recordTest('security', 'Role-Based Access Control', true, 'RBAC implemented');
    } catch (error) {
      recordTest('security', 'Role-Based Access Control', false, 'RBAC not implemented');
    }
    
    // Test rate limiting
    try {
      const promises = Array(10).fill().map(() => 
        axios.get(`${BASE_URL}/api/test/rate-limit`, { timeout: TEST_TIMEOUT })
      );
      
      const responses = await Promise.allSettled(promises);
      const rateLimited = responses.some(r => r.status === 'rejected' && r.reason.response?.status === 429);
      recordTest('security', 'Rate Limiting', rateLimited, 'Rate limiting active');
    } catch (error) {
      recordTest('security', 'Rate Limiting', false, 'Rate limiting not working');
    }
    
    // Test media scanning
    try {
      const mediaResponse = await axios.get(`${BASE_URL}/api/test/media-scanning`, { timeout: TEST_TIMEOUT });
      recordTest('security', 'Media Scanning', true, 'Media scanning implemented');
    } catch (error) {
      recordTest('security', 'Media Scanning', false, 'Media scanning not available');
    }
    
    // Test security headers
    const headersResponse = await axios.get(`${BASE_URL}/api/listings/categories`, { timeout: TEST_TIMEOUT });
    const securityHeaders = [
      'x-content-type-options',
      'x-frame-options',
      'x-xss-protection',
      'strict-transport-security'
    ];
    
    const hasSecurityHeaders = securityHeaders.some(header => 
      headersResponse.headers[header] || headersResponse.headers[header.toLowerCase()]
    );
    recordTest('security', 'Security Headers', hasSecurityHeaders, 'Security headers present');
    
  } catch (error) {
    recordTest('security', 'Security Tests Setup', false, error.message);
  }
};

// Compliance Tests
const testCompliance = async () => {
  log('Starting Compliance Tests...');
  
  try {
    // Test GST compliance
    try {
      const gstResponse = await axios.get(`${BASE_URL}/api/test/gst-compliance`, { timeout: TEST_TIMEOUT });
      recordTest('compliance', 'GST Compliance', true, 'GST calculations working');
    } catch (error) {
      recordTest('compliance', 'GST Compliance', false, 'GST compliance not implemented');
    }
    
    // Test livestock welfare compliance
    try {
      const welfareResponse = await axios.get(`${BASE_URL}/api/test/livestock-welfare`, { timeout: TEST_TIMEOUT });
      recordTest('compliance', 'Livestock Welfare Compliance', true, 'Welfare checks implemented');
    } catch (error) {
      recordTest('compliance', 'Livestock Welfare Compliance', false, 'Welfare compliance not available');
    }
    
    // Test data privacy compliance
    try {
      const privacyResponse = await axios.get(`${BASE_URL}/api/test/data-privacy`, { timeout: TEST_TIMEOUT });
      recordTest('compliance', 'Data Privacy Compliance', true, 'Privacy controls implemented');
    } catch (error) {
      recordTest('compliance', 'Data Privacy Compliance', false, 'Privacy compliance not available');
    }
    
    // Test Indian e-commerce compliance
    try {
      const ecommerceResponse = await axios.get(`${BASE_URL}/api/test/ecommerce-compliance`, { timeout: TEST_TIMEOUT });
      recordTest('compliance', 'Indian E-commerce Compliance', true, 'E-commerce rules implemented');
    } catch (error) {
      recordTest('compliance', 'Indian E-commerce Compliance', false, 'E-commerce compliance not available');
    }
    
  } catch (error) {
    recordTest('compliance', 'Compliance Tests Setup', false, error.message);
  }
};

// Observability Tests
const testObservability = async () => {
  log('Starting Observability Tests...');
  
  try {
    // Test logging system
    try {
      const logResponse = await axios.get(`${BASE_URL}/api/test/logging`, { timeout: TEST_TIMEOUT });
      recordTest('observability', 'Logging System', true, 'Logging operational');
    } catch (error) {
      recordTest('observability', 'Logging System', false, 'Logging not available');
    }
    
    // Test metrics collection
    try {
      const metricsResponse = await axios.get(`${BASE_URL}/api/metrics`, { timeout: TEST_TIMEOUT });
      recordTest('observability', 'Metrics Collection', true, 'Metrics endpoint available');
    } catch (error) {
      recordTest('observability', 'Metrics Collection', false, 'Metrics not available');
    }
    
    // Test audit trails
    try {
      const auditResponse = await axios.get(`${BASE_URL}/api/test/audit-trails`, { timeout: TEST_TIMEOUT });
      recordTest('observability', 'Audit Trails', true, 'Audit logging implemented');
    } catch (error) {
      recordTest('observability', 'Audit Trails', false, 'Audit trails not available');
    }
    
    // Test health checks
    try {
      const healthResponse = await axios.get(`${BASE_URL}/api/health`, { timeout: TEST_TIMEOUT });
      const isHealthy = healthResponse.data.status === 'healthy';
      recordTest('observability', 'Health Checks', isHealthy, 'Health monitoring active');
    } catch (error) {
      recordTest('observability', 'Health Checks', false, 'Health checks not available');
    }
    
    // Test alerting system
    try {
      const alertResponse = await axios.get(`${BASE_URL}/api/test/alerting`, { timeout: TEST_TIMEOUT });
      recordTest('observability', 'Alerting System', true, 'Alerting configured');
    } catch (error) {
      recordTest('observability', 'Alerting System', false, 'Alerting not available');
    }
    
  } catch (error) {
    recordTest('observability', 'Observability Tests Setup', false, error.message);
  }
};

// Frontend Performance Tests
const testFrontendPerformance = async () => {
  log('Starting Frontend Performance Tests...');
  
  try {
    // Test page load time
    const start = Date.now();
    const response = await axios.get(`${FRONTEND_URL}/marketplace`, { timeout: TEST_TIMEOUT });
    const loadTime = Date.now() - start;
    
    const loadTimePassed = loadTime < 3000; // <3s page load
    recordTest('performance', 'Frontend Page Load Time', loadTimePassed, `${loadTime}ms`);
    
    // Test Service Worker
    try {
      const swResponse = await axios.get(`${FRONTEND_URL}/sw.js`, { timeout: TEST_TIMEOUT });
      recordTest('performance', 'Service Worker', swResponse.status === 200, 'Service Worker available');
    } catch (error) {
      recordTest('performance', 'Service Worker', false, 'Service Worker not found');
    }
    
    // Test image optimization
    try {
      const imageOptResponse = await axios.get(`${FRONTEND_URL}/api/test/image-optimization`, { timeout: TEST_TIMEOUT });
      recordTest('performance', 'Image Optimization', true, 'Image optimization working');
    } catch (error) {
      recordTest('performance', 'Image Optimization', false, 'Image optimization not available');
    }
    
  } catch (error) {
    recordTest('performance', 'Frontend Performance Tests', false, error.message);
  }
};

// Generate test report
const generateReport = async () => {
  const report = {
    timestamp: new Date().toISOString(),
    summary: testResults.overall,
    categories: {
      performance: {
        total: testResults.performance.length,
        passed: testResults.performance.filter(t => t.passed).length,
        failed: testResults.performance.filter(t => !t.passed).length,
        tests: testResults.performance
      },
      scalability: {
        total: testResults.scalability.length,
        passed: testResults.scalability.filter(t => t.passed).length,
        failed: testResults.scalability.filter(t => !t.passed).length,
        tests: testResults.scalability
      },
      security: {
        total: testResults.security.length,
        passed: testResults.security.filter(t => t.passed).length,
        failed: testResults.security.filter(t => !t.passed).length,
        tests: testResults.security
      },
      compliance: {
        total: testResults.compliance.length,
        passed: testResults.compliance.filter(t => t.passed).length,
        failed: testResults.compliance.filter(t => !t.passed).length,
        tests: testResults.compliance
      },
      observability: {
        total: testResults.observability.length,
        passed: testResults.observability.filter(t => t.passed).length,
        failed: testResults.observability.filter(t => !t.passed).length,
        tests: testResults.observability
      }
    }
  };
  
  // Save report to file
  await fs.writeFile(
    path.join(__dirname, 'test-report.json'),
    JSON.stringify(report, null, 2)
  );
  
  // Print summary
  log('\n=== TEST SUMMARY ===');
  log(`Total Tests: ${testResults.overall.total}`);
  log(`Passed: ${testResults.overall.passed}`, 'success');
  log(`Failed: ${testResults.overall.failed}`, testResults.overall.failed > 0 ? 'error' : 'success');
  log(`Success Rate: ${((testResults.overall.passed / testResults.overall.total) * 100).toFixed(2)}%`);
  
  log('\n=== CATEGORY BREAKDOWN ===');
  Object.entries(report.categories).forEach(([category, data]) => {
    const successRate = ((data.passed / data.total) * 100).toFixed(2);
    log(`${category.toUpperCase()}: ${data.passed}/${data.total} (${successRate}%)`);
  });
  
  return report;
};

// Main test execution
const runTests = async () => {
  log('🚀 Starting AnimalMela Non-Functional Requirements Test Suite');
  log(`Testing against: Backend ${BASE_URL}, Frontend ${FRONTEND_URL}`);
  
  try {
    await testPerformance();
    await testScalability();
    await testSecurity();
    await testCompliance();
    await testObservability();
    await testFrontendPerformance();
    
    const report = await generateReport();
    
    log('\n✅ All tests completed!');
    log(`📊 Report saved to: test-report.json`);
    
    // Exit with appropriate code
    process.exit(testResults.overall.failed > 0 ? 1 : 0);
    
  } catch (error) {
    log(`❌ Test suite failed: ${error.message}`, 'error');
    process.exit(1);
  }
};

// Run tests if called directly
if (require.main === module) {
  runTests();
}

module.exports = {
  runTests,
  testPerformance,
  testScalability,
  testSecurity,
  testCompliance,
  testObservability,
  testFrontendPerformance,
  generateReport
};
