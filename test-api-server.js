#!/usr/bin/env node

// 🧪 TEST API SERVER - For debugging routing issues
// This creates a simple Express server to test the specific endpoints

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 8000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Headers:', req.headers);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', req.body);
  }
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API server is running',
    timestamp: new Date().toISOString(),
    endpoints: [
      'GET /api/health',
      'POST /api/auth/otp/send',
      'POST /api/forgot-password',
      'OPTIONS /api/auth/otp/send',
      'OPTIONS /api/forgot-password'
    ]
  });
});

// OPTIONS handler for CORS preflight
app.options('/api/auth/otp/send', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.status(200).json({
    success: true,
    message: 'OPTIONS request successful',
    allowedMethods: ['POST', 'OPTIONS'],
    endpoint: '/api/auth/otp/send'
  });
});

app.options('/api/forgot-password', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.status(200).json({
    success: true,
    message: 'OPTIONS request successful',
    allowedMethods: ['POST', 'OPTIONS'],
    endpoint: '/api/forgot-password'
  });
});

// POST /api/auth/otp/send endpoint
app.post('/api/auth/otp/send', (req, res) => {
  console.log('🔥 POST /api/auth/otp/send called');
  
  const { mobile } = req.body;
  
  if (!mobile) {
    return res.status(400).json({
      success: false,
      error: 'Mobile number is required',
      received: req.body
    });
  }

  // Validate mobile number format (Indian mobile)
  const mobileRegex = /^[6-9]\d{9}$/;
  if (!mobileRegex.test(mobile)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid mobile number format. Use 10-digit Indian mobile number.',
      received: mobile
    });
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  console.log(`📱 OTP for ${mobile}: ${otp}`);

  res.json({
    success: true,
    message: 'OTP sent successfully',
    mobile: mobile,
    otp: otp, // In production, don't return OTP
    debug: {
      endpoint: 'POST /api/auth/otp/send',
      method: 'POST',
      timestamp: new Date().toISOString()
    }
  });
});

// POST /api/forgot-password endpoint
app.post('/api/forgot-password', (req, res) => {
  console.log('🔥 POST /api/forgot-password called');
  
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({
      success: false,
      error: 'Email is required',
      received: req.body
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid email format',
      received: email
    });
  }

  // Generate reset token
  const resetToken = 'reset_' + Math.random().toString(36).substr(2, 9);
  
  console.log(`📧 Password reset for ${email}: ${resetToken}`);

  res.json({
    success: true,
    message: 'Password reset email sent',
    email: email,
    resetToken: resetToken, // In production, don't return token
    debug: {
      endpoint: 'POST /api/forgot-password',
      method: 'POST',
      timestamp: new Date().toISOString()
    }
  });
});

// Catch-all for undefined routes
app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    method: req.method,
    path: req.path,
    availableEndpoints: [
      'GET /api/health',
      'POST /api/auth/otp/send',
      'POST /api/forgot-password',
      'OPTIONS /api/auth/otp/send',
      'OPTIONS /api/forgot-password'
    ]
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Test API Server running on http://localhost:${PORT}`);
  console.log(`📋 Available endpoints:`);
  console.log(`   GET  http://localhost:${PORT}/api/health`);
  console.log(`   POST http://localhost:${PORT}/api/auth/otp/send`);
  console.log(`   POST http://localhost:${PORT}/api/forgot-password`);
  console.log(`\n🧪 Test commands:`);
  console.log(`   curl http://localhost:${PORT}/api/health`);
  console.log(`   curl -X OPTIONS http://localhost:${PORT}/api/auth/otp/send -v`);
  console.log(`   curl -X POST http://localhost:${PORT}/api/auth/otp/send -H "Content-Type: application/json" -d '{"mobile":"9876543210"}'`);
  console.log(`   curl -X POST http://localhost:${PORT}/api/forgot-password -H "Content-Type: application/json" -d '{"email":"test@example.com"}'`);
});

module.exports = app;
