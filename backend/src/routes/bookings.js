const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../../config/database');
const { protect } = require('../middleware/auth');
const { sendEmail } = require('../services/emailService');
const { logger } = require('../utils/logger');

const router = express.Router();

// @desc    Get user bookings
// @route   GET /api/bookings
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, role = 'customer' } = req.query;

    let query = db('bookings')
      .select(
        'bookings.*',
        'services.title as service_title',
        'services.service_type',
        'services.price',
        'users.name as customer_name',
        'users.avatar_url as customer_avatar',
        'providers.name as provider_name',
        'providers.avatar_url as provider_avatar'
      )
      .join('services', 'bookings.service_id', 'services.id')
      .join('users as customers', 'bookings.customer_id', 'customers.id')
      .join('users as providers', 'bookings.provider_id', 'providers.id');

    // Filter by role
    if (role === 'customer') {
      query = query.where('bookings.customer_id', req.user.id);
    } else if (role === 'provider') {
      query = query.where('bookings.provider_id', req.user.id);
    }

    // Apply status filter
    if (status) {
      query = query.where('bookings.status', status);
    }

    // Get total count
    const countQuery = query.clone();
    const total = await countQuery.count('* as count').first();

    // Apply pagination
    const offset = (page - 1) * limit;
    const bookings = await query
      .orderBy('bookings.created_at', 'desc')
      .limit(limit)
      .offset(offset);

    res.json({
      success: true,
      data: bookings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: total.count,
        pages: Math.ceil(total.count / limit)
      }
    });
  } catch (error) {
    logger.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await db('bookings')
      .select(
        'bookings.*',
        'services.title as service_title',
        'services.description as service_description',
        'services.service_type',
        'services.price',
        'services.address as service_address',
        'customers.name as customer_name',
        'customers.email as customer_email',
        'customers.phone as customer_phone',
        'customers.avatar_url as customer_avatar',
        'providers.name as provider_name',
        'providers.email as provider_email',
        'providers.phone as provider_phone',
        'providers.avatar_url as provider_avatar'
      )
      .join('services', 'bookings.service_id', 'services.id')
      .join('users as customers', 'bookings.customer_id', 'customers.id')
      .join('users as providers', 'bookings.provider_id', 'providers.id')
      .where('bookings.id', req.params.id)
      .first();

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Check authorization
    if (booking.customer_id !== req.user.id && booking.provider_id !== req.user.id && req.user.user_type !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view this booking'
      });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    logger.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const {
      serviceId,
      scheduledDate,
      startTime,
      endTime,
      specialInstructions
    } = req.body;

    // Get service details
    const service = await db('services')
      .select('*', 'users.name as provider_name', 'users.email as provider_email')
      .join('users', 'services.provider_id', 'users.id')
      .where('services.id', serviceId)
      .where('services.active', true)
      .first();

    if (!service) {
      return res.status(404).json({
        success: false,
        error: 'Service not found or inactive'
      });
    }

    // Check if service is available
    const conflictingBooking = await db('bookings')
      .where('service_id', serviceId)
      .where('status', 'in', ['pending', 'confirmed', 'in_progress'])
      .where('scheduled_date', scheduledDate)
      .where(function() {
        this.where('start_time', '<', endTime)
          .andWhere('end_time', '>', startTime);
      })
      .first();

    if (conflictingBooking) {
      return res.status(400).json({
        success: false,
        error: 'Service is not available at the requested time'
      });
    }

    // Calculate total amount
    const totalAmount = service.price;

    // Create booking
    const bookingData = {
      id: uuidv4(),
      service_id: serviceId,
      customer_id: req.user.id,
      provider_id: service.provider_id,
      status: 'pending',
      scheduled_date: scheduledDate,
      start_time: startTime,
      end_time: endTime,
      total_amount: totalAmount,
      currency: service.currency || 'USD',
      payment_status: 'pending',
      special_instructions: specialInstructions
    };

    const [bookingId] = await db('bookings').insert(bookingData).returning('id');

    const booking = await db('bookings')
      .select(
        'bookings.*',
        'services.title as service_title',
        'services.service_type',
        'customers.name as customer_name',
        'providers.name as provider_name'
      )
      .join('services', 'bookings.service_id', 'services.id')
      .join('users as customers', 'bookings.customer_id', 'customers.id')
      .join('users as providers', 'bookings.provider_id', 'providers.id')
      .where('bookings.id', bookingId)
      .first();

    // Send notification emails
    try {
      await sendEmail({
        email: service.provider_email,
        subject: 'New Booking Request',
        template: 'newBookingRequest',
        data: {
          providerName: service.provider_name,
          customerName: req.user.name,
          serviceTitle: service.title,
          scheduledDate,
          startTime,
          endTime,
          totalAmount
        }
      });
    } catch (emailError) {
      logger.error('Failed to send booking notification email:', emailError);
    }

    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error) {
    logger.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status, cancellationReason } = req.body;

    const booking = await db('bookings')
      .select('*', 'services.title as service_title')
      .join('services', 'bookings.service_id', 'services.id')
      .where('bookings.id', req.params.id)
      .first();

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Check authorization (provider or admin can update status)
    if (booking.provider_id !== req.user.id && req.user.user_type !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this booking'
      });
    }

    const updateData = {
      status,
      updated_at: new Date()
    };

    if (status === 'cancelled') {
      updateData.cancellation_reason = cancellationReason;
      updateData.cancelled_at = new Date();
    }

    await db('bookings')
      .where('id', req.params.id)
      .update(updateData);

    const updatedBooking = await db('bookings')
      .select(
        'bookings.*',
        'services.title as service_title',
        'customers.name as customer_name',
        'customers.email as customer_email',
        'providers.name as provider_name'
      )
      .join('services', 'bookings.service_id', 'services.id')
      .join('users as customers', 'bookings.customer_id', 'customers.id')
      .join('users as providers', 'bookings.provider_id', 'providers.id')
      .where('bookings.id', req.params.id)
      .first();

    // Send notification email to customer
    try {
      await sendEmail({
        email: updatedBooking.customer_email,
        subject: `Booking ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        template: 'bookingStatusUpdate',
        data: {
          customerName: updatedBooking.customer_name,
          serviceTitle: updatedBooking.service_title,
          status,
          scheduledDate: updatedBooking.scheduled_date,
          providerName: updatedBooking.provider_name
        }
      });
    } catch (emailError) {
      logger.error('Failed to send status update email:', emailError);
    }

    res.json({
      success: true,
      data: updatedBooking
    });
  } catch (error) {
    logger.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Cancel booking
// @route   POST /api/bookings/:id/cancel
// @access  Private
router.post('/:id/cancel', protect, async (req, res) => {
  try {
    const { cancellationReason } = req.body;

    const booking = await db('bookings')
      .where('id', req.params.id)
      .first();

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Check authorization (customer or provider can cancel)
    if (booking.customer_id !== req.user.id && booking.provider_id !== req.user.id && req.user.user_type !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to cancel this booking'
      });
    }

    // Check if booking can be cancelled
    if (['cancelled', 'completed', 'no_show'].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        error: 'Booking cannot be cancelled'
      });
    }

    await db('bookings')
      .where('id', req.params.id)
      .update({
        status: 'cancelled',
        cancellation_reason: cancellationReason,
        cancelled_at: new Date(),
        updated_at: new Date()
      });

    res.json({
      success: true,
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    logger.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get booking statistics
// @route   GET /api/bookings/stats
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const { role = 'customer' } = req.query;

    let query = db('bookings');
    
    // Filter by role
    if (role === 'customer') {
      query = query.where('customer_id', req.user.id);
    } else if (role === 'provider') {
      query = query.where('provider_id', req.user.id);
    }

    // Get booking counts by status
    const statusStats = await query
      .select('status')
      .count('* as count')
      .groupBy('status');

    // Get total bookings
    const totalBookings = await query.count('* as count').first();

    // Get recent bookings
    const recentBookings = await query
      .select('status', 'created_at')
      .orderBy('created_at', 'desc')
      .limit(10);

    const stats = {
      total: parseInt(totalBookings.count),
      byStatus: statusStats.reduce((acc, item) => {
        acc[item.status] = parseInt(item.count);
        return acc;
      }, {}),
      recent: recentBookings
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    logger.error('Get booking stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;
