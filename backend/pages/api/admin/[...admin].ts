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
      if (admin && admin[0] === 'dashboard') {
        return await getDashboardStats(req, res);
      } else if (admin && admin[0] === 'users') {
        return await getUsers(req, res);
      } else if (admin && admin[0] === 'listings') {
        return await getListings(req, res);
      } else if (admin && admin[0] === 'orders') {
        return await getOrders(req, res);
      } else if (admin && admin[0] === 'categories') {
        return await getCategories(req, res);
      } else if (admin && admin[0] === 'reports') {
        return await getReports(req, res);
      } else if (admin && admin[0] === 'mod' && admin[1] === 'queue') {
        return await getModerationQueue(req, res);
      }
      break;
    case 'POST':
      if (admin && admin[0] === 'categories') {
        return await createCategory(req, res);
      } else if (admin && admin[0] === 'notifications') {
        return await sendNotification(req, res);
      }
      break;
    case 'PATCH':
      if (admin && admin[0] === 'users' && admin[1]) {
        return await updateUser(req, res);
      } else if (admin && admin[0] === 'listings' && admin[1]) {
        return await moderateListing(req, res);
      } else if (admin && admin[0] === 'categories' && admin[1]) {
        return await updateCategory(req, res);
      }
      break;
    case 'DELETE':
      if (admin && admin[0] === 'categories' && admin[1]) {
        return await deleteCategory(req, res);
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PATCH', 'DELETE']);
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

    let updateData: any = {};

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

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private (Admin only)
async function getDashboardStats(req, res) {
  try {
    await new Promise((resolve, reject) => {
      protect(req, res, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access dashboard'
      });
    }

    const [
      totalUsers,
      totalListings,
      totalOrders,
      totalLeads,
      totalVetRequests,
      totalInsuranceLeads
    ] = await Promise.all([
      User.countDocuments(),
      Listing.countDocuments(),
      Order.countDocuments(),
      Lead.countDocuments(),
      VetRequest.countDocuments(),
      InsuranceLead.countDocuments()
    ]);

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentUsers = await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
    const recentListings = await Listing.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
    const recentOrders = await Order.countDocuments({ createdAt: { $gte: sevenDaysAgo } });

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
        }
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Get users with filtering
// @route   GET /api/admin/users
// @access  Private (Admin only)
async function getUsers(req, res) {
  try {
    await new Promise((resolve, reject) => {
      protect(req, res, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access users'
      });
    }

    const { page = 1, limit = 20, role, search } = req.query;
    
    let query: any = {};
    
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit as string));
    
    const total = await User.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Get listings with filtering
// @route   GET /api/admin/listings
// @access  Private (Admin only)
async function getListings(req, res) {
  try {
    await new Promise((resolve, reject) => {
      protect(req, res, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access listings'
      });
    }

    const { page = 1, limit = 20, category, status, search } = req.query;
    
    let query: any = {};
    
    if (category) query.category = category;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    
    const listings = await Listing.find(query)
      .populate('sellerId', 'name email mobile')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit as string));
    
    const total = await Listing.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: listings,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    console.error('Get listings error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Get orders with filtering
// @route   GET /api/admin/orders
// @access  Private (Admin only)
async function getOrders(req, res) {
  try {
    await new Promise((resolve, reject) => {
      protect(req, res, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access orders'
      });
    }

    const { page = 1, limit = 20, status, paymentStatus } = req.query;
    
    let query: any = {};
    
    if (status) query.status = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    
    const orders = await Order.find(query)
      .populate('buyerId', 'name email mobile')
      .populate('sellerId', 'name email mobile')
      .populate('listingId', 'title category')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit as string));
    
    const total = await Order.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Get categories
// @route   GET /api/admin/categories
// @access  Private (Admin only)
async function getCategories(req, res) {
  try {
    await new Promise((resolve, reject) => {
      protect(req, res, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access categories'
      });
    }

    // For now, return predefined categories
    const categories = [
      { _id: 'crops', name: 'Crops', subcategories: ['wheat', 'rice', 'corn', 'vegetables', 'fruits'] },
      { _id: 'livestock', name: 'Livestock', subcategories: ['cattle', 'goats', 'sheep', 'poultry', 'pigs'] },
      { _id: 'seeds', name: 'Seeds', subcategories: ['crop_seeds', 'vegetable_seeds', 'flower_seeds'] },
      { _id: 'fertilizers', name: 'Fertilizers', subcategories: ['organic', 'chemical', 'bio_fertilizers'] },
      { _id: 'equipment', name: 'Equipment', subcategories: ['tractors', 'irrigation', 'harvesting', 'planting'] },
      { _id: 'tools', name: 'Tools', subcategories: ['hand_tools', 'power_tools', 'garden_tools'] },
      { _id: 'feed', name: 'Feed', subcategories: ['cattle_feed', 'poultry_feed', 'fish_feed'] },
      { _id: 'other', name: 'Other', subcategories: ['miscellaneous'] }
    ];
    
    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Create category
// @route   POST /api/admin/categories
// @access  Private (Admin only)
async function createCategory(req, res) {
  try {
    await new Promise((resolve, reject) => {
      protect(req, res, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to create categories'
      });
    }

    const { name, subcategories } = req.body;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Category name is required'
      });
    }
    
    // In a real implementation, you would create a new category in the database
    const newCategory = {
      _id: name.toLowerCase().replace(/\s+/g, '_'),
      name,
      subcategories: subcategories || [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    res.status(201).json({
      success: true,
      data: newCategory,
      message: 'Category created successfully'
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Update category
// @route   PATCH /api/admin/categories/:id
// @access  Private (Admin only)
async function updateCategory(req, res) {
  try {
    await new Promise((resolve, reject) => {
      protect(req, res, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update categories'
      });
    }

    const { id } = req.query;
    const { name, subcategories } = req.body;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Category ID is required'
      });
    }
    
    // In a real implementation, you would update the category in the database
    const updatedCategory = {
      _id: id,
      name: name || 'Updated Category',
      subcategories: subcategories || [],
      updatedAt: new Date()
    };
    
    res.status(200).json({
      success: true,
      data: updatedCategory,
      message: 'Category updated successfully'
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Delete category
// @route   DELETE /api/admin/categories/:id
// @access  Private (Admin only)
async function deleteCategory(req, res) {
  try {
    await new Promise((resolve, reject) => {
      protect(req, res, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete categories'
      });
    }

    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Category ID is required'
      });
    }
    
    // In a real implementation, you would delete the category from the database
    // and handle any listings that use this category
    
    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Update user
// @route   PATCH /api/admin/users/:id
// @access  Private (Admin only)
async function updateUser(req, res) {
  try {
    await new Promise((resolve, reject) => {
      protect(req, res, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update users'
      });
    }

    const { id } = req.query;
    const { role, kyc } = req.body;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }
    
    const updateData: any = {};
    if (role) updateData.role = role;
    if (kyc) updateData.kyc = kyc;
    
    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: updatedUser,
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Send notification
// @route   POST /api/admin/notifications
// @access  Private (Admin only)
async function sendNotification(req, res) {
  try {
    await new Promise((resolve, reject) => {
      protect(req, res, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to send notifications'
      });
    }

    const { targetUsers, type, title, message, channels } = req.body;
    
    if (!targetUsers || !type || !title || !message) {
      return res.status(400).json({
        success: false,
        error: 'Target users, type, title, and message are required'
      });
    }
    
    // In a real implementation, you would send notifications to multiple users
    const results = [];
    
    for (const userId of targetUsers) {
      try {
        // Send notification logic here
        results.push({ userId, success: true });
      } catch (error) {
        results.push({ userId, success: false, error: error.message });
      }
    }
    
    res.status(200).json({
      success: true,
      message: 'Notifications sent successfully',
      results
    });
  } catch (error) {
    console.error('Send notification error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}
