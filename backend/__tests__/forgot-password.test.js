const request = require('supertest');
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// Mock email service
jest.mock('../services/emailService', () => ({
  sendPasswordResetEmail: jest.fn().mockResolvedValue({
    success: true,
    messageId: 'test-message-id',
    previewUrl: 'https://ethereal.email/message/test'
  })
}));

const emailService = require('../services/emailService');

describe('Forgot Password API', () => {
  let app;
  let server;
  let testUser;

  beforeAll(async () => {
    // Setup Next.js app for testing
    const nextApp = next({ dev: false, dir: __dirname + '/..' });
    const handle = nextApp.getRequestHandler();
    await nextApp.prepare();

    server = createServer((req, res) => {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    });

    app = request(server);

    // Connect to test database
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/kisaanmela_test');
    }

    // Create test user
    const { User } = require('../models');
    testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedpassword123',
      phone: '+919876543210',
      role: 'buyer'
    });
  });

  afterAll(async () => {
    // Cleanup
    if (testUser) {
      await testUser.deleteOne();
    }
    await mongoose.connection.close();
    server.close();
  });

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('POST /api/forgot-password', () => {
    it('should send password reset email for valid user', async () => {
      const response = await app
        .post('/api/forgot-password')
        .send({
          email: 'test@example.com'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Password reset email sent successfully');
      expect(response.body.email).toBe('test@example.com');
      expect(response.body.debug.emailSent).toBe(true);
      
      // Verify email service was called
      expect(emailService.sendPasswordResetEmail).toHaveBeenCalledWith(
        'test@example.com',
        expect.any(String),
        'Test User'
      );

      // Verify token is included in development
      if (process.env.NODE_ENV === 'development') {
        expect(response.body.resetToken).toBeDefined();
        expect(typeof response.body.resetToken).toBe('string');
      }

      // Verify user document was updated
      const updatedUser = await testUser.constructor.findById(testUser._id);
      expect(updatedUser.resetPasswordToken).toBeDefined();
      expect(updatedUser.resetPasswordExpires).toBeDefined();
      expect(updatedUser.resetPasswordExpires > new Date()).toBe(true);
    });

    it('should return error for non-existent user', async () => {
      const response = await app
        .post('/api/forgot-password')
        .send({
          email: 'nonexistent@example.com'
        })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('User not found with this email address');
      
      // Verify email service was not called
      expect(emailService.sendPasswordResetEmail).not.toHaveBeenCalled();
    });

    it('should return error for missing email', async () => {
      const response = await app
        .post('/api/forgot-password')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Email is required');
    });

    it('should return error for invalid email format', async () => {
      const response = await app
        .post('/api/forgot-password')
        .send({
          email: 'invalid-email'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid email format');
    });

    it('should handle email service failure gracefully', async () => {
      // Mock email service to throw error
      emailService.sendPasswordResetEmail.mockRejectedValueOnce(
        new Error('SMTP server unavailable')
      );

      const response = await app
        .post('/api/forgot-password')
        .send({
          email: 'test@example.com'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Email service temporarily unavailable');
      expect(response.body.warning).toBeDefined();
      expect(response.body.debug.emailSent).toBe(false);
      expect(response.body.debug.emailError).toBe('SMTP server unavailable');
    });

    it('should handle CORS preflight request', async () => {
      const response = await app
        .options('/api/forgot-password')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('CORS preflight successful');
    });

    it('should reject unsupported HTTP methods', async () => {
      const response = await app
        .get('/api/forgot-password')
        .expect(405);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Method GET not allowed');
    });
  });

  describe('Token Generation and Validation', () => {
    it('should generate valid JWT token', async () => {
      const response = await app
        .post('/api/forgot-password')
        .send({
          email: 'test@example.com'
        })
        .expect(200);

      if (response.body.resetToken) {
        // Verify token can be decoded
        const decoded = jwt.verify(
          response.body.resetToken,
          process.env.JWT_SECRET || 'fallback-secret'
        );

        expect(decoded.userId).toBe(testUser._id.toString());
        expect(decoded.email).toBe('test@example.com');
        expect(decoded.exp).toBeDefined();
        
        // Token should expire in 1 hour
        const expirationTime = decoded.exp * 1000;
        const expectedExpiration = Date.now() + (60 * 60 * 1000); // 1 hour
        expect(Math.abs(expirationTime - expectedExpiration)).toBeLessThan(5000); // 5 second tolerance
      }
    });

    it('should store token with correct expiration in database', async () => {
      const beforeRequest = new Date();
      
      await app
        .post('/api/forgot-password')
        .send({
          email: 'test@example.com'
        })
        .expect(200);

      const afterRequest = new Date();
      const updatedUser = await testUser.constructor.findById(testUser._id);
      
      expect(updatedUser.resetPasswordToken).toBeDefined();
      expect(updatedUser.resetPasswordExpires).toBeDefined();
      
      // Token should expire approximately 1 hour from now
      const tokenExpiration = updatedUser.resetPasswordExpires.getTime();
      const expectedMin = beforeRequest.getTime() + (60 * 60 * 1000) - 5000; // 1 hour - 5 seconds
      const expectedMax = afterRequest.getTime() + (60 * 60 * 1000) + 5000; // 1 hour + 5 seconds
      
      expect(tokenExpiration).toBeGreaterThan(expectedMin);
      expect(tokenExpiration).toBeLessThan(expectedMax);
    });
  });

  describe('Email Content Validation', () => {
    it('should call email service with correct parameters', async () => {
      await app
        .post('/api/forgot-password')
        .send({
          email: 'test@example.com'
        })
        .expect(200);

      expect(emailService.sendPasswordResetEmail).toHaveBeenCalledTimes(1);
      
      const [email, token, userName] = emailService.sendPasswordResetEmail.mock.calls[0];
      expect(email).toBe('test@example.com');
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
      expect(userName).toBe('Test User');
    });

    it('should handle user without name gracefully', async () => {
      // Create user without name
      const userWithoutName = await testUser.constructor.create({
        email: 'noname@example.com',
        password: 'hashedpassword123',
        phone: '+919876543211',
        role: 'buyer'
      });

      try {
        await app
          .post('/api/forgot-password')
          .send({
            email: 'noname@example.com'
          })
          .expect(200);

        const [email, token, userName] = emailService.sendPasswordResetEmail.mock.calls[0];
        expect(userName).toBe('User'); // Default fallback
      } finally {
        await userWithoutName.deleteOne();
      }
    });
  });

  describe('Security Tests', () => {
    it('should not expose sensitive information in error responses', async () => {
      const response = await app
        .post('/api/forgot-password')
        .send({
          email: 'nonexistent@example.com'
        })
        .expect(404);

      // Should not reveal whether user exists in production
      expect(response.body.error).not.toContain('database');
      expect(response.body.error).not.toContain('mongodb');
      expect(response.body.error).not.toContain('password');
    });

    it('should rate limit requests (if implemented)', async () => {
      // This test would need rate limiting middleware to be implemented
      // For now, we'll just verify the endpoint doesn't crash with multiple requests
      
      const promises = Array(5).fill().map(() =>
        app.post('/api/forgot-password').send({ email: 'test@example.com' })
      );

      const responses = await Promise.all(promises);
      
      // All requests should complete (though some might be rate limited in production)
      responses.forEach(response => {
        expect([200, 429]).toContain(response.status); // 200 OK or 429 Too Many Requests
      });
    });

    it('should sanitize email input', async () => {
      const maliciousEmail = '<script>alert("xss")</script>@example.com';
      
      const response = await app
        .post('/api/forgot-password')
        .send({
          email: maliciousEmail
        })
        .expect(400);

      expect(response.body.error).toBe('Invalid email format');
      expect(response.body.received).toBe(maliciousEmail);
    });
  });

  describe('Integration Tests', () => {
    it('should complete full forgot password flow', async () => {
      // Step 1: Request password reset
      const forgotResponse = await app
        .post('/api/forgot-password')
        .send({
          email: 'test@example.com'
        })
        .expect(200);

      expect(forgotResponse.body.success).toBe(true);
      expect(emailService.sendPasswordResetEmail).toHaveBeenCalled();

      // Step 2: Verify user document was updated
      const updatedUser = await testUser.constructor.findById(testUser._id);
      expect(updatedUser.resetPasswordToken).toBeDefined();
      expect(updatedUser.resetPasswordExpires).toBeDefined();

      // Step 3: Verify token can be used (this would typically be tested in reset-password.test.js)
      const token = updatedUser.resetPasswordToken;
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
      expect(decoded.userId).toBe(testUser._id.toString());
    });
  });
});
