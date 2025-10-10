# SMS Service Setup Instructions

## Current Status
- ✅ OTP API endpoint is working (`/api/auth/otp/send`)
- ✅ API returns success response with OTP
- ❌ SMS is not being sent to phone (demo mode only)

## Quick Setup Guide

### Option 1: Fast2SMS (Recommended for India)

1. **Sign up for Fast2SMS:**
   - Visit: https://www.fast2sms.com/
   - Create account and verify mobile number
   - Go to Dashboard → API

2. **Get API Key:**
   - Copy your API key from dashboard
   - Example: `ABCD1234EFGH5678IJKL9012MNOP3456`

3. **Configure Environment:**
   ```bash
   # In web-frontend/.env.local file, add:
   SMS_SERVICE_AUTHORIZATION_KEY=your_actual_api_key_here
   SMS_SERVICE_API=https://www.fast2sms.com/dev/bulkV2
   ```

4. **Test SMS:**
   - Restart dev server: `npm run dev`
   - Send OTP to your phone number
   - Check phone for SMS

### Option 2: Twilio (International)

1. **Sign up for Twilio:**
   - Visit: https://www.twilio.com/
   - Create account and verify phone number
   - Get Account SID and Auth Token

2. **Configure Environment:**
   ```bash
   # In web-frontend/.env.local file, add:
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your_auth_token_here
   TWILIO_PHONE_NUMBER=+1234567890
   ```

### Option 3: MSG91 (India with Templates)

1. **Sign up for MSG91:**
   - Visit: https://msg91.com/
   - Create account and verify mobile
   - Create OTP template

2. **Configure Environment:**
   ```bash
   # In web-frontend/.env.local file, add:
   MSG91_API_KEY=your_api_key_here
   MSG91_TEMPLATE_ID=your_template_id_here
   MSG91_SENDER_ID=your_sender_id_here
   ```

## Current Demo Mode
The system is currently in demo mode, which means:
- ✅ OTP is generated and returned in API response
- ❌ No actual SMS is sent to phone
- 📱 You can see the OTP in the API response for testing

## Testing Steps

1. **Check current status:**
   ```bash
   curl -X POST http://localhost:3000/api/auth/otp/send \
     -H "Content-Type: application/json" \
     -d '{"mobile": "9560604508"}'
   ```

2. **Expected response (demo mode):**
   ```json
   {
     "success": true,
     "message": "OTP sent successfully (demo mode)",
     "otp": "136126",
     "demo": true
   }
   ```

3. **After SMS setup, expected response:**
   ```json
   {
     "success": true,
     "message": "OTP sent successfully via Fast2SMS",
     "provider": "Fast2SMS"
   }
   ```

## Troubleshooting

### If SMS still not working:
1. Check API key is correct (no extra spaces)
2. Verify account has sufficient balance
3. Check phone number format (10 digits for India)
4. Restart dev server after changing env vars
5. Check console logs for error messages

### Common Issues:
- **Invalid API Key:** Check key format and permissions
- **Insufficient Balance:** Add credits to SMS account
- **Wrong Number Format:** Use 10-digit format for India
- **Rate Limiting:** Wait between requests

## Cost Information
- **Fast2SMS:** ~₹0.50-1.00 per SMS
- **Twilio:** ~$0.0075 per SMS
- **MSG91:** ~₹0.30-0.50 per SMS

## Security Notes
- Never commit API keys to git
- Use environment variables only
- Rotate keys regularly
- Monitor usage and costs
