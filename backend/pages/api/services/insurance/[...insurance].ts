import { NextApiRequest, NextApiResponse } from 'next';
import { InsuranceService, User } from '../../../../models';
import { protect, authorize } from '../../../../middleware/auth';
import { connectDB } from '../../../../lib/database';

// Connect to database
connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      if (req.url === '/api/services/insurance') {
        return await getInsuranceServices(req, res);
      } else if (req.url?.startsWith('/api/services/insurance/') && req.url !== '/api/services/insurance/provider') {
        return await getInsuranceService(req, res);
      } else if (req.url?.startsWith('/api/services/insurance/provider/')) {
        return await getInsuranceServicesByProvider(req, res);
      }
      break;
    case 'POST':
      if (req.url === '/api/services/insurance') {
        return await createInsuranceService(req, res);
      }
      break;
    case 'PUT':
      if (req.url?.startsWith('/api/services/insurance/')) {
        return await updateInsuranceService(req, res);
      }
      break;
    case 'DELETE':
      if (req.url?.startsWith('/api/services/insurance/')) {
        return await deleteInsuranceService(req, res);
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).json({ success: false, error: `Method ${method} not allowed` });
  }
}

// @desc    Get all insurance services with filtering
// @route   GET /api/services/insurance
// @access  Public
async function getInsuranceServices(req: NextApiRequest, res: NextApiResponse) {
  try {
    const {
      page = 1,
      limit = 10,
      insuranceType,
      serviceArea,
      coverageAmountMin,
      coverageAmountMax,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    let query: any = { active: true };

    if (insuranceType) {
      query.insurance_types = { $in: [insuranceType] };
    }

    if (serviceArea) {
      query.service_areas = { $in: [serviceArea] };
    }

    if (coverageAmountMin || coverageAmountMax) {
      query['coverage_options.coverage_amount'] = {};
      if (coverageAmountMin) query['coverage_options.coverage_amount'].$gte = parseFloat(coverageAmountMin as string);
      if (coverageAmountMax) query['coverage_options.coverage_amount'].$lte = parseFloat(coverageAmountMax as string);
    }

    if (search) {
      query.$or = [
        { company_name: { $regex: search, $options: 'i' } },
        { service_areas: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const sortOptions: any = {};
    sortOptions[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const services = await InsuranceService.find(query)
      .populate('provider_id', 'name email phone avatar_url verified user_type location business_info')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit as string));

    const total = await InsuranceService.countDocuments(query);

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
    console.error('Get insurance services error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Get single insurance service by ID
// @route   GET /api/services/insurance/:id
// @access  Public
async function getInsuranceService(req: NextApiRequest, res: NextApiResponse) {
  try {
    const serviceId = req.url?.split('/')[4];
    
    if (!serviceId) {
      return res.status(400).json({
        success: false,
        error: 'Service ID is required'
      });
    }

    const service = await InsuranceService.findById(serviceId)
      .populate('provider_id', 'name email phone avatar_url verified user_type location business_info');

    if (!service) {
      return res.status(404).json({
        success: false,
        error: 'Insurance service not found'
      });
    }

    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Get insurance service error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Get insurance services by provider
// @route   GET /api/services/insurance/provider/:providerId
// @access  Public
async function getInsuranceServicesByProvider(req: NextApiRequest, res: NextApiResponse) {
  try {
    const providerId = req.url?.split('/')[5];
    
    if (!providerId) {
      return res.status(400).json({
        success: false,
        error: 'Provider ID is required'
      });
    }

    const services = await InsuranceService.find({ 
      provider_id: providerId,
      active: true 
    }).populate('provider_id', 'name email phone avatar_url verified user_type');

    res.json({
      success: true,
      data: services
    });
  } catch (error) {
    console.error('Get insurance services by provider error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Create new insurance service
// @route   POST /api/services/insurance
// @access  Private (Insurance Provider or Admin)
async function createInsuranceService(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Use protect middleware
    await new Promise((resolve, reject) => {
      protect(req, res, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });

    // Check authorization
    if (!['insurance_provider', 'admin'].includes(req.user.user_type)) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to create insurance services'
      });
    }

    const {
      companyName,
      insuranceTypes,
      coverageOptions,
      serviceAreas,
      claimsProcess,
      contactInfo
    } = req.body;

    const serviceData = {
      provider_id: req.user._id,
      company_name: companyName,
      insurance_types: insuranceTypes,
      coverage_options: coverageOptions,
      service_areas: serviceAreas,
      claims_process: claimsProcess,
      contact_info: contactInfo,
      active: true
    };

    const service = await InsuranceService.create(serviceData);
    await service.populate('provider_id', 'name email phone avatar_url verified user_type');

    res.status(201).json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Create insurance service error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Update insurance service
// @route   PUT /api/services/insurance/:id
// @access  Private
async function updateInsuranceService(req: NextApiRequest, res: NextApiResponse) {
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

    const service = await InsuranceService.findById(serviceId);

    if (!service) {
      return res.status(404).json({
        success: false,
        error: 'Insurance service not found'
      });
    }

    // Check ownership or admin
    if (service.provider_id.toString() !== req.user._id.toString() && req.user.user_type !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this insurance service'
      });
    }

    const updateData = { ...req.body };
    
    // Map frontend field names to database field names
    if (updateData.companyName) updateData.company_name = updateData.companyName;
    if (updateData.insuranceTypes) updateData.insurance_types = updateData.insuranceTypes;
    if (updateData.coverageOptions) updateData.coverage_options = updateData.coverageOptions;
    if (updateData.serviceAreas) updateData.service_areas = updateData.serviceAreas;
    if (updateData.claimsProcess) updateData.claims_process = updateData.claimsProcess;
    if (updateData.contactInfo) updateData.contact_info = updateData.contactInfo;

    const updatedService = await InsuranceService.findByIdAndUpdate(
      serviceId,
      updateData,
      { new: true, runValidators: true }
    ).populate('provider_id', 'name email phone avatar_url verified user_type');

    res.json({
      success: true,
      data: updatedService
    });
  } catch (error) {
    console.error('Update insurance service error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Delete insurance service
// @route   DELETE /api/services/insurance/:id
// @access  Private
async function deleteInsuranceService(req: NextApiRequest, res: NextApiResponse) {
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

    const service = await InsuranceService.findById(serviceId);

    if (!service) {
      return res.status(404).json({
        success: false,
        error: 'Insurance service not found'
      });
    }

    // Check ownership or admin
    if (service.provider_id.toString() !== req.user._id.toString() && req.user.user_type !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this insurance service'
      });
    }

    await InsuranceService.findByIdAndDelete(serviceId);

    res.json({
      success: true,
      message: 'Insurance service deleted successfully'
    });
  } catch (error) {
    console.error('Delete insurance service error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

