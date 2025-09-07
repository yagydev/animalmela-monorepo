# SMS Service Configuration Guide

This guide explains how to configure SMS services for OTP delivery in the Animall platform.

## 🚀 Quick Setup

### 1. Choose Your SMS Provider

The system supports multiple SMS providers with automatic fallback:

1. **Fast2SMS** (Recommended for India) - Most cost-effective
2. **Twilio** (International) - Reliable global service
3. **MSG91** (India-focused) - Good for Indian numbers

### 2. Environment Configuration

Add the following variables to your `.env` file:

#### For Fast2SMS (Recommended)
```env
SMS_SERVICE_AUTHORIZATION_KEY=your_fast2sms_api_key
SMS_SERVICE_API=https://www.fast2sms.com/dev/bulkV2
```

#### For Twilio (International)
```env
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

#### For MSG91 (India)
```env
MSG91_API_KEY=your_msg91_api_key
MSG91_TEMPLATE_ID=your_template_id
MSG91_SENDER_ID=your_sender_id
```

## 📱 Provider Setup Instructions

### Fast2SMS Setup

1. **Sign up** at [Fast2SMS](https://www.fast2sms.com/)
2. **Get API Key** from your dashboard
3. **Add funds** to your account (₹0.15 per SMS)
4. **Set environment variable**:
   ```env
   SMS_SERVICE_AUTHORIZATION_KEY=your_api_key_here
   ```

### Twilio Setup

1. **Sign up** at [Twilio](https://www.twilio.com/)
2. **Get Account SID and Auth Token** from console
3. **Purchase a phone number** for sending SMS
4. **Set environment variables**:
   ```env
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your_auth_token_here
   TWILIO_PHONE_NUMBER=+1234567890
   ```

### MSG91 Setup

1. **Sign up** at [MSG91](https://msg91.com/)
2. **Create an OTP template** in your dashboard
3. **Get API Key and Template ID**
4. **Set environment variables**:
   ```env
   MSG91_API_KEY=your_api_key_here
   MSG91_TEMPLATE_ID=your_template_id_here
   MSG91_SENDER_ID=your_sender_id_here
   ```

## 🔧 Testing SMS Service

### Development Mode
In development mode, OTPs are logged to console instead of being sent via SMS:

```bash
NODE_ENV=development
```

### Production Mode
In production mode, SMS will be sent via configured providers:

```bash
NODE_ENV=production
```

### Test SMS Service
You can test the SMS service configuration by calling the OTP endpoint:

```bash
curl -X POST http://localhost:5000/api/auth/otp/send \
  -H "Content-Type: application/json" \
  -d '{"mobile": "9876543210"}'
```

## 📊 SMS Service Features

### Automatic Fallback
The system automatically tries providers in this order:
1. Fast2SMS (if configured)
2. Twilio (if configured)
3. MSG91 (if configured)

### Rate Limiting
- Maximum 100 OTPs per day per number
- 10-minute expiration for OTPs
- 3 attempts per OTP session

### Error Handling
- Graceful fallback between providers
- Detailed error logging
- Development mode for testing

## 💰 Cost Comparison

| Provider | Cost per SMS | Best For |
|----------|--------------|----------|
| Fast2SMS | ₹0.15 | India |
| Twilio | $0.0075 | International |
| MSG91 | ₹0.20 | India (templates) |

## 🛠️ Troubleshooting

### Common Issues

1. **No SMS providers configured**
   - Check environment variables
   - Ensure at least one provider is set up

2. **SMS not delivered**
   - Check provider account balance
   - Verify phone number format
   - Check provider-specific logs

3. **API errors**
   - Verify API keys are correct
   - Check provider documentation
   - Ensure proper permissions

### Debug Mode
Enable debug mode to see detailed SMS service information:

```env
NODE_ENV=development
```

This will include:
- Available providers
- SMS sending results
- Debug information in API responses

## 🔒 Security Notes

- Never commit API keys to version control
- Use environment variables for all sensitive data
- Regularly rotate API keys
- Monitor SMS usage for unusual activity

## 📞 Support

For SMS service issues:
1. Check provider-specific documentation
2. Verify account status and balance
3. Check server logs for detailed error messages
4. Contact provider support if needed

