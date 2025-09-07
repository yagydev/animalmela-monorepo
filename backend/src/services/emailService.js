const nodemailer = require('nodemailer');
const { logger } = require('../utils/logger');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Email templates
const emailTemplates = {
  emailVerification: (data) => ({
    subject: 'Welcome to AnimalMela - Verify Your Email',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Welcome to AnimalMela!</h2>
        <p>Hi ${data.name},</p>
        <p>Thank you for joining AnimalMela! Please verify your email address by clicking the button below:</p>
        <a href="${data.verificationUrl}" 
           style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
          Verify Email
        </a>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p>${data.verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
        <p>Best regards,<br>The AnimalMela Team</p>
      </div>
    `
  }),

  passwordReset: (data) => ({
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Password Reset Request</h2>
        <p>Hi ${data.name},</p>
        <p>We received a request to reset your password. Click the button below to create a new password:</p>
        <a href="${data.resetUrl}" 
           style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
          Reset Password
        </a>
        <p>If you didn't request this, you can safely ignore this email.</p>
        <p>This link will expire in 1 hour.</p>
        <p>Best regards,<br>The AnimalMela Team</p>
      </div>
    `
  }),

  bookingConfirmation: (data) => ({
    subject: 'Booking Confirmation - AnimalMela',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Booking Confirmed!</h2>
        <p>Hi ${data.customerName},</p>
        <p>Your booking has been confirmed with ${data.providerName}.</p>
        <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Booking Details:</h3>
          <p><strong>Service:</strong> ${data.serviceTitle}</p>
          <p><strong>Date:</strong> ${data.scheduledDate}</p>
          <p><strong>Time:</strong> ${data.scheduledTime}</p>
          <p><strong>Total:</strong> $${data.totalAmount}</p>
        </div>
        <p>You can view your booking details in your AnimalMela account.</p>
        <p>Best regards,<br>The AnimalMela Team</p>
      </div>
    `
  }),

  welcomeEmail: (data) => ({
    subject: 'Welcome to AnimalMela - Your Pet\'s Best Friend',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Welcome to AnimalMela! 🐾</h2>
        <p>Hi ${data.name},</p>
        <p>Welcome to AnimalMela, the comprehensive platform for all your pet needs!</p>
        <p>Here's what you can do with AnimalMela:</p>
        <ul>
          <li>🐕 Find pet services (sitting, walking, grooming)</li>
          <li>🏥 Track your pet's health and vaccinations</li>
          <li>🛒 Shop for pet supplies and food</li>
          <li>👥 Connect with other pet owners</li>
          <li>🏠 Adopt or rehome pets</li>
        </ul>
        <p>Get started by creating your first pet profile!</p>
        <a href="${process.env.FRONTEND_URL}/dashboard" 
           style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
          Go to Dashboard
        </a>
        <p>Best regards,<br>The AnimalMela Team</p>
      </div>
    `
  })
};

// Send email function
const sendEmail = async ({ email, subject, template, data, html, text }) => {
  try {
    let emailContent;

    if (template && emailTemplates[template]) {
      emailContent = emailTemplates[template](data);
    } else {
      emailContent = { subject, html, text };
    }

    const mailOptions = {
      from: `"AnimalMela" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: email,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text || emailContent.html.replace(/<[^>]*>/g, '')
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent to ${email}: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error('Email sending error:', error);
    throw error;
  }
};

// Send bulk email
const sendBulkEmail = async (emails, template, data) => {
  try {
    const emailContent = emailTemplates[template](data);
    const promises = emails.map(email => 
      sendEmail({
        email,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text
      })
    );

    const results = await Promise.allSettled(promises);
    const successful = results.filter(result => result.status === 'fulfilled').length;
    const failed = results.filter(result => result.status === 'rejected').length;

    logger.info(`Bulk email sent: ${successful} successful, ${failed} failed`);
    return { successful, failed, results };
  } catch (error) {
    logger.error('Bulk email error:', error);
    throw error;
  }
};

module.exports = {
  sendEmail,
  sendBulkEmail,
  emailTemplates
};
