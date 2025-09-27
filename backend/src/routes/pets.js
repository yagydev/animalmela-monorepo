const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const { Pet, User } = require('../../config/database');
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

// @desc    Get all pets with advanced filtering and pagination
// @route   GET /api/pets
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('species').optional().isIn([
    'dog', 'cat', 'bird', 'fish', 'reptile', 'rabbit', 'hamster', 'other'
  ]).withMessage('Invalid species'),
  query('breed').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Breed must be between 1 and 100 characters'),
  query('ageMin').optional().isInt({ min: 0 }).withMessage('Age min must be non-negative'),
  query('ageMax').optional().isInt({ min: 0 }).withMessage('Age max must be non-negative'),
  query('gender').optional().isIn(['male', 'female', 'unknown']).withMessage('Invalid gender'),
  query('availableForAdoption').optional().isBoolean().withMessage('Available for adoption must be boolean'),
  query('ownerId').optional().isMongoId().withMessage('Invalid owner ID'),
  handleValidationErrors
], async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      species,
      breed,
      ageMin,
      ageMax,
      gender,
      availableForAdoption,
      ownerId,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    let query = Pet.find();

    // Apply filters
    if (species) {
      query = query.where('species', species);
    }

    if (breed) {
      query = query.where('breed', { $regex: breed, $options: 'i' });
    }

    if (ageMin || ageMax) {
      const ageFilter = {};
      if (ageMin) ageFilter.$gte = parseInt(ageMin);
      if (ageMax) ageFilter.$lte = parseInt(ageMax);
      query = query.where('age', ageFilter);
    }

    if (gender) {
      query = query.where('gender', gender);
    }

    if (availableForAdoption !== undefined) {
      query = query.where('available_for_adoption', availableForAdoption === 'true');
    }

    if (ownerId) {
      query = query.where('owner_id', ownerId);
    }

    // Text search
    if (search) {
      query = query.where({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { breed: { $regex: search, $options: 'i' } },
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

    // Populate owner information
    query = query.populate('owner_id', 'name email phone avatar_url verified user_type');

    const pets = await query.exec();

    // Get total count for pagination
    const totalQuery = Pet.find();
    if (species) totalQuery.where('species', species);
    if (breed) totalQuery.where('breed', { $regex: breed, $options: 'i' });
    if (ageMin || ageMax) {
      const ageFilter = {};
      if (ageMin) ageFilter.$gte = parseInt(ageMin);
      if (ageMax) ageFilter.$lte = parseInt(ageMax);
      totalQuery.where('age', ageFilter);
    }
    if (gender) totalQuery.where('gender', gender);
    if (availableForAdoption !== undefined) totalQuery.where('available_for_adoption', availableForAdoption === 'true');
    if (ownerId) totalQuery.where('owner_id', ownerId);
    if (search) {
      totalQuery.where({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { breed: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      });
    }

    const total = await totalQuery.countDocuments();

    res.json({
      success: true,
      data: pets,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Get pets error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get single pet by ID
// @route   GET /api/pets/:id
// @access  Public
router.get('/:id', [
  param('id').isMongoId().withMessage('Invalid pet ID'),
  handleValidationErrors
], async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id)
      .populate('owner_id', 'name email phone avatar_url verified user_type');

    if (!pet) {
      return res.status(404).json({
        success: false,
        error: 'Pet not found'
      });
    }

    res.json({
      success: true,
      data: pet
    });
  } catch (error) {
    logger.error('Get pet error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Create new pet
// @route   POST /api/pets
// @access  Private
router.post('/', [
  protect,
  body('name').trim().isLength({ min: 1, max: 255 }).withMessage('Name must be between 1 and 255 characters'),
  body('species').isIn([
    'dog', 'cat', 'bird', 'fish', 'reptile', 'rabbit', 'hamster', 'other'
  ]).withMessage('Invalid species'),
  body('breed').optional().trim().isLength({ max: 100 }).withMessage('Breed must be less than 100 characters'),
  body('age').optional().isInt({ min: 0, max: 30 }).withMessage('Age must be between 0 and 30'),
  body('weight').optional().isFloat({ min: 0, max: 1000 }).withMessage('Weight must be between 0 and 1000'),
  body('gender').optional().isIn(['male', 'female', 'unknown']).withMessage('Invalid gender'),
  body('color').optional().trim().isLength({ max: 100 }).withMessage('Color must be less than 100 characters'),
  body('neutered').optional().isBoolean().withMessage('Neutered must be boolean'),
  body('description').optional().trim().isLength({ max: 2000 }).withMessage('Description must be less than 2000 characters'),
  body('medicalNotes').optional().trim().isLength({ max: 2000 }).withMessage('Medical notes must be less than 2000 characters'),
  body('specialNeeds').optional().isArray().withMessage('Special needs must be an array'),
  body('vaccinations').optional().isArray().withMessage('Vaccinations must be an array'),
  body('healthInfo').optional().isObject().withMessage('Health info must be an object'),
  body('behaviorTraits').optional().isObject().withMessage('Behavior traits must be an object'),
  body('photos').optional().isArray().withMessage('Photos must be an array'),
  body('gallery').optional().isArray().withMessage('Gallery must be an array'),
  body('emergencyContact').optional().isObject().withMessage('Emergency contact must be an object'),
  body('vetInfo').optional().isObject().withMessage('Vet info must be an object'),
  body('availableForAdoption').optional().isBoolean().withMessage('Available for adoption must be boolean'),
  body('adoptionFee').optional().isFloat({ min: 0 }).withMessage('Adoption fee must be non-negative'),
  handleValidationErrors
], async (req, res) => {
  try {
    const {
      name,
      species,
      breed,
      age,
      weight,
      gender,
      color,
      neutered = false,
      description,
      medicalNotes,
      specialNeeds = [],
      vaccinations = [],
      healthInfo = {},
      behaviorTraits = {},
      photos = [],
      gallery = [],
      emergencyContact = {},
      vetInfo = {},
      availableForAdoption = false,
      adoptionFee
    } = req.body;

    const petData = {
      owner_id: req.user._id,
      name,
      species,
      breed,
      age,
      weight,
      gender,
      color,
      neutered,
      description,
      medical_notes: medicalNotes,
      special_needs: specialNeeds,
      vaccinations,
      health_info: healthInfo,
      behavior_traits: behaviorTraits,
      photos,
      gallery,
      emergency_contact: emergencyContact,
      vet_info: vetInfo,
      available_for_adoption: availableForAdoption,
      adoption_fee: adoptionFee
    };

    const pet = await Pet.create(petData);
    await pet.populate('owner_id', 'name email phone avatar_url verified user_type');

    res.status(201).json({
      success: true,
      data: pet
    });
  } catch (error) {
    logger.error('Create pet error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Update pet
// @route   PUT /api/pets/:id
// @access  Private
router.put('/:id', [
  protect,
  param('id').isMongoId().withMessage('Invalid pet ID'),
  body('name').optional().trim().isLength({ min: 1, max: 255 }).withMessage('Name must be between 1 and 255 characters'),
  body('species').optional().isIn([
    'dog', 'cat', 'bird', 'fish', 'reptile', 'rabbit', 'hamster', 'other'
  ]).withMessage('Invalid species'),
  body('breed').optional().trim().isLength({ max: 100 }).withMessage('Breed must be less than 100 characters'),
  body('age').optional().isInt({ min: 0, max: 30 }).withMessage('Age must be between 0 and 30'),
  body('weight').optional().isFloat({ min: 0, max: 1000 }).withMessage('Weight must be between 0 and 1000'),
  body('gender').optional().isIn(['male', 'female', 'unknown']).withMessage('Invalid gender'),
  body('color').optional().trim().isLength({ max: 100 }).withMessage('Color must be less than 100 characters'),
  body('neutered').optional().isBoolean().withMessage('Neutered must be boolean'),
  body('description').optional().trim().isLength({ max: 2000 }).withMessage('Description must be less than 2000 characters'),
  body('medicalNotes').optional().trim().isLength({ max: 2000 }).withMessage('Medical notes must be less than 2000 characters'),
  body('specialNeeds').optional().isArray().withMessage('Special needs must be an array'),
  body('vaccinations').optional().isArray().withMessage('Vaccinations must be an array'),
  body('healthInfo').optional().isObject().withMessage('Health info must be an object'),
  body('behaviorTraits').optional().isObject().withMessage('Behavior traits must be an object'),
  body('photos').optional().isArray().withMessage('Photos must be an array'),
  body('gallery').optional().isArray().withMessage('Gallery must be an array'),
  body('emergencyContact').optional().isObject().withMessage('Emergency contact must be an object'),
  body('vetInfo').optional().isObject().withMessage('Vet info must be an object'),
  body('availableForAdoption').optional().isBoolean().withMessage('Available for adoption must be boolean'),
  body('adoptionFee').optional().isFloat({ min: 0 }).withMessage('Adoption fee must be non-negative'),
  handleValidationErrors
], async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({
        success: false,
        error: 'Pet not found'
      });
    }

    // Check ownership or admin
    if (pet.owner_id.toString() !== req.user._id.toString() && req.user.user_type !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this pet'
      });
    }

    const updateData = { ...req.body };
    
    // Map frontend field names to database field names
    if (updateData.medicalNotes) updateData.medical_notes = updateData.medicalNotes;
    if (updateData.specialNeeds) updateData.special_needs = updateData.specialNeeds;
    if (updateData.healthInfo) updateData.health_info = updateData.healthInfo;
    if (updateData.behaviorTraits) updateData.behavior_traits = updateData.behaviorTraits;
    if (updateData.emergencyContact) updateData.emergency_contact = updateData.emergencyContact;
    if (updateData.vetInfo) updateData.vet_info = updateData.vetInfo;
    if (updateData.availableForAdoption) updateData.available_for_adoption = updateData.availableForAdoption;
    if (updateData.adoptionFee) updateData.adoption_fee = updateData.adoptionFee;

    const updatedPet = await Pet.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('owner_id', 'name email phone avatar_url verified user_type');

    res.json({
      success: true,
      data: updatedPet
    });
  } catch (error) {
    logger.error('Update pet error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Delete pet
// @route   DELETE /api/pets/:id
// @access  Private
router.delete('/:id', [
  protect,
  param('id').isMongoId().withMessage('Invalid pet ID'),
  handleValidationErrors
], async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({
        success: false,
        error: 'Pet not found'
      });
    }

    // Check ownership or admin
    if (pet.owner_id.toString() !== req.user._id.toString() && req.user.user_type !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this pet'
      });
    }

    await Pet.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Pet deleted successfully'
    });
  } catch (error) {
    logger.error('Delete pet error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Upload pet photos
// @route   POST /api/pets/:id/photos
// @access  Private
router.post('/:id/photos', [
  protect,
  param('id').isMongoId().withMessage('Invalid pet ID'),
  handleValidationErrors
], async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({
        success: false,
        error: 'Pet not found'
      });
    }

    // Check ownership or admin
    if (pet.owner_id.toString() !== req.user._id.toString() && req.user.user_type !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to upload photos for this pet'
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
    const photoUrls = req.files.map(file => `/uploads/pets/${file.filename}`);

    // Update pet with photo URLs
    const updatedPet = await Pet.findByIdAndUpdate(
      req.params.id,
      { 
        $push: { photos: { $each: photoUrls } },
        updatedAt: new Date()
      },
      { new: true }
    ).populate('owner_id', 'name email phone avatar_url verified user_type');

    res.status(201).json({
      success: true,
      data: { photos: photoUrls },
      pet: updatedPet
    });
  } catch (error) {
    logger.error('Upload pet photos error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Add vaccination record
// @route   POST /api/pets/:id/vaccinations
// @access  Private
router.post('/:id/vaccinations', [
  protect,
  param('id').isMongoId().withMessage('Invalid pet ID'),
  body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Vaccination name is required'),
  body('date').isISO8601().withMessage('Date must be valid'),
  body('nextDue').isISO8601().withMessage('Next due date must be valid'),
  handleValidationErrors
], async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({
        success: false,
        error: 'Pet not found'
      });
    }

    // Check ownership or admin
    if (pet.owner_id.toString() !== req.user._id.toString() && req.user.user_type !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to add vaccinations for this pet'
      });
    }

    const { name, date, nextDue } = req.body;

    const vaccination = {
      name,
      date: new Date(date),
      next_due: new Date(nextDue)
    };

    const updatedPet = await Pet.findByIdAndUpdate(
      req.params.id,
      { 
        $push: { vaccinations: vaccination },
        updatedAt: new Date()
      },
      { new: true }
    ).populate('owner_id', 'name email phone avatar_url verified user_type');

    res.status(201).json({
      success: true,
      data: updatedPet,
      message: 'Vaccination added successfully'
    });
  } catch (error) {
    logger.error('Add vaccination error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Update vaccination record
// @route   PUT /api/pets/:id/vaccinations/:vaccinationId
// @access  Private
router.put('/:id/vaccinations/:vaccinationId', [
  protect,
  param('id').isMongoId().withMessage('Invalid pet ID'),
  param('vaccinationId').isMongoId().withMessage('Invalid vaccination ID'),
  body('name').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Vaccination name must be between 1 and 100 characters'),
  body('date').optional().isISO8601().withMessage('Date must be valid'),
  body('nextDue').optional().isISO8601().withMessage('Next due date must be valid'),
  handleValidationErrors
], async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({
        success: false,
        error: 'Pet not found'
      });
    }

    // Check ownership or admin
    if (pet.owner_id.toString() !== req.user._id.toString() && req.user.user_type !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update vaccinations for this pet'
      });
    }

    const vaccination = pet.vaccinations.id(req.params.vaccinationId);
    if (!vaccination) {
      return res.status(404).json({
        success: false,
        error: 'Vaccination not found'
      });
    }

    // Update vaccination fields
    if (req.body.name) vaccination.name = req.body.name;
    if (req.body.date) vaccination.date = new Date(req.body.date);
    if (req.body.nextDue) vaccination.next_due = new Date(req.body.nextDue);

    const updatedPet = await pet.save();

    res.json({
      success: true,
      data: updatedPet,
      message: 'Vaccination updated successfully'
    });
  } catch (error) {
    logger.error('Update vaccination error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Delete vaccination record
// @route   DELETE /api/pets/:id/vaccinations/:vaccinationId
// @access  Private
router.delete('/:id/vaccinations/:vaccinationId', [
  protect,
  param('id').isMongoId().withMessage('Invalid pet ID'),
  param('vaccinationId').isMongoId().withMessage('Invalid vaccination ID'),
  handleValidationErrors
], async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({
        success: false,
        error: 'Pet not found'
      });
    }

    // Check ownership or admin
    if (pet.owner_id.toString() !== req.user._id.toString() && req.user.user_type !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete vaccinations for this pet'
      });
    }

    const vaccination = pet.vaccinations.id(req.params.vaccinationId);
    if (!vaccination) {
      return res.status(404).json({
        success: false,
        error: 'Vaccination not found'
      });
    }

    vaccination.remove();
    await pet.save();

    res.json({
      success: true,
      message: 'Vaccination deleted successfully'
    });
  } catch (error) {
    logger.error('Delete vaccination error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get pets by owner
// @route   GET /api/pets/owner/:ownerId
// @access  Public
router.get('/owner/:ownerId', [
  param('ownerId').isMongoId().withMessage('Invalid owner ID'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { ownerId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const pets = await Pet.find({ owner_id: ownerId })
      .populate('owner_id', 'name email phone avatar_url verified user_type')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Pet.countDocuments({ owner_id: ownerId });

    res.json({
      success: true,
      data: pets,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Get pets by owner error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get pet species
// @route   GET /api/pets/species
// @access  Public
router.get('/species', async (req, res) => {
  try {
    const species = [
      { value: 'dog', label: 'Dog', icon: '🐕', description: 'Dogs and puppies' },
      { value: 'cat', label: 'Cat', icon: '🐱', description: 'Cats and kittens' },
      { value: 'bird', label: 'Bird', icon: '🐦', description: 'Birds and parrots' },
      { value: 'fish', label: 'Fish', icon: '🐠', description: 'Fish and aquatic pets' },
      { value: 'reptile', label: 'Reptile', icon: '🦎', description: 'Lizards, snakes, and turtles' },
      { value: 'rabbit', label: 'Rabbit', icon: '🐰', description: 'Rabbits and bunnies' },
      { value: 'hamster', label: 'Hamster', icon: '🐹', description: 'Hamsters and small rodents' },
      { value: 'other', label: 'Other', icon: '🐾', description: 'Other pets and exotic animals' }
    ];

    res.json({
      success: true,
      data: species
    });
  } catch (error) {
    logger.error('Get pet species error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Toggle pet adoption status
// @route   PATCH /api/pets/:id/toggle-adoption
// @access  Private
router.patch('/:id/toggle-adoption', [
  protect,
  param('id').isMongoId().withMessage('Invalid pet ID'),
  handleValidationErrors
], async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({
        success: false,
        error: 'Pet not found'
      });
    }

    // Check ownership or admin
    if (pet.owner_id.toString() !== req.user._id.toString() && req.user.user_type !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to modify this pet'
      });
    }

    const updatedPet = await Pet.findByIdAndUpdate(
      req.params.id,
      { available_for_adoption: !pet.available_for_adoption },
      { new: true }
    ).populate('owner_id', 'name email phone avatar_url verified user_type');

    res.json({
      success: true,
      data: updatedPet,
      message: `Pet ${updatedPet.available_for_adoption ? 'made available for adoption' : 'removed from adoption'}`
    });
  } catch (error) {
    logger.error('Toggle pet adoption status error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;