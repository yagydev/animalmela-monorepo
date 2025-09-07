const { NextApiRequest, NextApiResponse } = require('next');
const { TransportJob, Order, User } = require('../../../models');
const { protect, authorize } = require('../../../middleware/auth');
const connectDB = require('../../../lib/mongodb');

// Connect to database
connectDB();

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  switch (method) {
    case 'POST':
      if (req.query.transport && req.query.transport[0] === 'quote') {
        return await requestTransportQuote(req, res);
      } else if (req.query.transport && req.query.transport[0] === 'accept') {
        return await acceptTransportJob(req, res);
      }
      break;
    case 'PATCH':
      if (id) {
        return await updateTransportStatus(req, res);
      }
      break;
    case 'GET':
      return await getTransportJobs(req, res);
      break;
    default:
      res.setHeader('Allow', ['POST', 'PATCH', 'GET']);
      res.status(405).json({ success: false, error: `Method ${method} not allowed` });
  }
}

// @desc    Request transport quote
// @route   POST /api/transport/quote
// @access  Private
async function requestTransportQuote(req, res) {
  try {
    // Use protect middleware
    await new Promise((resolve, reject) => {
      protect(req, res, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });

    const { orderId, pickupLocation, deliveryLocation, vehicleType } = req.body;

    if (!orderId || !pickupLocation || !deliveryLocation) {
      return res.status(400).json({
        success: false,
        error: 'Order ID, pickup location, and delivery location are required'
      });
    }

    // Check if order exists
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Check if user is buyer or admin
    if (order.buyerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to request transport for this order'
      });
    }

    // In a real implementation, you would calculate quote based on distance, vehicle type, etc.
    const estimatedQuote = Math.floor(Math.random() * 5000) + 1000; // Random quote between 1000-6000

    res.json({
      success: true,
      message: 'Transport quote generated',
      data: {
        orderId,
        estimatedQuote,
        vehicleType: vehicleType || 'truck',
        pickupLocation,
        deliveryLocation
      }
    });
  } catch (error) {
    console.error('Request transport quote error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Accept transport job
// @route   POST /api/transport/accept
// @access  Private (Transport service providers)
async function acceptTransportJob(req, res) {
  try {
    // Use protect middleware
    await new Promise((resolve, reject) => {
      protect(req, res, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });

    // Check if user is transport service provider
    if (req.user.role !== 'service') {
      return res.status(403).json({
        success: false,
        error: 'Only transport service providers can accept transport jobs'
      });
    }

    const { orderId, quote } = req.body;

    if (!orderId || !quote) {
      return res.status(400).json({
        success: false,
        error: 'Order ID and quote are required'
      });
    }

    // Check if order exists
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Create transport job
    const transportJob = await TransportJob.create({
      orderId,
      transporterId: req.user._id,
      quote
    });

    await transportJob.populate('orderId', 'buyerId sellerId amount');
    await transportJob.populate('transporterId', 'name mobile email role');

    res.status(201).json({
      success: true,
      message: 'Transport job accepted successfully',
      data: transportJob
    });
  } catch (error) {
    console.error('Accept transport job error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Update transport status
// @route   PATCH /api/transport/:id/status
// @access  Private
async function updateTransportStatus(req, res) {
  try {
    // Use protect middleware
    await new Promise((resolve, reject) => {
      protect(req, res, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });

    const { status, tracking } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Status is required'
      });
    }

    const transportJob = await TransportJob.findById(req.query.id);

    if (!transportJob) {
      return res.status(404).json({
        success: false,
        error: 'Transport job not found'
      });
    }

    // Check if user is transporter or admin
    if (transportJob.transporterId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this transport job'
      });
    }

    const updateData = { status };
    if (tracking) {
      updateData.tracking = tracking;
    }

    const updatedJob = await TransportJob.findByIdAndUpdate(
      req.query.id,
      updateData,
      { new: true }
    ).populate('orderId', 'buyerId sellerId amount')
     .populate('transporterId', 'name mobile email role');

    res.json({
      success: true,
      message: 'Transport status updated successfully',
      data: updatedJob
    });
  } catch (error) {
    console.error('Update transport status error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Get transport jobs
// @route   GET /api/transport
// @access  Private
async function getTransportJobs(req, res) {
  try {
    // Use protect middleware
    await new Promise((resolve, reject) => {
      protect(req, res, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });

    const { status, page = 1, limit = 10 } = req.query;

    let query = {};

    // Filter by user role
    if (req.user.role === 'service') {
      query.transporterId = req.user._id;
    } else if (req.user.role === 'admin') {
      // Admin can see all transport jobs
    } else {
      // For buyers/sellers, get transport jobs for their orders
      const userOrders = await Order.find({
        $or: [
          { buyerId: req.user._id },
          { sellerId: req.user._id }
        ]
      }).select('_id');
      
      const orderIds = userOrders.map(order => order._id);
      query.orderId = { $in: orderIds };
    }

    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const transportJobs = await TransportJob.find(query)
      .populate('orderId', 'buyerId sellerId amount')
      .populate('transporterId', 'name mobile email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await TransportJob.countDocuments(query);

    res.json({
      success: true,
      data: transportJobs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get transport jobs error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}