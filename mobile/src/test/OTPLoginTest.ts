// src/test/OTPLoginTest.ts
// Test file to verify OTP login integration

import AuthAPI from '../api/auth';

/**
 * Test the OTP login flow
 * This is a demonstration of how the OTP login works
 */
export const testOTPLoginFlow = async () => {
  console.log('🧪 Testing OTP Login Flow...');
  
  try {
    // Test 1: Send OTP
    console.log('📱 Step 1: Sending OTP to test number...');
    const testPhone = '9876543210';
    
    const sendOTPResponse = await AuthAPI.sendOTP(testPhone);
    console.log('✅ Send OTP Response:', sendOTPResponse);
    
    if (!sendOTPResponse.success) {
      throw new Error('Failed to send OTP');
    }
    
    // Test 2: Verify OTP (using a mock OTP for testing)
    console.log('🔐 Step 2: Verifying OTP...');
    const testOTP = '123456'; // In real scenario, this would be the actual OTP received
    
    const verifyOTPResponse = await AuthAPI.verifyOTP(testPhone, testOTP);
    console.log('✅ Verify OTP Response:', verifyOTPResponse);
    
    if (!verifyOTPResponse.success) {
      throw new Error('Failed to verify OTP');
    }
    
    console.log('🎉 OTP Login Flow Test Completed Successfully!');
    console.log('👤 User logged in:', verifyOTPResponse.user);
    console.log('🔑 Token received:', verifyOTPResponse.token ? 'Yes' : 'No');
    
    return {
      success: true,
      user: verifyOTPResponse.user,
      token: verifyOTPResponse.token
    };
    
  } catch (error) {
    console.error('❌ OTP Login Flow Test Failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Test error handling scenarios
 */
export const testErrorHandling = async () => {
  console.log('🧪 Testing Error Handling...');
  
  try {
    // Test invalid phone number
    console.log('📱 Testing invalid phone number...');
    const invalidPhone = '123';
    
    try {
      await AuthAPI.sendOTP(invalidPhone);
    } catch (error) {
      console.log('✅ Invalid phone error handled:', error.message);
    }
    
    // Test invalid OTP
    console.log('🔐 Testing invalid OTP...');
    const validPhone = '9876543210';
    const invalidOTP = '000000';
    
    try {
      await AuthAPI.verifyOTP(validPhone, invalidOTP);
    } catch (error) {
      console.log('✅ Invalid OTP error handled:', error.message);
    }
    
    console.log('🎉 Error Handling Test Completed!');
    
  } catch (error) {
    console.error('❌ Error Handling Test Failed:', error);
  }
};

/**
 * Run all tests
 */
export const runAllTests = async () => {
  console.log('🚀 Starting OTP Login Integration Tests...\n');
  
  await testOTPLoginFlow();
  console.log('\n');
  await testErrorHandling();
  
  console.log('\n🏁 All tests completed!');
};

// Export for use in development/testing
export default {
  testOTPLoginFlow,
  testErrorHandling,
  runAllTests
};

