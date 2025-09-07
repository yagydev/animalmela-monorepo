const { NextApiRequest, NextApiResponse } = require('next');
const { Order } = require('../../../models');
const { protect } = require('../../../middleware/auth');
const connectDB = require('../../../lib/mongodb');

// Connect to database
connectDB();

export default async function handler(req, res) {
  const { method } = req;
  const { orderId } = req.query;

  switch (method) {
    case 'POST':
      if (orderId) {
        return await capturePayment(req, res);
      }
      break;
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).json({ success: false, error: `Method ${method} not allowed` });
  }
}

// @desc    Capture payment for order
// @route   POST /api/payments/:orderId/capture
// @access  Private
async function capturePayment(req, res) {
  try {
    // Use protect middleware
    await new Promise((resolve, reject) => {
      protect(req, res, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });

    const { paymentMethod, transactionId } = req.body;

    if (!paymentMethod || !transactionId) {
      return res.status(400).json({
        success: false,
        error: 'Payment method and transaction ID are required'
      });
    }

    const order = await Order.findById(req.query.orderId);

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
        error: 'Not authorized to capture payment for this order'
      });
    }

    // Check if order is in pending payment status
    if (order.paymentStatus !== 'pending') {
      return res.status(400).json({
        success: false,
        error: 'Order payment is not pending'
      });
    }

    // In a real implementation, you would verify the payment with payment gateway
    // For now, we'll simulate successful payment
    const updatedOrder = await Order.findByIdAndUpdate(
      req.query.orderId,
      {
        paymentStatus: 'paid',
        deliveryStatus: 'initiated'
      },
      { new: true }
    ).populate('buyerId', 'name mobile email role')
     .populate('sellerId', 'name mobile email role')
     .populate('listingId', 'species breed price');

    res.json({
      success: true,
      message: 'Payment captured successfully',
      data: updatedOrder
    });
  } catch (error) {
    console.error('Capture payment error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}
