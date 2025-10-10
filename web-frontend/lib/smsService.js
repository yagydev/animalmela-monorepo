// lib/smsService.js
const axios = require('axios');

class SMSService {
  constructor() {
    this.fast2smsApiKey = process.env.SMS_SERVICE_AUTHORIZATION_KEY;
    this.fast2smsApiUrl = process.env.SMS_SERVICE_API || 'https://www.fast2sms.com/dev/bulkV2';
    this.fast2smsProductionUrl = 'https://www.fast2sms.com/dev/bulk';
    this.twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
    this.twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
    this.twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
    this.msg91ApiKey = process.env.MSG91_API_KEY;
    this.msg91TemplateId = process.env.MSG91_TEMPLATE_ID;
    this.msg91SenderId = process.env.MSG91_SENDER_ID;
  }

  /**
   * Send OTP via SMS using the best available service
   * @param {string} mobile - Mobile number (10 digits)
   * @param {string} otp - 6-digit OTP
   * @returns {Promise<{success: boolean, message: string, provider?: string}>}
   */
  async sendOTP(mobile, otp) {
    const message = `Your Kisaanmela OTP is: ${otp}. Valid for 10 minutes. Do not share this OTP with anyone.`;
    
    // Try Fast2SMS first (most cost-effective for India)
    if (this.fast2smsApiKey && this.fast2smsApiKey !== 'your_fast2sms_api_key_here' && this.fast2smsApiKey.length > 10) {
      try {
        console.log('📱 Attempting to send OTP via Fast2SMS...');
        console.log('Fast2SMS API Key:', this.fast2smsApiKey.substring(0, 10) + '...');
        const result = await this.sendViaFast2SMS(mobile, message);
        if (result.success) {
          console.log('✅ OTP sent successfully via Fast2SMS');
          return { ...result, provider: 'Fast2SMS' };
        } else {
          console.log('❌ Fast2SMS returned unsuccessful result:', result);
        }
      } catch (error) {
        console.error('❌ Fast2SMS failed:', error.message);
        console.error('Fast2SMS error details:', error);
      }
    } else {
      console.warn('⚠️ Fast2SMS API key not configured or invalid');
      console.warn('Fast2SMS API Key:', this.fast2smsApiKey ? this.fast2smsApiKey.substring(0, 10) + '...' : 'undefined');
    }

    // Fallback to Twilio
    if (this.twilioAccountSid && this.twilioAuthToken) {
      try {
        const result = await this.sendViaTwilio(mobile, message);
        if (result.success) {
          return { ...result, provider: 'Twilio' };
        }
      } catch (error) {
        console.error('Twilio failed:', error.message);
      }
    }

    // Fallback to MSG91
    if (this.msg91ApiKey) {
      try {
        const result = await this.sendViaMSG91(mobile, otp);
        if (result.success) {
          return { ...result, provider: 'MSG91' };
        }
      } catch (error) {
        console.error('MSG91 failed:', error.message);
      }
    }

    // If all services fail, return error
    return {
      success: false,
      message: 'All SMS services are currently unavailable. Please try again later.',
      provider: 'None'
    };
  }

  /**
   * Send SMS via Fast2SMS (India-focused service)
   */
  async sendViaFast2SMS(mobile, message) {
    try {
      console.log(`📱 Sending SMS to ${mobile} via Fast2SMS...`);
      
      // Try production API first, then fallback to dev API
      const apiUrls = [this.fast2smsProductionUrl, this.fast2smsApiUrl];
      
      for (const apiUrl of apiUrls) {
        try {
          console.log(`Trying Fast2SMS API: ${apiUrl}`);
          const response = await axios.post(apiUrl, {
            route: 'q',
            message: message,
            language: 'english',
            flash: 0,
            numbers: mobile
          }, {
            headers: {
              'authorization': this.fast2smsApiKey,
              'Content-Type': 'application/json'
            },
            timeout: 10000 // 10 second timeout
          });

          console.log('Fast2SMS Response:', response.data);

          if (response.data.return === true) {
            return {
              success: true,
              message: 'SMS sent successfully via Fast2SMS',
              requestId: response.data.request_id
            };
          } else {
            console.log(`Fast2SMS API ${apiUrl} failed:`, response.data.message);
            continue; // Try next API URL
          }
        } catch (apiError) {
          console.log(`Fast2SMS API ${apiUrl} error:`, apiError.response?.data || apiError.message);
          continue; // Try next API URL
        }
      }
      
      // If all API URLs failed
      throw new Error('All Fast2SMS API endpoints failed');
    } catch (error) {
      console.error('Fast2SMS Error:', error.message);
      throw new Error(`Fast2SMS error: ${error.message}`);
    }
  }

