import { NextApiRequest, NextApiResponse } from 'next';
import { VeterinaryService, User } from '../../../../models';
import { protect, authorize } from '../../../../middleware/auth';
import { connectDB } from '../../../../lib/database';

// Connect to database
connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      if (req.url === '/api/services/veterinary') {
        return await getVeterinaryServices(req, res);
      } else if (req.url?.startsWith('/api/services/veterinary/') && req.url !== '/api/services/veterinary/provider') {
        return await getVeterinaryService(req, res);
      } else if (req.url?.startsWith('/api/services/veterinary/provider/')) {
        return await getVeterinaryServicesByProvider(req, res);
      }
      break;
    case 'POST':
      if (req.url === '/api/services/veterinary') {
        return await createVeterinaryService(req, res);
      }
      break;
    case 'PUT':
      if (req.url?.startsWith('/api/services/veterinary/')) {
        return await updateVeterinaryService(req, res);
      }
      break;
    case 'DELETE':
      if (req.url?.startsWith('/api/services/veterinary/')) {
        return await deleteVeterinaryService(req, res);
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).json({ success: false, error: `Method ${method} not allowed` });
  }
}

// @desc    Get all veterinary services with filtering
// @route   GET /api/services/veterinary
// @access  Public
async function getVeterinaryServices(req: NextApiRequest, res: NextApiResponse) {
  try {
    const {
      page = 1,
      limit = 10,
      specialization,
      serviceOffered,
      serviceArea,
      emergencyService,
      priceMin,
      priceMax,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    let query: any = { active: true };

    if (specialization) {
      query.specialization = { $in: [specialization] };
    }

    if (serviceOffered) {
      query.services_offered = { $in: [serviceOffered] };
    }

    if (serviceArea) {
      query.service_areas = { $in: [serviceArea] };
    }

    if (emergencyService !== undefined) {
      query.emergency_service = emergencyService === 'true';
    }

    if (priceMin || priceMax) {
      query['pricing.consultation_fee'] = {};
      if (priceMin) query['pricing.consultation_fee'].$gte = parseFloat(priceMin as string);
      if (priceMax) query['pricing.consultation_fee'].$lte = parseFloat(priceMax as string);
    }

    if (search) {
      query.$or = [
        { clinic_name: { $regex: search, $options: 'i' } },
        { service_areas: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const sortOptions: any = {};
    sortOptions[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const services = await VeterinaryService.find(query)
      .populate('provider_id', 'name email phone avatar_url verified user_type location business_info')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit as string));

    const total = await VeterinaryService.countDocuments(query);

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
    console.error('Get veterinary services error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Get single veterinary service by ID
// @route   GET /api/services/veterinary/:id
// @access  Public
async function getVeterinaryService(req: NextApiRequest, res: NextApiResponse) {
  try {
    const serviceId = req.url?.split('/')[4];
    
    if (!serviceId) {
      return res.status(400).json({
        success: false,
        error: 'Service ID is required'
      });
    }

    const service = await VeterinaryService.findById(serviceId)
      .populate('provider_id', 'name email phone avatar_url verified user_type location business_info');

    if (!service) {
      return res.status(404).json({
        success: false,
        error: 'Veterinary service not found'
      });
    }

    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Get veterinary service error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Get veterinary services by provider
// @route   GET /api/services/veterinary/provider/:providerId
// @access  Public
async function getVeterinaryServicesByProvider(req: NextApiRequest, res: NextApiResponse) {
  try {
    const providerId = req.url?.split('/')[5];
    
    if (!providerId) {
      return res.status(400).json({
        success: false,
        error: 'Provider ID is required'
      });
    }

    const services = await VeterinaryService.find({ 
      provider_id: providerId,
      active: true 
    }).populate('provider_id', 'name email phone avatar_url verified user_type');

    res.json({
      success: true,
      data: services
    });
  } catch (error) {
    console.error('Get veterinary services by provider error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Create new veterinary service
// @route   POST /api/services/veterinary
// @access  Private (Veterinarian or Admin)
async function createVeterinaryService(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Use protect middleware
    await new Promise((resolve, reject) => {
      protect(req, res, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });

    // Check authorization
    if (!['veterinarian', 'admin'].includes(req.user.user_type)) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to create veterinary services'
      });
    }

    const {
      clinicName,
      specialization,
      servicesOffered,
      serviceAreas,
      pricing,
      availability,
      certifications,
      emergencyService
    } = req.body;

    const serviceData = {
      provider_id: req.user._id,
      clinic_name: clinicName,
      specialization,
      services_offered: servicesOffered,
      service_areas: serviceAreas,
      pricing,
      availability,
      certifications,
      emergency_service: emergencyService,
      active: true
    };

    const service = await VeterinaryService.create(serviceData);
    await service.populate('provider_id', 'name email phone avatar_url verified user_type');

    res.status(201).json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Create veterinary service error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Update veterinary service
// @route   PUT /api/services/veterinary/:id
// @access  Private
async function updateVeterinaryService(req: NextApiRequest, res: NextApiResponse) {
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

    const service = await VeterinaryService.findById(serviceId);

    if (!service) {
      return res.status(404).json({
        success: false,
        error: 'Veterinary service not found'
      });
    }

    // Check ownership or admin
    if (service.provider_id.toString() !== req.user._id.toString() && req.user.user_type !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this veterinary service'
      });
    }

    const updateData = { ...req.body };
    
    // Map frontend field names to database field names
    if (updateData.clinicName) updateData.clinic_name = updateData.clinicName;
    if (updateData.servicesOffered) updateData.services_offered = updateData.servicesOffered;
    if (updateData.serviceAreas) updateData.service_areas = updateData.serviceAreas;
    if (updateData.emergencyService) updateData.emergency_service = updateData.emergencyService;

    const updatedService = await VeterinaryService.findByIdAndUpdate(
      serviceId,
      updateData,
      { new: true, runValidators: true }
    ).populate('provider_id', 'name email phone avatar_url verified user_type');

    res.json({
      success: true,
      data: updatedService
    });
  } catch (error) {
    console.error('Update veterinary service error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Delete veterinary service
// @route   DELETE /api/services/veterinary/:id
// @access  Private
async function deleteVeterinaryService(req: NextApiRequest, res: NextApiResponse) {
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

    const service = await VeterinaryService.findById(serviceId);

    if (!service) {
      return res.status(404).json({
        success: false,
        error: 'Veterinary service not found'
      });
    }

    // Check ownership or admin
    if (service.provider_id.toString() !== req.user._id.toString() && req.user.user_type !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this veterinary service'
      });
    }

    await VeterinaryService.findByIdAndDelete(serviceId);

    res.json({
      success: true,
      message: 'Veterinary service deleted successfully'
    });
  } catch (error) {
    console.error('Delete veterinary service error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

