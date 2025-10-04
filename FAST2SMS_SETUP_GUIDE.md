# 📱 Fast2SMS Setup Guide for KisaanMela OTP

## 🚀 Quick Setup Steps

### Step 1: Get Fast2SMS API Key

1. **Visit Fast2SMS**: Go to [https://www.fast2sms.com](https://www.fast2sms.com)
2. **Sign Up/Login**: Create account or login
3. **Get API Key**: 
   - Go to Dashboard → API Keys
   - Copy your API key (starts with something like `abcd1234...`)
4. **Add Credits**: Add some credits to your account (₹10-50 is enough for testing)

### Step 2: Configure Environment Variables

Update your `.env` file with your Fast2SMS API key:

```bash
# Replace YOUR_FAST2SMS_API_KEY_HERE with your actual API key
SMS_SERVICE_AUTHORIZATION_KEY=your_actual_fast2sms_api_key_here
```

### Step 3: Test SMS Sending

After adding the API key, restart the server and test:

```bash
# Kill existing server
pkill -f "otp-backend-server"

# Start server with new config
node otp-backend-server.js &

# Test OTP sending
curl -X POST http://localhost:5001/api/auth/otp/send \
  -H "Content-Type: application/json" \
  -d '{"mobile":"YOUR_MOBILE_NUMBER"}'
```

## 🧪 Testing Commands

### Test OTP Send
```bash
curl -X POST http://localhost:5001/api/auth/otp/send \
  -H "Content-Type: application/json" \
  -d '{"mobile":"9876543210"}' | jq .
```

### Test OTP Verify
```bash
curl -X POST http://localhost:5001/api/auth/otp/verify \
  -H "Content-Type: application/json" \
  -d '{"mobile":"9876543210","otp":"123456","name":"Test User"}' | jq .
```

## 🔧 Troubleshooting

### Issue: "OTP logged to console (development mode)"
**Solution**: Add your Fast2SMS API key to environment variables

### Issue: "SMS sending failed"
**Possible causes**:
1. Invalid API key
2. Insufficient credits in Fast2SMS account
3. Invalid mobile number format
4. Network connectivity issues

### Issue: "Invalid mobile number format"
**Solution**: Use 10-digit Indian mobile numbers (e.g., 9876543210)

## 📋 Fast2SMS API Response Codes

- `return: true` - SMS sent successfully
- `return: false` - SMS failed (check message for details)

## 🔐 Security Notes

1. **Never commit API keys** to version control
2. **Use environment variables** for API keys
3. **Rotate API keys** regularly
4. **Monitor usage** to prevent abuse

## 💰 Pricing (Approximate)

- **Transactional SMS**: ₹0.25 per SMS
- **Promotional SMS**: ₹0.15 per SMS
- **OTP SMS**: ₹0.25 per SMS

## 🎯 Production Checklist

- [ ] Valid Fast2SMS API key configured
- [ ] Sufficient credits in account
- [ ] SMS templates approved (if using templates)
- [ ] Rate limiting implemented
- [ ] Error handling for failed SMS
- [ ] Monitoring and alerting setup

## 📞 Support

- **Fast2SMS Support**: [https://www.fast2sms.com/contact](https://www.fast2sms.com/contact)
- **API Documentation**: [https://docs.fast2sms.com](https://docs.fast2sms.com)

---

**Next Steps**: After configuring Fast2SMS, test the complete OTP flow and then implement the frontend components.
