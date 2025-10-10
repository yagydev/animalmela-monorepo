#!/usr/bin/env node

// Direct Fast2SMS Test
const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'web-frontend', '.env.local') });

async function testFast2SMS() {
  console.log('🧪 Direct Fast2SMS Test');
  console.log('======================');
  
  const apiKey = process.env.SMS_SERVICE_AUTHORIZATION_KEY;
  const apiUrl = process.env.SMS_SERVICE_API || 'https://www.fast2sms.com/dev/bulkV2';
  const mobile = '9560604508';
  const otp = '123456';
  const message = `Your Kisaanmela OTP is: ${otp}. Valid for 10 minutes. Do not share this OTP with anyone.`;
  
  console.log('📋 Configuration:');
  console.log(`API Key: ${apiKey ? apiKey.substring(0, 10) + '...' : 'Not set'}`);
  console.log(`API URL: ${apiUrl}`);
  console.log(`Mobile: ${mobile}`);
  console.log(`Message: ${message}`);
  
  if (!apiKey || apiKey === 'your_fast2sms_api_key_here') {
    console.log('❌ Invalid API key');
    return;
  }
  
  try {
    console.log('\n📱 Sending SMS via Fast2SMS...');
    
    const response = await axios.post(apiUrl, {
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
      timeout: 10000
    });
    
    console.log('✅ Fast2SMS Response:');
    console.log(JSON.stringify(response.data, null, 2));
    
    if (response.data.return === true) {
      console.log('🎉 SMS sent successfully via Fast2SMS!');
    } else {
      console.log('❌ Fast2SMS returned error:', response.data.message);
    }
    
  } catch (error) {
    console.log('❌ Fast2SMS Error:');
    console.log('Error message:', error.message);
    if (error.response) {
      console.log('Response status:', error.response.status);
      console.log('Response data:', error.response.data);
    }
  }
}

testFast2SMS();