  /**
   * Send SMS via Twilio (International service)
   */
  async sendViaTwilio(mobile, message) {
    try {
      const twilio = require('twilio');
      const client = twilio(this.twilioAccountSid, this.twilioAuthToken);

      // Format mobile number for Twilio (add +91 for India)
      const formattedMobile = mobile.startsWith('+') ? mobile : `+91${mobile}`;

      const result = await client.messages.create({
        body: message,
        from: this.twilioPhoneNumber,
        to: formattedMobile
      });

      return {
        success: true,
        message: 'SMS sent successfully via Twilio',
        messageId: result.sid
      };
    } catch (error) {
      throw new Error(`Twilio error: ${error.message}`);
    }
  }

  /**
   * Send OTP via MSG91 (India-focused service with templates)
   */
  async sendViaMSG91(mobile, otp) {
    try {
      const response = await axios.post('https://api.msg91.com/api/v5/otp', {
        template_id: this.msg91TemplateId,
        mobile: mobile,
        authkey: this.msg91ApiKey,
        otp: otp
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.type === 'success') {
        return {
          success: true,
          message: 'OTP sent successfully via MSG91',
          requestId: response.data.request_id
        };
      } else {
        throw new Error(response.data.message || 'MSG91 API error');
      }
    } catch (error) {
      throw new Error(`MSG91 error: ${error.message}`);
    }
  }

  /**
   * Check if SMS service is configured
   */
  isConfigured() {
    // Check for real API keys (not placeholder values)
    const hasFast2SMS = this.fast2smsApiKey && 
      this.fast2smsApiKey !== 'your_fast2sms_api_key_here' && 
      this.fast2smsApiKey.length > 10;
    
    const hasTwilio = this.twilioAccountSid && 
      this.twilioAccountSid !== 'your_twilio_account_sid_here' && 
      this.twilioAccountSid.startsWith('AC') &&
      this.twilioAuthToken && 
      this.twilioAuthToken !== 'your_twilio_auth_token_here';
    
    const hasMSG91 = this.msg91ApiKey && 
      this.msg91ApiKey !== 'your_msg91_api_key_here' && 
      this.msg91ApiKey.length > 10;
    
    return !!(hasFast2SMS || hasTwilio || hasMSG91);
  }

  /**
   * Get available SMS providers
   */
  getAvailableProviders() {
    const providers = [];
    
    // Check for real API keys (not placeholder values)
    if (this.fast2smsApiKey && 
        this.fast2smsApiKey !== 'your_fast2sms_api_key_here' && 
        this.fast2smsApiKey.length > 10) {
      providers.push('Fast2SMS');
    }
    
    if (this.twilioAccountSid && 
        this.twilioAccountSid !== 'your_twilio_account_sid_here' && 
        this.twilioAccountSid.startsWith('AC') &&
        this.twilioAuthToken && 
        this.twilioAuthToken !== 'your_twilio_auth_token_here') {
      providers.push('Twilio');
    }
    
    if (this.msg91ApiKey && 
        this.msg91ApiKey !== 'your_msg91_api_key_here' && 
        this.msg91ApiKey.length > 10) {
      providers.push('MSG91');
    }
    
    return providers;
  }
}

module.exports = new SMSService();
