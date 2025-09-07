import { NextApiRequest, NextApiResponse } from 'next';
import { Conversation, Message, User, Listing, Order } from '../../../models';
import { protect, authorize } from '../../../middleware/auth';
import { connectDB } from '../../../lib/database';

// Connect to database
connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      if (req.url === '/api/chat/conversations') {
        return await getConversations(req, res);
      } else if (req.url?.startsWith('/api/chat/conversations/') && req.url !== '/api/chat/conversations/messages') {
        return await getConversation(req, res);
      } else if (req.url?.startsWith('/api/chat/conversations/') && req.url.includes('/messages')) {
        return await getMessages(req, res);
      }
      break;
    case 'POST':
      if (req.url === '/api/chat/conversations') {
        return await createConversation(req, res);
      } else if (req.url?.startsWith('/api/chat/conversations/') && req.url.includes('/messages')) {
        return await sendMessage(req, res);
      } else if (req.url?.startsWith('/api/chat/conversations/') && req.url.includes('/advance-payment')) {
        return await processAdvancePayment(req, res);
      }
      break;
    case 'PUT':
      if (req.url?.startsWith('/api/chat/conversations/') && req.url.includes('/status')) {
        return await updateConversationStatus(req, res);
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT']);
      res.status(405).json({ success: false, error: `Method ${method} not allowed` });
  }
}

