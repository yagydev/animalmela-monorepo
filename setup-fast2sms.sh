#!/bin/bash

# Fast2SMS Setup Script for Kisaanmela OTP Service
# This script helps configure Fast2SMS for sending OTP SMS

echo "🚀 Fast2SMS Setup for Kisaanmela OTP Service"
echo "=============================================="

# Check if .env.local exists
if [ ! -f "web-frontend/.env.local" ]; then
    echo "📝 Creating .env.local file..."
    cp web-frontend/env.example web-frontend/.env.local
    echo "✅ Created web-frontend/.env.local"
else
    echo "✅ .env.local already exists"
fi

echo ""
echo "📋 Setup Instructions:"
echo "1. Visit: https://www.fast2sms.com/"
echo "2. Sign up and verify your mobile number"
echo "3. Go to Dashboard → API"
echo "4. Copy your API key"
echo "5. Run: nano web-frontend/.env.local"
echo "6. Update SMS_SERVICE_AUTHORIZATION_KEY with your actual API key"
echo "7. Restart dev server: npm run dev"
echo ""

echo "🔧 Current .env.local SMS configuration:"
if grep -q "SMS_SERVICE_AUTHORIZATION_KEY" web-frontend/.env.local; then
    echo "SMS_SERVICE_AUTHORIZATION_KEY found in .env.local"
    current_key=$(grep "SMS_SERVICE_AUTHORIZATION_KEY" web-frontend/.env.local | cut -d'=' -f2)
    if [ "$current_key" = "your_fast2sms_api_key_here" ]; then
        echo "❌ Still using placeholder API key"
        echo "   Please update with your actual Fast2SMS API key"
    else
        echo "✅ API key configured: ${current_key:0:10}..."
    fi
else
    echo "❌ SMS_SERVICE_AUTHORIZATION_KEY not found"
    echo "   Adding SMS configuration to .env.local..."
    echo "" >> web-frontend/.env.local
    echo "# SMS Service Configuration" >> web-frontend/.env.local
    echo "SMS_SERVICE_AUTHORIZATION_KEY=your_fast2sms_api_key_here" >> web-frontend/.env.local
    echo "SMS_SERVICE_API=https://www.fast2sms.com/dev/bulkV2" >> web-frontend/.env.local
    echo "✅ Added SMS configuration"
fi

echo ""
echo "🧪 Test OTP API:"
echo "curl -X POST http://localhost:3000/api/auth/otp/send \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{\"mobile\": \"9560604508\"}'"
echo ""

echo "📱 Expected Response (after setup):"
echo "{"
echo "  \"success\": true,"
echo "  \"message\": \"OTP sent successfully via Fast2SMS\","
echo "  \"provider\": \"Fast2SMS\""
echo "}"
echo ""

echo "💰 Cost: ~₹0.50-1.00 per SMS"
echo "🔒 Security: Never commit API keys to git"
echo ""

echo "✅ Setup script completed!"
echo "   Next: Update API key in .env.local and restart dev server"