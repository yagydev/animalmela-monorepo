const { NextApiRequest, NextApiResponse } = require('next');
const { Listing, User, Order } = require('../../../models');
const { protect, authorize } = require('../../../middleware/auth');
const connectDB = require('../../../lib/mongodb');

// Connect to database
connectDB();

export default async function handler(req, res) {
  const { method } = req;
  const { listings } = req.query;
  
  // Handle different route patterns
  const route = Array.isArray(listings) ? listings.join('/') : listings || '';
  
  switch (method) {
    case 'GET':
      if (route === 'categories') {
        return await getCategories(req, res);
      } else if (route === '') {
        return await getListings(req, res);
      } else if (route && route !== 'categories') {
        return await getListing(req, res);
      }
      break;
    case 'POST':
      if (route === '') {
        return await createListing(req, res);
      }
      break;
    case 'PUT':
      if (route && route !== 'categories') {
        return await updateListing(req, res);
      }
      break;
    case 'DELETE':
      if (route && route !== 'categories') {
        return await deleteListing(req, res);
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).json({ success: false, error: `Method ${method} not allowed` });
  }
}

// @desc    Get all listings with advanced filtering and pagination
// @route   GET /api/listings
// @access  Public
async function getListings(req: NextApiRequest, res: NextApiResponse) {
  try {
    const {
      page = 1,
      limit = 10,
      species,
      breed,
      sex,
      ageMin,
      ageMax,
      weightMin,
      weightMax,
      priceMin,
      priceMax,
      sellerId,
      status = 'active',
      verified,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      location,
      // Livestock-specific filters
      milkYieldMin,
      milkYieldMax,
      lactationNo,
      pregnancyMonths,
      negotiable
    } = req.query;

    // Build query
    let query = {};

    // Apply filters
    if (species) {
      query.species = species;
    }

    if (breed) {
      query.breed = breed;
    }

    if (sex) {
      query.sex = sex;
    }

    if (ageMin || ageMax) {
      query.age = {};
      if (ageMin) query.age.$gte = parseInt(ageMin);
      if (ageMax) query.age.$lte = parseInt(ageMax);
    }

    if (weightMin || weightMax) {
      query.weight = {};
      if (weightMin) query.weight.$gte = parseFloat(weightMin);
      if (weightMax) query.weight.$lte = parseFloat(weightMax);
    }

    if (priceMin || priceMax) {
      query.price = {};
      if (priceMin) query.price.$gte = parseFloat(priceMin);
      if (priceMax) query.price.$lte = parseFloat(priceMax);
    }

    if (sellerId) {
      query.sellerId = sellerId;
    }

    if (status) {
      query.status = status;
    }

    if (verified !== undefined) {
      query.verified = verified === 'true';
    }

    if (negotiable !== undefined) {
      query.negotiable = negotiable === 'true';
    }

    // Livestock-specific filters
    if (milkYieldMin || milkYieldMax) {
      query.milkYield = {};
      if (milkYieldMin) query.milkYield.$gte = parseFloat(milkYieldMin);
      if (milkYieldMax) query.milkYield.$lte = parseFloat(milkYieldMax);
    }

    if (lactationNo) {
      query.lactationNo = parseInt(lactationNo);
    }

    if (pregnancyMonths) {
      query.pregnancyMonths = parseInt(pregnancyMonths);
    }

    // Text search
    if (search) {
      query.$or = [
        { species: { $regex: search, $options: 'i' } },
        { breed: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Location-based search (if coordinates provided)
    if (location) {
      const { lat, lng, radius = 10 } = JSON.parse(location as string);
      if (lat && lng) {
        query['location.coordinates'] = {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [lng, lat]
            },
            $maxDistance: radius * 1000 // Convert km to meters
          }
        };
      }
    }

    // Sorting
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const listings = await Listing.find(query)
      .populate('sellerId', 'name mobile email role rating location')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Listing.countDocuments(query);

    res.json({
      success: true,
      data: listings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
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

// @desc    Get single listing by ID
// @route   GET /api/listings/:id
// @access  Public
async function getListing(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { listings } = req.query;
    const listingId = Array.isArray(listings) ? listings[0] : listings;
    
    if (!listingId) {
      return res.status(400).json({
        success: false,
        error: 'Listing ID is required'
      });
    }

    const listing = await Listing.findById(listingId)
      .populate('sellerId', 'name mobile email role rating location');

    if (!listing) {
      return res.status(404).json({
        success: false,
        error: 'Listing not found'
      });
    }

    // Increment view count
    await Listing.findByIdAndUpdate(listingId, { $inc: { views: 1 } });

    res.json({
      success: true,
      data: listing
    });
  } catch (error) {
    console.error('Get listing error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Create new listing
// @route   POST /api/listings
// @access  Private (Seller or Admin)
async function createListing(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Use protect middleware
    await new Promise((resolve, reject) => {
      protect(req, res, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });

    // Check authorization
    if (!['seller', 'admin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to create listings'
      });
    }

    const {
      species,
      breed,
      sex,
      age,
      teeth,
      weight,
      milkYield,
      lactationNo,
      pregnancyMonths,
      price,
      negotiable = true,
      description,
      media = [],
      docs = [],
      health
    } = req.body;

    const listingData = {
      sellerId: req.user._id,
      species,
      breed,
      sex,
      age,
      teeth,
      weight,
      milkYield,
      lactationNo,
      pregnancyMonths,
      price,
      negotiable,
      description,
      media,
      docs,
      health,
      status: 'active',
      verified: false
    };

    const listing = await Listing.create(listingData);
    await listing.populate('sellerId', 'name mobile email role rating');

    res.status(201).json({
      success: true,
      data: listing
    });
  } catch (error) {
    console.error('Create listing error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Update listing
// @route   PUT /api/listings/:id
// @access  Private
async function updateListing(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { listings } = req.query;
    const listingId = Array.isArray(listings) ? listings[0] : listings;
    
    if (!listingId) {
      return res.status(400).json({
        success: false,
        error: 'Listing ID is required'
      });
    }

    // Use protect middleware
    await new Promise((resolve, reject) => {
      protect(req, res, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });

    const listing = await Listing.findById(listingId);

    if (!listing) {
      return res.status(404).json({
        success: false,
        error: 'Listing not found'
      });
    }

    // Check ownership or admin
    if (listing.sellerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this listing'
      });
    }

    const updateData = { ...req.body };
    
    // Remove sensitive fields
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    const updatedListing = await Listing.findByIdAndUpdate(
      listingId,
      updateData,
      { new: true, runValidators: true }
    ).populate('sellerId', 'name mobile email role rating');

    res.json({
      success: true,
      data: updatedListing
    });
  } catch (error) {
    console.error('Update listing error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Delete listing
// @route   DELETE /api/listings/:id
// @access  Private
async function deleteListing(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { listings } = req.query;
    const listingId = Array.isArray(listings) ? listings[0] : listings;
    
    if (!listingId) {
      return res.status(400).json({
        success: false,
        error: 'Listing ID is required'
      });
    }

    // Use protect middleware
    await new Promise((resolve, reject) => {
      protect(req, res, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });

    const listing = await Listing.findById(listingId);

    if (!listing) {
      return res.status(404).json({
        success: false,
        error: 'Listing not found'
      });
    }

    // Check ownership or admin
    if (listing.sellerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this listing'
      });
    }

    await Listing.findByIdAndDelete(listingId);

    res.json({
      success: true,
      message: 'Listing deleted successfully'
    });
  } catch (error) {
    console.error('Delete listing error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

// @desc    Get listing categories
// @route   GET /api/listings/categories
// @access  Public
async function getCategories(req: NextApiRequest, res: NextApiResponse) {
  try {
    const categories = [
      { 
        value: 'pets', 
        label: 'Pets', 
        icon: '🐕', 
        description: 'Live animals for sale',
        subcategories: ['dogs', 'cats', 'birds', 'fish', 'reptiles', 'other']
      },
      { 
        value: 'livestock', 
        label: 'Livestock', 
        icon: '🐄', 
        description: 'Farm animals for sale',
        subcategories: ['cows', 'buffalo', 'goats', 'sheep', 'pigs', 'horses', 'donkeys']
      },
      { 
        value: 'poultry', 
        label: 'Poultry', 
        icon: '🐔', 
        description: 'Birds for farming',
        subcategories: ['chickens', 'ducks', 'turkeys', 'geese', 'quails']
      },
      { 
        value: 'pet_food', 
        label: 'Pet Food', 
        icon: '🍖', 
        description: 'Food and treats for pets',
        subcategories: ['dry_food', 'wet_food', 'treats', 'supplements', 'puppy_food', 'senior_food']
      },
      { 
        value: 'pet_toys', 
        label: 'Pet Toys', 
        icon: '🎾', 
        description: 'Toys and entertainment for pets',
        subcategories: ['interactive_toys', 'chew_toys', 'fetch_toys', 'puzzle_toys', 'cat_toys', 'dog_toys']
      },
      { 
        value: 'pet_accessories', 
        label: 'Pet Accessories', 
        icon: '🦮', 
        description: 'Collars, leashes, and accessories',
        subcategories: ['collars', 'leashes', 'harnesses', 'carriers', 'beds', 'bowls']
      },
      { 
        value: 'pet_health', 
        label: 'Pet Health', 
        icon: '💊', 
        description: 'Health and medical supplies',
        subcategories: ['medications', 'vitamins', 'grooming_tools', 'first_aid', 'dental_care']
      },
      { 
        value: 'pet_grooming', 
        label: 'Pet Grooming', 
        icon: '✂️', 
        description: 'Grooming supplies and tools',
        subcategories: ['shampoos', 'brushes', 'nail_clippers', 'dryers', 'grooming_kits']
      },
      { 
        value: 'pet_training', 
        label: 'Pet Training', 
        icon: '🎓', 
        description: 'Training aids and equipment',
        subcategories: ['clickers', 'training_treats', 'agility_equipment', 'training_books', 'behavior_aids']
      },
      { 
        value: 'pet_services', 
        label: 'Pet Services', 
        icon: '🛠️', 
        description: 'Services for pets',
        subcategories: ['grooming_services', 'training_services', 'boarding', 'walking', 'sitting']
      },
      { 
        value: 'livestock_feed', 
        label: 'Livestock Feed', 
        icon: '🌾', 
        description: 'Feed and nutrition for livestock',
        subcategories: ['cattle_feed', 'goat_feed', 'sheep_feed', 'pig_feed', 'poultry_feed', 'supplements']
      },
      { 
        value: 'livestock_equipment', 
        label: 'Livestock Equipment', 
        icon: '🔧', 
        description: 'Equipment and tools for livestock farming',
        subcategories: ['milking_machines', 'feeding_equipment', 'housing_equipment', 'health_tools', 'breeding_equipment']
      },
      { 
        value: 'livestock_services', 
        label: 'Livestock Services', 
        icon: '🚛', 
        description: 'Services for livestock',
        subcategories: ['transport_services', 'veterinary_services', 'insurance_services', 'breeding_services', 'health_checkup']
      },
      { 
        value: 'other', 
        label: 'Other', 
        icon: '🐾', 
        description: 'Miscellaneous pet-related items',
        subcategories: ['books', 'magazines', 'artwork', 'clothing', 'gift_items']
      }
    ];

    res.json({
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
