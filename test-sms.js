#!/usr/bin/env node

// 🧪 Test SMS Service - Quick test for Fast2SMS integration

const axios = require('axios');

// Test configuration
const FAST2SMS_API_URL = 'https://www.fast2sms.com/dev/bulkV2';
const TEST_MOBILE = '9876543210'; // Change this to your mobile number
const TEST_OTP = '123456';

async function testFast2SMS(apiKey, mobile) {
  const message = `Your KisaanMela OTP is: ${TEST_OTP}. Valid for 10 minutes. Do not share this OTP with anyone. - KisaanMela`;
  
  console.log('🧪 Testing Fast2SMS Integration');
  console.log('================================');
  console.log(`📱 Mobile: ${mobile}`);
  console.log(`🔑 API Key: ${apiKey.substring(0, 8)}...`);
  console.log(`💬 Message: ${message}`);
  console.log('');
  
  try {
    console.log('📤 Sending SMS...');
    
    const response = await axios.post(FAST2SMS_API_URL, {
      route: 'q',
      message: message,
      language: 'english',
      flash: 0,
      numbers: mobile
    }, {
      headers: {
        'authorization': apiKey,
        'Content-Type': 'application/json'
      },
      timeout: 15000
    });

    console.log('📋 Response Status:', response.status);
    console.log('📋 Response Data:', JSON.stringify(response.data, null, 2));

    if (response.data.return === true) {
      console.log('✅ SMS sent successfully!');
      console.log(`📱 Check your mobile ${mobile} for the OTP`);
      return {
        success: true,
        message: 'SMS sent successfully',
        requestId: response.data.request_id
      };
    } else {
      console.log('❌ SMS sending failed');
      console.log('Error:', response.data.message || 'Unknown error');
      return {
        success: false,
        error: response.data.message || 'Fast2SMS API error'
      };
    }
  } catch (error) {
    console.log('❌ SMS sending failed with error:');
    console.log('Error:', error.message);
    
    if (error.response) {
      console.log('Response Status:', error.response.status);
      console.log('Response Data:', JSON.stringify(error.response.data, null, 2));
    }
    
    return {
      success: false,
      error: error.message
    };
  }
}

// Main function
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('Usage: node test-sms.js <API_KEY> <MOBILE_NUMBER>');
    console.log('Example: node test-sms.js "your_api_key_here" "9876543210"');
    console.log('');
    console.log('📋 To get Fast2SMS API key:');
    console.log('1. Visit: https://www.fast2sms.com');
    console.log('2. Sign up/Login');
    console.log('3. Go to Dashboard → API Keys');
    console.log('4. Copy your API key');
    console.log('');
    process.exit(1);
  }
  
  const apiKey = args[0];
  const mobile = args[1];
  
  // Validate mobile number
  if (!/^[6-9]\d{9}$/.test(mobile)) {
    console.log('❌ Invalid mobile number format');
    console.log('Please use 10-digit Indian mobile number (e.g., 9876543210)');
    process.exit(1);
  }
  
  const result = await testFast2SMS(apiKey, mobile);
  
  console.log('');
  console.log('🎯 Test Result:', result.success ? 'SUCCESS' : 'FAILED');
  
  if (result.success) {
    console.log('✅ SMS service is working correctly!');
    console.log('📱 You should receive the OTP on your mobile');
  } else {
    console.log('❌ SMS service failed:', result.error);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('1. Check if API key is correct');
    console.log('2. Ensure you have sufficient credits in Fast2SMS account');
    console.log('3. Verify mobile number format');
    console.log('4. Check internet connectivity');
  }
}

main().catch(console.error);
