#!/usr/bin/env node

// 🧪 SIMPLE TEST SERVER - No dependencies, just Node.js built-ins
// This demonstrates the routing issues for the specific endpoints

const http = require('http');
const url = require('url');
const PORT = 9000;

function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({});
      }
    });
  });
}

function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data, null, 2));
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const method = req.method;
  const pathname = parsedUrl.pathname;
  
  console.log(`${new Date().toISOString()} - ${method} ${pathname}`);
  
  // Handle CORS preflight
  if (method === 'OPTIONS') {
    if (pathname === '/api/auth/otp/send') {
      sendJSON(res, 200, {
        success: true,
        message: 'OPTIONS request successful for OTP endpoint',
        allowedMethods: ['POST', 'OPTIONS'],
        endpoint: pathname
      });
      return;
    }
    
    if (pathname === '/api/forgot-password') {
      sendJSON(res, 200, {
        success: true,
        message: 'OPTIONS request successful for forgot-password endpoint',
        allowedMethods: ['POST', 'OPTIONS'],
        endpoint: pathname
      });
      return;
    }
    
    sendJSON(res, 200, {
      success: true,
      message: 'OPTIONS request successful',
      allowedMethods: ['GET', 'POST', 'OPTIONS']
    });
    return;
  }
  
  // Health check
  if (method === 'GET' && pathname === '/api/health') {
    sendJSON(res, 200, {
      success: true,
      message: 'Test API server is running',
      timestamp: new Date().toISOString(),
      endpoints: [
        'GET /api/health',
        'POST /api/auth/otp/send',
        'POST /api/forgot-password',
        'OPTIONS /api/auth/otp/send',
        'OPTIONS /api/forgot-password'
      ]
    });
    return;
  }
  
  // POST /api/auth/otp/send
  if (method === 'POST' && pathname === '/api/auth/otp/send') {
    console.log('🔥 POST /api/auth/otp/send called');
    
    const body = await parseBody(req);
    const { mobile } = body;
    
    if (!mobile) {
      sendJSON(res, 400, {
        success: false,
        error: 'Mobile number is required',
        received: body
      });
      return;
    }
    
    // Validate mobile number format (Indian mobile)
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(mobile)) {
      sendJSON(res, 400, {
        success: false,
        error: 'Invalid mobile number format. Use 10-digit Indian mobile number.',
        received: mobile
      });
      return;
    }
    
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`📱 OTP for ${mobile}: ${otp}`);
    
    sendJSON(res, 200, {
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
    return;
  }
  
  // POST /api/forgot-password
  if (method === 'POST' && pathname === '/api/forgot-password') {
    console.log('🔥 POST /api/forgot-password called');
    
    const body = await parseBody(req);
    const { email } = body;
    
    if (!email) {
      sendJSON(res, 400, {
        success: false,
        error: 'Email is required',
        received: body
      });
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      sendJSON(res, 400, {
        success: false,
        error: 'Invalid email format',
        received: email
      });
      return;
    }
    
    // Generate reset token
    const resetToken = 'reset_' + Math.random().toString(36).substr(2, 9);
    console.log(`📧 Password reset for ${email}: ${resetToken}`);
    
    sendJSON(res, 200, {
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
    return;
  }
  
  // 404 for all other routes
  sendJSON(res, 404, {
    success: false,
    error: 'Endpoint not found',
    method: method,
    path: pathname,
    availableEndpoints: [
      'GET /api/health',
      'POST /api/auth/otp/send',
      'POST /api/forgot-password',
      'OPTIONS /api/auth/otp/send',
      'OPTIONS /api/forgot-password'
    ]
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Simple Test API Server running on http://localhost:${PORT}`);
  console.log(`📋 Available endpoints:`);
  console.log(`   GET  http://localhost:${PORT}/api/health`);
  console.log(`   POST http://localhost:${PORT}/api/auth/otp/send`);
  console.log(`   POST http://localhost:${PORT}/api/forgot-password`);
  console.log(`\n🧪 Test commands:`);
  console.log(`   curl http://localhost:${PORT}/api/health`);
  console.log(`   curl -X OPTIONS http://localhost:${PORT}/api/auth/otp/send -v`);
  console.log(`   curl -X POST http://localhost:${PORT}/api/auth/otp/send -H "Content-Type: application/json" -d '{"mobile":"9876543210"}'`);
  console.log(`   curl -X POST http://localhost:${PORT}/api/forgot-password -H "Content-Type: application/json" -d '{"email":"test@example.com"}'`);
  console.log(`\n✅ This demonstrates PROPER routing with POST method handlers defined!`);
});
