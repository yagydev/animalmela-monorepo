import { NextRequest, NextResponse } from 'next/server';

// Mock data for development/testing (same as in main route)
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

// Mock seller data
const mockSellers = {
  'seller1': {
    _id: 'seller1',
    name: 'Rajesh Kumar',
    phone: '+91-9876543210',
    location: 'Punjab, India',
    rating: 4.5,
    profileImage: '/images/seller1.jpg'
  },
  'seller2': {
    _id: 'seller2',
    name: 'Priya Sharma',
    phone: '+91-9876543211',
    location: 'Haryana, India',
    rating: 4.8,
    profileImage: '/images/seller2.jpg'
  },
  'seller3': {
    _id: 'seller3',
    name: 'Amit Singh',
    phone: '+91-9876543212',
    location: 'Rajasthan, India',
    rating: 4.7,
    profileImage: '/images/seller3.jpg'
  },
  'seller4': {
    _id: 'seller4',
    name: 'Deepak Patel',
    phone: '+91-9876543213',
    location: 'Gujarat, India',
    rating: 4.6,
    profileImage: '/images/seller4.jpg'
  },
  'seller5': {
    _id: 'seller5',
    name: 'Sunita Desai',
    phone: '+91-9876543214',
    location: 'Maharashtra, India',
    rating: 4.4,
    profileImage: '/images/seller5.jpg'
  },
  'seller6': {
    _id: 'seller6',
    name: 'Ravi Kumar',
    phone: '+91-9876543215',
    location: 'Karnataka, India',
    rating: 4.3,
    profileImage: '/images/seller6.jpg'
  }
};

// GET /api/marketplace/[category]/[id] - Get single listing
export async function GET(
  request: NextRequest,
  { params }: { params: { category: string; id: string } }
) {
  try {
    const { category, id } = params;
    
    // Validate category
    if (!['equipment', 'livestock', 'product'].includes(category)) {
      return NextResponse.json(
        { success: false, error: 'Invalid category' },
        { status: 400 }
      );
    }

    // Find the listing
    const listing = mockListings.find(
      item => item._id === id && item.category === category && item.status === 'approved'
    );

    if (!listing) {
      return NextResponse.json(
        { success: false, error: 'Listing not found' },
        { status: 404 }
      );
    }

    // Get seller info
    const seller = mockSellers[listing.sellerId as keyof typeof mockSellers];

    // Get related listings from same seller
    const relatedListings = mockListings
      .filter(item => 
        item.sellerId === listing.sellerId && 
        item._id !== id && 
        item.status === 'approved'
      )
      .slice(0, 4)
      .map(item => ({
        _id: item._id,
        name: item.name,
        price: item.price,
        images: item.images,
        category: item.category,
        condition: item.condition
      }));

    return NextResponse.json({
      success: true,
      data: {
        listing: {
          ...listing,
          sellerId: seller
        },
        relatedListings
      }
    });

  } catch (error) {
    console.error('Get Listing Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch listing' },
      { status: 500 }
    );
  }
}

// PUT /api/marketplace/[category]/[id] - Update listing
export async function PUT(
  request: NextRequest,
  { params }: { params: { category: string; id: string } }
) {
  try {
    await dbConnect();
    
    const { category, id } = params;
    const body = await request.json();
    
    // Validate category
    if (!['equipment', 'livestock', 'product'].includes(category)) {
      return NextResponse.json(
        { success: false, error: 'Invalid category' },
        { status: 400 }
      );
    }

    // Find the listing
    const listing = await MarketplaceListing.findOne({
      _id: id,
      category
    });

    if (!listing) {
      return NextResponse.json(
        { success: false, error: 'Listing not found' },
        { status: 404 }
      );
    }

    // Validate condition if provided
    if (body.condition && !['new', 'used'].includes(body.condition)) {
      return NextResponse.json(
        { success: false, error: 'Invalid condition' },
        { status: 400 }
      );
    }

    // Validate price if provided
    if (body.price && body.price <= 0) {
      return NextResponse.json(
        { success: false, error: 'Price must be greater than 0' },
        { status: 400 }
      );
    }

    // Update listing
    const updatedListing = await MarketplaceListing.findByIdAndUpdate(
      id,
      { 
        ...body, 
        status: 'pending' // Reset to pending after update for review
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      data: updatedListing,
      message: 'Listing updated successfully. It will be reviewed before going live.'
    });

  } catch (error) {
    console.error('Update Listing Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update listing' },
      { status: 500 }
    );
  }
}

// DELETE /api/marketplace/[category]/[id] - Delete listing
export async function DELETE(
  request: NextRequest,
  { params }: { params: { category: string; id: string } }
) {
  try {
    await dbConnect();
    
    const { category, id } = params;
    
    // Validate category
    if (!['equipment', 'livestock', 'product'].includes(category)) {
      return NextResponse.json(
        { success: false, error: 'Invalid category' },
        { status: 400 }
      );
    }

    // Find and delete the listing
    const listing = await MarketplaceListing.findOneAndDelete({
      _id: id,
      category
    });

    if (!listing) {
      return NextResponse.json(
        { success: false, error: 'Listing not found' },
        { status: 404 }
      );
    }

    // Update seller's listing count
    await MarketplaceUser.findByIdAndUpdate(listing.sellerId, {
      $inc: { totalListings: -1 }
    });

    return NextResponse.json({
      success: true,
      message: 'Listing deleted successfully'
    });

  } catch (error) {
    console.error('Delete Listing Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete listing' },
      { status: 500 }
    );
  }
}
