import { NextApiRequest, NextApiResponse } from 'next';
const { Order, User, Listing } = require('../../../models');
import { protect, authorize } from '../../../middleware/auth';
import { connectDB } from '../../../lib/database';
import Razorpay from 'razorpay';

// Connect to database
connectDB();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || ''
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { bookings } = req.query;
  
  // Handle different route patterns
  const route = Array.isArray(bookings) ? bookings.join('/') : bookings || '';
  
  switch (method) {
    case 'GET':
      if (route === '') {
        return await getBookings(req, res);
      } else if (route === 'payment/create') {
        return await createPaymentOrder(req, res);
      } else if (route === 'payment/verify') {
        return await verifyPayment(req, res);
      } else if (route && route !== 'payment/create' && route !== 'payment/verify') {
        return await getBooking(req, res);
      }
      break;
    case 'POST':
      if (route === '') {
        return await createBooking(req, res);
      } else if (route === 'advance-payment') {
        return await processAdvancePayment(req, res);
      }
      break;
    case 'PUT':
      if (route && route !== 'payment/create' && route !== 'payment/verify') {
        return await updateBooking(req, res);
      }
      break;
    case 'DELETE':
      if (route && route !== 'payment/create' && route !== 'payment/verify') {
        return await cancelBooking(req, res);
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).json({ success: false, error: `Method ${method} not allowed` });
  }
}

// @desc    Get all bookings with filtering
// @route   GET /api/bookings
// @access  Private
async function getBookings(req: NextApiRequest, res: NextApiResponse) {
  try {
    const {
      buyer_id,
      seller_id,
      status,
      payment_status,
      booking_type,
      page = 1,
      limit = 10
    } = req.query;

    const query: any = {};
    
    if (buyer_id) query.buyer_id = buyer_id;
    if (seller_id) query.seller_id = seller_id;
    if (status) query.booking_status = status;
    if (payment_status) query.payment_status = payment_status;
    if (booking_type) query.booking_type = booking_type;

    const skip = (Number(page) - 1) * Number(limit);

    const bookings = await Order.find(query)
      .populate('buyer_id', 'name email phone avatar_url')
      .populate('seller_id', 'name email phone avatar_url business_info')
      .populate('listing_id', 'title price images')
      .populate('pet_id', 'name species breed livestock_info')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        bookings,
        pagination: {
          current: Number(page),
          pages: Math.ceil(total / Number(limit)),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
async function getBooking(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { bookings } = req.query;
    const bookingId = Array.isArray(bookings) ? bookings[0] : bookings;
    
    if (!bookingId) {
      return res.status(400).json({
        success: false,
        error: 'Booking ID is required'
      });
    }

    const booking = await Order.findById(bookingId)
      .populate('buyer_id', 'name email phone avatar_url location')
      .populate('seller_id', 'name email phone avatar_url business_info location')
      .populate('listing_id', 'title price images description')
      .populate('pet_id', 'name species breed livestock_info');

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
async function createBooking(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Use protect middleware
    await new Promise((resolve, reject) => {
      protect(req, res, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });

    const {
      seller_id,
      listing_id,
      pet_id,
      booking_type,
      amount,
      advance_amount,
      payment_method,
      delivery_address,
      delivery_date,
      delivery_time,
      notes
    } = req.body;

    // Validate required fields
    if (!seller_id || !listing_id || !pet_id || !booking_type || !amount || !payment_method) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Verify listing exists and is available
    const listing = await Listing.findById(listing_id);
    if (!listing) {
      return res.status(404).json({
        success: false,
        error: 'Listing not found'
      });
    }

    if (listing.status !== 'active') {
      return res.status(400).json({
        success: false,
        error: 'Listing is not available for booking'
      });
    }

    // Verify pet exists
    const pet = await Listing.findById(pet_id);
    if (!pet) {
      return res.status(404).json({
        success: false,
        error: 'Pet not found'
      });
    }

    const bookingData = {
      buyer_id: (req as any).user.id,
      seller_id,
      listing_id,
      pet_id,
      booking_type,
      amount,
      advance_amount: advance_amount || 0,
      payment_method,
      delivery_address,
      delivery_date: delivery_date ? new Date(delivery_date) : undefined,
      delivery_time,
      notes,
      booking_status: 'pending',
      payment_status: 'pending'
    };

    const booking = await Order.create(bookingData);

    // Populate the booking with related data
    const populatedBooking = await Order.findById(booking._id)
      .populate('buyer_id', 'name email phone avatar_url')
      .populate('seller_id', 'name email phone avatar_url business_info')
      .populate('listing_id', 'title price images')
      .populate('pet_id', 'name species breed livestock_info');

    res.status(201).json({
      success: true,
      data: populatedBooking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Create Razorpay payment order
// @route   GET /api/bookings/payment/create
// @access  Private
async function createPaymentOrder(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { booking_id, amount } = req.query;

    if (!booking_id || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Booking ID and amount are required'
      });
    }

    const booking = await Order.findById(booking_id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    const options = {
      amount: Number(amount) * 100, // Razorpay expects amount in paise
      currency: 'INR',
      receipt: `booking_${booking_id}`,
      notes: {
        booking_id: booking_id,
        buyer_id: booking.buyer_id,
        seller_id: booking.seller_id
      }
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      data: {
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        key_id: process.env.RAZORPAY_KEY_ID
      }
    });
  } catch (error) {
    console.error('Create payment order error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create payment order'
    });
  }
}

// @desc    Verify Razorpay payment
// @route   GET /api/bookings/payment/verify
// @access  Private
async function verifyPayment(req: NextApiRequest, res: NextApiResponse) {
  try {
    const {
      booking_id,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature
    } = req.query;

    if (!booking_id || !razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        error: 'Missing payment verification parameters'
      });
    }

    const booking = await Order.findById(booking_id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Verify payment signature
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        error: 'Invalid payment signature'
      });
    }

    // Update booking with payment details
    booking.payment_status = 'paid';
    booking.booking_status = 'confirmed';
    booking.payment_details = {
      transaction_id: razorpay_payment_id,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      payment_gateway: 'razorpay',
      payment_date: new Date()
    };

    await booking.save();

    res.status(200).json({
      success: true,
      data: {
        payment_status: 'verified',
        booking_status: 'confirmed',
        transaction_id: razorpay_payment_id
      }
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      error: 'Payment verification failed'
    });
  }
}

