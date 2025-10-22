import { NextRequest, NextResponse } from 'next/server';

// Mock data for development/testing
const mockListings = [
  {
    _id: '1',
    name: 'John Deere Tractor 5050',
    description: 'Well-maintained John Deere tractor with 2000 hours. Perfect for medium-scale farming operations. Recently serviced and ready to use.',
    category: 'equipment',
    condition: 'used',
    price: 450000,
    images: ['/images/tractor1.jpg', '/images/tractor2.jpg'],
    location: 'Punjab, India',
    sellerId: 'seller1',
    sellerName: 'Rajesh Kumar',
    sellerPhone: '+91-9876543210',
    status: 'approved',
    featured: true,
    tags: ['tractor', 'john deere', 'farming', 'agriculture'],
    createdAt: '2024-01-15T10:00:00Z',
    specifications: {
      brand: 'John Deere',
      model: '5050',
      year: 2018,
      hours: 2000,
      fuelType: 'Diesel',
      power: 50
    }
  },
  {
    _id: '2',
    name: 'Holstein Friesian Cow',
    description: 'Healthy Holstein Friesian cow, 4 years old, producing 25-30 liters of milk daily. Vaccinated and dewormed regularly.',
    category: 'livestock',
    condition: 'used',
    price: 85000,
    images: ['/images/cow1.jpg', '/images/cow2.jpg'],
    location: 'Haryana, India',
    sellerId: 'seller2',
    sellerName: 'Priya Sharma',
    sellerPhone: '+91-9876543211',
    status: 'approved',
    featured: false,
    tags: ['cow', 'dairy', 'holstein', 'milk'],
    createdAt: '2024-01-14T14:30:00Z',
    specifications: {
      breed: 'Holstein Friesian',
      age: '4 years',
      weight: 450,
      gender: 'Female',
      vaccinated: 'Yes',
      healthStatus: 'Excellent'
    }
  },
  {
    _id: '3',
    name: 'Fresh Organic Wheat',
    description: 'Premium quality organic wheat harvested this season. No pesticides or chemicals used. Perfect for health-conscious consumers.',
    category: 'product',
    condition: 'new',
    price: 2500,
    images: ['/images/wheat1.jpg', '/images/wheat2.jpg'],
    location: 'Rajasthan, India',
    sellerId: 'seller3',
    sellerName: 'Amit Singh',
    sellerPhone: '+91-9876543212',
    status: 'approved',
    featured: true,
    tags: ['wheat', 'organic', 'grain', 'healthy'],
    quantity: 100,
    unit: 'quintal',
    createdAt: '2024-01-13T09:15:00Z',
    specifications: {
      variety: 'Durum',
      grade: 'A',
      harvestDate: '2024-01-15',
      storage: 'Dry storage',
      organic: 'Yes',
      pesticideFree: 'Yes'
    }
  },
  {
    _id: '4',
    name: 'Irrigation Pump Set',
    description: 'High-efficiency irrigation pump set with 5HP motor. Suitable for small to medium farms. Includes all accessories.',
    category: 'equipment',
    condition: 'new',
    price: 35000,
    images: ['/images/pump1.jpg'],
    location: 'Gujarat, India',
    sellerId: 'seller4',
    sellerName: 'Deepak Patel',
    sellerPhone: '+91-9876543213',
    status: 'approved',
    featured: false,
    tags: ['pump', 'irrigation', 'motor', 'water'],
    createdAt: '2024-01-12T16:45:00Z',
    specifications: {
      brand: 'Kirloskar',
      model: 'KP-5',
      year: 2024,
      fuelType: 'Electric',
      power: 5
    }
  },
  {
    _id: '5',
    name: 'Goat Herd (5 Goats)',
    description: 'Healthy mixed breed goat herd consisting of 3 females and 2 males. All goats are disease-free and well-fed.',
    category: 'livestock',
    condition: 'used',
    price: 45000,
    images: ['/images/goats1.jpg'],
    location: 'Maharashtra, India',
    sellerId: 'seller5',
    sellerName: 'Sunita Desai',
    sellerPhone: '+91-9876543214',
    status: 'approved',
    featured: false,
    tags: ['goats', 'herd', 'livestock', 'animals'],
    quantity: 5,
    unit: 'piece',
    createdAt: '2024-01-11T11:20:00Z',
    specifications: {
      breed: 'Mixed',
      age: '1-2 years',
      weight: 25,
      gender: 'Mixed',
      vaccinated: 'Yes',
      healthStatus: 'Good'
    }
  },
  {
    _id: '6',
    name: 'Fresh Tomatoes',
    description: 'Fresh, juicy tomatoes from our organic farm. Perfect for cooking and salads. Harvested daily.',
    category: 'product',
    condition: 'new',
    price: 40,
    images: ['/images/tomatoes1.jpg'],
    location: 'Karnataka, India',
    sellerId: 'seller6',
    sellerName: 'Ravi Kumar',
    sellerPhone: '+91-9876543215',
    status: 'approved',
    featured: false,
    tags: ['tomatoes', 'vegetables', 'organic', 'fresh'],
    quantity: 50,
    unit: 'kg',
    createdAt: '2024-01-10T08:30:00Z',
    specifications: {
      variety: 'Cherry',
      grade: 'A',
      harvestDate: '2024-01-10',
      storage: 'Cool storage',
      organic: 'Yes',
      pesticideFree: 'Yes'
    }
  }
];

