const { NextApiRequest, NextApiResponse } = require('next');
const { Order, Listing, User } = require('../../../models');
const { protect } = require('../../../middleware/auth');
const connectDB = require('../../../lib/mongodb');

// Connect to database
connectDB();

export default async function handler(req, res) {
  const { method } = req;
  const { orders } = req.query;
  
  // Handle different route patterns
  const route = Array.isArray(orders) ? orders.join('/') : orders || '';
  const orderId = route && route !== 'status' && route !== 'tracking' ? route : null;

  switch (method) {
    case 'POST':
      if (!orderId) {
        return await createOrder(req, res);
      }
      break;
    case 'GET':
      if (orderId) {
        return await getOrder(req, res, orderId);
      } else if (route === 'status') {
        return await getOrderStatus(req, res);
      } else if (route === 'tracking') {
        return await getOrderTracking(req, res);
      } else {
        return await getOrders(req, res);
      }
      break;
    case 'PUT':
      if (orderId) {
        return await updateOrder(req, res, orderId);
      }
      break;
    case 'PATCH':
      if (orderId && route.includes('status')) {
        return await updateOrderStatus(req, res, orderId);
      } else if (orderId && route.includes('tracking')) {
        return await updateOrderTracking(req, res, orderId);
      }
      break;
    case 'DELETE':
      if (orderId) {
        return await cancelOrder(req, res, orderId);
      }
      break;
    default:
      res.setHeader('Allow', ['POST', 'GET', 'PUT', 'PATCH', 'DELETE']);
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
async function getOrder(req, res, orderId) {
  try {
    // Use protect middleware
    await new Promise((resolve, reject) => {
      protect(req, res, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });

    const order = await Order.findById(orderId)
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

// @desc    Update order details
// @route   PUT /api/orders/:id
// @access  Private (Seller/Admin)
async function updateOrder(req, res, orderId) {
  try {
    await new Promise((resolve, reject) => {
      protect(req, res, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });

    const { expectedDispatchTime, notes } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Check if user is seller or admin
    const isSeller = order.sellerId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isSeller && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this order'
      });
    }

    const updateData = {};
    if (expectedDispatchTime) updateData.expectedDispatchTime = expectedDispatchTime;
    if (notes) updateData.notes = notes;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      updateData,
      { new: true }
    ).populate('buyerId', 'name mobile email')
     .populate('sellerId', 'name mobile email')
     .populate('listingId', 'title category price');

    res.json({
      success: true,
      data: updatedOrder,
      message: 'Order updated successfully'
    });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private (Seller/Admin)
async function updateOrderStatus(req, res, orderId) {
  try {
    await new Promise((resolve, reject) => {
      protect(req, res, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });

    const { status, reason } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Status is required'
      });
    }

    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'refunded'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status'
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Check authorization
    const isSeller = order.sellerId.toString() === req.user._id.toString();
    const isBuyer = order.buyerId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    // Define who can update to which status
    const sellerCanUpdate = ['confirmed', 'processing', 'shipped', 'out_for_delivery'];
    const buyerCanUpdate = ['cancelled'];
    const adminCanUpdate = validStatuses;

    let canUpdate = false;
    if (isSeller && sellerCanUpdate.includes(status)) canUpdate = true;
    if (isBuyer && buyerCanUpdate.includes(status)) canUpdate = true;
    if (isAdmin && adminCanUpdate.includes(status)) canUpdate = true;

    if (!canUpdate) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update to this status'
      });
    }

    const updateData = { status };
    if (reason) updateData.notes = reason;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      updateData,
      { new: true }
    ).populate('buyerId', 'name mobile email')
     .populate('sellerId', 'name mobile email')
     .populate('listingId', 'title category price');

    res.json({
      success: true,
      data: updatedOrder,
      message: 'Order status updated successfully'
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Update order tracking information
// @route   PATCH /api/orders/:id/tracking
// @access  Private (Seller/Admin)
async function updateOrderTracking(req, res, orderId) {
  try {
    await new Promise((resolve, reject) => {
      protect(req, res, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });

    const { trackingNumber, carrier, estimatedDelivery } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Check if user is seller or admin
    const isSeller = order.sellerId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isSeller && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update tracking information'
      });
    }

    const trackingInfo = {
      ...order.trackingInfo,
      trackingNumber: trackingNumber || order.trackingInfo?.trackingNumber,
      carrier: carrier || order.trackingInfo?.carrier,
      estimatedDelivery: estimatedDelivery || order.trackingInfo?.estimatedDelivery
    };

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { trackingInfo },
      { new: true }
    ).populate('buyerId', 'name mobile email')
     .populate('sellerId', 'name mobile email')
     .populate('listingId', 'title category price');

    res.json({
      success: true,
      data: updatedOrder,
      message: 'Tracking information updated successfully'
    });
  } catch (error) {
    console.error('Update order tracking error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Cancel order
// @route   DELETE /api/orders/:id
// @access  Private (Buyer/Seller/Admin)
async function cancelOrder(req, res, orderId) {
  try {
    await new Promise((resolve, reject) => {
      protect(req, res, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });

    const { reason } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Check authorization
    const isBuyer = order.buyerId.toString() === req.user._id.toString();
    const isSeller = order.sellerId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isBuyer && !isSeller && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to cancel this order'
      });
    }

    // Check if order can be cancelled
    const cancellableStatuses = ['pending', 'confirmed'];
    if (!cancellableStatuses.includes(order.status)) {
      return res.status(400).json({
        success: false,
        error: 'Order cannot be cancelled in current status'
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        status: 'cancelled',
        notes: reason || 'Order cancelled'
      },
      { new: true }
    ).populate('buyerId', 'name mobile email')
     .populate('sellerId', 'name mobile email')
     .populate('listingId', 'title category price');

    res.json({
      success: true,
      data: updatedOrder,
      message: 'Order cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Get order status summary
// @route   GET /api/orders/status
// @access  Private
async function getOrderStatus(req, res) {
  try {
    await new Promise((resolve, reject) => {
      protect(req, res, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });

    let query = {};
    if (req.user.role === 'buyer') {
      query.buyerId = req.user._id;
    } else if (req.user.role === 'seller') {
      query.sellerId = req.user._id;
    }

    const statusCounts = await Order.aggregate([
      { $match: query },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const statusSummary = {};
    statusCounts.forEach(item => {
      statusSummary[item._id] = item.count;
    });

    res.json({
      success: true,
      data: statusSummary
    });
  } catch (error) {
    console.error('Get order status error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Get order tracking information
// @route   GET /api/orders/tracking
// @access  Private
async function getOrderTracking(req, res) {
  try {
    await new Promise((resolve, reject) => {
      protect(req, res, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });

    const { orderId } = req.query;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        error: 'Order ID is required'
      });
    }

    const order = await Order.findById(orderId)
      .select('trackingInfo status paymentStatus')
      .populate('buyerId', 'name mobile')
      .populate('sellerId', 'name mobile')
      .populate('listingId', 'title');

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Check authorization
    const isBuyer = order.buyerId._id.toString() === req.user._id.toString();
    const isSeller = order.sellerId._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isBuyer && !isSeller && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view tracking information'
      });
    }

    res.json({
      success: true,
      data: {
        orderId: order._id,
        status: order.status,
        paymentStatus: order.paymentStatus,
        trackingInfo: order.trackingInfo,
        buyer: order.buyerId,
        seller: order.sellerId,
        listing: order.listingId
      }
    });
  } catch (error) {
    console.error('Get order tracking error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}