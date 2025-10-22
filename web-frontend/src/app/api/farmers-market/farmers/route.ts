import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

// MongoDB connection
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kisaanmela');
  } catch (error) {
    console.error('Database connection error:', error);
  }
};

// Farmer Schema
const farmerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Farmer name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    trim: true,
    match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number']
  },
  location: {
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true
    },
    district: {
      type: String,
      required: [true, 'District is required'],
      trim: true
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required'],
      trim: true,
      match: [/^\d{6}$/, 'Please enter a valid 6-digit pincode']
    },
    village: {
      type: String,
      required: [true, 'Village is required'],
      trim: true
    }
  },
  products: [{
    type: String,
    trim: true
  }],
  images: [{
    type: String,
    trim: true,
    validate: {
      validator: function(v: string) {
        return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(v) || 
               /^https?:\/\/images\.unsplash\.com\/.+$/i.test(v);
      },
      message: 'Please provide a valid image URL'
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for farmer's full address
farmerSchema.virtual('fullAddress').get(function() {
  return `${this.location.village}, ${this.location.district}, ${this.location.state} - ${this.location.pincode}`;
});

const Farmer = mongoose.models.Farmer || mongoose.model('Farmer', farmerSchema);

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
      message: error instanceof Error ? error.message : 'Unknown error'
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
    if (error instanceof mongoose.Error.ValidationError) {
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
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}