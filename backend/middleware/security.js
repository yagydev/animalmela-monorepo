// Security Middleware for AnimalMela - JWT Auth, RBAC, Rate Limiting, Media Scanning
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sharp = require('sharp');
const { promisify } = require('util');

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your-refresh-token-secret';

// Role-Based Access Control (RBAC)
const ROLES = {
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  SELLER: 'seller',
  BUYER: 'buyer',
  VETERINARIAN: 'veterinarian',
  TRANSPORT_PROVIDER: 'transport_provider',
  INSURANCE_PROVIDER: 'insurance_provider',
  GUEST: 'guest'
};

const PERMISSIONS = {
  // User management
  CREATE_USER: 'create_user',
  READ_USER: 'read_user',
  UPDATE_USER: 'update_user',
  DELETE_USER: 'delete_user',
  
  // Listing management
  CREATE_LISTING: 'create_listing',
  READ_LISTING: 'read_listing',
  UPDATE_LISTING: 'update_listing',
  DELETE_LISTING: 'delete_listing',
  
  // Order management
  CREATE_ORDER: 'create_order',
  READ_ORDER: 'read_order',
  UPDATE_ORDER: 'update_order',
  DELETE_ORDER: 'delete_order',
  
  // Admin functions
  MANAGE_USERS: 'manage_users',
  MANAGE_LISTINGS: 'manage_listings',
  MANAGE_ORDERS: 'manage_orders',
  VIEW_ANALYTICS: 'view_analytics',
  MANAGE_SYSTEM: 'manage_system'
};

// Role-Permission mapping
const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: Object.values(PERMISSIONS),
  [ROLES.MODERATOR]: [
    PERMISSIONS.READ_USER,
    PERMISSIONS.UPDATE_USER,
    PERMISSIONS.READ_LISTING,
    PERMISSIONS.UPDATE_LISTING,
    PERMISSIONS.DELETE_LISTING,
    PERMISSIONS.READ_ORDER,
    PERMISSIONS.UPDATE_ORDER,
    PERMISSIONS.VIEW_ANALYTICS
  ],
  [ROLES.SELLER]: [
    PERMISSIONS.CREATE_LISTING,
    PERMISSIONS.READ_LISTING,
    PERMISSIONS.UPDATE_LISTING,
    PERMISSIONS.DELETE_LISTING,
    PERMISSIONS.READ_ORDER,
    PERMISSIONS.UPDATE_ORDER
  ],
  [ROLES.BUYER]: [
    PERMISSIONS.READ_LISTING,
    PERMISSIONS.CREATE_ORDER,
    PERMISSIONS.READ_ORDER
  ],
  [ROLES.VETERINARIAN]: [
    PERMISSIONS.READ_USER,
    PERMISSIONS.READ_LISTING,
    PERMISSIONS.READ_ORDER
  ],
  [ROLES.TRANSPORT_PROVIDER]: [
    PERMISSIONS.READ_USER,
    PERMISSIONS.READ_ORDER
  ],
  [ROLES.INSURANCE_PROVIDER]: [
    PERMISSIONS.READ_USER,
    PERMISSIONS.READ_ORDER
  ],
  [ROLES.GUEST]: [
    PERMISSIONS.READ_LISTING
  ]
};

// JWT Authentication Middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access token required' 
      });
    }

    const decoded = await promisify(jwt.verify)(token, JWT_SECRET);
    
    // Add user info to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      permissions: ROLE_PERMISSIONS[decoded.role] || []
    };

    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(403).json({ 
      success: false, 
      message: 'Invalid or expired token' 
    });
  }
};

// Role-based authorization middleware
const authorize = (requiredPermissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    const userPermissions = req.user.permissions || [];
    const hasPermission = requiredPermissions.some(permission => 
      userPermissions.includes(permission)
    );

    if (!hasPermission) {
      return res.status(403).json({ 
        success: false, 
        message: 'Insufficient permissions' 
      });
    }

    next();
  };
};

// Resource ownership middleware
const checkOwnership = (resourceField = 'userId') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    // Admin can access any resource
    if (req.user.role === ROLES.ADMIN) {
      return next();
    }

    const resourceUserId = req.params[resourceField] || req.body[resourceField];
    
    if (resourceUserId && resourceUserId !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied: Resource ownership required' 
      });
    }

    next();
  };
};

// Rate limiting configurations
const createRateLimit = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: { success: false, message },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        message: 'Too many requests, please try again later',
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }
  });
};

