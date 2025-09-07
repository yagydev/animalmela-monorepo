const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../../config/database');
const { protect } = require('../middleware/auth');
const { logger } = require('../utils/logger');

const router = express.Router();

// @desc    Get reviews for a service
// @route   GET /api/reviews/service/:serviceId
// @access  Public
router.get('/service/:serviceId', async (req, res) => {
  try {
    const { page = 1, limit = 10, rating } = req.query;

    let query = db('reviews')
      .select(
        'reviews.*',
        'users.name as reviewer_name',
        'users.avatar_url as reviewer_avatar',
        'users.verified as reviewer_verified'
      )
      .join('users', 'reviews.reviewer_id', 'users.id')
      .where('reviews.service_id', req.params.serviceId)
      .where('reviews.verified', true);

    // Apply rating filter
    if (rating) {
      query = query.where('reviews.rating', rating);
    }

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
    logger.error('Get service reviews error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get user reviews
// @route   GET /api/reviews/user/:userId
// @access  Public
router.get('/user/:userId', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    let query = db('reviews')
      .select(
        'reviews.*',
        'services.title as service_title',
        'services.service_type',
        'users.name as reviewer_name',
        'users.avatar_url as reviewer_avatar'
      )
      .join('services', 'reviews.service_id', 'services.id')
      .join('users', 'reviews.reviewer_id', 'users.id')
      .where('services.provider_id', req.params.userId)
      .where('reviews.verified', true);

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

// @desc    Create review
// @route   POST /api/reviews
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const {
      serviceId,
      bookingId,
      rating,
      comment,
      ratingBreakdown
    } = req.body;

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: 'Rating must be between 1 and 5'
      });
    }

    // Check if user has completed booking for this service
    const booking = await db('bookings')
      .where('id', bookingId)
      .where('customer_id', req.user.id)
      .where('service_id', serviceId)
      .where('status', 'completed')
      .first();

    if (!booking) {
      return res.status(400).json({
        success: false,
        error: 'You can only review services you have completed'
      });
    }

    // Check if user has already reviewed this service
    const existingReview = await db('reviews')
      .where('service_id', serviceId)
      .where('reviewer_id', req.user.id)
      .where('booking_id', bookingId)
      .first();

    if (existingReview) {
      return res.status(400).json({
        success: false,
        error: 'You have already reviewed this service'
      });
    }

    // Create review
    const reviewData = {
      id: uuidv4(),
      reviewer_id: req.user.id,
      service_id: serviceId,
      booking_id: bookingId,
      rating,
      comment: comment || null,
      rating_breakdown: ratingBreakdown || {},
      verified: false,
      helpful: false,
      helpful_count: 0
    };

    const [reviewId] = await db('reviews').insert(reviewData).returning('id');

    const review = await db('reviews')
      .select(
        'reviews.*',
        'users.name as reviewer_name',
        'users.avatar_url as reviewer_avatar',
        'services.title as service_title'
      )
      .join('users', 'reviews.reviewer_id', 'users.id')
      .join('services', 'reviews.service_id', 'services.id')
      .where('reviews.id', reviewId)
      .first();

    res.status(201).json({
      success: true,
      data: review
    });
  } catch (error) {
    logger.error('Create review error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const { rating, comment, ratingBreakdown } = req.body;

    const review = await db('reviews')
      .where('id', req.params.id)
      .first();

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }

    // Check ownership
    if (review.reviewer_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this review'
      });
    }

    // Check if review is too old (e.g., 30 days)
    const reviewAge = Date.now() - new Date(review.created_at).getTime();
    const maxEditAge = 30 * 24 * 60 * 60 * 1000; // 30 days

    if (reviewAge > maxEditAge) {
      return res.status(400).json({
        success: false,
        error: 'Review is too old to edit'
      });
    }

    const updateData = {
      rating,
      comment: comment || null,
      rating_breakdown: ratingBreakdown || {},
      updated_at: new Date()
    };

    await db('reviews')
      .where('id', req.params.id)
      .update(updateData);

    const updatedReview = await db('reviews')
      .select(
        'reviews.*',
        'users.name as reviewer_name',
        'users.avatar_url as reviewer_avatar',
        'services.title as service_title'
      )
      .join('users', 'reviews.reviewer_id', 'users.id')
      .join('services', 'reviews.service_id', 'services.id')
      .where('reviews.id', req.params.id)
      .first();

    res.json({
      success: true,
      data: updatedReview
    });
  } catch (error) {
    logger.error('Update review error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const review = await db('reviews')
      .where('id', req.params.id)
      .first();

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }

    // Check ownership or admin rights
    if (review.reviewer_id !== req.user.id && req.user.user_type !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this review'
      });
    }

    await db('reviews')
      .where('id', req.params.id)
      .del();

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    logger.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Mark review as helpful
// @route   POST /api/reviews/:id/helpful
// @access  Private
router.post('/:id/helpful', protect, async (req, res) => {
  try {
    const review = await db('reviews')
      .where('id', req.params.id)
      .first();

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }

    // Check if user has already marked as helpful
    const existingHelpful = await db('review_helpful')
      .where('review_id', req.params.id)
      .where('user_id', req.user.id)
      .first();

    if (existingHelpful) {
      // Remove helpful mark
      await db('review_helpful')
        .where('review_id', req.params.id)
        .where('user_id', req.user.id)
        .del();

      // Decrease helpful count
      await db('reviews')
        .where('id', req.params.id)
        .decrement('helpful_count');

      res.json({
        success: true,
        message: 'Helpful mark removed',
        helpful: false
      });
    } else {
      // Add helpful mark
      await db('review_helpful').insert({
        review_id: req.params.id,
        user_id: req.user.id
      });

      // Increase helpful count
      await db('reviews')
        .where('id', req.params.id)
        .increment('helpful_count');

      res.json({
        success: true,
        message: 'Review marked as helpful',
        helpful: true
      });
    }
  } catch (error) {
    logger.error('Mark review helpful error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get review statistics
// @route   GET /api/reviews/stats/:serviceId
// @access  Public
router.get('/stats/:serviceId', async (req, res) => {
  try {
    // Get average rating
    const avgRating = await db('reviews')
      .where('service_id', req.params.serviceId)
      .where('verified', true)
      .avg('rating as avg_rating')
      .first();

    // Get total reviews
    const totalReviews = await db('reviews')
      .where('service_id', req.params.serviceId)
      .where('verified', true)
      .count('* as count')
      .first();

    // Get rating distribution
    const ratingDistribution = await db('reviews')
      .select('rating')
      .count('* as count')
      .where('service_id', req.params.serviceId)
      .where('verified', true)
      .groupBy('rating')
      .orderBy('rating', 'desc');

    const stats = {
      avgRating: avgRating ? parseFloat(avgRating.avg_rating) : 0,
      totalReviews: parseInt(totalReviews.count),
      ratingDistribution: ratingDistribution.reduce((acc, item) => {
        acc[item.rating] = parseInt(item.count);
        return acc;
      }, {})
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    logger.error('Get review stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;
