import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../../../lib/mongodb';
import { Farmer } from '../../../../../lib/schemas';

export async function GET() {
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
  } catch (error) {
    console.error('Error fetching farmers:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to fetch farmers',
      message: error.message 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
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
