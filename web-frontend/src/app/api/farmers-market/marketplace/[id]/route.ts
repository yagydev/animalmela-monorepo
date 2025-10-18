import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../../../../lib/mongodb';
import mongoose from 'mongoose';

// Mock MarketplaceListing model
const MarketplaceListing = mongoose.models.MarketplaceListing || mongoose.model('MarketplaceListing', new mongoose.Schema({}));

// Demo data fallback
const demoListings = [
  {
    _id: '1',
    title: 'Premium Organic Wheat - Grade A',
    description: 'High-quality organic wheat grown using traditional farming methods without any chemical fertilizers or pesticides. This premium wheat is perfect for making rotis, bread, and other wheat-based products. Grown in the fertile lands of Punjab with excellent soil quality and irrigation facilities.',
    price: 2500,
    unit: 'quintal',
    quantity: 10,
    category: 'crops',
    subcategory: 'grains',
    images: [
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&h=400&fit=crop'
    ],
    sellerId: {
      _id: 'seller1',
      name: 'Rajesh Kumar',
      email: 'rajesh@example.com',
      mobile: '9876543210',
      location: {
        state: 'Punjab',
        district: 'Ludhiana',
        pincode: '141001',
        village: 'Village A'
      },
      rating: {
        average: 4.5,
        count: 23
      },
      verified: true,
      joinDate: '2020-01-15'
    },
    location: {
      state: 'Punjab',
      district: 'Ludhiana',
      pincode: '141001',
      village: 'Village A'
    },
    rating: {
      average: 4.3,
      count: 15
    },
    negotiable: true,
    minimumOrder: 1,
    specifications: {
      'Moisture Content': '12%',
      'Protein Content': '11-12%',
      'Gluten Content': 'Medium',
      'Color': 'Golden Yellow',
      'Purity': '99%',
      'Storage': 'Cool and Dry Place',
      'Shelf Life': '2 Years'
    },
    tags: ['organic', 'premium', 'wheat', 'traditional', 'chemical-free'],
    status: 'active',
    featured: true,
    views: 1250,
    likes: 89,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-20T14:45:00Z',
    shipping: {
      available: true,
      cost: 200,
      estimatedDays: 3
    },
    paymentMethods: ['cash', 'upi', 'bank_transfer'],
    returnPolicy: '7-day return policy for quality issues',
    warranty: 'Quality guarantee - 100% satisfaction or money back'
  },
  {
    _id: '2',
    title: 'Fresh Organic Rice - Basmati',
    description: 'Premium quality Basmati rice grown organically in the foothills of Himalayas. Known for its long grains and aromatic fragrance.',
    price: 1800,
    unit: 'quintal',
    quantity: 5,
    category: 'crops',
    subcategory: 'grains',
    images: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=400&fit=crop'
    ],
    sellerId: {
      _id: 'seller2',
      name: 'Priya Sharma',
      email: 'priya@example.com',
      mobile: '9876543211',
      location: {
        state: 'Haryana',
        district: 'Karnal',
        pincode: '132001',
        village: 'Village B'
      },
      rating: {
        average: 4.2,
        count: 18
      },
      verified: true,
      joinDate: '2021-03-20'
    },
    location: {
      state: 'Haryana',
      district: 'Karnal',
      pincode: '132001',
      village: 'Village B'
    },
    rating: {
      average: 4.1,
      count: 12
    },
    negotiable: true,
    minimumOrder: 1,
    specifications: {
      'Grain Length': '7-8mm',
      'Moisture Content': '14%',
      'Broken Grains': 'Less than 5%',
      'Color': 'White',
      'Aroma': 'Basmati Fragrance'
    },
    tags: ['basmati', 'organic', 'aromatic', 'long-grain'],
    status: 'active',
    featured: false,
    views: 890,
    likes: 45,
    createdAt: '2024-01-10T08:15:00Z',
    updatedAt: '2024-01-18T12:30:00Z',
    shipping: {
      available: true,
      cost: 150,
      estimatedDays: 2
    },
    paymentMethods: ['cash', 'upi'],
    returnPolicy: '5-day return policy',
    warranty: 'Quality guarantee'
  }
];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const listingId = params.id;
    
    try {
      await connectDB();
      
      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(listingId)) {
        return NextResponse.json({
          success: false,
          error: 'Invalid listing ID format'
        }, { status: 400 });
      }
      
      const listing = await MarketplaceListing.findById(listingId)
        .populate('sellerId', 'name email mobile location rating verified joinDate')
        .select('-__v');
      
      if (!listing) {
        return NextResponse.json({
          success: false,
          error: 'Listing not found'
        }, { status: 404 });
      }
      
      return NextResponse.json({
        success: true,
        listing: listing
      });
    } catch (dbError) {
      console.warn('MongoDB connection failed, using demo data:', dbError.message);
      
      // Fallback to demo data
      const listing = demoListings.find(l => l._id === listingId);
      if (!listing) {
        return NextResponse.json({
          success: false,
          error: 'Listing not found'
        }, { status: 404 });
      }
      
      return NextResponse.json({
        success: true,
        listing: listing,
        message: 'Using demo data - MongoDB not available'
      });
    }
  } catch (error) {
    console.error('Error fetching listing:', error);
    
    // Final fallback to demo data
    const listing = demoListings.find(l => l._id === params.id);
    if (!listing) {
      return NextResponse.json({
        success: false,
        error: 'Listing not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      listing: listing,
      message: 'Using demo data due to error'
    });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const listingId = params.id;
    const updates = await request.json();
    
    try {
      await connectDB();
      
      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(listingId)) {
        return NextResponse.json({
          success: false,
          error: 'Invalid listing ID format'
        }, { status: 400 });
      }
      
      const listing = await MarketplaceListing.findByIdAndUpdate(
        listingId,
        { ...updates, updatedAt: new Date() },
        { new: true, runValidators: true }
      ).populate('sellerId', 'name email mobile location rating verified joinDate');
      
      if (!listing) {
        return NextResponse.json({
          success: false,
          error: 'Listing not found'
        }, { status: 404 });
      }
      
      return NextResponse.json({
        success: true,
        listing: listing,
        message: 'Listing updated successfully'
      });
    } catch (dbError) {
      console.warn('MongoDB connection failed:', dbError.message);
      
      return NextResponse.json({
        success: false,
        error: 'Database connection failed'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error updating listing:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to update listing'
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const listingId = params.id;
    
    try {
      await connectDB();
      
      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(listingId)) {
        return NextResponse.json({
          success: false,
          error: 'Invalid listing ID format'
        }, { status: 400 });
      }
      
      const listing = await MarketplaceListing.findByIdAndDelete(listingId);
      
      if (!listing) {
        return NextResponse.json({
          success: false,
          error: 'Listing not found'
        }, { status: 404 });
      }
      
      return NextResponse.json({
        success: true,
        message: 'Listing deleted successfully'
      });
    } catch (dbError) {
      console.warn('MongoDB connection failed:', dbError.message);
      
      return NextResponse.json({
        success: false,
        error: 'Database connection failed'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error deleting listing:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to delete listing'
    }, { status: 500 });
  }
}
