import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../../../../lib/mongodb';
import { Farmer } from '../../../../../../lib/schemas';
import mongoose from 'mongoose';

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
  }
];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const farmerId = params.id;
    
    try {
      await connectDB();
      
      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(farmerId)) {
        return NextResponse.json({
          success: false,
          error: 'Invalid farmer ID format'
        }, { status: 400 });
      }
      
      const farmer = await Farmer.findById(farmerId).select('-__v');
      
      if (!farmer) {
        return NextResponse.json({
          success: false,
          error: 'Farmer not found'
        }, { status: 404 });
      }
      
      return NextResponse.json({
        success: true,
        farmer: farmer
      });
    } catch (dbError) {
      console.warn('MongoDB connection failed, using demo data:', dbError.message);
      
      // Fallback to demo data
      const farmer = demoFarmers.find(f => f._id === farmerId);
      if (!farmer) {
        return NextResponse.json({
          success: false,
          error: 'Farmer not found'
        }, { status: 404 });
      }
      
      return NextResponse.json({
        success: true,
        farmer: farmer,
        message: 'Using demo data - MongoDB not available'
      });
    }
  } catch (error) {
    console.error('Error fetching farmer:', error);
    
    // Final fallback to demo data
    const farmer = demoFarmers.find(f => f._id === params.id);
    if (!farmer) {
      return NextResponse.json({
        success: false,
        error: 'Farmer not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      farmer: farmer,
      message: 'Using demo data due to error'
    });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const farmerId = params.id;
    const data = await request.json();
    
    try {
      await connectDB();
      
      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(farmerId)) {
        return NextResponse.json({
          success: false,
          error: 'Invalid farmer ID format'
        }, { status: 400 });
      }
      
      // Check if farmer exists
      const existingFarmer = await Farmer.findById(farmerId);
      if (!existingFarmer) {
        return NextResponse.json({
          success: false,
          error: 'Farmer not found'
        }, { status: 404 });
      }
      
      // Check if email is being changed and if new email already exists
      if (data.email && data.email !== existingFarmer.email) {
        const emailExists = await Farmer.findOne({ 
          email: data.email, 
          _id: { $ne: farmerId } 
        });
        if (emailExists) {
          return NextResponse.json({
            success: false,
            error: 'Email already exists for another farmer'
          }, { status: 409 });
        }
      }
      
      // Update farmer
      const updatedFarmer = await Farmer.findByIdAndUpdate(
        farmerId,
        { ...data, updatedAt: new Date() },
        { new: true, runValidators: true }
      ).select('-__v');
      
      return NextResponse.json({
        success: true,
        farmer: updatedFarmer,
        message: 'Farmer updated successfully'
      });
    } catch (dbError) {
      console.warn('MongoDB connection failed for PUT:', dbError.message);
      
      // Simulate successful update with demo data
      const farmer = demoFarmers.find(f => f._id === farmerId);
      if (!farmer) {
        return NextResponse.json({
          success: false,
          error: 'Farmer not found'
        }, { status: 404 });
      }
      
      const updatedFarmer = {
        ...farmer,
        ...data,
        updatedAt: new Date().toISOString()
      };
      
      return NextResponse.json({
        success: true,
        farmer: updatedFarmer,
        message: 'Farmer updated successfully (demo mode)'
      });
    }
  } catch (error) {
    console.error('Error updating farmer:', error);
    
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
      error: 'Failed to update farmer',
      message: error.message
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const farmerId = params.id;
    
    try {
      await connectDB();
      
      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(farmerId)) {
        return NextResponse.json({
          success: false,
          error: 'Invalid farmer ID format'
        }, { status: 400 });
      }
      
      // Check if farmer exists
      const existingFarmer = await Farmer.findById(farmerId);
      if (!existingFarmer) {
        return NextResponse.json({
          success: false,
          error: 'Farmer not found'
        }, { status: 404 });
      }
      
      // Soft delete (set isActive to false) instead of hard delete
      await Farmer.findByIdAndUpdate(
        farmerId,
        { isActive: false, updatedAt: new Date() }
      );
      
      return NextResponse.json({
        success: true,
        message: 'Farmer deleted successfully'
      });
    } catch (dbError) {
      console.warn('MongoDB connection failed for DELETE:', dbError.message);
      
      // Simulate successful deletion
      const farmer = demoFarmers.find(f => f._id === farmerId);
      if (!farmer) {
        return NextResponse.json({
          success: false,
          error: 'Farmer not found'
        }, { status: 404 });
      }
      
      return NextResponse.json({
        success: true,
        message: 'Farmer deleted successfully (demo mode)'
      });
    }
  } catch (error) {
    console.error('Error deleting farmer:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete farmer',
      message: error.message
    }, { status: 500 });
  }
}