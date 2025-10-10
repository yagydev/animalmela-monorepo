# Fast2SMS Setup Guide for Kisaanmela OTP Service

## Overview
Fast2SMS is a cost-effective SMS service provider for India, perfect for sending OTP messages at ~₹0.50-1.00 per SMS.

## Step-by-Step Setup

### 1. Create Fast2SMS Account
1. Visit: https://www.fast2sms.com/
2. Click "Sign Up" and create account
3. Verify your mobile number
4. Complete profile setup

### 2. Get API Key
1. Login to Fast2SMS dashboard
2. Go to "API" section
3. Copy your API key (32 characters)
4. Example: `ABCD1234EFGH5678IJKL9012MNOP3456`

### 3. Configure Environment Variables
Update `web-frontend/.env.local` file:

```bash
# Fast2SMS Configuration
SMS_SERVICE_AUTHORIZATION_KEY=your_actual_api_key_here
SMS_SERVICE_API=https://www.fast2sms.com/dev/bulkV2
```

### 4. Restart Development Server
```bash
cd web-frontend
npm run dev
```

## Testing

### Test OTP API
```bash
curl -X POST http://localhost:3000/api/auth/otp/send \
  -H "Content-Type: application/json" \
  -d '{"mobile": "9560604508"}'
```

### Expected Response (After Setup)
```json
{
  "success": true,
  "message": "OTP sent successfully via Fast2SMS",
  "provider": "Fast2SMS",
  "requestId": "1234567890"
}
```

## Current Status
- ✅ OTP API endpoint working
- ✅ Fast2SMS integration ready
- ❌ API key not configured (demo mode)
- 📱 SMS not reaching phone

## Troubleshooting

### Common Issues
1. **Invalid API Key**: Check key format (32 characters)
2. **Insufficient Balance**: Add credits to Fast2SMS account
3. **Wrong Number Format**: Use 10-digit format (9560604508)
4. **Rate Limiting**: Wait between requests

### Debug Steps
1. Check API key in `.env.local`
2. Verify Fast2SMS account balance
3. Test with different mobile number
4. Check console logs for errors

## Cost Information
- **Setup**: Free
- **Per SMS**: ₹0.50-1.00
- **Minimum Recharge**: ₹100
- **Validity**: 1 year

## Security Notes
- Never commit API keys to git
- Use environment variables only
- Monitor usage regularly
- Rotate keys periodically

## Support
- Fast2SMS Support: https://www.fast2sms.com/support
- Documentation: https://www.fast2sms.com/dev/api
- Status Page: https://status.fast2sms.com/