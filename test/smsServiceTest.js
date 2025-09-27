// test/smsServiceTest.js
const smsService = require('../backend/services/smsService');

/**
 * Test SMS service functionality
 */
async function testSMSService() {
  console.log('🧪 Testing SMS Service...\n');

  // Check configuration
  console.log('📋 Configuration Status:');
  console.log(`- SMS Service Configured: ${smsService.isConfigured()}`);
  console.log(`- Available Providers: ${smsService.getAvailableProviders().join(', ') || 'None'}\n`);

  if (!smsService.isConfigured()) {
    console.log('⚠️  No SMS providers configured. Add environment variables to test SMS sending.');
    console.log('📖 See SMS_SETUP_GUIDE.md for configuration instructions.\n');
    
    // Test with mock data
    console.log('🔧 Testing with mock data (development mode):');
    try {
      const result = await smsService.sendOTP('9876543210', '123456');
      console.log('✅ Mock SMS test result:', result);
    } catch (error) {
      console.error('❌ Mock SMS test failed:', error.message);
    }
    return;
  }

  // Test with real phone number (use your own number for testing)
  const testMobile = '9876543210'; // Replace with your mobile number for testing
  const testOTP = '123456';

  console.log(`📱 Testing SMS delivery to ${testMobile}...`);
  
  try {
    const result = await smsService.sendOTP(testMobile, testOTP);
    
    if (result.success) {
      console.log('✅ SMS sent successfully!');
      console.log(`📤 Provider: ${result.provider}`);
      console.log(`💬 Message: ${result.message}`);
      if (result.requestId) {
        console.log(`🆔 Request ID: ${result.requestId}`);
      }
    } else {
      console.log('❌ SMS sending failed:');
      console.log(`📤 Provider: ${result.provider}`);
      console.log(`💬 Error: ${result.message}`);
    }
  } catch (error) {
    console.error('❌ SMS test failed:', error.message);
  }
}

/**
 * Test individual SMS providers
 */
async function testIndividualProviders() {
  console.log('\n🔍 Testing Individual Providers...\n');

  const testMobile = '9876543210';
  const testOTP = '123456';
  const message = `Test OTP: ${testOTP}`;

  // Test Fast2SMS
  if (smsService.fast2smsApiKey) {
    console.log('📱 Testing Fast2SMS...');
    try {
      const result = await smsService.sendViaFast2SMS(testMobile, message);
      console.log('✅ Fast2SMS result:', result);
    } catch (error) {
      console.error('❌ Fast2SMS failed:', error.message);
    }
  }

  // Test Twilio
  if (smsService.twilioAccountSid && smsService.twilioAuthToken) {
    console.log('\n📱 Testing Twilio...');
    try {
      const result = await smsService.sendViaTwilio(testMobile, message);
      console.log('✅ Twilio result:', result);
    } catch (error) {
      console.error('❌ Twilio failed:', error.message);
    }
  }

  // Test MSG91
  if (smsService.msg91ApiKey) {
    console.log('\n📱 Testing MSG91...');
    try {
      const result = await smsService.sendViaMSG91(testMobile, testOTP);
      console.log('✅ MSG91 result:', result);
    } catch (error) {
      console.error('❌ MSG91 failed:', error.message);
    }
  }
}

/**
 * Run all tests
 */
async function runAllTests() {
  console.log('🚀 Starting SMS Service Tests...\n');
  
  await testSMSService();
  await testIndividualProviders();
  
  console.log('\n🏁 SMS Service tests completed!');
  console.log('\n📖 For production setup, see SMS_SETUP_GUIDE.md');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  testSMSService,
  testIndividualProviders,
  runAllTests
};

