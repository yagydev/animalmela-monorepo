import { NextApiRequest, NextApiResponse } from 'next';
import { Service, User } from '../../../models';
import { protect, authorize } from '../../../middleware/auth';
import { connectDB } from '../../../lib/database';

// Connect to database
connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { services } = req.query;

  // Handle different routes based on the catch-all parameter
  if (Array.isArray(services)) {
    const [action, id] = services;
    
    switch (method) {
      case 'GET':
        if (action === 'types') {
          return await getServiceTypes(req, res);
        } else if (id) {
          req.query.id = id;
          return await getService(req, res);
        } else {
          return await getServices(req, res);
        }
      case 'POST':
        return await createService(req, res);
      case 'PUT':
        if (id) {
          req.query.id = id;
          return await updateService(req, res);
        }
        break;
      case 'DELETE':
        if (id) {
          req.query.id = id;
          return await deleteService(req, res);
        }
        break;
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).json({ success: false, error: `Method ${method} not allowed` });
    }
  } else {
    // Handle /api/services route
    switch (method) {
      case 'GET':
        return await getServices(req, res);
      case 'POST':
        return await createService(req, res);
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).json({ success: false, error: `Method ${method} not allowed` });
    }
  }
}

// @desc    Get all services with advanced filtering and pagination
// @route   GET /api/services
// @access  Public
async function getServices(req: NextApiRequest, res: NextApiResponse) {
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
    let query: any = {};

    // Apply filters
    if (serviceType) {
      query.service_type = serviceType;
    }

    if (verified !== undefined) {
      query.verified = verified === 'true';
    }

    if (active !== undefined) {
      query.active = active === 'true';
    }

    if (priceMin || priceMax) {
      query.price = {};
      if (priceMin) query.price.$gte = parseFloat(priceMin as string);
      if (priceMax) query.price.$lte = parseFloat(priceMax as string);
    }

    if (providerId) {
      query.provider_id = providerId;
    }

    // Text search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Sorting
    const sortOptions: any = {};
    sortOptions[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

    // Pagination
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const services = await Service.find(query)
      .populate('provider_id', 'name email phone avatar_url verified user_type')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit as string));

    const total = await Service.countDocuments(query);

    res.json({
      success: true,
      data: services,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Get single service by ID
// @route   GET /api/services/:id
// @access  Public
async function getService(req: NextApiRequest, res: NextApiResponse) {
  try {
    const serviceId = req.query.id as string;
    
    if (!serviceId) {
      return res.status(400).json({
        success: false,
        error: 'Service ID is required'
      });
    }

    const service = await Service.findById(serviceId)
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
    console.error('Get service error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Create new service
// @route   POST /api/services
// @access  Private (Service Provider or Admin)
async function createService(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Use protect middleware
    await new Promise((resolve, reject) => {
      protect(req, res, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });

    // Check authorization
    if (!['service_provider', 'admin'].includes(req.user.user_type)) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to create services'
      });
    }

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
    console.error('Create service error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private
async function updateService(req: NextApiRequest, res: NextApiResponse) {
  try {
    const serviceId = req.query.id as string;
    
    if (!serviceId) {
      return res.status(400).json({
        success: false,
        error: 'Service ID is required'
      });
    }

    // Use protect middleware
    await new Promise((resolve, reject) => {
      protect(req, res, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });

    const service = await Service.findById(serviceId);

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
      serviceId,
      updateData,
      { new: true, runValidators: true }
    ).populate('provider_id', 'name email phone avatar_url verified user_type');

    res.json({
      success: true,
      data: updatedService
    });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private
async function deleteService(req: NextApiRequest, res: NextApiResponse) {
  try {
    const serviceId = req.query.id as string;
    
    if (!serviceId) {
      return res.status(400).json({
        success: false,
        error: 'Service ID is required'
      });
    }

    // Use protect middleware
    await new Promise((resolve, reject) => {
      protect(req, res, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });

    const service = await Service.findById(serviceId);

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

    await Service.findByIdAndDelete(serviceId);

    res.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Get service types
// @route   GET /api/services/types
// @access  Public
async function getServiceTypes(req: NextApiRequest, res: NextApiResponse) {
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
    console.error('Get service types error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}
