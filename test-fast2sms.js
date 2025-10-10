#!/usr/bin/env node

// Test Fast2SMS Configuration
// Run: node test-fast2sms.js

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'web-frontend', '.env.local') });

console.log('🧪 Fast2SMS Configuration Test');
console.log('================================');

// Check environment variables
const fast2smsApiKey = process.env.SMS_SERVICE_AUTHORIZATION_KEY;
const fast2smsApiUrl = process.env.SMS_SERVICE_API;

console.log('📋 Configuration Check:');
console.log(`SMS_SERVICE_AUTHORIZATION_KEY: ${fast2smsApiKey ? '✅ Set' : '❌ Not set'}`);
console.log(`SMS_SERVICE_API: ${fast2smsApiUrl || '❌ Not set'}`);

if (fast2smsApiKey) {
  console.log(`API Key Length: ${fast2smsApiKey.length} characters`);
  console.log(`API Key Preview: ${fast2smsApiKey.substring(0, 8)}...`);
  
  if (fast2smsApiKey === 'your_fast2sms_api_key_here') {
    console.log('❌ Still using placeholder API key');
    console.log('   Please update with your actual Fast2SMS API key');
  } else if (fast2smsApiKey.length < 10) {
    console.log('❌ API key too short');
  } else {
    console.log('✅ API key format looks valid');
  }
} else {
  console.log('❌ SMS_SERVICE_AUTHORIZATION_KEY not found in environment');
}

console.log('\n📋 Next Steps:');
console.log('1. Get API key from: https://www.fast2sms.com/');
console.log('2. Update web-frontend/.env.local file');
console.log('3. Set SMS_SERVICE_AUTHORIZATION_KEY=your_actual_api_key');
console.log('4. Restart dev server: npm run dev');
console.log('5. Test OTP: curl -X POST http://localhost:3000/api/auth/otp/send -H "Content-Type: application/json" -d \'{"mobile": "9560604508"}\'');

console.log('\n💰 Cost Information:');
console.log('- Setup: Free');
console.log('- Per SMS: ₹0.50-1.00');
console.log('- Minimum Recharge: ₹100');

console.log('\n🔒 Security Notes:');
console.log('- Never commit API keys to git');
console.log('- Use environment variables only');
console.log('- Monitor usage regularly');
