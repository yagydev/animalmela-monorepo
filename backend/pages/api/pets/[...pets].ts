import { NextApiRequest, NextApiResponse } from 'next';
import { body, param, query, validationResult } from 'express-validator';
import { Pet, User } from '../../../models';
import { protect, authorize } from '../../../middleware/auth';
import { connectDB } from '../../../lib/database';

// Connect to database
connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      if (req.url === '/api/pets') {
        return await getPets(req, res);
      } else if (req.url?.startsWith('/api/pets/') && req.url !== '/api/pets/species') {
        return await getPet(req, res);
      } else if (req.url === '/api/pets/species') {
        return await getPetSpecies(req, res);
      }
      break;
    case 'POST':
      if (req.url === '/api/pets') {
        return await createPet(req, res);
      }
      break;
    case 'PUT':
      if (req.url?.startsWith('/api/pets/')) {
        return await updatePet(req, res);
      }
      break;
    case 'DELETE':
      if (req.url?.startsWith('/api/pets/')) {
        return await deletePet(req, res);
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).json({ success: false, error: `Method ${method} not allowed` });
  }
}

// @desc    Get all pets with advanced filtering and pagination
// @route   GET /api/pets
// @access  Public
async function getPets(req: NextApiRequest, res: NextApiResponse) {
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
    let query: any = {};

    // Apply filters
    if (species) {
      query.species = species;
    }

    if (breed) {
      query.breed = { $regex: breed, $options: 'i' };
    }

    if (ageMin || ageMax) {
      query.age = {};
      if (ageMin) query.age.$gte = parseInt(ageMin as string);
      if (ageMax) query.age.$lte = parseInt(ageMax as string);
    }

    if (gender) {
      query.gender = gender;
    }

    if (availableForAdoption !== undefined) {
      query.available_for_adoption = availableForAdoption === 'true';
    }

    if (ownerId) {
      query.owner_id = ownerId;
    }

    // Text search
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { breed: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Sorting
    const sortOptions: any = {};
    sortOptions[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

    // Pagination
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const pets = await Pet.find(query)
      .populate('owner_id', 'name email phone avatar_url verified user_type')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit as string));

    const total = await Pet.countDocuments(query);

    res.json({
      success: true,
      data: pets,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    console.error('Get pets error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Get single pet by ID
// @route   GET /api/pets/:id
// @access  Public
async function getPet(req: NextApiRequest, res: NextApiResponse) {
  try {
    const petId = req.url?.split('/')[3];
    
    if (!petId) {
      return res.status(400).json({
        success: false,
        error: 'Pet ID is required'
      });
    }

    const pet = await Pet.findById(petId)
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
    console.error('Get pet error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Create new pet
// @route   POST /api/pets
// @access  Private
async function createPet(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Use protect middleware
    await new Promise((resolve, reject) => {
      protect(req, res, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });

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
    console.error('Create pet error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Update pet
// @route   PUT /api/pets/:id
// @access  Private
async function updatePet(req: NextApiRequest, res: NextApiResponse) {
  try {
    const petId = req.url?.split('/')[3];
    
    if (!petId) {
      return res.status(400).json({
        success: false,
        error: 'Pet ID is required'
      });
    }

    // Use protect middleware
    await new Promise((resolve, reject) => {
      protect(req, res, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });

    const pet = await Pet.findById(petId);

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
      petId,
      updateData,
      { new: true, runValidators: true }
    ).populate('owner_id', 'name email phone avatar_url verified user_type');

    res.json({
      success: true,
      data: updatedPet
    });
  } catch (error) {
    console.error('Update pet error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Delete pet
// @route   DELETE /api/pets/:id
// @access  Private
async function deletePet(req: NextApiRequest, res: NextApiResponse) {
  try {
    const petId = req.url?.split('/')[3];
    
    if (!petId) {
      return res.status(400).json({
        success: false,
        error: 'Pet ID is required'
      });
    }

    // Use protect middleware
    await new Promise((resolve, reject) => {
      protect(req, res, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });

    const pet = await Pet.findById(petId);

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

    await Pet.findByIdAndDelete(petId);

    res.json({
      success: true,
      message: 'Pet deleted successfully'
    });
  } catch (error) {
    console.error('Delete pet error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Get pet species
// @route   GET /api/pets/species
// @access  Public
async function getPetSpecies(req: NextApiRequest, res: NextApiResponse) {
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
    console.error('Get pet species error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}
