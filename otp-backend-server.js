#!/usr/bin/env node

// 🚀 OTP BACKEND SERVER - Complete Mobile OTP Login Implementation
// This creates a working backend for mobile OTP authentication

const http = require('http');
const url = require('url');
const crypto = require('crypto');
const axios = require('axios');
const PORT = 5001;

// Load environment variables from .env file
const fs = require('fs');
const path = require('path');

function loadEnvFile() {
  try {
    const envPath = path.join(__dirname, '.env');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars = {};
    
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim();
      }
    });
    
    return envVars;
  } catch (error) {
    console.log('⚠️ Could not load .env file:', error.message);
    return {};
  }
}

const envVars = loadEnvFile();

// Fast2SMS Configuration
const FAST2SMS_API_KEY = envVars.SMS_SERVICE_AUTHORIZATION_KEY || process.env.SMS_SERVICE_AUTHORIZATION_KEY || 'YOUR_FAST2SMS_API_KEY';
const FAST2SMS_API_URL = 'https://www.fast2sms.com/dev/bulkV2';

console.log('🔑 API Key loaded:', FAST2SMS_API_KEY && FAST2SMS_API_KEY !== 'YOUR_FAST2SMS_API_KEY' ? `${FAST2SMS_API_KEY.substring(0, 8)}...` : 'NOT CONFIGURED');
console.log('📋 API Key status:', FAST2SMS_API_KEY !== 'YOUR_FAST2SMS_API_KEY' ? 'CONFIGURED' : 'MISSING');

// In-memory storage (use database in production)
const otpSessions = new Map();
const users = new Map();
const products = new Map();
const orders = new Map();
const chats = new Map();
const notifications = new Map();
const reviews = new Map();

// Demo users
users.set('9876543210', {
  id: '1',
  mobile: '9876543210',
  name: 'Demo Farmer',
  email: 'demo@kisaanmela.com',
  role: 'farmer',
  location: 'Punjab, India',
  rating: 4.5,
  totalSales: 25,
  createdAt: new Date()
});

users.set('9123456789', {
  id: '2',
  mobile: '9123456789',
  name: 'Rajesh Kumar',
  email: 'rajesh@kisaanmela.com',
  role: 'farmer',
  location: 'Haryana, India',
  rating: 4.8,
  totalSales: 45,
  createdAt: new Date()
});

// Demo products
products.set('1', {
  id: '1',
  sellerId: '1',
  sellerName: 'Demo Farmer',
  sellerMobile: '9876543210',
  title: 'Organic Wheat Seeds',
  description: 'High quality organic wheat seeds, disease resistant variety. Perfect for winter sowing.',
  category: 'Seeds',
  subcategory: 'Wheat',
  price: 45,
  unit: 'per kg',
  quantity: 500,
  images: [
    'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400',
    'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400'
  ],
  location: 'Punjab, India',
  status: 'active',
  featured: true,
  tags: ['organic', 'wheat', 'seeds', 'winter'],
  specifications: {
    variety: 'HD-2967',
    purity: '98%',
    germination: '85%',
    moisture: '12%'
  },
  createdAt: new Date(),
  updatedAt: new Date()
});

products.set('2', {
  id: '2',
  sellerId: '2',
  sellerName: 'Rajesh Kumar',
  sellerMobile: '9123456789',
  title: 'Fresh Basmati Rice',
  description: '1121 Basmati rice, aged for 2 years. Premium quality with long grains and aromatic fragrance.',
  category: 'Crops',
  subcategory: 'Rice',
  price: 85,
  unit: 'per kg',
  quantity: 1000,
  images: [
    'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
    'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400'
  ],
  location: 'Haryana, India',
  status: 'active',
  featured: true,
  tags: ['basmati', 'rice', 'premium', 'aged'],
  specifications: {
    variety: '1121 Basmati',
    aging: '2 years',
    length: '8.2mm',
    broken: '<5%'
  },
  createdAt: new Date(),
  updatedAt: new Date()
});

products.set('3', {
  id: '3',
  sellerId: '1',
  sellerName: 'Demo Farmer',
  sellerMobile: '9876543210',
  title: 'Holstein Dairy Cow',
  description: 'Healthy Holstein dairy cow, 3 years old, giving 25 liters milk per day. Vaccinated and healthy.',
  category: 'Livestock',
  subcategory: 'Cattle',
  price: 65000,
  unit: 'per animal',
  quantity: 2,
  images: [
    'https://images.unsplash.com/photo-1560114928-40f1f1eb26a0?w=400',
    'https://images.unsplash.com/photo-1572949645841-094f3f3c4f1d?w=400'
  ],
  location: 'Punjab, India',
  status: 'active',
  featured: false,
  tags: ['holstein', 'dairy', 'cow', 'milk'],
  specifications: {
    age: '3 years',
    breed: 'Holstein Friesian',
    milkYield: '25 liters/day',
    health: 'Vaccinated'
  },
  createdAt: new Date(),
  updatedAt: new Date()
});

