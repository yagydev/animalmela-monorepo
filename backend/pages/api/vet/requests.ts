const { NextApiRequest, NextApiResponse } = require('next');
const { VetRequest, User } = require('../../../models');
const { protect, authorize } = require('../../../middleware/auth');
const connectDB = require('../../../lib/mongodb');

// Connect to database
connectDB();

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'POST':
      return await createVetRequest(req, res);
      break;
    case 'GET':
      return await getVetRequests(req, res);
      break;
    case 'PATCH':
      return await updateVetRequest(req, res);
      break;
    default:
      res.setHeader('Allow', ['POST', 'GET', 'PATCH']);
      res.status(405).json({ success: false, error: `Method ${method} not allowed` });
  }
}

// @desc    Create vet request
// @route   POST /api/vet/requests
// @access  Private
async function createVetRequest(req, res) {
  try {
    // Use protect middleware
    await new Promise((resolve, reject) => {
      protect(req, res, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });

    const { issue, attachments = [] } = req.body;

    if (!issue) {
      return res.status(400).json({
        success: false,
        error: 'Issue description is required'
      });
    }

    const vetRequest = await VetRequest.create({
      userId: req.user._id,
      issue,
      attachments
    });

    await vetRequest.populate('userId', 'name mobile email role');

    res.status(201).json({
      success: true,
      message: 'Vet request created successfully',
      data: vetRequest
    });
  } catch (error) {
    console.error('Create vet request error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Get vet requests
// @route   GET /api/vet/requests
// @access  Private
async function getVetRequests(req, res) {
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
    if (req.user.role === 'admin') {
      // Admin can see all vet requests
    } else {
      // Users can only see their own requests
      query.userId = req.user._id;
    }

    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const vetRequests = await VetRequest.find(query)
      .populate('userId', 'name mobile email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await VetRequest.countDocuments(query);

    res.json({
      success: true,
      data: vetRequests,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get vet requests error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Update vet request
// @route   PATCH /api/vet/requests
// @access  Private
async function updateVetRequest(req, res) {
  try {
    // Use protect middleware
    await new Promise((resolve, reject) => {
      protect(req, res, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });

    const { requestId, status, response } = req.body;

    if (!requestId || !status) {
      return res.status(400).json({
        success: false,
        error: 'Request ID and status are required'
      });
    }

    const vetRequest = await VetRequest.findById(requestId);

    if (!vetRequest) {
      return res.status(404).json({
        success: false,
        error: 'Vet request not found'
      });
    }

    // Check if user is admin or the request owner
    if (req.user.role !== 'admin' && vetRequest.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this vet request'
      });
    }

    const updateData = { status };
    if (response) {
      updateData.response = response;
    }

    const updatedRequest = await VetRequest.findByIdAndUpdate(
      requestId,
      updateData,
      { new: true }
    ).populate('userId', 'name mobile email role');

    res.json({
      success: true,
      message: 'Vet request updated successfully',
      data: updatedRequest
    });
  } catch (error) {
    console.error('Update vet request error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}
