import { NextApiRequest, NextApiResponse } from 'next';
import { TransportService, User } from '../../../../models';
import { protect, authorize } from '../../../../middleware/auth';
import { connectDB } from '../../../../lib/database';

// Connect to database
connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      if (req.url === '/api/services/transport') {
        return await getTransportServices(req, res);
      } else if (req.url?.startsWith('/api/services/transport/') && req.url !== '/api/services/transport/provider') {
        return await getTransportService(req, res);
      } else if (req.url?.startsWith('/api/services/transport/provider/')) {
        return await getTransportServicesByProvider(req, res);
      }
      break;
    case 'POST':
      if (req.url === '/api/services/transport') {
        return await createTransportService(req, res);
      }
      break;
    case 'PUT':
      if (req.url?.startsWith('/api/services/transport/')) {
        return await updateTransportService(req, res);
      }
      break;
    case 'DELETE':
      if (req.url?.startsWith('/api/services/transport/')) {
        return await deleteTransportService(req, res);
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).json({ success: false, error: `Method ${method} not allowed` });
  }
}

// @desc    Get all transport services with filtering
// @route   GET /api/services/transport
// @access  Public
async function getTransportServices(req: NextApiRequest, res: NextApiResponse) {
  try {
    const {
      page = 1,
      limit = 10,
      vehicleType,
      serviceArea,
      priceMin,
      priceMax,
      capacity,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    let query: any = { active: true };

    if (vehicleType) {
      query.vehicle_type = vehicleType;
    }

    if (serviceArea) {
      query.service_areas = { $in: [serviceArea] };
    }

    if (priceMin || priceMax) {
      query['pricing.per_km'] = {};
      if (priceMin) query['pricing.per_km'].$gte = parseFloat(priceMin as string);
      if (priceMax) query['pricing.per_km'].$lte = parseFloat(priceMax as string);
    }

    if (capacity) {
      query['capacity.max_animals'] = { $gte: parseInt(capacity as string) };
    }

    if (search) {
      query.$or = [
        { service_name: { $regex: search, $options: 'i' } },
        { service_areas: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const sortOptions: any = {};
    sortOptions[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const services = await TransportService.find(query)
      .populate('provider_id', 'name email phone avatar_url verified user_type location business_info')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit as string));

    const total = await TransportService.countDocuments(query);

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
    console.error('Get transport services error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Get single transport service by ID
// @route   GET /api/services/transport/:id
// @access  Public
async function getTransportService(req: NextApiRequest, res: NextApiResponse) {
  try {
    const serviceId = req.url?.split('/')[4];
    
    if (!serviceId) {
      return res.status(400).json({
        success: false,
        error: 'Service ID is required'
      });
    }

    const service = await TransportService.findById(serviceId)
      .populate('provider_id', 'name email phone avatar_url verified user_type location business_info');

    if (!service) {
      return res.status(404).json({
        success: false,
        error: 'Transport service not found'
      });
    }

    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Get transport service error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Get transport services by provider
// @route   GET /api/services/transport/provider/:providerId
// @access  Public
async function getTransportServicesByProvider(req: NextApiRequest, res: NextApiResponse) {
  try {
    const providerId = req.url?.split('/')[5];
    
    if (!providerId) {
      return res.status(400).json({
        success: false,
        error: 'Provider ID is required'
      });
    }

    const services = await TransportService.find({ 
      provider_id: providerId,
      active: true 
    }).populate('provider_id', 'name email phone avatar_url verified user_type');

    res.json({
      success: true,
      data: services
    });
  } catch (error) {
    console.error('Get transport services by provider error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Create new transport service
// @route   POST /api/services/transport
// @access  Private (Transport Provider or Admin)
async function createTransportService(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Use protect middleware
    await new Promise((resolve, reject) => {
      protect(req, res, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });

    // Check authorization
    if (!['transport_provider', 'admin'].includes(req.user.user_type)) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to create transport services'
      });
    }

    const {
      serviceName,
      vehicleType,
      capacity,
      serviceAreas,
      pricing,
      availability,
      certifications,
      insuranceCoverage
    } = req.body;

    const serviceData = {
      provider_id: req.user._id,
      service_name: serviceName,
      vehicle_type: vehicleType,
      capacity,
      service_areas: serviceAreas,
      pricing,
      availability,
      certifications,
      insurance_coverage: insuranceCoverage,
      active: true
    };

    const service = await TransportService.create(serviceData);
    await service.populate('provider_id', 'name email phone avatar_url verified user_type');

    res.status(201).json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Create transport service error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Update transport service
// @route   PUT /api/services/transport/:id
// @access  Private
async function updateTransportService(req: NextApiRequest, res: NextApiResponse) {
  try {
    const serviceId = req.url?.split('/')[4];
    
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

    const service = await TransportService.findById(serviceId);

    if (!service) {
      return res.status(404).json({
        success: false,
        error: 'Transport service not found'
      });
    }

    // Check ownership or admin
    if (service.provider_id.toString() !== req.user._id.toString() && req.user.user_type !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this transport service'
      });
    }

    const updateData = { ...req.body };
    
    // Map frontend field names to database field names
    if (updateData.serviceName) updateData.service_name = updateData.serviceName;
    if (updateData.vehicleType) updateData.vehicle_type = updateData.vehicleType;
    if (updateData.serviceAreas) updateData.service_areas = updateData.serviceAreas;
    if (updateData.insuranceCoverage) updateData.insurance_coverage = updateData.insuranceCoverage;

    const updatedService = await TransportService.findByIdAndUpdate(
      serviceId,
      updateData,
      { new: true, runValidators: true }
    ).populate('provider_id', 'name email phone avatar_url verified user_type');

    res.json({
      success: true,
      data: updatedService
    });
  } catch (error) {
    console.error('Update transport service error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Delete transport service
// @route   DELETE /api/services/transport/:id
// @access  Private
async function deleteTransportService(req: NextApiRequest, res: NextApiResponse) {
  try {
    const serviceId = req.url?.split('/')[4];
    
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

    const service = await TransportService.findById(serviceId);

    if (!service) {
      return res.status(404).json({
        success: false,
        error: 'Transport service not found'
      });
    }

    // Check ownership or admin
    if (service.provider_id.toString() !== req.user._id.toString() && req.user.user_type !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this transport service'
      });
    }

    await TransportService.findByIdAndDelete(serviceId);

    res.json({
      success: true,
      message: 'Transport service deleted successfully'
    });
  } catch (error) {
    console.error('Delete transport service error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

