# 📱 SMS Setup Guide for Kisaanmela OTP

## 🚀 Quick Setup Steps

### Step 1: Get Fast2SMS API Key (Recommended for India)

1. **Visit Fast2SMS**: Go to [https://www.fast2sms.com](https://www.fast2sms.com)
2. **Sign Up/Login**: Create account or login
3. **Get API Key**: 
   - Go to Dashboard → API Keys
   - Copy your API key (starts with something like `abcd1234...`)
4. **Add Credits**: Add some credits to your account (₹10-50 is enough for testing)

### Step 2: Configure Environment Variables

Create or update your `.env.local` file in the `web-frontend` directory:

```bash
# Fast2SMS Configuration
SMS_SERVICE_AUTHORIZATION_KEY=your_actual_fast2sms_api_key_here
SMS_SERVICE_API=https://www.fast2sms.com/dev/bulkV2

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/kisaanmela
```

### Step 3: Restart Development Server

After adding the API key, restart the development server:

```bash
# Stop the current server (Ctrl+C)
# Then restart
cd web-frontend && npm run dev
```

### Step 4: Test SMS Sending

Test the OTP endpoint:

```bash
curl -X POST http://localhost:3000/api/auth/otp/send \
  -H "Content-Type: application/json" \
  -d '{"mobile":"YOUR_MOBILE_NUMBER"}'
```

## 🧪 Testing Commands

### Test OTP Send
```bash
curl -X POST http://localhost:3000/api/auth/otp/send \
  -H "Content-Type: application/json" \
  -d '{"mobile":"9876543210"}'
```

**Expected Response (with SMS configured):**
```json
{
  "success": true,
  "message": "SMS sent successfully via Fast2SMS",
  "provider": "Fast2SMS",
  "otp": "123456"
}
```

**Expected Response (demo mode):**
```json
{
  "success": true,
  "message": "OTP sent successfully (demo mode)",
  "otp": "123456",
  "demo": true
}
```

## 🔧 Troubleshooting

### Issue: "OTP sent successfully (demo mode)"
**Solution**: Add your Fast2SMS API key to `.env.local` file

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

## 🔄 Alternative SMS Services

### Twilio (International)
```bash
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

### MSG91 (India-focused)
```bash
MSG91_API_KEY=your_msg91_api_key
MSG91_TEMPLATE_ID=your_msg91_template_id
MSG91_SENDER_ID=your_msg91_sender_id
```

---

**Next Steps**: After configuring Fast2SMS, test the complete OTP flow and then implement the frontend components.