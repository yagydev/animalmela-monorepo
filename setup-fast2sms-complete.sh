#!/bin/bash

# Complete Fast2SMS Setup Script for Kisaanmela
# This script provides step-by-step instructions and validation

echo "🚀 Complete Fast2SMS Setup for Kisaanmela OTP Service"
echo "======================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if .env.local exists
if [ ! -f "web-frontend/.env.local" ]; then
    echo -e "${YELLOW}📝 Creating .env.local file...${NC}"
    cp web-frontend/env.example web-frontend/.env.local
    echo -e "${GREEN}✅ Created web-frontend/.env.local${NC}"
else
    echo -e "${GREEN}✅ .env.local already exists${NC}"
fi

echo ""
echo -e "${BLUE}📋 Fast2SMS Setup Instructions:${NC}"
echo "1. Visit: https://www.fast2sms.com/"
echo "2. Sign up for a free account"
echo "3. Verify your mobile number"
echo "4. Go to Dashboard → API"
echo "5. Copy your API key (32 characters)"
echo "6. Run: nano web-frontend/.env.local"
echo "7. Update SMS_SERVICE_AUTHORIZATION_KEY with your actual API key"
echo "8. Restart dev server: npm run dev"
echo ""

# Check current configuration
echo -e "${BLUE}🔧 Current Configuration Status:${NC}"
if grep -q "SMS_SERVICE_AUTHORIZATION_KEY" web-frontend/.env.local; then
    current_key=$(grep "SMS_SERVICE_AUTHORIZATION_KEY" web-frontend/.env.local | cut -d'=' -f2)
    if [ "$current_key" = "your_fast2sms_api_key_here" ]; then
        echo -e "${RED}❌ Still using placeholder API key${NC}"
        echo -e "${YELLOW}   Please update with your actual Fast2SMS API key${NC}"
    else
        echo -e "${GREEN}✅ API key configured: ${current_key:0:10}...${NC}"
    fi
else
    echo -e "${RED}❌ SMS_SERVICE_AUTHORIZATION_KEY not found${NC}"
    echo -e "${YELLOW}   Adding SMS configuration...${NC}"
    echo "" >> web-frontend/.env.local
    echo "# SMS Service Configuration" >> web-frontend/.env.local
    echo "SMS_SERVICE_AUTHORIZATION_KEY=your_fast2sms_api_key_here" >> web-frontend/.env.local
    echo "SMS_SERVICE_API=https://www.fast2sms.com/dev/bulkV2" >> web-frontend/.env.local
    echo -e "${GREEN}✅ Added SMS configuration${NC}"
fi

echo ""
echo -e "${BLUE}🧪 Test Commands:${NC}"
echo "1. Test configuration:"
echo "   node test-fast2sms.js"
echo ""
echo "2. Test OTP API:"
echo "   curl -X POST http://localhost:3000/api/auth/otp/send \\"
echo "     -H \"Content-Type: application/json\" \\"
echo "     -d '{\"mobile\": \"9560604508\"}'"
echo ""

echo -e "${BLUE}📱 Expected Response (After Setup):${NC}"
echo "{"
echo "  \"success\": true,"
echo "  \"message\": \"OTP sent successfully via Fast2SMS\","
echo "  \"provider\": \"Fast2SMS\","
echo "  \"requestId\": \"1234567890\""
echo "}"
echo ""

echo -e "${BLUE}💰 Cost Information:${NC}"
echo "- Setup: Free"
echo "- Per SMS: ₹0.50-1.00"
echo "- Minimum Recharge: ₹100"
echo "- Validity: 1 year"
echo ""

echo -e "${BLUE}🔒 Security Notes:${NC}"
echo "- Never commit API keys to git"
echo "- Use environment variables only"
echo "- Monitor usage regularly"
echo "- Rotate keys periodically"
echo ""

echo -e "${BLUE}🛠️ Troubleshooting:${NC}"
echo "If SMS still not working:"
echo "1. Check API key format (32 characters)"
echo "2. Verify account has sufficient balance"
echo "3. Check phone number format (10 digits)"
echo "4. Restart dev server after changes"
echo "5. Check console logs for errors"
echo ""

echo -e "${GREEN}✅ Setup script completed!${NC}"
echo -e "${YELLOW}   Next: Get API key from Fast2SMS and update .env.local${NC}"

# Offer to open Fast2SMS website
read -p "Would you like to open Fast2SMS website? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v open &> /dev/null; then
        open "https://www.fast2sms.com/"
    elif command -v xdg-open &> /dev/null; then
        xdg-open "https://www.fast2sms.com/"
    else
        echo "Please visit: https://www.fast2sms.com/"
    fi
fi
