import { NextApiRequest, NextApiResponse } from 'next';
import { User, Order, Listing } from '../../models';
import connectDB from '../../lib/mongodb';
import jwt from 'jsonwebtoken';
import emailService from '../../services/emailService';
import smsService from '../../services/smsService';

// Connect to database
connectDB();

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
  const { notifications } = req.query;
  
  try {
    const userId = authenticateUser(req);
    
    switch (method) {
      case 'GET':
        if (notifications && notifications[0] === 'unread') {
          return await getUnreadNotifications(req, res, userId);
        } else if (notifications && notifications[0] === 'mark-read') {
          return await markAsRead(req, res, userId);
        }
        return await getNotifications(req, res, userId);
        
      case 'POST':
        if (notifications && notifications[0] === 'send') {
          return await sendNotification(req, res, userId);
        }
        break;
        
      case 'PUT':
        if (notifications && notifications[0] === 'mark-all-read') {
          return await markAllAsRead(req, res, userId);
        }
        break;
        
      case 'DELETE':
        if (notifications && notifications[0] === 'clear') {
          return await clearNotifications(req, res, userId);
        }
        break;
        
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).json({ success: false, error: `Method ${method} not allowed` });
    }
  } catch (error: any) {
    console.error('Notification API error:', error);
    res.status(401).json({ success: false, error: error.message });
  }
}

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
async function getNotifications(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { page = 1, limit = 20, type } = req.query;
    
    let query: any = { userId };
    if (type) {
      query.type = type;
    }
    
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    
    // For now, we'll simulate notifications since we don't have a Notification model yet
    // In a real implementation, you would query the Notification collection
    const notifications = [
      {
        _id: '1',
        userId,
        type: 'order',
        title: 'New Order Received',
        message: 'You have received a new order for Wheat - Premium Grade',
        data: { orderId: 'order123', listingId: 'listing456' },
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        updatedAt: new Date(Date.now() - 1000 * 60 * 30)
      },
      {
        _id: '2',
        userId,
        type: 'payment',
        title: 'Payment Received',
        message: 'Payment of ₹15,000 has been received for your order',
        data: { orderId: 'order123', amount: 15000 },
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2)
      },
      {
        _id: '3',
        userId,
        type: 'message',
        title: 'New Message',
        message: 'You have a new message from John Doe',
        data: { conversationId: 'conv123', senderId: 'user789' },
        isRead: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24)
      }
    ];
    
    const filteredNotifications = notifications.filter(n => 
      !type || n.type === type
    );
    
    const paginatedNotifications = filteredNotifications.slice(skip, skip + parseInt(limit as string));
    
    res.status(200).json({
      success: true,
      notifications: paginatedNotifications,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total: filteredNotifications.length,
        pages: Math.ceil(filteredNotifications.length / parseInt(limit as string))
      }
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
}

// @desc    Get unread notifications count
// @route   GET /api/notifications/unread
// @access  Private
async function getUnreadNotifications(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    // Simulate unread count
    const unreadCount = 2;
    
    res.status(200).json({
      success: true,
      unreadCount
    });
  } catch (error) {
    console.error('Get unread notifications error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
}

// @desc    Mark notification as read
// @route   GET /api/notifications/mark-read
// @access  Private
async function markAsRead(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { notificationId } = req.query;
    
    if (!notificationId) {
      return res.status(400).json({
        success: false,
        error: 'Notification ID is required'
      });
    }
    
    // In a real implementation, you would update the notification in the database
    // await Notification.findByIdAndUpdate(notificationId, { isRead: true });
    
    res.status(200).json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
}

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/mark-all-read
// @access  Private
async function markAllAsRead(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    // In a real implementation, you would update all notifications for the user
    // await Notification.updateMany({ userId, isRead: false }, { isRead: true });
    
    res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
}

// @desc    Clear all notifications
// @route   DELETE /api/notifications/clear
// @access  Private
async function clearNotifications(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    // In a real implementation, you would delete all notifications for the user
    // await Notification.deleteMany({ userId });
    
    res.status(200).json({
      success: true,
      message: 'All notifications cleared'
    });
  } catch (error) {
    console.error('Clear notifications error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
}

// @desc    Send notification
// @route   POST /api/notifications/send
// @access  Private (Admin/Seller)
async function sendNotification(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { targetUserId, type, title, message, data, channels } = req.body;
    
    if (!targetUserId || !type || !title || !message) {
      return res.status(400).json({
        success: false,
        error: 'Target user ID, type, title, and message are required'
      });
    }
    
    // Get sender details
    const sender = await User.findById(userId);
    if (!sender) {
      return res.status(404).json({
        success: false,
        error: 'Sender not found'
      });
    }
    
    // Get target user details
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        error: 'Target user not found'
      });
    }
    
    // Send notifications through different channels
    const results = [];
    
    if (!channels || channels.includes('email')) {
      try {
        await emailService.sendWelcomeEmail(targetUser.email, targetUser.name);
        results.push({ channel: 'email', success: true });
      } catch (error) {
        results.push({ channel: 'email', success: false, error: error.message });
      }
    }
    
    if (!channels || channels.includes('sms')) {
      try {
        await smsService.sendOTP(targetUser.mobile, message);
        results.push({ channel: 'sms', success: true });
      } catch (error) {
        results.push({ channel: 'sms', success: false, error: error.message });
      }
    }
    
    // In a real implementation, you would also send push notifications
    if (!channels || channels.includes('push')) {
      results.push({ channel: 'push', success: true, message: 'Push notification queued' });
    }
    
    res.status(200).json({
      success: true,
      message: 'Notifications sent successfully',
      results
    });
  } catch (error) {
    console.error('Send notification error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
}

// Utility function to send order notifications
export async function sendOrderNotification(orderId: string, type: 'created' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled') {
  try {
    const order = await Order.findById(orderId)
      .populate('buyerId', 'name email mobile')
      .populate('sellerId', 'name email mobile')
      .populate('listingId', 'title');
    
    if (!order) return;
    
    const buyer = order.buyerId as any;
    const seller = order.sellerId as any;
    const listing = order.listingId as any;
    
    let title = '';
    let message = '';
    let recipient = null;
    
    switch (type) {
      case 'created':
        title = 'New Order Received';
        message = `You have received a new order for ${listing.title} from ${buyer.name}`;
        recipient = seller;
        break;
      case 'confirmed':
        title = 'Order Confirmed';
        message = `Your order for ${listing.title} has been confirmed by ${seller.name}`;
        recipient = buyer;
        break;
      case 'shipped':
        title = 'Order Shipped';
        message = `Your order for ${listing.title} has been shipped by ${seller.name}`;
        recipient = buyer;
        break;
      case 'delivered':
        title = 'Order Delivered';
        message = `Your order for ${listing.title} has been delivered successfully`;
        recipient = buyer;
        break;
      case 'cancelled':
        title = 'Order Cancelled';
        message = `Your order for ${listing.title} has been cancelled`;
        recipient = buyer;
        break;
    }
    
    if (recipient) {
      // Send email notification
      try {
        await emailService.sendWelcomeEmail(recipient.email, recipient.name);
      } catch (error) {
        console.error('Email notification failed:', error);
      }
      
      // Send SMS notification
      try {
        await smsService.sendOTP(recipient.mobile, message);
      } catch (error) {
        console.error('SMS notification failed:', error);
      }
    }
  } catch (error) {
    console.error('Send order notification error:', error);
  }
}
