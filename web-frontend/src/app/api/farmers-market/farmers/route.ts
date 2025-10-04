import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../../../lib/mongodb';
import { Farmer } from '../../../../../lib/schemas';

// Demo data fallback
const demoFarmers = [
  {
    _id: '1',
    name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    mobile: '9876543210',
    location: {
      state: 'Punjab',
      district: 'Ludhiana',
      pincode: '141001',
      village: 'Village A'
    },
    products: ['Wheat', 'Rice', 'Corn'],
    images: [
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=200&fit=crop',
      'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&h=200&fit=crop'
    ],
    rating: { average: 4.5, count: 12 },
    createdAt: new Date().toISOString(),
    isActive: true
  },
  {
    _id: '2',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    mobile: '9876543211',
    location: {
      state: 'Haryana',
      district: 'Karnal',
      pincode: '132001',
      village: 'Village B'
    },
    products: ['Rice', 'Vegetables', 'Fruits'],
    images: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop'
    ],
    rating: { average: 4.2, count: 8 },
    createdAt: new Date().toISOString(),
    isActive: true
  },
  {
    _id: '3',
    name: 'Amit Singh',
    email: 'amit@example.com',
    mobile: '9876543212',
    location: {
      state: 'Uttar Pradesh',
      district: 'Meerut',
      pincode: '250001',
      village: 'Village C'
    },
    products: ['Sugarcane', 'Potatoes', 'Onions'],
    images: [
      'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=300&h=200&fit=crop'
    ],
    rating: { average: 4.8, count: 15 },
    createdAt: new Date().toISOString(),
    isActive: true
  }
];

export async function GET() {
  try {
    // Try to connect to MongoDB first
    try {
      await connectDB();
      const farmers = await Farmer.find({ isActive: true })
        .select('-__v')
        .sort({ createdAt: -1 });
      
      return NextResponse.json({
        success: true,
        farmers: farmers,
        count: farmers.length
      });
    } catch (dbError) {
      console.warn('MongoDB connection failed, using demo data:', dbError.message);
      
      // Fallback to demo data
      return NextResponse.json({
        success: true,
        farmers: demoFarmers,
        count: demoFarmers.length,
        message: 'Using demo data - MongoDB not available'
      });
    }
  } catch (error) {
    console.error('Error fetching farmers:', error);
    
    // Final fallback to demo data
    return NextResponse.json({
      success: true,
      farmers: demoFarmers,
      count: demoFarmers.length,
      message: 'Using demo data due to error'
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'mobile', 'location'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({
          success: false,
          error: `Missing required field: ${field}`
        }, { status: 400 });
      }
    }
    
    try {
      await connectDB();
      
      // Check if farmer with email already exists
      const existingFarmer = await Farmer.findOne({ email: data.email });
      if (existingFarmer) {
        return NextResponse.json({
          success: false,
          error: 'Farmer with this email already exists'
        }, { status: 409 });
      }
      
      const newFarmer = new Farmer(data);
      await newFarmer.save();
      
      return NextResponse.json({
        success: true,
        farmer: newFarmer,
        message: 'Farmer created successfully'
      }, { status: 201 });
    } catch (dbError) {
      console.warn('MongoDB connection failed for POST:', dbError.message);
      
      // Simulate successful creation with demo data
      const newFarmer = {
        _id: Math.random().toString(36).substr(2, 9),
        ...data,
        createdAt: new Date().toISOString(),
        isActive: true
      };
      
      return NextResponse.json({
        success: true,
        farmer: newFarmer,
        message: 'Farmer created successfully (demo mode)'
      }, { status: 201 });
    }
  } catch (error) {
    console.error('Error creating farmer:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: validationErrors
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      success: false,
      error: 'Failed to create farmer',
      message: error.message 
    }, { status: 500 });
  }
}
