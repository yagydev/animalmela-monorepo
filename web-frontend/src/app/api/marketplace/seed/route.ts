import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import MarketplaceListing from '@/lib/models/MarketplaceListing';
import MarketplaceUser from '@/lib/models/MarketplaceUser';

// Mock data for development/testing
const mockListings = [
  {
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
    specifications: {
      brand: 'Kirloskar',
      model: 'KP-5',
      year: 2024,
      fuelType: 'Electric',
      power: 5
    }
  },
  {
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
    specifications: {
      breed: 'Mixed',
      age: '1-2 years',
      weight: 25,
      gender: 'Mixed',
      vaccinated: 'Yes',
      healthStatus: 'Good'
    }
  }
];

const mockUsers = [
  {
    name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    phone: '+91-9876543210',
    role: 'farmer',
    location: 'Punjab, India',
    isVerified: true,
    rating: 4.5,
    totalListings: 3,
    totalSales: 12
  },
  {
    name: 'Priya Sharma',
    email: 'priya@example.com',
    phone: '+91-9876543211',
    role: 'farmer',
    location: 'Haryana, India',
    isVerified: true,
    rating: 4.8,
    totalListings: 2,
    totalSales: 8
  },
  {
    name: 'Amit Singh',
    email: 'amit@example.com',
    phone: '+91-9876543212',
    role: 'farmer',
    location: 'Rajasthan, India',
    isVerified: true,
    rating: 4.7,
    totalListings: 5,
    totalSales: 15
  },
  {
    name: 'Deepak Patel',
    email: 'deepak@example.com',
    phone: '+91-9876543213',
    role: 'vendor',
    location: 'Gujarat, India',
    isVerified: true,
    rating: 4.6,
    totalListings: 8,
    totalSales: 25
  },
  {
    name: 'Sunita Desai',
    email: 'sunita@example.com',
    phone: '+91-9876543214',
    role: 'farmer',
    location: 'Maharashtra, India',
    isVerified: true,
    rating: 4.4,
    totalListings: 4,
    totalSales: 10
  }
];

// GET /api/marketplace/seed - Seed database with mock data
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Check if data already exists
    const existingListings = await MarketplaceListing.countDocuments();
    if (existingListings > 0) {
      return NextResponse.json({
        success: true,
        message: 'Database already seeded',
        count: existingListings
      });
    }

    // Create mock users first
    const createdUsers = await MarketplaceUser.insertMany(mockUsers);
    
    // Update sellerId in mock listings
    const listingsWithSellerIds = mockListings.map((listing, index) => ({
      ...listing,
      sellerId: createdUsers[index]._id.toString()
    }));

    // Create mock listings
    const createdListings = await MarketplaceListing.insertMany(listingsWithSellerIds);

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      users: createdUsers.length,
      listings: createdListings.length
    });

  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed database' },
      { status: 500 }
    );
  }
}
