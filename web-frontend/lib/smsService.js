// lib/smsService.js
const axios = require('axios');

class SMSService {
  constructor() {
    this.fast2smsApiKey = process.env.SMS_SERVICE_AUTHORIZATION_KEY;
    this.fast2smsApiUrl = process.env.SMS_SERVICE_API || 'https://www.fast2sms.com/dev/bulkV2';
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
    const message = `Your Pashu Marketplace OTP is: ${otp}. Valid for 10 minutes. Do not share this OTP with anyone.`;
    
    // Try Fast2SMS first (most cost-effective for India)
    if (this.fast2smsApiKey) {
      try {
        const result = await this.sendViaFast2SMS(mobile, message);
        if (result.success) {
          return { ...result, provider: 'Fast2SMS' };
        }
      } catch (error) {
        console.error('Fast2SMS failed:', error.message);
      }
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
      const response = await axios.post(this.fast2smsApiUrl, {
        route: 'q',
        message: message,
        language: 'english',
        flash: 0,
        numbers: mobile
      }, {
        headers: {
          'authorization': this.fast2smsApiKey,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.return === true) {
        return {
          success: true,
          message: 'SMS sent successfully via Fast2SMS',
          requestId: response.data.request_id
        };
      } else {
        throw new Error(response.data.message || 'Fast2SMS API error');
      }
    } catch (error) {
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
    return !!(this.fast2smsApiKey || (this.twilioAccountSid && this.twilioAuthToken) || this.msg91ApiKey);
  }

  /**
   * Get available SMS providers
   */
  getAvailableProviders() {
    const providers = [];
    if (this.fast2smsApiKey) providers.push('Fast2SMS');
    if (this.twilioAccountSid && this.twilioAuthToken) providers.push('Twilio');
    if (this.msg91ApiKey) providers.push('MSG91');
    return providers;
  }
}

module.exports = new SMSService();
