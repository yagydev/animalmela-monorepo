import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../../../../lib/mongodb';
import { Farmer } from '../../../../../../lib/schemas';
import mongoose from 'mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const farmerId = params.id;
    
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
  } catch (error) {
    console.error('Error fetching farmer:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch farmer',
      message: error.message
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const farmerId = params.id;
    const data = await request.json();
    
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
    await connectDB();
    
    const farmerId = params.id;
    
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
  } catch (error) {
    console.error('Error deleting farmer:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete farmer',
      message: error.message
    }, { status: 500 });
  }
}