// @desc    Get user's conversations
// @route   GET /api/chat/conversations
// @access  Private
async function getConversations(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Use protect middleware
    await new Promise((resolve, reject) => {
      protect(req, res, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });

    const { status = 'active', conversationType } = req.query;

    let query: any = {
      'participants.user_id': req.user._id
    };

    if (status) {
      query.status = status;
    }

    if (conversationType) {
      query.conversation_type = conversationType;
    }

    const conversations = await Conversation.find(query)
      .populate('participants.user_id', 'name email avatar_url user_type')
      .populate('listing_id', 'title price images')
      .populate('order_id', 'total_amount status')
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      data: conversations
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Get single conversation by ID
// @route   GET /api/chat/conversations/:id
// @access  Private
async function getConversation(req: NextApiRequest, res: NextApiResponse) {
  try {
    const conversationId = req.url?.split('/')[4];
    
    if (!conversationId) {
      return res.status(400).json({
        success: false,
        error: 'Conversation ID is required'
      });
    }

    // Use protect middleware
    await new Promise((resolve, reject) => {
      protect(req, res, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });

    const conversation = await Conversation.findOne({
      _id: conversationId,
      'participants.user_id': req.user._id
    })
      .populate('participants.user_id', 'name email avatar_url user_type')
      .populate('listing_id', 'title price images seller_id')
      .populate('order_id', 'total_amount status advance_payment');

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found'
      });
    }

    res.json({
      success: true,
      data: conversation
    });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Get messages for a conversation
// @route   GET /api/chat/conversations/:id/messages
// @access  Private
async function getMessages(req: NextApiRequest, res: NextApiResponse) {
  try {
    const conversationId = req.url?.split('/')[4];
    
    if (!conversationId) {
      return res.status(400).json({
        success: false,
        error: 'Conversation ID is required'
      });
    }

    // Use protect middleware
    await new Promise((resolve, reject) => {
      protect(req, res, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });

    const { page = 1, limit = 50 } = req.query;

    // Verify user has access to this conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      'participants.user_id': req.user._id
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found'
      });
    }

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const messages = await Message.find({ conversation_id: conversationId })
      .populate('sender_id', 'name email avatar_url user_type')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit as string));

    const total = await Message.countDocuments({ conversation_id: conversationId });

    res.json({
      success: true,
      data: messages.reverse(), // Reverse to show oldest first
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Create new conversation
// @route   POST /api/chat/conversations
// @access  Private
async function createConversation(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Use protect middleware
    await new Promise((resolve, reject) => {
      protect(req, res, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });

    const { 
      participantId, 
      listingId, 
      orderId, 
      conversationType = 'inquiry' 
    } = req.body;

    if (!participantId) {
      return res.status(400).json({
        success: false,
        error: 'Participant ID is required'
      });
    }

    // Check if conversation already exists
    const existingConversation = await Conversation.findOne({
      'participants.user_id': { $all: [req.user._id, participantId] },
      listing_id: listingId || null,
      order_id: orderId || null
    });

    if (existingConversation) {
      return res.json({
        success: true,
        data: existingConversation,
        message: 'Conversation already exists'
      });
    }

    const conversationData = {
      participants: [
        { user_id: req.user._id, role: 'buyer' },
        { user_id: participantId, role: 'seller' }
      ],
      listing_id: listingId || null,
      order_id: orderId || null,
      conversation_type: conversationType,
      status: 'active'
    };

    const conversation = await Conversation.create(conversationData);
    await conversation.populate('participants.user_id', 'name email avatar_url user_type');
    await conversation.populate('listing_id', 'title price images');
    await conversation.populate('order_id', 'total_amount status');

    res.status(201).json({
      success: true,
      data: conversation
    });
  } catch (error) {
    console.error('Create conversation error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Send message in conversation
// @route   POST /api/chat/conversations/:id/messages
// @access  Private
async function sendMessage(req: NextApiRequest, res: NextApiResponse) {
  try {
    const conversationId = req.url?.split('/')[4];
    
    if (!conversationId) {
      return res.status(400).json({
        success: false,
        error: 'Conversation ID is required'
      });
    }

    // Use protect middleware
    await new Promise((resolve, reject) => {
      protect(req, res, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });

    const { content, messageType = 'text', attachments = [], metadata = {} } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        error: 'Message content is required'
      });
    }

    // Verify user has access to this conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      'participants.user_id': req.user._id
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found'
      });
    }

    const messageData = {
      conversation_id: conversationId,
      sender_id: req.user._id,
      content,
      message_type: messageType,
      attachments,
      metadata,
      read_by: [{ user_id: req.user._id, read_at: new Date() }]
    };

    const message = await Message.create(messageData);
    await message.populate('sender_id', 'name email avatar_url user_type');

    // Update conversation's last message
    await Conversation.findByIdAndUpdate(conversationId, {
      last_message: {
        content,
        sender_id: req.user._id,
        timestamp: new Date()
      }
    });

    res.status(201).json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Process advance payment
// @route   POST /api/chat/conversations/:id/advance-payment
// @access  Private
async function processAdvancePayment(req: NextApiRequest, res: NextApiResponse) {
  try {
    const conversationId = req.url?.split('/')[4];
    
    if (!conversationId) {
      return res.status(400).json({
        success: false,
        error: 'Conversation ID is required'
      });
    }

    // Use protect middleware
    await new Promise((resolve, reject) => {
      protect(req, res, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });

    const { amount, paymentMethod, orderId } = req.body;

    if (!amount || !paymentMethod || !orderId) {
      return res.status(400).json({
        success: false,
        error: 'Amount, payment method, and order ID are required'
      });
    }

    // Verify user has access to this conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      'participants.user_id': req.user._id
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found'
      });
    }

    // Update order with advance payment
    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        advance_payment: {
          amount: parseFloat(amount),
          paid: true,
          payment_date: new Date(),
          payment_method: paymentMethod
        },
        payment_status: 'paid'
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Send payment confirmation message
    const messageData = {
      conversation_id: conversationId,
      sender_id: req.user._id,
      content: `Advance payment of ₹${amount} processed successfully via ${paymentMethod}`,
      message_type: 'acceptance',
      metadata: {
        payment_amount: amount,
        payment_method: paymentMethod,
        order_id: orderId
      }
    };

    const message = await Message.create(messageData);
    await message.populate('sender_id', 'name email avatar_url user_type');

    res.json({
      success: true,
      data: {
        order,
        message
      },
      message: 'Advance payment processed successfully'
    });
  } catch (error) {
    console.error('Process advance payment error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Update conversation status
// @route   PUT /api/chat/conversations/:id/status
// @access  Private
async function updateConversationStatus(req: NextApiRequest, res: NextApiResponse) {
  try {
    const conversationId = req.url?.split('/')[4];
    
    if (!conversationId) {
      return res.status(400).json({
        success: false,
        error: 'Conversation ID is required'
      });
    }

    // Use protect middleware
    await new Promise((resolve, reject) => {
      protect(req, res, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });

    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Status is required'
      });
    }

    // Verify user has access to this conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      'participants.user_id': req.user._id
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found'
      });
    }

    const updatedConversation = await Conversation.findByIdAndUpdate(
      conversationId,
      { status },
      { new: true }
    ).populate('participants.user_id', 'name email avatar_url user_type');

    res.json({
      success: true,
      data: updatedConversation,
      message: 'Conversation status updated successfully'
    });
  } catch (error) {
    console.error('Update conversation status error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

