const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../../config/database');
const { protect, authorize } = require('../middleware/auth');
const { uploadAvatar } = require('../services/fileUploadService');
const { logger } = require('../utils/logger');

const router = express.Router();

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await db('users')
      .select(
        'id',
        'email',
        'name',
        'phone',
        'avatar_url',
        'user_type',
        'verified',
        'email_verified',
        'phone_verified',
        'preferences',
        'stripe_customer_id',
        'last_login',
        'created_at',
        'updated_at'
      )
      .where('id', req.user.id)
      .first();

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    logger.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, phone, preferences } = req.body;

    const updateData = {
      name,
      phone,
      preferences: preferences || {},
      updated_at: new Date()
    };

    await db('users')
      .where('id', req.user.id)
      .update(updateData);

    const updatedUser = await db('users')
      .select(
        'id',
        'email',
        'name',
        'phone',
        'avatar_url',
        'user_type',
        'verified',
        'email_verified',
        'phone_verified',
        'preferences',
        'last_login',
        'created_at',
        'updated_at'
      )
      .where('id', req.user.id)
      .first();

    res.json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    logger.error('Update user profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Upload avatar
// @route   POST /api/users/avatar
// @access  Private
router.post('/avatar', protect, async (req, res) => {
  try {
    // Handle file upload (assuming multer middleware is used)
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    // Upload to S3
    const uploadResult = await uploadAvatar(req.file);

    // Update user avatar
    await db('users')
      .where('id', req.user.id)
      .update({ 
        avatar_url: uploadResult.url,
        updated_at: new Date()
      });

    res.json({
      success: true,
      data: { avatarUrl: uploadResult.url }
    });
  } catch (error) {
    logger.error('Upload avatar error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const user = await db('users')
      .select(
        'id',
        'name',
        'avatar_url',
        'user_type',
        'verified',
        'created_at'
      )
      .where('id', req.params.id)
      .first();

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    logger.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Search users
// @route   GET /api/users/search
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { q, userType, verified, page = 1, limit = 10 } = req.query;

    let query = db('users')
      .select(
        'id',
        'name',
        'avatar_url',
        'user_type',
        'verified',
        'created_at'
      );

    // Text search
    if (q) {
      query = query.where('name', 'ilike', `%${q}%`);
    }

    // Apply filters
    if (userType) {
      query = query.where('user_type', userType);
    }

    if (verified !== undefined) {
      query = query.where('verified', verified === 'true');
    }

    // Get total count
    const countQuery = query.clone();
    const total = await countQuery.count('* as count').first();

    // Apply pagination
    const offset = (page - 1) * limit;
    const users = await query
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);

    res.json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: total.count,
        pages: Math.ceil(total.count / limit)
      }
    });
  } catch (error) {
    logger.error('Search users error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get user pets
// @route   GET /api/users/:id/pets
// @access  Public
router.get('/:id/pets', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    let query = db('pets')
      .where('owner_id', req.params.id);

    // Get total count
    const countQuery = query.clone();
    const total = await countQuery.count('* as count').first();

    // Apply pagination
    const offset = (page - 1) * limit;
    const pets = await query
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);

    // Get pet photos
    const petIds = pets.map(pet => pet.id);
    const photos = await db('pet_photos')
      .whereIn('pet_id', petIds)
      .orderBy('is_primary', 'desc')
      .orderBy('order_index', 'asc');

    // Attach photos to pets
    const petsWithPhotos = pets.map(pet => ({
      ...pet,
      photos: photos.filter(photo => photo.pet_id === pet.id)
    }));

    res.json({
      success: true,
      data: petsWithPhotos,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: total.count,
        pages: Math.ceil(total.count / limit)
      }
    });
  } catch (error) {
    logger.error('Get user pets error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get user services
// @route   GET /api/users/:id/services
// @access  Public
router.get('/:id/services', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    let query = db('services')
      .where('provider_id', req.params.id)
      .where('active', true);

    // Get total count
    const countQuery = query.clone();
    const total = await countQuery.count('* as count').first();

    // Apply pagination
    const offset = (page - 1) * limit;
    const services = await query
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);

    // Get average ratings for services
    const serviceIds = services.map(service => service.id);
    const ratings = await db('reviews')
      .select('service_id')
      .avg('rating as avg_rating')
      .count('* as review_count')
      .whereIn('service_id', serviceIds)
      .groupBy('service_id');

    // Attach ratings to services
    const servicesWithRatings = services.map(service => {
      const rating = ratings.find(r => r.service_id === service.id);
      return {
        ...service,
        avgRating: rating ? parseFloat(rating.avg_rating) : 0,
        reviewCount: rating ? parseInt(rating.review_count) : 0
      };
    });

    res.json({
      success: true,
      data: servicesWithRatings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: total.count,
        pages: Math.ceil(total.count / limit)
      }
    });
  } catch (error) {
    logger.error('Get user services error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get user reviews
// @route   GET /api/users/:id/reviews
// @access  Public
router.get('/:id/reviews', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    let query = db('reviews')
      .select(
        'reviews.*',
        'services.title as service_title',
        'users.name as reviewer_name',
        'users.avatar_url as reviewer_avatar'
      )
      .join('services', 'reviews.service_id', 'services.id')
      .join('users', 'reviews.reviewer_id', 'users.id')
      .where('services.provider_id', req.params.id);

    // Get total count
    const countQuery = query.clone();
    const total = await countQuery.count('* as count').first();

    // Apply pagination
    const offset = (page - 1) * limit;
    const reviews = await query
      .orderBy('reviews.created_at', 'desc')
      .limit(limit)
      .offset(offset);

    res.json({
      success: true,
      data: reviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: total.count,
        pages: Math.ceil(total.count / limit)
      }
    });
  } catch (error) {
    logger.error('Get user reviews error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Delete user account
// @route   DELETE /api/users/profile
// @access  Private
router.delete('/profile', protect, async (req, res) => {
  try {
    // Soft delete user
    await db('users')
      .where('id', req.user.id)
      .update({ 
        email: `deleted_${Date.now()}@deleted.com`,
        name: 'Deleted User',
        phone: null,
        avatar_url: null,
        verified: false,
        email_verified: false,
        phone_verified: false,
        updated_at: new Date()
      });

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    logger.error('Delete user account error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;