// GET /api/marketplace - Fetch all listings with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const category = searchParams.get('category');
    const condition = searchParams.get('condition');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const location = searchParams.get('location');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Filter listings
    let filteredListings = mockListings.filter(listing => listing.status === 'approved');
    
    if (category && category !== 'all' && ['equipment', 'livestock', 'product'].includes(category)) {
      filteredListings = filteredListings.filter(listing => listing.category === category);
    }
    
    if (condition && condition !== 'all' && ['new', 'used'].includes(condition)) {
      filteredListings = filteredListings.filter(listing => listing.condition === condition);
    }
    
    if (minPrice) {
      filteredListings = filteredListings.filter(listing => listing.price >= parseInt(minPrice));
    }
    
    if (maxPrice) {
      filteredListings = filteredListings.filter(listing => listing.price <= parseInt(maxPrice));
    }
    
    if (location) {
      filteredListings = filteredListings.filter(listing => 
        listing.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredListings = filteredListings.filter(listing => 
        listing.name.toLowerCase().includes(searchLower) ||
        listing.description.toLowerCase().includes(searchLower) ||
        listing.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Sort listings
    filteredListings.sort((a, b) => {
      if (sortBy === 'price') {
        return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
      } else if (sortBy === 'name') {
        return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      } else {
        // Sort by featured first, then by creation date
        if (a.featured !== b.featured) {
          return b.featured ? 1 : -1;
        }
        return sortOrder === 'asc' 
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    // Calculate pagination
    const totalCount = filteredListings.length;
    const totalPages = Math.ceil(totalCount / limit);
    const skip = (page - 1) * limit;
    const paginatedListings = filteredListings.slice(skip, skip + limit);

    return NextResponse.json({
      success: true,
      data: paginatedListings,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit
      }
    });

  } catch (error) {
    console.error('Marketplace API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch listings' },
      { status: 500 }
    );
  }
}

// POST /api/marketplace - Create new listing
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'description', 'category', 'condition', 'price', 'images', 'location', 'sellerId'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate category
    if (!['equipment', 'livestock', 'product'].includes(body.category)) {
      return NextResponse.json(
        { success: false, error: 'Invalid category' },
        { status: 400 }
      );
    }

    // Validate condition
    if (!['new', 'used'].includes(body.condition)) {
      return NextResponse.json(
        { success: false, error: 'Invalid condition' },
        { status: 400 }
      );
    }

    // Validate price
    if (body.price <= 0) {
      return NextResponse.json(
        { success: false, error: 'Price must be greater than 0' },
        { status: 400 }
      );
    }

    // Get seller info
    const seller = await MarketplaceUser.findById(body.sellerId);
    if (!seller) {
      return NextResponse.json(
        { success: false, error: 'Seller not found' },
        { status: 404 }
      );
    }

    // Create listing
    const listing = await MarketplaceListing.create({
      ...body,
      sellerName: seller.name,
      sellerPhone: seller.phone,
      status: 'pending' // New listings need approval
    });

    // Update seller's listing count
    await MarketplaceUser.findByIdAndUpdate(body.sellerId, {
      $inc: { totalListings: 1 },
      lastActive: new Date()
    });

    return NextResponse.json({
      success: true,
      data: listing,
      message: 'Listing created successfully. It will be reviewed before going live.'
    }, { status: 201 });

  } catch (error) {
    console.error('Create Listing Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create listing' },
      { status: 500 }
    );
  }
}
