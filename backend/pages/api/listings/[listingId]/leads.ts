const { NextApiRequest, NextApiResponse } = require('next');
const { Lead, Listing, User } = require('../../../../models');
const { protect } = require('../../../../middleware/auth');
const connectDB = require('../../../../lib/mongodb');

// Connect to database
connectDB();

export default async function handler(req, res) {
  const { method } = req;
  const { listingId } = req.query;

  switch (method) {
    case 'POST':
      if (listingId) {
        return await createLead(req, res);
      }
      break;
    case 'GET':
      return await getLeads(req, res);
      break;
    default:
      res.setHeader('Allow', ['POST', 'GET']);
      res.status(405).json({ success: false, error: `Method ${method} not allowed` });
  }
}

// @desc    Create lead for a listing
// @route   POST /api/listings/:listingId/leads
// @access  Private
async function createLead(req, res) {
  try {
    // Use protect middleware
    await new Promise((resolve, reject) => {
      protect(req, res, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });

    const { message, channel = 'chat' } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }

    // Check if listing exists
    const listing = await Listing.findById(req.query.listingId);
    if (!listing) {
      return res.status(404).json({
        success: false,
        error: 'Listing not found'
      });
    }

    // Check if user is not the seller
    if (listing.sellerId.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        error: 'Cannot create lead for your own listing'
      });
    }

    const lead = await Lead.create({
      listingId: req.query.listingId,
      buyerId: req.user._id,
      message,
      channel
    });

    await lead.populate('buyerId', 'name mobile email role');
    await lead.populate('listingId', 'species breed price');

    res.status(201).json({
      success: true,
      data: lead
    });
  } catch (error) {
    console.error('Create lead error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Get leads for user
// @route   GET /api/leads
// @access  Private
async function getLeads(req, res) {
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

    // If user is seller, get leads for their listings
    if (req.user.role === 'seller') {
      const userListings = await Listing.find({ sellerId: req.user._id }).select('_id');
      const listingIds = userListings.map(listing => listing._id);
      query.listingId = { $in: listingIds };
    } else {
      // If user is buyer, get their leads
      query.buyerId = req.user._id;
    }

    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const leads = await Lead.find(query)
      .populate('buyerId', 'name mobile email role')
      .populate('listingId', 'species breed price')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Lead.countDocuments(query);

    res.json({
      success: true,
      data: leads,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}
