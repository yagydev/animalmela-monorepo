#!/usr/bin/env node

// Debug SMS Configuration
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'web-frontend', '.env.local') });

console.log('🔍 SMS Configuration Debug');
console.log('==========================');

// Check all SMS environment variables
const fast2smsApiKey = process.env.SMS_SERVICE_AUTHORIZATION_KEY;
const fast2smsApiUrl = process.env.SMS_SERVICE_API;
const msg91ApiKey = process.env.MSG91_API_KEY;
const msg91TemplateId = process.env.MSG91_TEMPLATE_ID;
const msg91SenderId = process.env.MSG91_SENDER_ID;
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

console.log('📋 Environment Variables:');
console.log(`SMS_SERVICE_AUTHORIZATION_KEY: ${fast2smsApiKey ? '✅ Set' : '❌ Not set'}`);
console.log(`SMS_SERVICE_API: ${fast2smsApiUrl || '❌ Not set'}`);
console.log(`MSG91_API_KEY: ${msg91ApiKey ? '✅ Set' : '❌ Not set'}`);
console.log(`MSG91_TEMPLATE_ID: ${msg91TemplateId || '❌ Not set'}`);
console.log(`MSG91_SENDER_ID: ${msg91SenderId || '❌ Not set'}`);
console.log(`TWILIO_ACCOUNT_SID: ${twilioAccountSid ? '✅ Set' : '❌ Not set'}`);
console.log(`TWILIO_AUTH_TOKEN: ${twilioAuthToken ? '✅ Set' : '❌ Not set'}`);
console.log(`TWILIO_PHONE_NUMBER: ${twilioPhoneNumber || '❌ Not set'}`);

console.log('\n🔧 Configuration Analysis:');

// Fast2SMS
if (fast2smsApiKey) {
  console.log(`Fast2SMS API Key Length: ${fast2smsApiKey.length}`);
  console.log(`Fast2SMS API Key Preview: ${fast2smsApiKey.substring(0, 10)}...`);
  if (fast2smsApiKey === 'your_fast2sms_api_key_here') {
    console.log('❌ Fast2SMS: Still using placeholder');
  } else if (fast2smsApiKey.length < 10) {
    console.log('❌ Fast2SMS: API key too short');
  } else {
    console.log('✅ Fast2SMS: API key looks valid');
  }
} else {
  console.log('❌ Fast2SMS: No API key found');
}

// MSG91
if (msg91ApiKey) {
  console.log(`MSG91 API Key Length: ${msg91ApiKey.length}`);
  console.log(`MSG91 API Key Preview: ${msg91ApiKey.substring(0, 10)}...`);
  if (msg91ApiKey === 'your_msg91_api_key_here') {
    console.log('❌ MSG91: Still using placeholder');
  } else if (msg91ApiKey.length < 10) {
    console.log('❌ MSG91: API key too short');
  } else {
    console.log('✅ MSG91: API key looks valid');
  }
} else {
  console.log('❌ MSG91: No API key found');
}

// Twilio
if (twilioAccountSid && twilioAuthToken) {
  console.log(`Twilio Account SID: ${twilioAccountSid.substring(0, 10)}...`);
  if (twilioAccountSid === 'your_twilio_account_sid_here') {
    console.log('❌ Twilio: Still using placeholder');
  } else if (twilioAccountSid.startsWith('AC')) {
    console.log('✅ Twilio: Account SID looks valid');
  } else {
    console.log('❌ Twilio: Invalid Account SID format');
  }
} else {
  console.log('❌ Twilio: Missing credentials');
}

console.log('\n🎯 Expected Provider Priority:');
console.log('1. Fast2SMS (if API key valid)');
console.log('2. Twilio (if credentials valid)');
console.log('3. MSG91 (if API key valid)');
console.log('4. Demo mode (if none valid)');

console.log('\n📱 Current Behavior:');
console.log('System is using MSG91, which suggests:');
console.log('- Fast2SMS might be failing');
console.log('- MSG91 might have valid credentials');
console.log('- Check server logs for Fast2SMS errors');