// @desc    Process advance payment
// @route   POST /api/bookings/advance-payment
// @access  Private
async function processAdvancePayment(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Use protect middleware
    await new Promise((resolve, reject) => {
      protect(req, res, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });

    const {
      booking_id,
      advance_amount,
      payment_method,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature
    } = req.body;

    const booking = await Order.findById(booking_id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    if (booking.buyer_id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized'
      });
    }

    // Verify payment if Razorpay details provided
    if (razorpay_payment_id && razorpay_order_id && razorpay_signature) {
      const crypto = require('crypto');
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({
          success: false,
          error: 'Invalid payment signature'
        });
      }
    }

    // Update booking with advance payment
    booking.advance_amount = advance_amount;
    booking.payment_status = advance_amount >= booking.amount ? 'paid' : 'partial';
    booking.booking_status = 'confirmed';
    booking.payment_details = {
      transaction_id: razorpay_payment_id,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      payment_gateway: 'razorpay',
      payment_date: new Date()
    };

    await booking.save();

    res.status(200).json({
      success: true,
      data: {
        booking_status: 'confirmed',
        payment_status: booking.payment_status,
        advance_amount: advance_amount
      }
    });
  } catch (error) {
    console.error('Process advance payment error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Private
async function updateBooking(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Use protect middleware
    await new Promise((resolve, reject) => {
      protect(req, res, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });

    const { bookings } = req.query;
    const bookingId = Array.isArray(bookings) ? bookings[0] : bookings;
    
    if (!bookingId) {
      return res.status(400).json({
        success: false,
        error: 'Booking ID is required'
      });
    }

    const booking = await Order.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Check if user is authorized to update this booking
    if (booking.buyer_id.toString() !== req.user.id && booking.seller_id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized'
      });
    }

    const updates = req.body;
    const allowedUpdates = ['delivery_address', 'delivery_date', 'delivery_time', 'notes', 'booking_status'];
    const filteredUpdates = Object.keys(updates)
      .filter(key => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key];
        return obj;
      }, {});

    const updatedBooking = await Order.findByIdAndUpdate(
      bookingId,
      filteredUpdates,
      { new: true, runValidators: true }
    ).populate('buyer_id', 'name email phone avatar_url')
     .populate('seller_id', 'name email phone avatar_url business_info')
     .populate('listing_id', 'title price images')
     .populate('pet_id', 'name species breed livestock_info');

    res.status(200).json({
      success: true,
      data: updatedBooking
    });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Cancel booking
// @route   DELETE /api/bookings/:id
// @access  Private
async function cancelBooking(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Use protect middleware
    await new Promise((resolve, reject) => {
      protect(req, res, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });

    const { bookings } = req.query;
    const bookingId = Array.isArray(bookings) ? bookings[0] : bookings;
    const { cancellation_reason } = req.body;
    
    if (!bookingId) {
      return res.status(400).json({
        success: false,
        error: 'Booking ID is required'
      });
    }

    const booking = await Order.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Check if user is authorized to cancel this booking
    if (booking.buyer_id.toString() !== req.user.id && booking.seller_id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized'
      });
    }

    // Update booking status
    booking.booking_status = 'cancelled';
    booking.cancellation_reason = cancellation_reason;
    
    // Calculate refund amount
    if (booking.payment_status === 'paid') {
      booking.refund_amount = booking.advance_amount || booking.amount;
      booking.refund_status = 'pending';
    }

    await booking.save();

    res.status(200).json({
      success: true,
      data: {
        booking_status: 'cancelled',
        refund_amount: booking.refund_amount,
        refund_status: booking.refund_status
      }
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}
