const mongoose = require('mongoose');

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
      validator: function(v) {
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
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true, // Automatically manages createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Product Schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    minlength: [2, 'Product name must be at least 2 characters'],
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: ['crop', 'livestock', 'seeds', 'equipment', 'vegetables', 'fruits', 'dairy'],
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  unit: {
    type: String,
    required: [true, 'Unit is required'],
    enum: ['kg', 'quintal', 'ton', 'piece', 'dozen', 'litre', 'gram'],
    lowercase: true
  },
  availableQuantity: {
    type: Number,
    required: [true, 'Available quantity is required'],
    min: [0, 'Quantity cannot be negative']
  },
  quality: {
    type: String,
    required: [true, 'Quality is required'],
    enum: ['organic', 'premium', 'standard', 'budget'],
    lowercase: true
  },
  images: [{
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(v) || 
               /^https?:\/\/images\.unsplash\.com\/.+$/i.test(v);
      },
      message: 'Please provide a valid image URL'
    }
  }],
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
    required: [true, 'Farmer reference is required']
  },
  location: {
    state: String,
    district: String,
    pincode: String,
    village: String
  },
  isAvailable: {
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
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add indexes for better performance
// Note: email index is automatically created by unique: true
farmerSchema.index({ 'location.state': 1, 'location.district': 1 });
farmerSchema.index({ products: 1 });
farmerSchema.index({ isActive: 1 });

productSchema.index({ category: 1 });
productSchema.index({ farmer: 1 });
productSchema.index({ 'location.state': 1, 'location.district': 1 });
productSchema.index({ isAvailable: 1 });
productSchema.index({ price: 1 });

// Virtual for farmer's full address
farmerSchema.virtual('fullAddress').get(function() {
  return `${this.location.village}, ${this.location.district}, ${this.location.state} - ${this.location.pincode}`;
});

// Virtual for product's full location
productSchema.virtual('fullLocation').get(function() {
  return `${this.location.village}, ${this.location.district}, ${this.location.state} - ${this.location.pincode}`;
});

// Pre-save middleware to update timestamps
farmerSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create models
const Farmer = mongoose.models.Farmer || mongoose.model('Farmer', farmerSchema);
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

module.exports = {
  Farmer,
  Product
};
