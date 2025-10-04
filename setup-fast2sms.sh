#!/bin/bash

# 🚀 Fast2SMS Setup Script for KisaanMela

echo "📱 Fast2SMS Setup for KisaanMela OTP"
echo "=================================="
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "📄 Creating .env file from env.development..."
    cp env.development .env
fi

echo "🔑 Please enter your Fast2SMS API key:"
echo "   (Get it from: https://www.fast2sms.com/dashboard)"
echo ""
read -p "Fast2SMS API Key: " api_key

if [ -z "$api_key" ]; then
    echo "❌ No API key provided. Exiting..."
    exit 1
fi

# Update .env file
echo "📝 Updating .env file..."
sed -i '' "s/SMS_SERVICE_AUTHORIZATION_KEY=.*/SMS_SERVICE_AUTHORIZATION_KEY=$api_key/" .env

echo "✅ Fast2SMS API key configured!"
echo ""

# Test mobile number
echo "📱 Enter your mobile number for testing (10 digits, Indian number):"
read -p "Mobile Number: " mobile

if [[ ! $mobile =~ ^[6-9][0-9]{9}$ ]]; then
    echo "❌ Invalid mobile number format. Please use 10-digit Indian mobile number."
    exit 1
fi

echo ""
echo "🚀 Starting OTP server..."

# Kill existing server
pkill -f "otp-backend-server" 2>/dev/null || true

# Start server
node otp-backend-server.js &
SERVER_PID=$!

echo "⏳ Waiting for server to start..."
sleep 3

echo ""
echo "🧪 Testing OTP sending to $mobile..."

# Test OTP sending
response=$(curl -s -X POST http://localhost:5001/api/auth/otp/send \
  -H "Content-Type: application/json" \
  -d "{\"mobile\":\"$mobile\"}")

echo "📋 Response:"
echo "$response" | jq . 2>/dev/null || echo "$response"

echo ""
echo "📱 Check your mobile for the OTP SMS!"
echo ""
echo "🔧 Server is running with PID: $SERVER_PID"
echo "🛑 To stop server: kill $SERVER_PID"
echo ""
echo "📖 For more help, see: FAST2SMS_SETUP_GUIDE.md"
