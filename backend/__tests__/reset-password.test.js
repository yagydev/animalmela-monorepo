const request = require('supertest');
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

describe('Reset Password API', () => {
  let app;
  let server;
  let testUser;
  let validToken;

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

    // Create test user with reset token
    const { User } = require('../models');
    
    validToken = jwt.sign(
      { userId: new mongoose.Types.ObjectId(), email: 'test@example.com' },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '1h' }
    );

    testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: await bcrypt.hash('oldpassword123', 12),
      phone: '+919876543210',
      role: 'buyer',
      resetPasswordToken: validToken,
      resetPasswordExpires: new Date(Date.now() + 3600000) // 1 hour from now
    });

    // Update token with correct user ID
    validToken = jwt.sign(
      { userId: testUser._id, email: testUser.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '1h' }
    );

    testUser.resetPasswordToken = validToken;
    await testUser.save();
  });

  afterAll(async () => {
    // Cleanup
    if (testUser) {
      await testUser.deleteOne();
    }
    await mongoose.connection.close();
    server.close();
  });

  describe('GET /api/reset-password (Token Validation)', () => {
    it('should validate valid reset token', async () => {
      const response = await app
        .get(`/api/reset-password?token=${validToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Reset token is valid');
      expect(response.body.email).toBe('test@example.com');
      expect(response.body.userId).toBe(testUser._id.toString());
    });

    it('should reject missing token', async () => {
      const response = await app
        .get('/api/reset-password')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Reset token is required');
    });

    it('should reject invalid token format', async () => {
      const response = await app
        .get('/api/reset-password?token=invalid-token')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid or expired reset token');
    });

    it('should reject expired token', async () => {
      const expiredToken = jwt.sign(
        { userId: testUser._id, email: testUser.email },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '-1h' } // Expired 1 hour ago
      );

      const response = await app
        .get(`/api/reset-password?token=${expiredToken}`)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid or expired reset token');
    });

    it('should reject token for non-existent user', async () => {
      const nonExistentUserId = new mongoose.Types.ObjectId();
      const tokenForNonExistentUser = jwt.sign(
        { userId: nonExistentUserId, email: 'nonexistent@example.com' },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '1h' }
      );

      const response = await app
        .get(`/api/reset-password?token=${tokenForNonExistentUser}`)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Reset token is invalid or has expired');
    });

    it('should reject token with expired database record', async () => {
      // Create user with expired reset token in database
      const expiredUser = await testUser.constructor.create({
        name: 'Expired User',
        email: 'expired@example.com',
        password: await bcrypt.hash('password123', 12),
        phone: '+919876543211',
        role: 'buyer',
        resetPasswordToken: validToken,
        resetPasswordExpires: new Date(Date.now() - 3600000) // Expired 1 hour ago
      });

      const expiredUserToken = jwt.sign(
        { userId: expiredUser._id, email: expiredUser.email },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '1h' }
      );

      expiredUser.resetPasswordToken = expiredUserToken;
      await expiredUser.save();

      try {
        const response = await app
          .get(`/api/reset-password?token=${expiredUserToken}`)
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe('Reset token is invalid or has expired');
      } finally {
        await expiredUser.deleteOne();
      }
    });
  });

  describe('POST /api/reset-password (Password Reset)', () => {
    let freshToken;

    beforeEach(async () => {
      // Create fresh token for each test
      freshToken = jwt.sign(
        { userId: testUser._id, email: testUser.email },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '1h' }
      );

      testUser.resetPasswordToken = freshToken;
      testUser.resetPasswordExpires = new Date(Date.now() + 3600000);
      await testUser.save();
    });

    it('should reset password successfully', async () => {
      const newPassword = 'newpassword123';
      
      const response = await app
        .post('/api/reset-password')
        .send({
          token: freshToken,
          password: newPassword,
          confirmPassword: newPassword
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Password has been reset successfully');
      expect(response.body.email).toBe('test@example.com');

      // Verify password was changed in database
      const updatedUser = await testUser.constructor.findById(testUser._id);
      const isNewPasswordValid = await bcrypt.compare(newPassword, updatedUser.password);
      expect(isNewPasswordValid).toBe(true);

      // Verify reset token was cleared
      expect(updatedUser.resetPasswordToken).toBeUndefined();
      expect(updatedUser.resetPasswordExpires).toBeUndefined();
      expect(updatedUser.passwordChangedAt).toBeDefined();
    });

    it('should reject missing required fields', async () => {
      const response = await app
        .post('/api/reset-password')
        .send({
          token: freshToken,
          password: 'newpassword123'
          // Missing confirmPassword
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Token, password, and confirm password are required');
    });

    it('should reject mismatched passwords', async () => {
      const response = await app
        .post('/api/reset-password')
        .send({
          token: freshToken,
          password: 'newpassword123',
          confirmPassword: 'differentpassword123'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Passwords do not match');
    });

    it('should reject weak passwords', async () => {
      const response = await app
        .post('/api/reset-password')
        .send({
          token: freshToken,
          password: '123',
          confirmPassword: '123'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Password must be at least 6 characters long');
    });

    it('should reject invalid token', async () => {
      const response = await app
        .post('/api/reset-password')
        .send({
          token: 'invalid-token',
          password: 'newpassword123',
          confirmPassword: 'newpassword123'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid or expired reset token');
    });

    it('should reject expired token', async () => {
      const expiredToken = jwt.sign(
        { userId: testUser._id, email: testUser.email },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '-1h' }
      );

      const response = await app
        .post('/api/reset-password')
        .send({
          token: expiredToken,
          password: 'newpassword123',
          confirmPassword: 'newpassword123'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid or expired reset token');
    });

    it('should reject token not in database', async () => {
      const tokenNotInDB = jwt.sign(
        { userId: testUser._id, email: testUser.email },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '1h' }
      );

      const response = await app
        .post('/api/reset-password')
        .send({
          token: tokenNotInDB,
          password: 'newpassword123',
          confirmPassword: 'newpassword123'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Reset token is invalid or has expired');
    });

    it('should hash password securely', async () => {
      const newPassword = 'newpassword123';
      
      await app
        .post('/api/reset-password')
        .send({
          token: freshToken,
          password: newPassword,
          confirmPassword: newPassword
        })
        .expect(200);

      const updatedUser = await testUser.constructor.findById(testUser._id);
      
      // Password should be hashed (not plain text)
      expect(updatedUser.password).not.toBe(newPassword);
      expect(updatedUser.password.length).toBeGreaterThan(50); // Bcrypt hashes are long
      expect(updatedUser.password.startsWith('$2')).toBe(true); // Bcrypt format
      
      // Should be able to verify with bcrypt
      const isValid = await bcrypt.compare(newPassword, updatedUser.password);
      expect(isValid).toBe(true);
    });

    it('should prevent token reuse', async () => {
      const newPassword = 'newpassword123';
      
      // First reset should succeed
      await app
        .post('/api/reset-password')
        .send({
          token: freshToken,
          password: newPassword,
          confirmPassword: newPassword
        })
        .expect(200);

      // Second reset with same token should fail
      const response = await app
        .post('/api/reset-password')
        .send({
          token: freshToken,
          password: 'anotherpassword123',
          confirmPassword: 'anotherpassword123'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Reset token is invalid or has expired');
    });
  });

  describe('CORS and HTTP Methods', () => {
    it('should handle CORS preflight request', async () => {
      const response = await app
        .options('/api/reset-password')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('CORS preflight successful');
    });

    it('should reject unsupported HTTP methods', async () => {
      const response = await app
        .put('/api/reset-password')
        .expect(405);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Method PUT not allowed');
    });
  });

  describe('Security Tests', () => {
    it('should not expose sensitive information', async () => {
      const response = await app
        .post('/api/reset-password')
        .send({
          token: 'invalid-token',
          password: 'newpassword123',
          confirmPassword: 'newpassword123'
        })
        .expect(400);

      // Should not reveal database structure or internal details
      expect(response.body.error).not.toContain('mongodb');
      expect(response.body.error).not.toContain('database');
      expect(response.body.error).not.toContain('bcrypt');
    });

    it('should sanitize input data', async () => {
      const maliciousPassword = '<script>alert("xss")</script>';
      
      const response = await app
        .post('/api/reset-password')
        .send({
          token: validToken,
          password: maliciousPassword,
          confirmPassword: maliciousPassword
        })
        .expect(200);

      // Should process the password (even if it contains HTML)
      expect(response.body.success).toBe(true);
      
      // Verify the malicious content was hashed, not executed
      const updatedUser = await testUser.constructor.findById(testUser._id);
      expect(updatedUser.password).not.toBe(maliciousPassword);
      expect(updatedUser.password.startsWith('$2')).toBe(true);
    });
  });

  describe('Integration Tests', () => {
    it('should complete full password reset flow', async () => {
      const newPassword = 'completelynewpassword123';
      
      // Step 1: Validate token
      const validateResponse = await app
        .get(`/api/reset-password?token=${validToken}`)
        .expect(200);

      expect(validateResponse.body.success).toBe(true);

      // Step 2: Reset password
      const resetResponse = await app
        .post('/api/reset-password')
        .send({
          token: validToken,
          password: newPassword,
          confirmPassword: newPassword
        })
        .expect(200);

      expect(resetResponse.body.success).toBe(true);

      // Step 3: Verify changes in database
      const updatedUser = await testUser.constructor.findById(testUser._id);
      expect(updatedUser.resetPasswordToken).toBeUndefined();
      expect(updatedUser.resetPasswordExpires).toBeUndefined();
      expect(updatedUser.passwordChangedAt).toBeDefined();
      
      const isNewPasswordValid = await bcrypt.compare(newPassword, updatedUser.password);
      expect(isNewPasswordValid).toBe(true);

      // Step 4: Verify token cannot be reused
      const reuseResponse = await app
        .get(`/api/reset-password?token=${validToken}`)
        .expect(400);

      expect(reuseResponse.body.success).toBe(false);
    });
  });
});
