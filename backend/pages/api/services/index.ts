import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../../../lib/database';
import { Service } from '../../../models';

// Connect to database
connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

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

// @desc    Get all services
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

// @desc    Create new service
// @route   POST /api/services
// @access  Private (Service Provider or Admin)
async function createService(req: NextApiRequest, res: NextApiResponse) {
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
      provider_id: '507f1f77bcf86cd799439011', // Mock user ID for now
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
