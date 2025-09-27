const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const db = require('../../config/database');
const { protect } = require('../middleware/auth');
const { logger } = require('../utils/logger');

const router = express.Router();

// @desc    Create payment intent
// @route   POST /api/payments/create-intent
// @access  Private
router.post('/create-intent', protect, async (req, res) => {
  try {
    const { amount, currency = 'usd', bookingId, description } = req.body;

    // Get booking details
    const booking = await db('bookings')
      .select('*', 'services.title as service_title')
      .join('services', 'bookings.service_id', 'services.id')
      .where('bookings.id', bookingId)
      .where('bookings.customer_id', req.user.id)
      .first();

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Get or create Stripe customer
    let customerId = req.user.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: req.user.email,
        name: req.user.name,
        metadata: {
          userId: req.user.id
        }
      });

      customerId = customer.id;

      // Update user with Stripe customer ID
      await db('users')
        .where('id', req.user.id)
        .update({ stripe_customer_id: customerId });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      customer: customerId,
      description: description || `Payment for ${booking.service_title}`,
      metadata: {
        bookingId,
        userId: req.user.id,
        serviceId: booking.service_id
      }
    });

    res.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      }
    });
  } catch (error) {
    logger.error('Create payment intent error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Confirm payment
// @route   POST /api/payments/confirm
// @access  Private
router.post('/confirm', protect, async (req, res) => {
  try {
    const { paymentIntentId, bookingId } = req.body;

    // Retrieve payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Update booking payment status
      await db('bookings')
        .where('id', bookingId)
        .where('customer_id', req.user.id)
        .update({
          payment_status: 'paid',
          stripe_payment_intent_id: paymentIntentId,
          updated_at: new Date()
        });

      res.json({
        success: true,
        message: 'Payment confirmed successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Payment not completed'
      });
    }
  } catch (error) {
    logger.error('Confirm payment error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get payment history
// @route   GET /api/payments/history
// @access  Private
router.get('/history', protect, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    let query = db('bookings')
      .select(
        'bookings.id',
        'bookings.total_amount',
        'bookings.currency',
        'bookings.payment_status',
        'bookings.stripe_payment_intent_id',
        'bookings.created_at',
        'services.title as service_title',
        'providers.name as provider_name'
      )
      .join('services', 'bookings.service_id', 'services.id')
      .join('users as providers', 'bookings.provider_id', 'providers.id')
      .where('bookings.customer_id', req.user.id)
      .whereNotNull('bookings.stripe_payment_intent_id');

    // Get total count
    const countQuery = query.clone();
    const total = await countQuery.count('* as count').first();

    // Apply pagination
    const offset = (page - 1) * limit;
    const payments = await query
      .orderBy('bookings.created_at', 'desc')
      .limit(limit)
      .offset(offset);

    res.json({
      success: true,
      data: payments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: total.count,
        pages: Math.ceil(total.count / limit)
      }
    });
  } catch (error) {
    logger.error('Get payment history error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Process refund
// @route   POST /api/payments/refund
// @access  Private
router.post('/refund', protect, async (req, res) => {
  try {
    const { bookingId, amount, reason } = req.body;

    // Get booking details
    const booking = await db('bookings')
      .where('id', bookingId)
      .where('customer_id', req.user.id)
      .first();

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    if (!booking.stripe_payment_intent_id) {
      return res.status(400).json({
        success: false,
        error: 'No payment found for this booking'
      });
    }

    // Get payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(booking.stripe_payment_intent_id);

    // Create refund
    const refund = await stripe.refunds.create({
      payment_intent: booking.stripe_payment_intent_id,
      amount: amount ? Math.round(amount * 100) : undefined, // Convert to cents
      reason: reason || 'requested_by_customer',
      metadata: {
        bookingId,
        userId: req.user.id
      }
    });

    // Update booking
    await db('bookings')
      .where('id', bookingId)
      .update({
        payment_status: 'refunded',
        updated_at: new Date()
      });

    res.json({
      success: true,
      data: {
        refundId: refund.id,
        status: refund.status,
        amount: refund.amount / 100 // Convert from cents
      }
    });
  } catch (error) {
    logger.error('Process refund error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get payment methods
// @route   GET /api/payments/methods
// @access  Private
router.get('/methods', protect, async (req, res) => {
  try {
    const customerId = req.user.stripe_customer_id;

    if (!customerId) {
      return res.json({
        success: true,
        data: []
      });
    }

    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card'
    });

    res.json({
      success: true,
      data: paymentMethods.data
    });
  } catch (error) {
    logger.error('Get payment methods error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Add payment method
// @route   POST /api/payments/methods
// @access  Private
router.post('/methods', protect, async (req, res) => {
  try {
    const { paymentMethodId } = req.body;

    let customerId = req.user.stripe_customer_id;

    if (!customerId) {
      // Create customer if doesn't exist
      const customer = await stripe.customers.create({
        email: req.user.email,
        name: req.user.name,
        metadata: {
          userId: req.user.id
        }
      });

      customerId = customer.id;

      // Update user
      await db('users')
        .where('id', req.user.id)
        .update({ stripe_customer_id: customerId });
    }

    // Attach payment method to customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId
    });

    res.json({
      success: true,
      message: 'Payment method added successfully'
    });
  } catch (error) {
    logger.error('Add payment method error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Remove payment method
// @route   DELETE /api/payments/methods/:id
// @access  Private
router.delete('/methods/:id', protect, async (req, res) => {
  try {
    const customerId = req.user.stripe_customer_id;

    if (!customerId) {
      return res.status(400).json({
        success: false,
        error: 'No customer found'
      });
    }

    // Detach payment method
    await stripe.paymentMethods.detach(req.params.id);

    res.json({
      success: true,
      message: 'Payment method removed successfully'
    });
  } catch (error) {
    logger.error('Remove payment method error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Set default payment method
// @route   PUT /api/payments/methods/:id/default
// @access  Private
router.put('/methods/:id/default', protect, async (req, res) => {
  try {
    const customerId = req.user.stripe_customer_id;

    if (!customerId) {
      return res.status(400).json({
        success: false,
        error: 'No customer found'
      });
    }

    // Set as default payment method
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: req.params.id
      }
    });

    res.json({
      success: true,
      message: 'Default payment method updated'
    });
  } catch (error) {
    logger.error('Set default payment method error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Webhook handler
// @route   POST /api/payments/webhook
// @access  Public
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    logger.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        logger.info('Payment succeeded:', paymentIntent.id);
        
        // Update booking payment status
        if (paymentIntent.metadata.bookingId) {
          await db('bookings')
            .where('id', paymentIntent.metadata.bookingId)
            .update({
              payment_status: 'paid',
              updated_at: new Date()
            });
        }
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        logger.info('Payment failed:', failedPayment.id);
        
        // Update booking payment status
        if (failedPayment.metadata.bookingId) {
          await db('bookings')
            .where('id', failedPayment.metadata.bookingId)
            .update({
              payment_status: 'failed',
              updated_at: new Date()
            });
        }
        break;

      case 'refund.created':
        const refund = event.data.object;
        logger.info('Refund created:', refund.id);
        break;

      default:
        logger.info(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    logger.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

module.exports = router;
