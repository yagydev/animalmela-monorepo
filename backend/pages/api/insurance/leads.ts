const { NextApiRequest, NextApiResponse } = require('next');
const { InsuranceLead, User } = require('../../../models');
const { protect, authorize } = require('../../../middleware/auth');
const connectDB = require('../../../lib/mongodb');

// Connect to database
connectDB();

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'POST':
      return await createInsuranceLead(req, res);
      break;
    case 'GET':
      return await getInsuranceLeads(req, res);
      break;
    case 'PATCH':
      return await updateInsuranceLead(req, res);
      break;
    default:
      res.setHeader('Allow', ['POST', 'GET', 'PATCH']);
      res.status(405).json({ success: false, error: `Method ${method} not allowed` });
  }
}

// @desc    Create insurance lead
// @route   POST /api/insurance/leads
// @access  Private
async function createInsuranceLead(req, res) {
  try {
    // Use protect middleware
    await new Promise((resolve, reject) => {
      protect(req, res, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });

    const { animalInfo } = req.body;

    if (!animalInfo) {
      return res.status(400).json({
        success: false,
        error: 'Animal information is required'
      });
    }

    const insuranceLead = await InsuranceLead.create({
      userId: req.user._id,
      animalInfo
    });

    await insuranceLead.populate('userId', 'name mobile email role');

    res.status(201).json({
      success: true,
      message: 'Insurance lead created successfully',
      data: insuranceLead
    });
  } catch (error) {
    console.error('Create insurance lead error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Get insurance leads
// @route   GET /api/insurance/leads
// @access  Private
async function getInsuranceLeads(req, res) {
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
      // Admin can see all insurance leads
    } else {
      // Users can only see their own leads
      query.userId = req.user._id;
    }

    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const insuranceLeads = await InsuranceLead.find(query)
      .populate('userId', 'name mobile email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await InsuranceLead.countDocuments(query);

    res.json({
      success: true,
      data: insuranceLeads,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get insurance leads error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Update insurance lead
// @route   PATCH /api/insurance/leads
// @access  Private
async function updateInsuranceLead(req, res) {
  try {
    // Use protect middleware
    await new Promise((resolve, reject) => {
      protect(req, res, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });

    const { leadId, status, notes } = req.body;

    if (!leadId || !status) {
      return res.status(400).json({
        success: false,
        error: 'Lead ID and status are required'
      });
    }

    const insuranceLead = await InsuranceLead.findById(leadId);

    if (!insuranceLead) {
      return res.status(404).json({
        success: false,
        error: 'Insurance lead not found'
      });
    }

    // Check if user is admin or the lead owner
    if (req.user.role !== 'admin' && insuranceLead.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this insurance lead'
      });
    }

    const updateData = { status };
    if (notes) {
      updateData.notes = notes;
    }

    const updatedLead = await InsuranceLead.findByIdAndUpdate(
      leadId,
      updateData,
      { new: true }
    ).populate('userId', 'name mobile email role');

    res.json({
      success: true,
      message: 'Insurance lead updated successfully',
      data: updatedLead
    });
  } catch (error) {
    console.error('Update insurance lead error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}
