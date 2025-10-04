import { NextApiRequest, NextApiResponse } from 'next';
import { Cart, Order, Listing, User } from '../../models';
import connectDB from '../../lib/mongodb';
import jwt from 'jsonwebtoken';
import Razorpay from 'razorpay';

// Connect to database
connectDB();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || ''
});

// Middleware to authenticate user
const authenticateUser = (req: NextApiRequest) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    throw new Error('No token provided');
  }
  
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || 'fallback-secret') as any;
  return decoded.userId;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { checkout } = req.query;
  
  try {
    const userId = authenticateUser(req);
    
    switch (method) {
      case 'POST':
        if (checkout && checkout[0] === 'create-order') {
          return await createCheckoutOrder(req, res, userId);
        } else if (checkout && checkout[0] === 'place-order') {
          return await placeOrder(req, res, userId);
        } else if (checkout && checkout[0] === 'verify-payment') {
          return await verifyPayment(req, res, userId);
        }
        break;
        
      default:
        res.setHeader('Allow', ['POST']);
        res.status(405).json({ success: false, error: `Method ${method} not allowed` });
    }
  } catch (error: any) {
    console.error('Checkout API error:', error);
    res.status(401).json({ success: false, error: error.message });
  }
}

// @desc    Create checkout order (prepare for payment)
// @route   POST /api/checkout/create-order
// @access  Private
async function createCheckoutOrder(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { shippingAddress, paymentMethod } = req.body;
    
    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({
        success: false,
        error: 'Shipping address and payment method are required'
      });
    }
    
    // Get user's cart
    const cart = await Cart.findOne({ userId }).populate('items.listingId');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Cart is empty'
      });
    }
    
    // Validate all items are still available
    const validatedItems = [];
    let totalAmount = 0;
    
    for (const item of cart.items) {
      const listing = item.listingId as any;
      
      if (!listing || listing.status !== 'active') {
        return res.status(400).json({
          success: false,
          error: `Item "${listing?.title || 'Unknown'}" is no longer available`
        });
      }
      
      if (item.quantity < listing.minimumOrder) {
        return res.status(400).json({
          success: false,
          error: `Minimum order quantity for "${listing.title}" is ${listing.minimumOrder}`
        });
      }
      
      validatedItems.push({
        listingId: listing._id,
        sellerId: listing.sellerId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice
      });
      
      totalAmount += item.totalPrice;
    }
    
    // Create order summary
    const orderSummary = {
      userId,
      items: validatedItems,
      totalAmount,
      shippingCost: 0, // Calculate based on location
      paymentMethod,
      shippingAddress,
      status: 'pending',
      paymentStatus: 'pending'
    };
    
    res.status(200).json({
      success: true,
      orderSummary,
      message: 'Order summary created successfully'
    });
  } catch (error) {
    console.error('Create checkout order error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
}

// @desc    Place order and process payment
// @route   POST /api/checkout/place-order
// @access  Private
async function placeOrder(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { shippingAddress, paymentMethod, orderItems } = req.body;
    
    if (!shippingAddress || !paymentMethod || !orderItems) {
      return res.status(400).json({
        success: false,
        error: 'Shipping address, payment method, and order items are required'
      });
    }
    
    // Get user details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Create individual orders for each seller
    const orders = [];
    let totalOrderValue = 0;
    
    for (const item of orderItems) {
      const listing = await Listing.findById(item.listingId);
      if (!listing) {
        return res.status(404).json({
          success: false,
          error: `Listing ${item.listingId} not found`
        });
      }
      
      const orderData = {
        listingId: item.listingId,
        buyerId: userId,
        sellerId: listing.sellerId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        amount: item.totalPrice,
        shippingCost: 0, // Calculate based on distance
        totalAmount: item.totalPrice,
        status: 'pending',
        paymentStatus: 'pending',
        paymentMethod,
        shippingAddress,
        notes: ''
      };
      
      const order = await Order.create(orderData);
      orders.push(order);
      totalOrderValue += item.totalPrice;
    }
    
    // Process payment based on method
    let paymentResult = null;
    
    if (paymentMethod === 'cash_on_delivery') {
      paymentResult = {
        success: true,
        method: 'cash_on_delivery',
        message: 'Order placed successfully. Payment will be collected on delivery.'
      };
    } else if (paymentMethod === 'upi' || paymentMethod === 'bank_transfer') {
      // For UPI/Bank transfer, create payment instructions
      paymentResult = {
        success: true,
        method: paymentMethod,
        instructions: 'Please complete the payment and upload the receipt to confirm your order.',
        message: 'Order placed successfully. Please complete payment to confirm.'
      };
    } else if (paymentMethod === 'razorpay') {
      // Create Razorpay order
      const razorpayOrder = await razorpay.orders.create({
        amount: totalOrderValue * 100, // Convert to paise
        currency: 'INR',
        receipt: `order_${Date.now()}`,
        notes: {
          userId,
          orderIds: orders.map(o => o._id).join(',')
        }
      });
      
      paymentResult = {
        success: true,
        method: 'razorpay',
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        message: 'Payment gateway initialized successfully'
      };
    }
    
    // Clear cart after successful order placement
    await Cart.findOneAndUpdate(
      { userId },
      { items: [], totalAmount: 0, itemCount: 0 }
    );
    
    res.status(201).json({
      success: true,
      orders: orders.map(order => ({
        _id: order._id,
        listingId: order.listingId,
        quantity: order.quantity,
        totalAmount: order.totalAmount,
        status: order.status,
        paymentStatus: order.paymentStatus
      })),
      paymentResult,
      message: 'Orders placed successfully'
    });
  } catch (error) {
    console.error('Place order error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
}

// @desc    Verify payment and update order status
// @route   POST /api/checkout/verify-payment
// @access  Private
async function verifyPayment(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderIds } = req.body;
    
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !orderIds) {
      return res.status(400).json({
        success: false,
        error: 'Payment verification details are required'
      });
    }
    
    // Verify Razorpay signature
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');
    
    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({
        success: false,
        error: 'Invalid payment signature'
      });
    }
    
    // Update order status
    const orderIdArray = Array.isArray(orderIds) ? orderIds : [orderIds];
    const updatedOrders = [];
    
    for (const orderId of orderIdArray) {
      const order = await Order.findByIdAndUpdate(
        orderId,
        {
          paymentStatus: 'paid',
          status: 'confirmed',
          'trackingInfo.paymentId': razorpayPaymentId
        },
        { new: true }
      );
      
      if (order) {
        updatedOrders.push(order);
      }
    }
    
    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      orders: updatedOrders.map(order => ({
        _id: order._id,
        status: order.status,
        paymentStatus: order.paymentStatus
      }))
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
}
