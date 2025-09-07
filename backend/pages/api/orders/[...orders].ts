const { NextApiRequest, NextApiResponse } = require('next');
const { Order, Listing, User } = require('../../../models');
const { protect } = require('../../../middleware/auth');
const connectDB = require('../../../lib/mongodb');

// Connect to database
connectDB();

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  switch (method) {
    case 'POST':
      if (!id) {
        return await createOrder(req, res);
      }
      break;
    case 'GET':
      if (id) {
        return await getOrder(req, res);
      } else {
        return await getOrders(req, res);
      }
      break;
    default:
      res.setHeader('Allow', ['POST', 'GET']);
      res.status(405).json({ success: false, error: `Method ${method} not allowed` });
  }
}

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
async function createOrder(req, res) {
  try {
    // Use protect middleware
    await new Promise((resolve, reject) => {
      protect(req, res, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });

    const { listingId, amount } = req.body;

    if (!listingId || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Listing ID and amount are required'
      });
    }

    // Check if listing exists and is available
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({
        success: false,
        error: 'Listing not found'
      });
    }

    if (listing.status !== 'active') {
      return res.status(400).json({
        success: false,
        error: 'Listing is not available for purchase'
      });
    }

    // Check if user is not the seller
    if (listing.sellerId.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        error: 'Cannot create order for your own listing'
      });
    }

    const order = await Order.create({
      listingId,
      buyerId: req.user._id,
      sellerId: listing.sellerId,
      amount
    });

    await order.populate('buyerId', 'name mobile email role');
    await order.populate('sellerId', 'name mobile email role');
    await order.populate('listingId', 'species breed price');

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
async function getOrder(req, res) {
  try {
    // Use protect middleware
    await new Promise((resolve, reject) => {
      protect(req, res, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });

    const order = await Order.findById(req.query.id)
      .populate('buyerId', 'name mobile email role')
      .populate('sellerId', 'name mobile email role')
      .populate('listingId', 'species breed price');

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Check if user is buyer, seller, or admin
    const isBuyer = order.buyerId._id.toString() === req.user._id.toString();
    const isSeller = order.sellerId._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isBuyer && !isSeller && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view this order'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Get orders for user
// @route   GET /api/orders
// @access  Private
async function getOrders(req, res) {
  try {
    // Use protect middleware
    await new Promise((resolve, reject) => {
      protect(req, res, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });

    const { status, page = 1, limit = 10, type = 'all' } = req.query;

    let query = {};

    // Filter by user role
    if (req.user.role === 'buyer') {
      query.buyerId = req.user._id;
    } else if (req.user.role === 'seller') {
      query.sellerId = req.user._id;
    } else if (req.user.role === 'admin') {
      // Admin can see all orders
    } else {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view orders'
      });
    }

    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const orders = await Order.find(query)
      .populate('buyerId', 'name mobile email role')
      .populate('sellerId', 'name mobile email role')
      .populate('listingId', 'species breed price')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}