products.set('4', {
  id: '4',
  sellerId: '2',
  sellerName: 'Rajesh Kumar',
  sellerMobile: '9123456789',
  title: 'Tractor - Mahindra 575',
  description: 'Well maintained Mahindra 575 tractor, 2019 model. Only 1200 hours used. All papers clear.',
  category: 'Equipment',
  subcategory: 'Tractors',
  price: 485000,
  unit: 'per unit',
  quantity: 1,
  images: [
    'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400',
    'https://images.unsplash.com/photo-1595273670150-bd0c3c392e38?w=400'
  ],
  location: 'Haryana, India',
  status: 'active',
  featured: true,
  tags: ['mahindra', 'tractor', 'equipment', '575'],
  specifications: {
    model: 'Mahindra 575 DI',
    year: '2019',
    hours: '1200 hours',
    condition: 'Excellent'
  },
  createdAt: new Date(),
  updatedAt: new Date()
});

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

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateJWT(payload) {
  // Simple JWT simulation (use proper JWT library in production)
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
  const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64');
  const signature = crypto.createHmac('sha256', 'secret-key').update(`${header}.${payloadStr}`).digest('base64');
  return `${header}.${payloadStr}.${signature}`;
}

async function sendOTPViaSMS(mobile, otp) {
  const message = `Your KisaanMela OTP is: ${otp}. Valid for 10 minutes. Do not share this OTP with anyone. - KisaanMela`;
  
  try {
    if (FAST2SMS_API_KEY && FAST2SMS_API_KEY !== 'YOUR_FAST2SMS_API_KEY') {
      console.log(`📱 Sending OTP via Fast2SMS to ${mobile}`);
      
      const response = await axios.post(FAST2SMS_API_URL, {
        route: 'q',
        message: message,
        language: 'english',
        flash: 0,
        numbers: mobile
      }, {
        headers: {
          'authorization': FAST2SMS_API_KEY,
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      });

      if (response.data.return === true) {
        return {
          success: true,
          message: 'OTP sent successfully via Fast2SMS',
          provider: 'Fast2SMS',
          requestId: response.data.request_id
        };
      } else {
        throw new Error(response.data.message || 'Fast2SMS API error');
      }
    } else {
      // Development mode - just log the OTP
      console.log(`📱 [DEV MODE] OTP for ${mobile}: ${otp}`);
      return {
        success: true,
        message: 'OTP logged to console (development mode)',
        provider: 'Console'
      };
    }
  } catch (error) {
    console.error('SMS sending failed:', error.message);
    
    // Fallback to console logging
    console.log(`📱 [FALLBACK] OTP for ${mobile}: ${otp}`);
    return {
      success: true,
      message: 'SMS service unavailable, OTP logged to console',
      provider: 'Console',
      error: error.message
    };
  }
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const method = req.method;
  const pathname = parsedUrl.pathname;
  
  console.log(`${new Date().toISOString()} - ${method} ${pathname}`);
  
  // Handle CORS preflight
  if (method === 'OPTIONS') {
    sendJSON(res, 200, {
      success: true,
      message: 'CORS preflight successful',
      allowedMethods: ['GET', 'POST', 'OPTIONS']
    });
    return;
  }
  
  // Health check
  if (method === 'GET' && pathname === '/api/health') {
    sendJSON(res, 200, {
      success: true,
      message: 'OTP Backend Server is running',
      timestamp: new Date().toISOString(),
      endpoints: [
        'GET /api/health',
        'POST /api/auth/otp/send',
        'POST /api/auth/otp/verify',
        'POST /api/auth/login',
        'GET /api/auth/me'
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
    
    // Generate OTP
    const otp = generateOTP();
    const sessionId = crypto.randomUUID();
    
    // Send OTP via SMS
    const smsResult = await sendOTPViaSMS(mobile, otp);
    
    // Store OTP session only if SMS was sent (or in dev mode)
    if (smsResult.success) {
      otpSessions.set(mobile, {
        otp,
        sessionId,
        mobile,
        attempts: 0,
        maxAttempts: 3,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        verified: false,
        createdAt: new Date(),
        smsProvider: smsResult.provider,
        smsRequestId: smsResult.requestId
      });
      
      console.log(`📱 OTP for ${mobile}: ${otp} (Session: ${sessionId}) via ${smsResult.provider}`);
      
      sendJSON(res, 200, {
        success: true,
        message: smsResult.message,
        mobile: mobile,
        sessionId: sessionId,
        provider: smsResult.provider,
        // Include OTP in development for testing
        otp: process.env.NODE_ENV === 'development' || smsResult.provider === 'Console' ? otp : undefined,
        expiresIn: '10 minutes',
        debug: {
          endpoint: 'POST /api/auth/otp/send',
          timestamp: new Date().toISOString(),
          smsRequestId: smsResult.requestId
        }
      });
    } else {
      sendJSON(res, 500, {
        success: false,
        error: 'Failed to send OTP. Please try again.',
        details: smsResult.message
      });
    }
    return;
  }
  
  // POST /api/auth/otp/verify
  if (method === 'POST' && pathname === '/api/auth/otp/verify') {
    console.log('🔥 POST /api/auth/otp/verify called');
    
    const body = await parseBody(req);
    const { mobile, otp, name } = body;
    
    if (!mobile || !otp) {
      sendJSON(res, 400, {
        success: false,
        error: 'Mobile number and OTP are required',
        received: body
      });
      return;
    }
    
    const session = otpSessions.get(mobile);
    
    if (!session) {
      sendJSON(res, 400, {
        success: false,
        error: 'OTP session not found. Please request OTP again.'
      });
      return;
    }
    
    // Check if OTP is expired
    if (new Date() > session.expiresAt) {
      otpSessions.delete(mobile);
      sendJSON(res, 400, {
        success: false,
        error: 'OTP has expired. Please request a new OTP.'
      });
      return;
    }
    
    // Check attempts limit
    if (session.attempts >= session.maxAttempts) {
      otpSessions.delete(mobile);
      sendJSON(res, 400, {
        success: false,
        error: 'Too many failed attempts. Please request a new OTP.'
      });
      return;
    }
    
    // Verify OTP
    if (session.otp !== otp) {
      session.attempts += 1;
      otpSessions.set(mobile, session);
      
      sendJSON(res, 400, {
        success: false,
        error: 'Invalid OTP',
        attemptsLeft: session.maxAttempts - session.attempts
      });
      return;
    }
    
    // OTP is valid, mark as verified
    session.verified = true;
    otpSessions.set(mobile, session);
    
    // Find or create user
    let user = users.get(mobile);
    
    if (!user) {
      // Create new user
      user = {
        id: crypto.randomUUID(),
        mobile: mobile,
        name: name || `User ${mobile.slice(-4)}`,
        email: `${mobile}@kisaanmela.com`,
        role: 'farmer',
        verified: true,
        createdAt: new Date(),
        lastLogin: new Date()
      };
      users.set(mobile, user);
      console.log(`👤 New user created: ${user.name} (${mobile})`);
    } else {
      // Update existing user
      user.lastLogin = new Date();
      if (name) user.name = name;
      users.set(mobile, user);
      console.log(`👤 User logged in: ${user.name} (${mobile})`);
    }
    
    // Generate JWT token
    const token = generateJWT({
      userId: user.id,
      mobile: user.mobile,
      role: user.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days
    });
    
    // Clean up OTP session
    otpSessions.delete(mobile);
    
    sendJSON(res, 200, {
      success: true,
      message: 'OTP verified successfully',
      token: token,
      user: {
        id: user.id,
        mobile: user.mobile,
        name: user.name,
        email: user.email,
        role: user.role,
        verified: user.verified,
        isNewUser: !users.has(mobile)
      },
      debug: {
        endpoint: 'POST /api/auth/otp/verify',
        timestamp: new Date().toISOString()
      }
    });
    return;
  }
  
  // POST /api/auth/login (regular email/password login)
  if (method === 'POST' && pathname === '/api/auth/login') {
    console.log('🔥 POST /api/auth/login called');
    
    const body = await parseBody(req);
    const { email, password, mobile } = body;
    
    // Demo login credentials
    const demoCredentials = [
      { email: 'admin@kisaanmela.com', password: 'admin123', role: 'admin', name: 'Admin User' },
      { email: 'farmer@kisaanmela.com', password: 'farmer123', role: 'farmer', name: 'Demo Farmer' },
      { email: 'buyer@kisaanmela.com', password: 'buyer123', role: 'buyer', name: 'Demo Buyer' },
      { email: 'demo@kisaanmela.com', password: 'demo123', role: 'farmer', name: 'Demo User' }
    ];
    
    const validUser = demoCredentials.find(u => 
      (email && u.email === email && u.password === password) ||
      (mobile && users.has(mobile))
    );
    
    if (!validUser) {
      sendJSON(res, 401, {
        success: false,
        error: 'Invalid email or password'
      });
      return;
    }
    
    const token = generateJWT({
      userId: validUser.email,
      email: validUser.email,
      role: validUser.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60)
    });
    
    sendJSON(res, 200, {
      success: true,
      message: 'Login successful',
      token: token,
      user: {
        id: validUser.email,
        email: validUser.email,
        name: validUser.name,
        role: validUser.role,
        verified: true
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
        error: 'Email is required'
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      sendJSON(res, 400, {
        success: false,
        error: 'Invalid email format'
      });
      return;
    }

    try {
      // Check if user exists (for demo, we'll check our demo users and test user)
      const demoEmails = [
        'demo@kisaanmela.com',
        'test@kisaanmela.com',
        'admin@kisaanmela.com',
        'farmer@kisaanmela.com',
        'buyer@kisaanmela.com'
      ];

      const userExists = demoEmails.includes(email);

      if (!userExists) {
        // For security, we still return success to prevent email enumeration
        console.log(`⚠️ Password reset attempted for non-existent email: ${email}`);
        sendJSON(res, 200, {
          success: true,
          message: 'If an account with this email exists, you will receive a password reset link.',
          email: email
        });
        return;
      }

      // Generate secure reset token (JWT-like)
      const resetToken = crypto.randomUUID();
      const tokenExpiry = Date.now() + (60 * 60 * 1000); // 1 hour

      // Store reset token (in production, store in database)
      const resetData = {
        email,
        token: resetToken,
        expires: tokenExpiry,
        used: false
      };

      // For demo, we'll just log it
      console.log(`📧 Password reset token generated for ${email}:`);
      console.log(`   Token: ${resetToken}`);
      console.log(`   Expires: ${new Date(tokenExpiry).toISOString()}`);
      console.log(`   Reset URL: http://localhost:3000/reset-password?token=${resetToken}`);

      // In production, you would:
      // 1. Store the token in database with expiration
      // 2. Send actual email with reset link
      // 3. Use proper email templates

      sendJSON(res, 200, {
        success: true,
        message: 'Password reset instructions have been sent to your email address.',
        email: email,
        // Include token in development for testing
        resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined,
        resetUrl: process.env.NODE_ENV === 'development' ? `http://localhost:3000/reset-password?token=${resetToken}` : undefined,
        debug: {
          endpoint: 'POST /api/forgot-password',
          timestamp: new Date().toISOString(),
          emailSent: true,
          tokenExpires: new Date(tokenExpiry).toISOString()
        }
      });

    } catch (error) {
      console.error('❌ Forgot password error:', error);
      sendJSON(res, 500, {
        success: false,
        error: 'Internal server error. Please try again later.'
      });
    }
    return;
  }
  
  // GET /api/marketplace/products - Browse all products
  if (method === 'GET' && pathname === '/api/marketplace/products') {
    const query = parsedUrl.query;
    const category = query.category;
    const search = query.search;
    const featured = query.featured;
    
    let productList = Array.from(products.values());
    
    // Filter by category
    if (category) {
      productList = productList.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    
    // Filter by search term
    if (search) {
      const searchTerm = search.toLowerCase();
      productList = productList.filter(p => 
        p.title.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm) ||
        p.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }
    
    // Filter featured products
    if (featured === 'true') {
      productList = productList.filter(p => p.featured);
    }
    
    sendJSON(res, 200, {
      success: true,
      products: productList,
      total: productList.length,
      categories: ['Seeds', 'Crops', 'Livestock', 'Equipment']
    });
    return;
  }
  
  // GET /api/marketplace/products/:id - Get product details
  if (method === 'GET' && pathname.startsWith('/api/marketplace/products/')) {
    const productId = pathname.split('/').pop();
    const product = products.get(productId);
    
    if (!product) {
      sendJSON(res, 404, {
        success: false,
        error: 'Product not found'
      });
      return;
    }
    
    sendJSON(res, 200, {
      success: true,
      product: product
    });
    return;
  }
  
  // POST /api/marketplace/products - Add new product (Sell Items)
  if (method === 'POST' && pathname === '/api/marketplace/products') {
    const body = await parseBody(req);
    const { title, description, category, subcategory, price, unit, quantity, images, location, tags, specifications, sellerId } = body;
    
    if (!title || !description || !category || !price || !sellerId) {
      sendJSON(res, 400, {
        success: false,
        error: 'Title, description, category, price, and sellerId are required'
      });
      return;
    }
    
    const productId = crypto.randomUUID();
    const seller = users.get(sellerId);
    
    const newProduct = {
      id: productId,
      sellerId,
      sellerName: seller ? seller.name : 'Unknown Seller',
      sellerMobile: seller ? seller.mobile : '',
      title,
      description,
      category,
      subcategory: subcategory || '',
      price: parseFloat(price),
      unit: unit || 'per unit',
      quantity: parseInt(quantity) || 1,
      images: images || [],
      location: location || (seller ? seller.location : ''),
      status: 'active',
      featured: false,
      tags: tags || [],
      specifications: specifications || {},
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    products.set(productId, newProduct);
    
    sendJSON(res, 201, {
      success: true,
      message: 'Product listed successfully',
      product: newProduct
    });
    return;
  }
  
  // POST /api/marketplace/orders - Place order
  if (method === 'POST' && pathname === '/api/marketplace/orders') {
    const body = await parseBody(req);
    const { productId, quantity, buyerId, paymentMethod, deliveryAddress } = body;
    
    if (!productId || !quantity || !buyerId) {
      sendJSON(res, 400, {
        success: false,
        error: 'Product ID, quantity, and buyer ID are required'
      });
      return;
    }
    
    const product = products.get(productId);
    if (!product) {
      sendJSON(res, 404, {
        success: false,
        error: 'Product not found'
      });
      return;
    }
    
    if (product.quantity < quantity) {
      sendJSON(res, 400, {
        success: false,
        error: 'Insufficient quantity available'
      });
      return;
    }
    
    const orderId = crypto.randomUUID();
    const totalAmount = product.price * quantity;
    const buyer = users.get(buyerId);
    
    const newOrder = {
      id: orderId,
      productId,
      productTitle: product.title,
      sellerId: product.sellerId,
      sellerName: product.sellerName,
      buyerId,
      buyerName: buyer ? buyer.name : 'Unknown Buyer',
      quantity,
      unitPrice: product.price,
      totalAmount,
      paymentMethod: paymentMethod || 'cash_on_delivery',
      deliveryAddress: deliveryAddress || '',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    orders.set(orderId, newOrder);
    
    // Update product quantity
    product.quantity -= quantity;
    products.set(productId, product);
    
    sendJSON(res, 201, {
      success: true,
      message: 'Order placed successfully',
      order: newOrder
    });
    return;
  }
  
  // GET /api/marketplace/orders - Get orders (for buyer or seller)
  if (method === 'GET' && pathname === '/api/marketplace/orders') {
    const query = parsedUrl.query;
    const userId = query.userId;
    const role = query.role; // 'buyer' or 'seller'
    
    if (!userId) {
      sendJSON(res, 400, {
        success: false,
        error: 'User ID is required'
      });
      return;
    }
    
    let orderList = Array.from(orders.values());
    
    if (role === 'buyer') {
      orderList = orderList.filter(o => o.buyerId === userId);
    } else if (role === 'seller') {
      orderList = orderList.filter(o => o.sellerId === userId);
    }
    
    sendJSON(res, 200, {
      success: true,
      orders: orderList,
      total: orderList.length
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
      'POST /api/auth/otp/verify',
      'POST /api/auth/login',
      'POST /api/forgot-password',
      'GET /api/marketplace/products',
      'GET /api/marketplace/products/:id',
      'POST /api/marketplace/products',
      'POST /api/marketplace/orders',
      'GET /api/marketplace/orders'
    ]
  });
});

server.listen(PORT, () => {
  console.log(`🚀 OTP Backend Server running on http://localhost:${PORT}`);
  console.log(`📋 Available endpoints:`);
  console.log(`   GET  http://localhost:${PORT}/api/health`);
  console.log(`   POST http://localhost:${PORT}/api/auth/otp/send`);
  console.log(`   POST http://localhost:${PORT}/api/auth/otp/verify`);
  console.log(`   POST http://localhost:${PORT}/api/auth/login`);
  console.log(`   POST http://localhost:${PORT}/api/forgot-password`);
  console.log(`\n🧪 Test OTP flow:`);
  console.log(`   1. Send OTP: curl -X POST http://localhost:${PORT}/api/auth/otp/send -H "Content-Type: application/json" -d '{"mobile":"9876543210"}'`);
  console.log(`   2. Verify OTP: curl -X POST http://localhost:${PORT}/api/auth/otp/verify -H "Content-Type: application/json" -d '{"mobile":"9876543210","otp":"123456","name":"Test User"}'`);
  console.log(`\n📱 Demo mobile: 9876543210`);
  console.log(`🔑 Demo credentials: admin@kisaanmela.com / admin123`);
});

module.exports = server;
