/**
 * seedMarketplaceListings.js
 *
 * Seeds the `marketplacelistings` collection used by /api/marketplace (the main
 * marketplace page). Documents need status:'approved' to appear on the page.
 */
const mongoose = require('mongoose');
const { resolveMongoUri } = require('./loadMonorepoEnv');

const MarketplaceListingSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category:    { type: String, enum: ['equipment', 'livestock', 'product'], required: true },
    condition:   { type: String, enum: ['new', 'used'], required: true },
    price:       { type: Number, required: true, min: 0 },
    images:      [{ type: String }],
    location:    { type: String, required: true },
    sellerId:    { type: String, required: true },
    sellerName:  { type: String },
    sellerPhone: { type: String },
    status:      { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' },
    featured:    { type: Boolean, default: false },
    tags:        [{ type: String }],
    quantity:    { type: Number },
    unit:        { type: String },
  },
  { timestamps: true }
);

const MarketplaceListing =
  mongoose.models.MarketplaceListing ||
  mongoose.model('MarketplaceListing', MarketplaceListingSchema);

const LISTINGS = [
  // ── Equipment ──────────────────────────────────────────────────────────────
  {
    name: 'Mahindra 475 DI Tractor - Well Maintained',
    description:
      'Used Mahindra 475 DI tractor in excellent condition. 47 HP engine, power steering, recently serviced. Ideal for medium to large farms.',
    category: 'equipment',
    condition: 'used',
    price: 450000,
    images: ['https://images.unsplash.com/photo-1592982573906-df18eb87a7f4?w=800'],
    location: 'Ludhiana, Punjab',
    sellerId: 'seller_001',
    sellerName: 'Harjinder Singh',
    sellerPhone: '9876543210',
    status: 'approved',
    featured: true,
    tags: ['tractor', 'mahindra', 'farm equipment'],
    quantity: 1,
    unit: 'piece',
  },
  {
    name: 'Rotavator 7 Feet - New',
    description:
      'Brand new 7-feet rotavator suitable for all tractors above 35 HP. Heavy-duty blades, 1-year warranty.',
    category: 'equipment',
    condition: 'new',
    price: 85000,
    images: ['https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800'],
    location: 'Amritsar, Punjab',
    sellerId: 'seller_002',
    sellerName: 'Kulwant Singh',
    sellerPhone: '9812345678',
    status: 'approved',
    featured: false,
    tags: ['rotavator', 'tillage', 'farm equipment'],
    quantity: 3,
    unit: 'piece',
  },
  {
    name: 'Drip Irrigation Kit - 1 Acre',
    description:
      'Complete drip irrigation kit for 1 acre vegetable farming. Includes main pipe, sub-pipe, drippers, fertiliser injector and filters.',
    category: 'equipment',
    condition: 'new',
    price: 18500,
    images: ['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800'],
    location: 'Nashik, Maharashtra',
    sellerId: 'seller_003',
    sellerName: 'Ramesh Patil',
    sellerPhone: '9823456789',
    status: 'approved',
    featured: true,
    tags: ['drip irrigation', 'water saving', 'irrigation'],
    quantity: 10,
    unit: 'kit',
  },
  {
    name: 'Power Sprayer 20L Battery Operated',
    description:
      'Rechargeable battery-operated knapsack sprayer. 20-litre capacity, 6–8 hours run time, adjustable nozzle.',
    category: 'equipment',
    condition: 'new',
    price: 3800,
    images: ['https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800'],
    location: 'Jaipur, Rajasthan',
    sellerId: 'seller_004',
    sellerName: 'Mohan Sharma',
    sellerPhone: '9934567890',
    status: 'approved',
    featured: false,
    tags: ['sprayer', 'pesticide', 'battery'],
    quantity: 15,
    unit: 'piece',
  },

  // ── Livestock ──────────────────────────────────────────────────────────────
  {
    name: 'Murrah Buffalo - High Milk Yield',
    description:
      'Healthy Murrah buffalo, 4 years old, currently giving 14–16 litres/day. All vaccinations up to date. Comes with health certificate.',
    category: 'livestock',
    condition: 'used',
    price: 95000,
    images: ['https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=800'],
    location: 'Karnal, Haryana',
    sellerId: 'seller_005',
    sellerName: 'Suresh Kumar',
    sellerPhone: '9845678901',
    status: 'approved',
    featured: true,
    tags: ['buffalo', 'dairy', 'murrah'],
    quantity: 2,
    unit: 'animal',
  },
  {
    name: 'Sahiwal Cow - Pure Breed',
    description:
      'Pure Sahiwal breed cow, 3 years old, giving 10–12 litres/day. Gentle temperament, easy to handle. Disease-free certificate available.',
    category: 'livestock',
    condition: 'used',
    price: 75000,
    images: ['https://images.unsplash.com/photo-1527153818091-1a9638521e2a?w=800'],
    location: 'Hisar, Haryana',
    sellerId: 'seller_006',
    sellerName: 'Baldev Singh',
    sellerPhone: '9856789012',
    status: 'approved',
    featured: false,
    tags: ['cow', 'dairy', 'sahiwal'],
    quantity: 1,
    unit: 'animal',
  },
  {
    name: 'Kadaknath Chicken - 50 Birds',
    description:
      'Kadaknath (black chicken) birds, 3 months old, ready for rearing. Rich in protein, high market demand. Healthy flock from certified hatchery.',
    category: 'livestock',
    condition: 'new',
    price: 12500,
    images: ['https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800'],
    location: 'Jhabua, Madhya Pradesh',
    sellerId: 'seller_007',
    sellerName: 'Raju Bhuriya',
    sellerPhone: '9867890123',
    status: 'approved',
    featured: false,
    tags: ['poultry', 'kadaknath', 'chicken'],
    quantity: 50,
    unit: 'bird',
  },

  // ── Produce ────────────────────────────────────────────────────────────────
  {
    name: 'Organic Basmati Rice - Premium Grade',
    description:
      'Freshly harvested organic Basmati rice, aged 6 months for enhanced aroma. No pesticides, certified organic. Minimum order 50 kg.',
    category: 'product',
    condition: 'new',
    price: 85,
    images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800'],
    location: 'Dehradun, Uttarakhand',
    sellerId: 'seller_008',
    sellerName: 'Govind Rawat',
    sellerPhone: '9878901234',
    status: 'approved',
    featured: true,
    tags: ['rice', 'basmati', 'organic'],
    quantity: 500,
    unit: 'kg',
  },
  {
    name: 'Fresh Alphonso Mangoes - Ratnagiri GI',
    description:
      'Directly from the orchard – GI-tagged Ratnagiri Alphonso mangoes. Naturally ripened, no carbide. Packing: 5 kg wooden box.',
    category: 'product',
    condition: 'new',
    price: 950,
    images: ['https://images.unsplash.com/photo-1553279768-865429fa0078?w=800'],
    location: 'Ratnagiri, Maharashtra',
    sellerId: 'seller_009',
    sellerName: 'Santosh Sathe',
    sellerPhone: '9889012345',
    status: 'approved',
    featured: true,
    tags: ['mango', 'alphonso', 'fruits', 'organic'],
    quantity: 200,
    unit: 'box (5kg)',
  },
  {
    name: 'A2 Desi Cow Ghee - Handmade',
    description:
      'Pure A2 ghee from Gir cow milk, made using traditional bilona method. 1 kg glass jar. No additives. Lab tested for purity.',
    category: 'product',
    condition: 'new',
    price: 1400,
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'],
    location: 'Anand, Gujarat',
    sellerId: 'seller_010',
    sellerName: 'Kiran Patel',
    sellerPhone: '9890123456',
    status: 'approved',
    featured: false,
    tags: ['ghee', 'a2', 'organic', 'dairy'],
    quantity: 50,
    unit: 'jar (1kg)',
  },
  {
    name: 'Red Onion - Farm Fresh 50kg Bag',
    description:
      'Farm-fresh red onions directly from Nashik. Properly cured, medium size, 50 kg gunny bag. Available for bulk orders.',
    category: 'product',
    condition: 'new',
    price: 1200,
    images: ['https://images.unsplash.com/photo-1508747703725-719777637510?w=800'],
    location: 'Nashik, Maharashtra',
    sellerId: 'seller_003',
    sellerName: 'Ramesh Patil',
    sellerPhone: '9823456789',
    status: 'approved',
    featured: false,
    tags: ['onion', 'vegetables', 'wholesale'],
    quantity: 1000,
    unit: 'bag (50kg)',
  },
  {
    name: 'Turmeric Powder - Natural & Pure 10kg',
    description:
      'Single-origin turmeric grown in Erode (GI tag). Stone-ground, high curcumin content (5%+). No colours or adulteration.',
    category: 'product',
    condition: 'new',
    price: 2200,
    images: ['https://images.unsplash.com/photo-1615485500704-8e990f9900f4?w=800'],
    location: 'Erode, Tamil Nadu',
    sellerId: 'seller_011',
    sellerName: 'Anbazhagan R',
    sellerPhone: '9901234567',
    status: 'approved',
    featured: false,
    tags: ['turmeric', 'spices', 'organic'],
    quantity: 200,
    unit: 'bag (10kg)',
  },
];

async function seed() {
  const uri = resolveMongoUri();
  console.log(`🔄 Connecting to MongoDB: ${uri.replace(/\/\/.*@/, '//***:***@')}`);
  await mongoose.connect(uri);
  console.log(`✅ Connected — database: ${mongoose.connection.db.databaseName}`);

  await MarketplaceListing.deleteMany({});
  console.log('🧹 Cleared existing marketplace listings');

  const inserted = await MarketplaceListing.insertMany(LISTINGS);
  console.log(`✅ Inserted ${inserted.length} marketplace listings (all status:approved)`);

  const byCategory = await MarketplaceListing.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
  ]);
  console.log('\n📊 Summary by category:');
  byCategory.forEach(({ _id, count }) => console.log(`   ${_id}: ${count}`));

  await mongoose.disconnect();
  console.log('\n🎉 Marketplace listings seed complete!\n');
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
