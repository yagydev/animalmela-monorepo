import mongoose from 'mongoose';

// ─── MarketplaceUser ────────────────────────────────────────────────────────
const marketplaceUserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, required: true },
  businessName: { type: String, required: true },
  location: {
    address: String,
    city: String,
    state: String,
    pincode: String,
  },
  role: { type: String, enum: ['vendor', 'buyer', 'admin'], default: 'vendor' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// ─── Stall ──────────────────────────────────────────────────────────────────
const stallSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MarketplaceUser',
    required: true,
  },
  location: { address: String, city: String, state: String, pincode: String },
  price: { type: Number, required: true },
  capacity: { type: Number, required: true },
  amenities: [String],
  images: [String],
  availability: {
    startTime: String,
    endTime: String,
    days: [String],
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'booked', 'maintenance'],
    default: 'active',
  },
  bookings: [
    {
      buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'MarketplaceUser' },
      startDate: Date,
      endDate: Date,
      totalAmount: Number,
      status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending',
      },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// ─── Product ────────────────────────────────────────────────────────────────
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, default: 0 },
    unit: { type: String, default: 'kg' },
    category: { type: String, index: true },
    images: [String],
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'FarmerProfile' },
    location: { city: String, state: String, pincode: String },
    organic: { type: Boolean, default: false },
    harvestDate: Date,
    availability: {
      type: String,
      enum: ['available', 'out_of_stock', 'discontinued'],
      default: 'available',
      index: true,
    },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'FarmerProfile' },
        rating: Number,
        comment: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

// ─── Order ──────────────────────────────────────────────────────────────────
const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'FarmerProfile' },
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'FarmerProfile' },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: Number,
        price: Number,
        totalPrice: Number,
      },
    ],
    totalAmount: { type: Number, required: true },
    shippingAddress: {
      name: String,
      phone: String,
      address: String,
      city: String,
      state: String,
      pincode: String,
    },
    paymentMethod: {
      type: String,
      enum: ['upi', 'wallet', 'cod', 'bank_transfer'],
      default: 'cod',
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
  },
  { timestamps: true },
);

// ─── Scheme ─────────────────────────────────────────────────────────────────
const schemeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true, index: true },
    benefits: [String],
    eligibility: {
      state: String,
      minLandHolding: Number,
      maxAnnualIncome: Number,
      farmerCategory: [String],
    },
    applicationProcess: String,
    documents: [String],
    contactInfo: {
      phone: String,
      email: String,
      website: String,
    },
    validityPeriod: {
      startDate: Date,
      endDate: Date,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'expired'],
      default: 'active',
    },
  },
  { timestamps: true },
);

// ─── Analytics ──────────────────────────────────────────────────────────────
const analyticsSchema = new mongoose.Schema(
  {
    event: { type: String, required: true },
    userId: mongoose.Schema.Types.ObjectId,
    metadata: mongoose.Schema.Types.Mixed,
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

// ─── Model registration ──────────────────────────────────────────────────────
// Double-cast via `unknown` prevents TS2590 ("union type too complex") caused by
// Mongoose's schema-generic inference when using the `||` registration pattern.
function registerModel<T>(name: string, schema: mongoose.Schema): mongoose.Model<T> {
  return (mongoose.models[name] || mongoose.model(name, schema)) as unknown as mongoose.Model<T>;
}

type Doc = Record<string, unknown>;

export const MarketplaceUser = registerModel<Doc>('MarketplaceUser', marketplaceUserSchema);
export const Stall            = registerModel<Doc>('Stall',            stallSchema);
export const Product          = registerModel<Doc>('Product',          productSchema);
export const Order            = registerModel<Doc>('Order',            orderSchema);
export const Scheme           = registerModel<Doc>('Scheme',           schemeSchema);
export const Analytics        = registerModel<Doc>('Analytics',        analyticsSchema);

// Alias for routes that import as `User`
export const User = MarketplaceUser;
