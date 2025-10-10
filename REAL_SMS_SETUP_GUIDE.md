# 📱 Real SMS Setup Guide for Kisaanmela OTP

## 🚨 Current Issue Fixed
- **Problem**: MSG91 was returning "success" with placeholder API keys, but no SMS was actually sent
- **Solution**: Added validation to detect placeholder values and properly fall back to demo mode
- **Status**: ✅ Fixed - Now correctly shows demo mode when no real SMS service is configured

## 🚀 Quick Setup for Real SMS (Choose One)

### Option 1: Fast2SMS (Recommended for India)

#### Step 1: Get API Key
1. Visit [https://www.fast2sms.com](https://www.fast2sms.com)
2. Sign up/Login
3. Go to Dashboard → API Keys
4. Copy your API key (starts with something like `abcd1234...`)

#### Step 2: Add Credits
- Add ₹10-50 to your account for testing
- Check pricing: ₹0.25 per SMS

#### Step 3: Configure Environment
Update `web-frontend/.env.local`:
```bash
# Replace with your actual Fast2SMS API key
SMS_SERVICE_AUTHORIZATION_KEY=your_actual_fast2sms_api_key_here
SMS_SERVICE_API=https://www.fast2sms.com/dev/bulkV2
```

#### Step 4: Test
```bash
curl -X POST http://localhost:3000/api/auth/otp/send \
  -H "Content-Type: application/json" \
  -d '{"mobile":"YOUR_MOBILE_NUMBER"}'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "SMS sent successfully via Fast2SMS",
  "provider": "Fast2SMS",
  "otp": "123456"
}
```

---

### Option 2: Twilio (International)

#### Step 1: Get Credentials
1. Visit [https://www.twilio.com](https://www.twilio.com)
2. Sign up for free account
3. Get Account SID (starts with `AC...`)
4. Get Auth Token
5. Get Phone Number

#### Step 2: Configure Environment
Update `web-frontend/.env.local`:
```bash
# Replace with your actual Twilio credentials
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_actual_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

#### Step 3: Test
```bash
curl -X POST http://localhost:3000/api/auth/otp/send \
  -H "Content-Type: application/json" \
  -d '{"mobile":"YOUR_MOBILE_NUMBER"}'
```

---

### Option 3: MSG91 (India-focused)

#### Step 1: Get API Key
1. Visit [https://msg91.com](https://msg91.com)
2. Sign up/Login
3. Get API Key
4. Create OTP Template
5. Get Template ID

#### Step 2: Configure Environment
Update `web-frontend/.env.local`:
```bash
# Replace with your actual MSG91 credentials
MSG91_API_KEY=your_actual_msg91_api_key_here
MSG91_TEMPLATE_ID=your_actual_template_id_here
MSG91_SENDER_ID=your_actual_sender_id_here
```

## 🧪 Testing Commands

### Test OTP Send
```bash
curl -X POST http://localhost:3000/api/auth/otp/send \
  -H "Content-Type: application/json" \
  -d '{"mobile":"9876543210"}'
```

### Test with Invalid Mobile
```bash
curl -X POST http://localhost:3000/api/auth/otp/send \
  -H "Content-Type: application/json" \
  -d '{"mobile":"1234567890"}'
```

**Expected Response (Invalid Mobile):**
```json
{
  "success": false,
  "error": "Please enter a valid 10-digit mobile number"
}
```

## 🔧 Troubleshooting

### Issue: "OTP sent successfully (demo mode)"
**Solution**: Configure a real SMS provider using one of the options above

### Issue: "All SMS services are currently unavailable"
**Possible causes**:
1. Invalid API key format
2. Insufficient credits
3. Network connectivity issues
4. API service downtime

### Issue: "Request failed with status code 401"
**Solution**: Check your API key is correct and has sufficient credits

### Issue: "accountSid must start with AC"
**Solution**: Use a valid Twilio Account SID that starts with "AC"

## 📋 Current Status

### ✅ Working Features
- Mobile number validation (10-digit Indian format)
- Random 6-digit OTP generation
- Demo mode fallback
- Multiple SMS provider support
- Proper error handling

### 🔄 Demo Mode (Current)
```json
{
  "success": true,
  "message": "OTP sent successfully (demo mode)",
  "otp": "123456",
  "demo": true
}
```

### 🎯 Real SMS Mode (After Configuration)
```json
{
  "success": true,
  "message": "SMS sent successfully via Fast2SMS",
  "provider": "Fast2SMS",
  "otp": "123456"
}
```

## 💰 Pricing Comparison

| Provider | Cost per SMS | Best For |
|----------|--------------|----------|
| Fast2SMS | ₹0.25 | India |
| Twilio | $0.0075 | International |
| MSG91 | ₹0.25 | India (Templates) |

## 🔐 Security Notes

1. **Never commit API keys** to version control
2. **Use environment variables** for all sensitive data
3. **Rotate API keys** regularly
4. **Monitor usage** to prevent abuse
5. **Validate mobile numbers** before sending

## 📞 Support

- **Fast2SMS**: [https://www.fast2sms.com/contact](https://www.fast2sms.com/contact)
- **Twilio**: [https://support.twilio.com](https://support.twilio.com)
- **MSG91**: [https://msg91.com/support](https://msg91.com/support)

---

## 🎉 Next Steps

1. **Choose a SMS provider** (Fast2SMS recommended for India)
2. **Get API credentials** from the provider
3. **Update `.env.local`** with real credentials
4. **Test OTP sending** with your mobile number
5. **Verify SMS delivery** on your phone

**The OTP system is now working correctly and will send real SMS once you configure a provider!**
