const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../../config/database');
const { protect } = require('../middleware/auth');
const { logger } = require('../utils/logger');

const router = express.Router();

// @desc    Get messages for a conversation
// @route   GET /api/messages/:conversationId
// @access  Private
router.get('/:conversationId', protect, async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;

    // Check if user is participant
    const participant = await db('conversation_participants')
      .where('conversation_id', req.params.conversationId)
      .where('user_id', req.user.id)
      .where('left_at', null)
      .first();

    if (!participant) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this conversation'
      });
    }

    // Get messages
    let query = db('messages')
      .select(
        'messages.*',
        'users.name as sender_name',
        'users.avatar_url as sender_avatar'
      )
      .join('users', 'messages.sender_id', 'users.id')
      .where('messages.conversation_id', req.params.conversationId)
      .where('messages.deleted', false);

    // Get total count
    const countQuery = query.clone();
    const total = await countQuery.count('* as count').first();

    // Apply pagination (newest first)
    const offset = (page - 1) * limit;
    const messages = await query
      .orderBy('messages.created_at', 'desc')
      .limit(limit)
      .offset(offset);

    // Mark messages as read
    const messageIds = messages.map(msg => msg.id);
    if (messageIds.length > 0) {
      await db('message_reads')
        .insert(
          messageIds.map(messageId => ({
            message_id: messageId,
            user_id: req.user.id
          }))
        )
        .onConflict(['message_id', 'user_id'])
        .ignore();
    }

    // Update conversation last_message_at
    if (messages.length > 0) {
      await db('conversations')
        .where('id', req.params.conversationId)
        .update({ 
          last_message_at: messages[0].created_at,
          updated_at: new Date()
        });
    }

    res.json({
      success: true,
      data: messages.reverse(), // Return in chronological order
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: total.count,
        pages: Math.ceil(total.count / limit)
      }
    });
  } catch (error) {
    logger.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Send message
// @route   POST /api/messages/:conversationId
// @access  Private
router.post('/:conversationId', protect, async (req, res) => {
  try {
    const { content, messageType = 'text', metadata = {} } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Message content is required'
      });
    }

    // Check if user is participant
    const participant = await db('conversation_participants')
      .where('conversation_id', req.params.conversationId)
      .where('user_id', req.user.id)
      .where('left_at', null)
      .first();

    if (!participant) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to send messages to this conversation'
      });
    }

    // Create message
    const messageData = {
      id: uuidv4(),
      conversation_id: req.params.conversationId,
      sender_id: req.user.id,
      content: content.trim(),
      message_type: messageType,
      metadata,
      edited: false,
      deleted: false
    };

    const [messageId] = await db('messages').insert(messageData).returning('id');

    // Update conversation last_message_at
    await db('conversations')
      .where('id', req.params.conversationId)
      .update({ 
        last_message_at: new Date(),
        updated_at: new Date()
      });

    // Get the created message with sender info
    const message = await db('messages')
      .select(
        'messages.*',
        'users.name as sender_name',
        'users.avatar_url as sender_avatar'
      )
      .join('users', 'messages.sender_id', 'users.id')
      .where('messages.id', messageId)
      .first();

    res.status(201).json({
      success: true,
      data: message
    });
  } catch (error) {
    logger.error('Send message error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Update message
// @route   PUT /api/messages/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Message content is required'
      });
    }

    // Get message
    const message = await db('messages')
      .where('id', req.params.id)
      .first();

    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Message not found'
      });
    }

    // Check ownership
    if (message.sender_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to edit this message'
      });
    }

    // Check if message is too old (e.g., 15 minutes)
    const messageAge = Date.now() - new Date(message.created_at).getTime();
    const maxEditAge = 15 * 60 * 1000; // 15 minutes

    if (messageAge > maxEditAge) {
      return res.status(400).json({
        success: false,
        error: 'Message is too old to edit'
      });
    }

    // Update message
    await db('messages')
      .where('id', req.params.id)
      .update({
        content: content.trim(),
        edited: true,
        edited_at: new Date()
      });

    const updatedMessage = await db('messages')
      .select(
        'messages.*',
        'users.name as sender_name',
        'users.avatar_url as sender_avatar'
      )
      .join('users', 'messages.sender_id', 'users.id')
      .where('messages.id', req.params.id)
      .first();

    res.json({
      success: true,
      data: updatedMessage
    });
  } catch (error) {
    logger.error('Update message error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    // Get message
    const message = await db('messages')
      .where('id', req.params.id)
      .first();

    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Message not found'
      });
    }

    // Check ownership or admin rights
    if (message.sender_id !== req.user.id && req.user.user_type !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this message'
      });
    }

    // Soft delete message
    await db('messages')
      .where('id', req.params.id)
      .update({
        deleted: true,
        deleted_at: new Date()
      });

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    logger.error('Delete message error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Mark message as read
// @route   PUT /api/messages/:id/read
// @access  Private
router.put('/:id/read', protect, async (req, res) => {
  try {
    // Check if user is participant in the conversation
    const message = await db('messages')
      .where('id', req.params.id)
      .first();

    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Message not found'
      });
    }

    const participant = await db('conversation_participants')
      .where('conversation_id', message.conversation_id)
      .where('user_id', req.user.id)
      .where('left_at', null)
      .first();

    if (!participant) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to mark this message as read'
      });
    }

    // Mark as read
    await db('message_reads')
      .insert({
        message_id: req.params.id,
        user_id: req.user.id
      })
      .onConflict(['message_id', 'user_id'])
      .ignore();

    res.json({
      success: true,
      message: 'Message marked as read'
    });
  } catch (error) {
    logger.error('Mark message as read error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Mark all messages in conversation as read
// @route   PUT /api/messages/:conversationId/read-all
// @access  Private
router.put('/:conversationId/read-all', protect, async (req, res) => {
  try {
    // Check if user is participant
    const participant = await db('conversation_participants')
      .where('conversation_id', req.params.conversationId)
      .where('user_id', req.user.id)
      .where('left_at', null)
      .first();

    if (!participant) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to mark messages as read'
      });
    }

    // Get unread messages
    const unreadMessages = await db('messages')
      .select('id')
      .where('conversation_id', req.params.conversationId)
      .where('deleted', false)
      .whereNotIn('id', function() {
        this.select('message_id')
          .from('message_reads')
          .where('user_id', req.user.id);
      });

    if (unreadMessages.length > 0) {
      // Mark all as read
      const readRecords = unreadMessages.map(msg => ({
        message_id: msg.id,
        user_id: req.user.id
      }));

      await db('message_reads').insert(readRecords);
    }

    res.json({
      success: true,
      message: 'All messages marked as read',
      count: unreadMessages.length
    });
  } catch (error) {
    logger.error('Mark all messages as read error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get unread message count
// @route   GET /api/messages/unread/count
// @access  Private
router.get('/unread/count', protect, async (req, res) => {
  try {
    // Get conversations where user is participant
    const conversations = await db('conversation_participants')
      .select('conversation_id')
      .where('user_id', req.user.id)
      .where('left_at', null);

    const conversationIds = conversations.map(c => c.conversation_id);

    if (conversationIds.length === 0) {
      return res.json({
        success: true,
        data: { total: 0, byConversation: {} }
      });
    }

    // Get unread count for each conversation
    const unreadCounts = await db('messages')
      .select('conversation_id')
      .count('* as count')
      .whereIn('conversation_id', conversationIds)
      .where('deleted', false)
      .whereNotIn('id', function() {
        this.select('message_id')
          .from('message_reads')
          .where('user_id', req.user.id);
      })
      .groupBy('conversation_id');

    const total = unreadCounts.reduce((sum, item) => sum + parseInt(item.count), 0);
    const byConversation = unreadCounts.reduce((acc, item) => {
      acc[item.conversation_id] = parseInt(item.count);
      return acc;
    }, {});

    res.json({
      success: true,
      data: { total, byConversation }
    });
  } catch (error) {
    logger.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;
