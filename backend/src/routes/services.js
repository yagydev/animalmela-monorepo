const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const { Service, User } = require('../../config/database');
const { protect, authorize } = require('../middleware/auth');
const { logger } = require('../utils/logger');

const router = express.Router();

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// @desc    Get all services with advanced filtering and pagination
// @route   GET /api/services
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('serviceType').optional().isIn([
    'pet_sitting', 'dog_walking', 'grooming', 'training', 'veterinary',
    'boarding', 'pet_taxi', 'pet_photography', 'pet_massage', 'pet_yoga', 'other'
  ]).withMessage('Invalid service type'),
  query('verified').optional().isBoolean().withMessage('Verified must be boolean'),
  query('active').optional().isBoolean().withMessage('Active must be boolean'),
  query('priceMin').optional().isFloat({ min: 0 }).withMessage('Price min must be non-negative'),
  query('priceMax').optional().isFloat({ min: 0 }).withMessage('Price max must be non-negative'),
  query('providerId').optional().isMongoId().withMessage('Invalid provider ID'),
  handleValidationErrors
], async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      serviceType,
      verified,
      active,
      priceMin,
      priceMax,
      providerId,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    let query = Service.find();

    // Apply filters
    if (serviceType) {
      query = query.where('service_type', serviceType);
    }

    if (verified !== undefined) {
      query = query.where('verified', verified === 'true');
    }

    if (active !== undefined) {
      query = query.where('active', active === 'true');
    }

    if (priceMin || priceMax) {
      const priceFilter = {};
      if (priceMin) priceFilter.$gte = parseFloat(priceMin);
      if (priceMax) priceFilter.$lte = parseFloat(priceMax);
      query = query.where('price', priceFilter);
    }

    if (providerId) {
      query = query.where('provider_id', providerId);
    }

    // Text search
    if (search) {
      query = query.where({
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      });
    }

    // Sorting
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    query = query.sort(sortOptions);

    // Pagination
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(parseInt(limit));

    // Populate provider information
    query = query.populate('provider_id', 'name email phone avatar_url verified user_type');

    const services = await query.exec();

    // Get total count for pagination
    const totalQuery = Service.find();
    if (serviceType) totalQuery.where('service_type', serviceType);
    if (verified !== undefined) totalQuery.where('verified', verified === 'true');
    if (active !== undefined) totalQuery.where('active', active === 'true');
    if (priceMin || priceMax) {
      const priceFilter = {};
      if (priceMin) priceFilter.$gte = parseFloat(priceMin);
      if (priceMax) priceFilter.$lte = parseFloat(priceMax);
      totalQuery.where('price', priceFilter);
    }
    if (providerId) totalQuery.where('provider_id', providerId);
    if (search) {
      totalQuery.where({
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      });
    }

    const total = await totalQuery.countDocuments();

    res.json({
      success: true,
      data: services,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Get services error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get single service by ID
// @route   GET /api/services/:id
// @access  Public
router.get('/:id', [
  param('id').isMongoId().withMessage('Invalid service ID'),
  handleValidationErrors
], async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('provider_id', 'name email phone avatar_url verified user_type');

    if (!service) {
      return res.status(404).json({
        success: false,
        error: 'Service not found'
      });
    }

    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    logger.error('Get service error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Create new service
// @route   POST /api/services
// @access  Private (Service Provider or Admin)
router.post('/', [
  protect,
  authorize('service_provider', 'admin'),
  body('title').trim().isLength({ min: 3, max: 255 }).withMessage('Title must be between 3 and 255 characters'),
  body('description').optional().trim().isLength({ max: 2000 }).withMessage('Description must be less than 2000 characters'),
  body('serviceType').isIn([
    'pet_sitting', 'dog_walking', 'grooming', 'training', 'veterinary',
    'boarding', 'pet_taxi', 'pet_photography', 'pet_massage', 'pet_yoga', 'other'
  ]).withMessage('Invalid service type'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be non-negative'),
  body('currency').optional().isLength({ min: 3, max: 3 }).withMessage('Currency must be 3 characters'),
  body('location.lat').optional().isFloat().withMessage('Latitude must be a number'),
  body('location.lng').optional().isFloat().withMessage('Longitude must be a number'),
  body('location.address').optional().trim().isLength({ max: 500 }).withMessage('Address must be less than 500 characters'),
  body('serviceAreas').optional().isArray().withMessage('Service areas must be an array'),
  body('requirements').optional().isObject().withMessage('Requirements must be an object'),
  body('features').optional().isArray().withMessage('Features must be an array'),
  body('policies').optional().isObject().withMessage('Policies must be an object'),
  body('included').optional().isArray().withMessage('Included must be an array'),
  body('notIncluded').optional().isArray().withMessage('Not included must be an array'),
  handleValidationErrors
], async (req, res) => {
  try {
    const {
      title,
      description,
      serviceType,
      price,
      currency = 'USD',
      location,
      availability = {},
      serviceAreas = [],
      requirements = {},
      features = [],
      policies = {},
      included = [],
      notIncluded = []
    } = req.body;

    const serviceData = {
      provider_id: req.user._id,
      title,
      description,
      service_type: serviceType,
      price,
      currency,
      location,
      availability,
      service_areas: serviceAreas,
      requirements,
      features,
      policies,
      included,
      not_included: notIncluded,
      verified: false,
      active: true
    };

    const service = await Service.create(serviceData);
    await service.populate('provider_id', 'name email phone avatar_url verified user_type');

    res.status(201).json({
      success: true,
      data: service
    });
  } catch (error) {
    logger.error('Create service error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private
router.put('/:id', [
  protect,
  param('id').isMongoId().withMessage('Invalid service ID'),
  body('title').optional().trim().isLength({ min: 3, max: 255 }).withMessage('Title must be between 3 and 255 characters'),
  body('description').optional().trim().isLength({ max: 2000 }).withMessage('Description must be less than 2000 characters'),
  body('serviceType').optional().isIn([
    'pet_sitting', 'dog_walking', 'grooming', 'training', 'veterinary',
    'boarding', 'pet_taxi', 'pet_photography', 'pet_massage', 'pet_yoga', 'other'
  ]).withMessage('Invalid service type'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be non-negative'),
  body('currency').optional().isLength({ min: 3, max: 3 }).withMessage('Currency must be 3 characters'),
  body('location.lat').optional().isFloat().withMessage('Latitude must be a number'),
  body('location.lng').optional().isFloat().withMessage('Longitude must be a number'),
  body('location.address').optional().trim().isLength({ max: 500 }).withMessage('Address must be less than 500 characters'),
  body('serviceAreas').optional().isArray().withMessage('Service areas must be an array'),
  body('requirements').optional().isObject().withMessage('Requirements must be an object'),
  body('features').optional().isArray().withMessage('Features must be an array'),
  body('policies').optional().isObject().withMessage('Policies must be an object'),
  body('included').optional().isArray().withMessage('Included must be an array'),
  body('notIncluded').optional().isArray().withMessage('Not included must be an array'),
  body('active').optional().isBoolean().withMessage('Active must be boolean'),
  handleValidationErrors
], async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        error: 'Service not found'
      });
    }

    // Check ownership or admin
    if (service.provider_id.toString() !== req.user._id.toString() && req.user.user_type !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this service'
      });
    }

    const updateData = { ...req.body };
    
    // Map frontend field names to database field names
    if (updateData.serviceType) updateData.service_type = updateData.serviceType;
    if (updateData.serviceAreas) updateData.service_areas = updateData.serviceAreas;
    if (updateData.notIncluded) updateData.not_included = updateData.notIncluded;

    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('provider_id', 'name email phone avatar_url verified user_type');

    res.json({
      success: true,
      data: updatedService
    });
  } catch (error) {
    logger.error('Update service error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private
router.delete('/:id', [
  protect,
  param('id').isMongoId().withMessage('Invalid service ID'),
  handleValidationErrors
], async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        error: 'Service not found'
      });
    }

    // Check ownership or admin
    if (service.provider_id.toString() !== req.user._id.toString() && req.user.user_type !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this service'
      });
    }

    await Service.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    logger.error('Delete service error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Upload service photos
// @route   POST /api/services/:id/photos
// @access  Private
router.post('/:id/photos', [
  protect,
  param('id').isMongoId().withMessage('Invalid service ID'),
  handleValidationErrors
], async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        error: 'Service not found'
      });
    }

    // Check ownership or admin
    if (service.provider_id.toString() !== req.user._id.toString() && req.user.user_type !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to upload photos for this service'
      });
    }

    // Handle file uploads (assuming multer middleware is used)
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No files uploaded'
      });
    }

    // For now, we'll simulate photo URLs (in real implementation, upload to S3)
    const photoUrls = req.files.map(file => `/uploads/services/${file.filename}`);

    // Update service with photo URLs
    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      { 
        $push: { photos: { $each: photoUrls } },
        updatedAt: new Date()
      },
      { new: true }
    ).populate('provider_id', 'name email phone avatar_url verified user_type');

    res.status(201).json({
      success: true,
      data: { photos: photoUrls },
      service: updatedService
    });
  } catch (error) {
    logger.error('Upload service photos error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get service types
// @route   GET /api/services/types
// @access  Public
router.get('/types', async (req, res) => {
  try {
    const serviceTypes = [
      { value: 'pet_sitting', label: 'Pet Sitting', icon: '🏠', description: 'In-home pet sitting services' },
      { value: 'dog_walking', label: 'Dog Walking', icon: '🐕', description: 'Regular walks and exercise' },
      { value: 'grooming', label: 'Pet Grooming', icon: '✂️', description: 'Professional grooming services' },
      { value: 'training', label: 'Pet Training', icon: '🎓', description: 'Behavioral training and obedience' },
      { value: 'veterinary', label: 'Veterinary Care', icon: '🏥', description: 'Medical care and checkups' },
      { value: 'boarding', label: 'Pet Boarding', icon: '🏨', description: 'Overnight care facilities' },
      { value: 'pet_taxi', label: 'Pet Transportation', icon: '🚗', description: 'Safe pet transportation' },
      { value: 'pet_photography', label: 'Pet Photography', icon: '📸', description: 'Professional pet photos' },
      { value: 'pet_massage', label: 'Pet Massage', icon: '💆', description: 'Therapeutic massage services' },
      { value: 'pet_yoga', label: 'Pet Yoga', icon: '🧘', description: 'Yoga sessions for pets' },
      { value: 'other', label: 'Other Services', icon: '🐾', description: 'Custom pet care services' }
    ];

    res.json({
      success: true,
      data: serviceTypes
    });
  } catch (error) {
    logger.error('Get service types error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get services by provider
// @route   GET /api/services/provider/:providerId
// @access  Public
router.get('/provider/:providerId', [
  param('providerId').isMongoId().withMessage('Invalid provider ID'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { providerId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const services = await Service.find({ provider_id: providerId })
      .populate('provider_id', 'name email phone avatar_url verified user_type')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Service.countDocuments({ provider_id: providerId });

    res.json({
      success: true,
      data: services,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Get services by provider error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Toggle service active status
// @route   PATCH /api/services/:id/toggle-active
// @access  Private
router.patch('/:id/toggle-active', [
  protect,
  param('id').isMongoId().withMessage('Invalid service ID'),
  handleValidationErrors
], async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        error: 'Service not found'
      });
    }

    // Check ownership or admin
    if (service.provider_id.toString() !== req.user._id.toString() && req.user.user_type !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to modify this service'
      });
    }

    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      { active: !service.active },
      { new: true }
    ).populate('provider_id', 'name email phone avatar_url verified user_type');

    res.json({
      success: true,
      data: updatedService,
      message: `Service ${updatedService.active ? 'activated' : 'deactivated'} successfully`
    });
  } catch (error) {
    logger.error('Toggle service active status error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;