const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { User } = require('../../config/database');
const { protect } = require('../middleware/auth');
const { sendEmail } = require('../services/emailService');
const { logger } = require('../utils/logger');

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, phone, userType = 'pet_owner' } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      email,
      password_hash: passwordHash,
      name,
      phone,
      user_type: userType,
      email_verified: false,
      phone_verified: false,
      verified: false
    });

    await user.save();

    // Generate verification token
    const verificationToken = jwt.sign(
      { userId: user._id, email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '24h' }
    );

    // Send verification email (commented out for now)
    // await sendEmail({
    //   email,
    //   subject: 'Welcome to AnimalMela - Verify Your Email',
    //   template: 'emailVerification',
    //   data: {
    //     name,
    //     verificationUrl: `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`
    //   }
    // });

    // Generate JWT
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        email,
        name,
        userType,
        verified: false
      }
    });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email })
      .select('_id email password_hash name user_type verified avatar_url');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Update last login
    await User.findByIdAndUpdate(user._id, { last_login: new Date() });

    // Generate JWT
    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        userType: user.user_type,
        verified: user.verified,
        avatarUrl: user.avatar_url
      }
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('_id email name user_type verified avatar_url phone preferences');

    res.json({
      success: true,
      user
    });
  } catch (error) {
    logger.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Verify email
// @route   GET /api/auth/verify-email
// @access  Public
router.get('/verify-email', async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'Verification token is required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
    await db('users')
      .where('id', decoded.userId)
      .update({ 
        email_verified: true,
        verified: true,
        updated_at: new Date()
      });

    res.json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    logger.error('Email verification error:', error);
    res.status(400).json({
      success: false,
      error: 'Invalid verification token'
    });
  }
});

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1h' }
    );

    // Send reset email (commented out for now)
    // await sendEmail({
    //   email,
    //   subject: 'Password Reset Request',
    //   template: 'passwordReset',
    //   data: {
    //     name: user.name,
    //     resetUrl: `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`
    //   }
    // });

    res.json({
      success: true,
      message: 'Password reset email sent',
      // For development, include the token in response
      resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined
    });
  } catch (error) {
    logger.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Validate reset token
// @route   GET /api/auth/validate-reset-token
// @access  Public
router.get('/validate-reset-token', async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'Reset token is required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
    // Check if user exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid reset token'
      });
    }

    res.json({
      success: true,
      message: 'Token is valid'
    });
  } catch (error) {
    logger.error('Token validation error:', error);
    res.status(400).json({
      success: false,
      error: 'Invalid or expired reset token'
    });
  }
});

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        error: 'Token and password are required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
    // Check if user exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid reset token'
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    await User.findByIdAndUpdate(decoded.userId, {
      password_hash: passwordHash,
      updated_at: new Date()
    });

    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    logger.error('Reset password error:', error);
    res.status(400).json({
      success: false,
      error: 'Invalid reset token'
    });
  }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, phone, preferences } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (preferences) updateData.preferences = preferences;

    updateData.updated_at = new Date();

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, select: '_id email name user_type verified avatar_url phone preferences' }
    );

    res.json({
      success: true,
      user
    });
  } catch (error) {
    logger.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Upload user avatar
// @route   POST /api/auth/upload-avatar
// @access  Private
router.post('/upload-avatar', protect, async (req, res) => {
  try {
    // This would typically use multer or similar for file upload
    // For now, we'll simulate a successful upload
    const { avatarUrl } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar_url: avatarUrl, updated_at: new Date() },
      { new: true, select: '_id email name user_type verified avatar_url phone preferences' }
    );

    res.json({
      success: true,
      avatarUrl: user.avatar_url
    });
  } catch (error) {
    logger.error('Avatar upload error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get user settings
// @route   GET /api/auth/settings
// @access  Private
router.get('/settings', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('preferences');

    const defaultSettings = {
      notifications: {
        email: true,
        sms: false,
        push: true,
        marketing: false,
      },
      privacy: {
        profileVisibility: 'public',
        showEmail: false,
        showPhone: false,
      },
      security: {
        twoFactorEnabled: false,
        loginAlerts: true,
      },
    };

    res.json({
      success: true,
      settings: user.preferences || defaultSettings
    });
  } catch (error) {
    logger.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Update user settings
// @route   PUT /api/auth/settings
// @access  Private
router.put('/settings', protect, async (req, res) => {
  try {
    const { notifications, privacy, security } = req.body;
    
    const updateData = {
      preferences: {
        notifications,
        privacy,
        security,
      },
      updated_at: new Date()
    };

    await User.findByIdAndUpdate(req.user.id, updateData);

    res.json({
      success: true,
      settings: updateData.preferences
    });
  } catch (error) {
    logger.error('Settings update error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Change password
// @route   POST /api/auth/change-password
// @access  Private
router.post('/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Current password and new password are required'
      });
    }

    // Get user with password
    const user = await User.findById(req.user.id).select('password_hash');
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        error: 'Current password is incorrect'
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    // Update password
    await User.findByIdAndUpdate(req.user.id, {
      password_hash: passwordHash,
      updated_at: new Date()
    });

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    logger.error('Change password error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Delete user account
// @route   DELETE /api/auth/delete-account
// @access  Private
router.delete('/delete-account', protect, async (req, res) => {
  try {
    // In a real application, you might want to:
    // 1. Soft delete the user
    // 2. Delete associated data (pets, bookings, etc.)
    // 3. Send confirmation email
    
    await User.findByIdAndDelete(req.user.id);

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    logger.error('Account deletion error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', protect, (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

module.exports = router;
