const { NextApiRequest, NextApiResponse } = require('next');
const { AdminAction, Listing, User, Order, Lead, VetRequest, InsuranceLead } = require('../../../models');
const { protect, authorize } = require('../../../middleware/auth');
const connectDB = require('../../../lib/mongodb');

// Connect to database
connectDB();

export default async function handler(req, res) {
  const { method } = req;
  const { admin } = req.query;

  switch (method) {
    case 'GET':
      if (admin && admin[0] === 'mod' && admin[1] === 'queue') {
        return await getModerationQueue(req, res);
      } else if (admin && admin[0] === 'reports') {
        return await getAdminReports(req, res);
      }
      break;
    case 'PATCH':
      if (admin && admin[0] === 'listings' && admin[1]) {
        return await moderateListing(req, res);
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'PATCH']);
      res.status(405).json({ success: false, error: `Method ${method} not allowed` });
  }
}

// @desc    Get moderation queue
// @route   GET /api/admin/mod/queue
// @access  Private (Admin only)
async function getModerationQueue(req, res) {
  try {
    // Use protect middleware
    await new Promise((resolve, reject) => {
      protect(req, res, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access moderation queue'
      });
    }

    const { page = 1, limit = 10, type = 'all' } = req.query;

    let query = {};

    // Get unverified listings
    if (type === 'listings' || type === 'all') {
      const unverifiedListings = await Listing.find({ verified: false })
        .populate('sellerId', 'name mobile email role')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit));

      return res.json({
        success: true,
        data: {
          listings: unverifiedListings,
          type: 'listings'
        },
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit)
        }
      });
    }

    // Get pending vet requests
    if (type === 'vet' || type === 'all') {
      const pendingVetRequests = await VetRequest.find({ status: 'new' })
        .populate('userId', 'name mobile email role')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit));

      return res.json({
        success: true,
        data: {
          vetRequests: pendingVetRequests,
          type: 'vet'
        },
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit)
        }
      });
    }

    // Get pending insurance leads
    if (type === 'insurance' || type === 'all') {
      const pendingInsuranceLeads = await InsuranceLead.find({ status: 'new' })
        .populate('userId', 'name mobile email role')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit));

      return res.json({
        success: true,
        data: {
          insuranceLeads: pendingInsuranceLeads,
          type: 'insurance'
        },
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit)
        }
      });
    }

    res.json({
      success: true,
      data: [],
      message: 'No items in moderation queue'
    });
  } catch (error) {
    console.error('Get moderation queue error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Moderate listing
// @route   PATCH /api/admin/listings/:id/moderate
// @access  Private (Admin only)
async function moderateListing(req, res) {
  try {
    // Use protect middleware
    await new Promise((resolve, reject) => {
      protect(req, res, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to moderate listings'
      });
    }

    const { action, reason } = req.body;
    const listingId = req.query.admin[1];

    if (!action || !reason) {
      return res.status(400).json({
        success: false,
        error: 'Action and reason are required'
      });
    }

    const listing = await Listing.findById(listingId);

    if (!listing) {
      return res.status(404).json({
        success: false,
        error: 'Listing not found'
      });
    }

    let updateData = {};

    if (action === 'approve') {
      updateData.verified = true;
      updateData.status = 'active';
    } else if (action === 'reject') {
      updateData.verified = false;
      updateData.status = 'paused';
    } else if (action === 'ban') {
      updateData.status = 'paused';
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      listingId,
      updateData,
      { new: true }
    ).populate('sellerId', 'name mobile email role');

    // Log admin action
    await AdminAction.create({
      actor: req.user._id,
      type: `listing_${action}`,
      targetId: listingId,
      reason
    });

    res.json({
      success: true,
      message: `Listing ${action}d successfully`,
      data: updatedListing
    });
  } catch (error) {
    console.error('Moderate listing error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Get admin reports
// @route   GET /api/admin/reports
// @access  Private (Admin only)
async function getAdminReports(req, res) {
  try {
    // Use protect middleware
    await new Promise((resolve, reject) => {
      protect(req, res, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access admin reports'
      });
    }

    const { period = '30d' } = req.query;

    // Calculate date range
    const now = new Date();
    let startDate;
    
    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get statistics
    const [
      totalUsers,
      totalListings,
      totalOrders,
      totalLeads,
      totalVetRequests,
      totalInsuranceLeads,
      recentUsers,
      recentListings,
      recentOrders
    ] = await Promise.all([
      User.countDocuments(),
      Listing.countDocuments(),
      Order.countDocuments(),
      Lead.countDocuments(),
      VetRequest.countDocuments(),
      InsuranceLead.countDocuments(),
      User.countDocuments({ createdAt: { $gte: startDate } }),
      Listing.countDocuments({ createdAt: { $gte: startDate } }),
      Order.countDocuments({ createdAt: { $gte: startDate } })
    ]);

    // Get user role distribution
    const userRoles = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    // Get listing status distribution
    const listingStatus = await Listing.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Get order status distribution
    const orderStatus = await Order.aggregate([
      { $group: { _id: '$paymentStatus', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalListings,
          totalOrders,
          totalLeads,
          totalVetRequests,
          totalInsuranceLeads
        },
        recentActivity: {
          recentUsers,
          recentListings,
          recentOrders
        },
        distributions: {
          userRoles,
          listingStatus,
          orderStatus
        },
        period
      }
    });
  } catch (error) {
    console.error('Get admin reports error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}
