const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../../config/database');
const { protect } = require('../middleware/auth');
const { logger } = require('../utils/logger');

const router = express.Router();

// @desc    Get user conversations
// @route   GET /api/conversations
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    // Get conversations where user is a participant
    let query = db('conversations')
      .select(
        'conversations.*',
        db.raw('(SELECT COUNT(*) FROM messages WHERE conversation_id = conversations.id AND created_at > (SELECT COALESCE(MAX(read_at), \'1970-01-01\') FROM message_reads WHERE message_id = messages.id AND user_id = ?)) as unread_count', [req.user.id])
      )
      .join('conversation_participants', 'conversations.id', 'conversation_participants.conversation_id')
      .where('conversation_participants.user_id', req.user.id)
      .where('conversation_participants.left_at', null);

    // Get total count
    const countQuery = query.clone();
    const total = await countQuery.count('* as count').first();

    // Apply pagination
    const offset = (page - 1) * limit;
    const conversations = await query
      .orderBy('conversations.last_message_at', 'desc')
      .orderBy('conversations.updated_at', 'desc')
      .limit(limit)
      .offset(offset);

    // Get participants for each conversation
    const conversationIds = conversations.map(conv => conv.id);
    const participants = await db('conversation_participants')
      .select(
        'conversation_participants.*',
        'users.name',
        'users.avatar_url',
        'users.verified'
      )
      .join('users', 'conversation_participants.user_id', 'users.id')
      .whereIn('conversation_participants.conversation_id', conversationIds)
      .where('conversation_participants.left_at', null);

    // Get last message for each conversation
    const lastMessages = await db('messages')
      .select('conversation_id', 'content', 'message_type', 'created_at', 'sender_id')
      .whereIn('conversation_id', conversationIds)
      .where('deleted', false)
      .orderBy('created_at', 'desc');

    // Attach participants and last message to conversations
    const conversationsWithDetails = conversations.map(conversation => {
      const conversationParticipants = participants.filter(p => p.conversation_id === conversation.id);
      const lastMessage = lastMessages.find(m => m.conversation_id === conversation.id);
      
      return {
        ...conversation,
        participants: conversationParticipants,
        lastMessage,
        unreadCount: parseInt(conversation.unread_count) || 0
      };
    });

    res.json({
      success: true,
      data: conversationsWithDetails,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: total.count,
        pages: Math.ceil(total.count / limit)
      }
    });
  } catch (error) {
    logger.error('Get conversations error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get single conversation
// @route   GET /api/conversations/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    // Check if user is participant
    const participant = await db('conversation_participants')
      .where('conversation_id', req.params.id)
      .where('user_id', req.user.id)
      .where('left_at', null)
      .first();

    if (!participant) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this conversation'
      });
    }

    const conversation = await db('conversations')
      .where('id', req.params.id)
      .first();

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found'
      });
    }

    // Get participants
    const participants = await db('conversation_participants')
      .select(
        'conversation_participants.*',
        'users.name',
        'users.avatar_url',
        'users.verified'
      )
      .join('users', 'conversation_participants.user_id', 'users.id')
      .where('conversation_participants.conversation_id', req.params.id)
      .where('conversation_participants.left_at', null);

    conversation.participants = participants;

    res.json({
      success: true,
      data: conversation
    });
  } catch (error) {
    logger.error('Get conversation error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Create conversation
// @route   POST /api/conversations
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { participantIds, title, type = 'direct' } = req.body;

    if (!participantIds || participantIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'At least one participant is required'
      });
    }

    // Add current user to participants
    const allParticipantIds = [...new Set([req.user.id, ...participantIds])];

    // Check if direct conversation already exists (for 2 participants)
    if (type === 'direct' && allParticipantIds.length === 2) {
      const existingConversation = await db('conversations')
        .select('conversations.*')
        .join('conversation_participants as cp1', 'conversations.id', 'cp1.conversation_id')
        .join('conversation_participants as cp2', 'conversations.id', 'cp2.conversation_id')
        .where('conversations.type', 'direct')
        .where('cp1.user_id', allParticipantIds[0])
        .where('cp2.user_id', allParticipantIds[1])
        .where('cp1.left_at', null)
        .where('cp2.left_at', null)
        .first();

      if (existingConversation) {
        return res.json({
          success: true,
          data: existingConversation
        });
      }
    }

    // Create conversation
    const conversationData = {
      id: uuidv4(),
      title: title || null,
      type,
      active: true
    };

    const [conversationId] = await db('conversations').insert(conversationData).returning('id');

    // Add participants
    const participantData = allParticipantIds.map(userId => ({
      conversation_id: conversationId,
      user_id: userId,
      role: userId === req.user.id ? 'admin' : 'participant'
    }));

    await db('conversation_participants').insert(participantData);

    const conversation = await db('conversations')
      .where('id', conversationId)
      .first();

    // Get participants
    const participants = await db('conversation_participants')
      .select(
        'conversation_participants.*',
        'users.name',
        'users.avatar_url',
        'users.verified'
      )
      .join('users', 'conversation_participants.user_id', 'users.id')
      .where('conversation_participants.conversation_id', conversationId);

    conversation.participants = participants;

    res.status(201).json({
      success: true,
      data: conversation
    });
  } catch (error) {
    logger.error('Create conversation error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Update conversation
// @route   PUT /api/conversations/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    // Check if user is participant
    const participant = await db('conversation_participants')
      .where('conversation_id', req.params.id)
      .where('user_id', req.user.id)
      .where('left_at', null)
      .first();

    if (!participant) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this conversation'
      });
    }

    const { title } = req.body;

    const updateData = {
      title,
      updated_at: new Date()
    };

    await db('conversations')
      .where('id', req.params.id)
      .update(updateData);

    const conversation = await db('conversations')
      .where('id', req.params.id)
      .first();

    res.json({
      success: true,
      data: conversation
    });
  } catch (error) {
    logger.error('Update conversation error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Leave conversation
// @route   POST /api/conversations/:id/leave
// @access  Private
router.post('/:id/leave', protect, async (req, res) => {
  try {
    // Check if user is participant
    const participant = await db('conversation_participants')
      .where('conversation_id', req.params.id)
      .where('user_id', req.user.id)
      .where('left_at', null)
      .first();

    if (!participant) {
      return res.status(403).json({
        success: false,
        error: 'Not a participant of this conversation'
      });
    }

    // Mark as left
    await db('conversation_participants')
      .where('conversation_id', req.params.id)
      .where('user_id', req.user.id)
      .update({ left_at: new Date() });

    // Check if conversation should be deactivated (no active participants)
    const activeParticipants = await db('conversation_participants')
      .where('conversation_id', req.params.id)
      .where('left_at', null)
      .count('* as count')
      .first();

    if (activeParticipants.count === 0) {
      await db('conversations')
        .where('id', req.params.id)
        .update({ active: false, updated_at: new Date() });
    }

    res.json({
      success: true,
      message: 'Left conversation successfully'
    });
  } catch (error) {
    logger.error('Leave conversation error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Add participant to conversation
// @route   POST /api/conversations/:id/participants
// @access  Private
router.post('/:id/participants', protect, async (req, res) => {
  try {
    const { userId, role = 'participant' } = req.body;

    // Check if user is admin of conversation
    const participant = await db('conversation_participants')
      .where('conversation_id', req.params.id)
      .where('user_id', req.user.id)
      .where('left_at', null)
      .first();

    if (!participant || (participant.role !== 'admin' && req.user.user_type !== 'admin')) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to add participants'
      });
    }

    // Check if user is already a participant
    const existingParticipant = await db('conversation_participants')
      .where('conversation_id', req.params.id)
      .where('user_id', userId)
      .first();

    if (existingParticipant) {
      if (existingParticipant.left_at) {
        // Re-join conversation
        await db('conversation_participants')
          .where('conversation_id', req.params.id)
          .where('user_id', userId)
          .update({ left_at: null });
      } else {
        return res.status(400).json({
          success: false,
          error: 'User is already a participant'
        });
      }
    } else {
      // Add new participant
      await db('conversation_participants').insert({
        conversation_id: req.params.id,
        user_id: userId,
        role
      });
    }

    res.json({
      success: true,
      message: 'Participant added successfully'
    });
  } catch (error) {
    logger.error('Add participant error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Remove participant from conversation
// @route   DELETE /api/conversations/:id/participants/:userId
// @access  Private
router.delete('/:id/participants/:userId', protect, async (req, res) => {
  try {
    // Check if user is admin of conversation
    const participant = await db('conversation_participants')
      .where('conversation_id', req.params.id)
      .where('user_id', req.user.id)
      .where('left_at', null)
      .first();

    if (!participant || (participant.role !== 'admin' && req.user.user_type !== 'admin')) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to remove participants'
      });
    }

    // Mark participant as left
    await db('conversation_participants')
      .where('conversation_id', req.params.id)
      .where('user_id', req.params.userId)
      .update({ left_at: new Date() });

    res.json({
      success: true,
      message: 'Participant removed successfully'
    });
  } catch (error) {
    logger.error('Remove participant error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;
