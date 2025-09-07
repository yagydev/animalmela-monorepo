const { NextApiRequest, NextApiResponse } = require('next');
const { User } = require('../../../models');
const { protect } = require('../../../middleware/auth');
const connectDB = require('../../../lib/mongodb');

// Connect to database
connectDB();

export default async function handler(req, res) {
  const { method } = req;
  const { peerId } = req.query;

  switch (method) {
    case 'GET':
      if (peerId) {
        return await getChatMessages(req, res);
      }
      break;
    case 'POST':
      if (peerId) {
        return await sendMessage(req, res);
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({ success: false, error: `Method ${method} not allowed` });
  }
}

// @desc    Get chat messages with peer
// @route   GET /api/chats/:peerId
// @access  Private
async function getChatMessages(req, res) {
  try {
    // Use protect middleware
    await new Promise((resolve, reject) => {
      protect(req, res, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });

    const { page = 1, limit = 50 } = req.query;

    // Check if peer exists
    const peer = await User.findById(peerId);
    if (!peer) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // In a real implementation, you would have a Message model
    // For now, we'll return a mock response
    const mockMessages = [
      {
        _id: '1',
        senderId: req.user._id,
        receiverId: peerId,
        content: 'Hello, I am interested in your listing',
        timestamp: new Date(),
        read: true
      },
      {
        _id: '2',
        senderId: peerId,
        receiverId: req.user._id,
        content: 'Thank you for your interest. What would you like to know?',
        timestamp: new Date(),
        read: true
      }
    ];

    res.json({
      success: true,
      data: {
        messages: mockMessages,
        peer: {
          _id: peer._id,
          name: peer.name,
          mobile: peer.mobile,
          role: peer.role
        }
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get chat messages error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Send message to peer
// @route   POST /api/chats/:peerId/messages
// @access  Private
async function sendMessage(req, res) {
  try {
    // Use protect middleware
    await new Promise((resolve, reject) => {
      protect(req, res, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });

    const { content, messageType = 'text' } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        error: 'Message content is required'
      });
    }

    // Check if peer exists
    const peer = await User.findById(peerId);
    if (!peer) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // In a real implementation, you would save the message to database
    const mockMessage = {
      _id: new Date().getTime().toString(),
      senderId: req.user._id,
      receiverId: peerId,
      content,
      messageType,
      timestamp: new Date(),
      read: false
    };

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: mockMessage
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}