// Different rate limits for different endpoints
const rateLimits = {
  // General API rate limit
  general: createRateLimit(15 * 60 * 1000, 100, 'Too many requests from this IP'),
  
  // Authentication rate limit
  auth: createRateLimit(15 * 60 * 1000, 5, 'Too many authentication attempts'),
  
  // Listing creation rate limit
  listing: createRateLimit(60 * 60 * 1000, 10, 'Too many listing creation attempts'),
  
  // Search rate limit
  search: createRateLimit(60 * 1000, 30, 'Too many search requests'),
  
  // Upload rate limit
  upload: createRateLimit(60 * 60 * 1000, 20, 'Too many file uploads'),
  
  // Messaging rate limit
  messaging: createRateLimit(60 * 1000, 10, 'Too many messages sent')
};

// Security headers middleware
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.animalmela.com"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
});

// Input validation and sanitization
const sanitizeInput = (req, res, next) => {
  // Remove potentially dangerous characters
  const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    return str
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  };

  // Sanitize request body
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeString(req.body[key]);
      }
    });
  }

  // Sanitize query parameters
  if (req.query) {
    Object.keys(req.query).forEach(key => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = sanitizeString(req.query[key]);
      }
    });
  }

  next();
};

// Media scanning and validation
const scanMedia = async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next();
  }

  try {
    for (const file of req.files) {
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid file type. Only images are allowed.'
        });
      }

      // Check file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        return res.status(400).json({
          success: false,
          message: 'File too large. Maximum size is 10MB.'
        });
      }

      // Scan image for malicious content
      try {
        const image = sharp(file.buffer);
        const metadata = await image.metadata();
        
        // Check image dimensions
        if (metadata.width > 5000 || metadata.height > 5000) {
          return res.status(400).json({
            success: false,
            message: 'Image dimensions too large.'
          });
        }

        // Generate secure filename
        const fileExtension = file.originalname.split('.').pop();
        const secureFilename = crypto.randomBytes(16).toString('hex') + '.' + fileExtension;
        file.secureFilename = secureFilename;

        // Add metadata to file object
        file.metadata = metadata;
        
      } catch (error) {
        console.error('Image scanning failed:', error);
        return res.status(400).json({
          success: false,
          message: 'Invalid image file.'
        });
      }
    }

    next();
  } catch (error) {
    console.error('Media scanning error:', error);
    return res.status(500).json({
      success: false,
      message: 'Media scanning failed.'
    });
  }
};

// Password security utilities
const passwordUtils = {
  // Hash password
  hashPassword: async (password) => {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  },

  // Verify password
  verifyPassword: async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
  },

  // Generate secure password
  generateSecurePassword: (length = 16) => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  },

  // Validate password strength
  validatePasswordStrength: (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const errors = [];
    if (password.length < minLength) {
      errors.push(`Password must be at least ${minLength} characters long`);
    }
    if (!hasUpperCase) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!hasLowerCase) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!hasNumbers) {
      errors.push('Password must contain at least one number');
    }
    if (!hasSpecialChar) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
};

// JWT token utilities
const tokenUtils = {
  // Generate access token
  generateAccessToken: (payload) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  },

  // Generate refresh token
  generateRefreshToken: (payload) => {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '30d' });
  },

  // Verify refresh token
  verifyRefreshToken: async (token) => {
    return await promisify(jwt.verify)(token, REFRESH_TOKEN_SECRET);
  },

  // Generate token pair
  generateTokenPair: (user) => {
    const payload = {
      id: user._id,
      email: user.email,
      role: user.user_type,
      permissions: ROLE_PERMISSIONS[user.user_type] || []
    };

    return {
      accessToken: tokenUtils.generateAccessToken(payload),
      refreshToken: tokenUtils.generateRefreshToken(payload)
    };
  }
};

// Security audit logging
const securityAudit = {
  logAuthAttempt: (req, success, reason = '') => {
    const logData = {
      timestamp: new Date(),
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      endpoint: req.path,
      method: req.method,
      success,
      reason,
      userId: req.user?.id || null
    };
    
    console.log('Security Audit - Auth Attempt:', logData);
    // Send to monitoring system
  },

  logPermissionDenied: (req, requiredPermission) => {
    const logData = {
      timestamp: new Date(),
      ip: req.ip,
      userId: req.user?.id,
      endpoint: req.path,
      requiredPermission,
      userPermissions: req.user?.permissions || []
    };
    
    console.log('Security Audit - Permission Denied:', logData);
    // Send to monitoring system
  },

  logRateLimitExceeded: (req, limitType) => {
    const logData = {
      timestamp: new Date(),
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      limitType,
      endpoint: req.path
    };
    
    console.log('Security Audit - Rate Limit Exceeded:', logData);
    // Send to monitoring system
  }
};

// Export all security utilities
module.exports = {
  ROLES,
  PERMISSIONS,
  ROLE_PERMISSIONS,
  authenticateToken,
  authorize,
  checkOwnership,
  rateLimits,
  securityHeaders,
  sanitizeInput,
  scanMedia,
  passwordUtils,
  tokenUtils,
  securityAudit
};
