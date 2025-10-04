const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    // Configure email transporter based on environment
    const emailConfig = {
      // Gmail configuration (most common)
      gmail: {
        service: 'gmail',
        auth: {
          user: process.env.SMTP_USER || process.env.EMAIL_USER,
          pass: process.env.SMTP_PASS || process.env.EMAIL_PASS
        }
      },
      // Generic SMTP configuration
      smtp: {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true' || false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      },
      // Development/Testing configuration
      development: {
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: 'ethereal.user@ethereal.email',
          pass: 'ethereal.pass'
        }
      }
    };

    // Choose configuration based on environment
    let config;
    if (process.env.NODE_ENV === 'development' && !process.env.SMTP_USER) {
      // Use Ethereal for development testing
      config = emailConfig.development;
      console.log('📧 Using Ethereal Email for development');
    } else if (process.env.SMTP_HOST) {
      // Use custom SMTP
      config = emailConfig.smtp;
      console.log('📧 Using custom SMTP configuration');
    } else {
      // Use Gmail by default
      config = emailConfig.gmail;
      console.log('📧 Using Gmail SMTP configuration');
    }

    try {
      this.transporter = nodemailer.createTransporter(config);
      console.log('✅ Email transporter initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize email transporter:', error.message);
      this.transporter = null;
    }
  }

  async verifyConnection() {
    if (!this.transporter) {
      throw new Error('Email transporter not initialized');
    }

    try {
      await this.transporter.verify();
      console.log('✅ Email server connection verified');
      return true;
    } catch (error) {
      console.error('❌ Email server connection failed:', error.message);
      throw error;
    }
  }

  async sendPasswordResetEmail(email, resetToken, userName = '') {
    if (!this.transporter) {
      throw new Error('Email service not configured');
    }

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: {
        name: 'Kisaan Mela',
        address: process.env.SMTP_USER || 'noreply@kisaanmela.com'
      },
      to: email,
      subject: 'Password Reset Request - Kisaan Mela',
      html: this.getPasswordResetEmailTemplate(userName, resetUrl, resetToken),
      text: this.getPasswordResetEmailText(userName, resetUrl)
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Password reset email sent successfully:', info.messageId);
      
      // Log preview URL for development
      if (process.env.NODE_ENV === 'development') {
        console.log('📧 Preview URL:', nodemailer.getTestMessageUrl(info));
      }
      
      return {
        success: true,
        messageId: info.messageId,
        previewUrl: process.env.NODE_ENV === 'development' ? nodemailer.getTestMessageUrl(info) : null
      };
    } catch (error) {
      console.error('❌ Failed to send password reset email:', error.message);
      throw error;
    }
  }

  async sendWelcomeEmail(email, userName) {
    if (!this.transporter) {
      throw new Error('Email service not configured');
    }

    const mailOptions = {
      from: {
        name: 'Kisaan Mela',
        address: process.env.SMTP_USER || 'noreply@kisaanmela.com'
      },
      to: email,
      subject: 'Welcome to Kisaan Mela - Your Livestock Trading Platform',
      html: this.getWelcomeEmailTemplate(userName),
      text: `Welcome to Kisaan Mela, ${userName}! Start exploring our livestock marketplace today.`
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Welcome email sent successfully:', info.messageId);
      return {
        success: true,
        messageId: info.messageId
      };
    } catch (error) {
      console.error('❌ Failed to send welcome email:', error.message);
      throw error;
    }
  }

  getPasswordResetEmailTemplate(userName, resetUrl, resetToken) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset - Kisaan Mela</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
            .button:hover { background: #059669; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .warning { background: #fef3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .token-box { background: #e3f2fd; border: 1px solid #90caf9; padding: 15px; border-radius: 5px; margin: 20px 0; font-family: monospace; word-break: break-all; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🐄 Kisaan Mela</h1>
            <h2>Password Reset Request</h2>
        </div>
        
        <div class="content">
            <p>Hello ${userName || 'User'},</p>
            
            <p>We received a request to reset your password for your Kisaan Mela account. If you made this request, click the button below to reset your password:</p>
            
            <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset My Password</a>
            </div>
            
            <div class="warning">
                <strong>⚠️ Important:</strong>
                <ul>
                    <li>This link will expire in 1 hour for security reasons</li>
                    <li>If you didn't request this reset, please ignore this email</li>
                    <li>Never share this link with anyone</li>
                </ul>
            </div>
            
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #f0f0f0; padding: 10px; border-radius: 5px;">
                ${resetUrl}
            </p>
            
            ${process.env.NODE_ENV === 'development' ? `
            <div class="token-box">
                <strong>🔧 Development Token:</strong><br>
                ${resetToken}
            </div>
            ` : ''}
            
            <p>If you continue to have problems, please contact our support team.</p>
            
            <p>Best regards,<br>
            The Kisaan Mela Team</p>
        </div>
        
        <div class="footer">
            <p>© 2024 Kisaan Mela. All rights reserved.</p>
            <p>This is an automated email. Please do not reply to this message.</p>
        </div>
    </body>
    </html>
    `;
  }

  getPasswordResetEmailText(userName, resetUrl) {
    return `
    Hello ${userName || 'User'},

    We received a request to reset your password for your Kisaan Mela account.

    To reset your password, please visit: ${resetUrl}

    This link will expire in 1 hour for security reasons.

    If you didn't request this reset, please ignore this email.

    Best regards,
    The Kisaan Mela Team

    © 2024 Kisaan Mela. All rights reserved.
    `;
  }

  getWelcomeEmailTemplate(userName) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Kisaan Mela</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .feature { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #10b981; }
            .button { display: inline-block; background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🐄 Welcome to Kisaan Mela!</h1>
            <p>Your Trusted Livestock Trading Platform</p>
        </div>
        
        <div class="content">
            <p>Hello ${userName},</p>
            
            <p>Welcome to Kisaan Mela! We're excited to have you join our community of farmers and livestock traders.</p>
            
            <div class="feature">
                <h3>🛒 Buy & Sell Livestock</h3>
                <p>Browse thousands of quality animals from verified sellers across India.</p>
            </div>
            
            <div class="feature">
                <h3>💬 Direct Communication</h3>
                <p>Chat directly with buyers and sellers to negotiate the best deals.</p>
            </div>
            
            <div class="feature">
                <h3>🚚 Service Network</h3>
                <p>Access veterinary services, transportation, and feed suppliers.</p>
            </div>
            
            <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" class="button">Start Exploring</a>
            </div>
            
            <p>If you have any questions, our support team is here to help!</p>
            
            <p>Happy trading,<br>
            The Kisaan Mela Team</p>
        </div>
        
        <div class="footer">
            <p>© 2024 Kisaan Mela. All rights reserved.</p>
        </div>
    </body>
    </html>
    `;
  }
}

// Create singleton instance
const emailService = new EmailService();

module.exports = emailService;
