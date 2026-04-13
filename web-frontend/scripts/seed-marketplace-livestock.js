/**
 * Seed script for marketplace livestock data — updated schema (animalType, ageYears, etc.)
 * Run with: node scripts/seed-marketplace-livestock.js
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kisaanmela_db_dev';

const livestockData = [
  // ── COW / BUFFALO DAIRY ──────────────────────────────────
  {
    name: 'Gir Cow — 26L/Day, 4 Years Old',
    description:
      'Healthy Gir cow in excellent condition, producing 25–30 litres of A2 milk daily. Properly vaccinated (FMD, HS, BQ). Born 2021, currently in 2nd lactation. Ideal for dairy or breeding. Comes with vaccination certificate and vet health records. Ready for immediate sale. Price negotiable for serious buyers.',
    category: 'livestock',
    condition: 'used',
    price: 85000,
    location: 'Ahmedabad, Gujarat',
    sellerId: 'seller_001',
    sellerName: 'Rajesh Patel',
    sellerPhone: '9876543210',
    status: 'approved',
    featured: true,
    viewsCount: 142,
    tags: ['gir', 'cow', 'dairy', 'a2-milk', 'gujarat'],
    images: [
      'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800',
      'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800',
    ],
    specifications: {
      animalType: 'cow',
      breed: 'Gir',
      ageYears: 4,
      milkYieldPerDay: 26,
      lactationStatus: '2nd lactation, 3 months',
      pregnant: false,
      healthSummary: 'Excellent — no diseases, regular deworming',
      vaccinationSummary: 'FMD, HS, BQ done April 2025',
      sellerType: 'farmer',
      state: 'Gujarat',
      city: 'Ahmedabad',
      negotiable: true,
      verifiedListing: false,
    },
  },
  {
    name: 'Holstein Friesian — 38L/Day Commercial Dairy',
    description:
      'Premium HF cow producing 35–40 litres per day. Age 3 years, 1st lactation. Fully vaccinated. Well-fed TMR ration, maintained by professional dairy manager. Ideal for commercial dairy operations. Located in Pune, Maharashtra. Transport can be arranged to nearby districts.',
    category: 'livestock',
    condition: 'used',
    price: 120000,
    location: 'Pune, Maharashtra',
    sellerId: 'seller_002',
    sellerName: 'Suresh Kumar',
    sellerPhone: '9876543211',
    status: 'approved',
    featured: true,
    viewsCount: 218,
    tags: ['holstein', 'hf', 'cow', 'high-yield', 'maharashtra'],
    images: [
      'https://images.unsplash.com/photo-1529148482759-b35b25c7fdf9?w=800',
      'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800',
    ],
    specifications: {
      animalType: 'cow',
      breed: 'Holstein Friesian',
      ageYears: 3,
      milkYieldPerDay: 38,
      lactationStatus: '1st lactation, 2 months',
      pregnant: false,
      healthSummary: 'Excellent health, housed in clean shed',
      vaccinationSummary: 'FMD, Brucellosis, HS done 2025',
      sellerType: 'farmer',
      state: 'Maharashtra',
      city: 'Pune',
      negotiable: false,
      verifiedListing: true,
    },
  },
  {
    name: 'Murrah Buffalo — 20L/Day, 5 Years',
    description:
      'Premium Murrah buffalo with excellent milk production. Producing 18–22 litres of high-fat milk (7% fat) daily. Age 5 years. Fully vaccinated and healthy. Comes with all health certificates. 3rd lactation. Perfect for dairy farming. Buyer must arrange transport from Ludhiana.',
    category: 'livestock',
    condition: 'used',
    price: 95000,
    location: 'Ludhiana, Punjab',
    sellerId: 'seller_004',
    sellerName: 'Jaspreet Singh',
    sellerPhone: '9876543213',
    status: 'approved',
    featured: true,
    viewsCount: 307,
    tags: ['murrah', 'buffalo', 'high-fat', 'punjab', 'dairy'],
    images: [
      'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=800',
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
    ],
    specifications: {
      animalType: 'buffalo',
      breed: 'Murrah',
      ageYears: 5,
      milkYieldPerDay: 20,
      lactationStatus: '3rd lactation, 1.5 months',
      pregnant: false,
      healthSummary: 'Healthy, last vet check March 2026',
      vaccinationSummary: 'FMD, HS done 2025, BQ 2024',
      sellerType: 'farmer',
      state: 'Punjab',
      city: 'Ludhiana',
      negotiable: true,
      verifiedListing: false,
    },
  },
  {
    name: 'Sahiwal Cow — Pure Breed, 22L/Day',
    description:
      'Pure Sahiwal cow with excellent genes and lineage documentation. Age 3 years. Producing 20–25 litres per day. Well-bred, vaccinated and healthy. Ideal for breeding programmes, A2 milk dairies and organic farms. Located near Karnal NDRI — vet inspection available.',
    category: 'livestock',
    condition: 'used',
    price: 110000,
    location: 'Karnal, Haryana',
    sellerId: 'seller_005',
    sellerName: 'Ram Kumar',
    sellerPhone: '9876543214',
    status: 'approved',
    featured: false,
    viewsCount: 89,
    tags: ['sahiwal', 'cow', 'a2-milk', 'pure-breed', 'haryana'],
    images: [
      'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800',
      'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800',
    ],
    specifications: {
      animalType: 'cow',
      breed: 'Sahiwal',
      ageYears: 3,
      milkYieldPerDay: 22,
      lactationStatus: '2nd lactation, 4 months',
      pregnant: false,
      healthSummary: 'Excellent health, NDRI checked',
      vaccinationSummary: 'FMD, Brucellosis, HS 2025',
      sellerType: 'farmer',
      state: 'Haryana',
      city: 'Karnal',
      negotiable: true,
      verifiedListing: false,
    },
  },
  {
    name: 'Jersey × HF Cross — 28L/Day, 2.5 Years',
    description:
      'Two healthy Jersey×HF cross cows. Each producing 20–25 litres per day. Age 2.5 years. Both vaccinated, healthy, in milk. Excellent temperament. Ideal for small to medium dairy farms. Price is per animal — buy one or both. Located near Bangalore, Karnataka.',
    category: 'livestock',
    condition: 'used',
    price: 78000,
    location: 'Bangalore, Karnataka',
    sellerId: 'seller_003',
    sellerName: 'Venkatesh Reddy',
    sellerPhone: '9876543212',
    status: 'approved',
    featured: false,
    viewsCount: 64,
    tags: ['jersey', 'cross-breed', 'cow', 'karnataka', 'dairy'],
    images: [
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
      'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800',
    ],
    specifications: {
      animalType: 'cow',
      breed: 'Jersey Cross',
      ageYears: 2,
      ageMonths: 6,
      milkYieldPerDay: 24,
      lactationStatus: '1st lactation, 5 months',
      pregnant: false,
      healthSummary: 'Good health, no known issues',
      vaccinationSummary: 'FMD, HS done 2025',
      sellerType: 'farmer',
      state: 'Karnataka',
      city: 'Bangalore',
      negotiable: true,
      verifiedListing: false,
    },
  },
  {
    name: 'Murrah Buffalo — Pregnant, Due June 2026',
    description:
      'Young Murrah buffalo, 3 years old, currently 6 months pregnant. First calving expected June 2026. Peak yield expected 15–18L/day. Fully vaccinated. Buy now and she will start milking by July. Located in Hisar, Haryana — one of the top Murrah belts.',
    category: 'livestock',
    condition: 'used',
    price: 72000,
    location: 'Hisar, Haryana',
    sellerId: 'seller_006',
    sellerName: 'Dharamvir Singh',
    sellerPhone: '9123456789',
    status: 'approved',
    featured: false,
    viewsCount: 53,
    tags: ['murrah', 'buffalo', 'pregnant', 'haryana', 'hisar'],
    images: [
      'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=800',
    ],
    specifications: {
      animalType: 'buffalo',
      breed: 'Murrah',
      ageYears: 3,
      milkYieldPerDay: 0,
      lactationStatus: 'Not milking — pregnant',
      pregnant: true,
      healthSummary: 'Healthy pregnancy, vet confirmed',
      vaccinationSummary: 'FMD, HS 2025, dewormed March 2026',
      sellerType: 'farmer',
      state: 'Haryana',
      city: 'Hisar',
      negotiable: true,
      verifiedListing: false,
    },
  },
  {
    name: 'Gir Cow — Pregnant, 3rd Parity',
    description:
      'Proven high-production Gir cow, 6 years old, 3rd parity. Currently 5 months pregnant. Previous two lactations averaged 22L/day. Vaccinated, healthy, calm temperament. Price negotiable. Genuine sale — relocating farm.',
    category: 'livestock',
    condition: 'used',
    price: 90000,
    location: 'Rajkot, Gujarat',
    sellerId: 'seller_007',
    sellerName: 'Bhavesh Desai',
    sellerPhone: '9988776655',
    status: 'approved',
    featured: false,
    viewsCount: 77,
    tags: ['gir', 'cow', 'pregnant', 'gujarat', 'a2-milk'],
    images: [
      'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800',
    ],
    specifications: {
      animalType: 'cow',
      breed: 'Gir',
      ageYears: 6,
      milkYieldPerDay: 0,
      lactationStatus: 'Dry — pregnant (5 months)',
      pregnant: true,
      healthSummary: 'Good health, pregnancy confirmed by vet',
      vaccinationSummary: 'FMD, HS, BQ done 2025',
      sellerType: 'farmer',
      state: 'Gujarat',
      city: 'Rajkot',
      negotiable: true,
      verifiedListing: false,
    },
  },
  // ── GOAT ──────────────────────────────────────────────
  {
    name: 'Sirohi Goat — 5 Females + 1 Male Kid',
    description:
      'Six healthy Sirohi goats — 5 females (2–3 years) and 1 male kid (4 months). All vaccinated against PPR, ET and FMD. Females producing 1.5L/day each. Ideal for milk or meat production. Located in Hyderabad, Telangana.',
    category: 'livestock',
    condition: 'used',
    price: 42000,
    location: 'Hyderabad, Telangana',
    sellerId: 'seller_008',
    sellerName: 'Abdul Rahman',
    sellerPhone: '9876543215',
    status: 'approved',
    featured: false,
    viewsCount: 38,
    tags: ['goat', 'sirohi', 'goat-milk', 'telangana', 'herd'],
    images: [
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800',
    ],
    specifications: {
      animalType: 'goat',
      breed: 'Sirohi',
      ageYears: 2,
      milkYieldPerDay: 1.5,
      lactationStatus: 'In milk',
      pregnant: false,
      healthSummary: 'Vaccinated, healthy, regular deworming',
      vaccinationSummary: 'PPR, ET, FMD done 2025',
      sellerType: 'farmer',
      state: 'Telangana',
      city: 'Hyderabad',
      negotiable: true,
      verifiedListing: false,
    },
  },
  {
    name: 'Beetal Goat — 3 Milking Does',
    description:
      'Three purebred Beetal goats, 2.5–3 years old, each producing 2–2.5L/day of rich milk. Vaccinated. Good for small dairy or meat. Easy to manage, calm temperament. Sale due to farm expansion. Located in Amritsar, Punjab.',
    category: 'livestock',
    condition: 'used',
    price: 38000,
    location: 'Amritsar, Punjab',
    sellerId: 'seller_009',
    sellerName: 'Kuldeep Kaur',
    sellerPhone: '9765432100',
    status: 'approved',
    featured: false,
    viewsCount: 27,
    tags: ['goat', 'beetal', 'milk-goat', 'punjab'],
    images: [
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800',
    ],
    specifications: {
      animalType: 'goat',
      breed: 'Beetal',
      ageYears: 2,
      ageMonths: 6,
      milkYieldPerDay: 2.2,
      lactationStatus: '2nd lactation, 2 months',
      pregnant: false,
      healthSummary: 'Healthy, vaccinated',
      vaccinationSummary: 'PPR, FMD done 2025',
      sellerType: 'farmer',
      state: 'Punjab',
      city: 'Amritsar',
      negotiable: true,
      verifiedListing: false,
    },
  },
  // ── SHEEP ─────────────────────────────────────────────
  {
    name: 'Nellore Sheep — 10 Ewes + 2 Rams',
    description:
      'Twelve Nellore sheep (10 ewes, 2 rams), age 1–2 years. Fast-growing breed, excellent for mutton production. All healthy and vaccinated. Sold as a herd. Ideal for commercial sheep farm or stocking foundation herd. Located in Kurnool, Andhra Pradesh.',
    category: 'livestock',
    condition: 'used',
    price: 55000,
    location: 'Kurnool, Andhra Pradesh',
    sellerId: 'seller_010',
    sellerName: 'Nagaraju Reddy',
    sellerPhone: '9012345678',
    status: 'approved',
    featured: false,
    viewsCount: 45,
    tags: ['sheep', 'nellore', 'mutton', 'andhra-pradesh'],
    images: [
      'https://images.unsplash.com/photo-1564150804893-80f30fcf894c?w=800',
    ],
    specifications: {
      animalType: 'sheep',
      breed: 'Nellore',
      ageYears: 1,
      milkYieldPerDay: 0,
      pregnant: false,
      healthSummary: 'Good health, no disease history',
      vaccinationSummary: 'PPR, ET, FMD done 2025',
      sellerType: 'farmer',
      state: 'Andhra Pradesh',
      city: 'Kurnool',
      negotiable: true,
      verifiedListing: false,
    },
  },
  // ── POULTRY ───────────────────────────────────────────
  {
    name: 'Desi Country Chicken — 50 Hens, 4 Months',
    description:
      'Fifty desi country chickens (50 hens), age 4–6 months. Vaccinated against ND, IBD, Marek. Well-fed on grain + green supplement. Each lays 180–200 eggs/year. Suitable for free-range or backyard poultry. Located in Coimbatore, Tamil Nadu.',
    category: 'livestock',
    condition: 'used',
    price: 25000,
    location: 'Coimbatore, Tamil Nadu',
    sellerId: 'seller_011',
    sellerName: 'Murugan M',
    sellerPhone: '9876543216',
    status: 'approved',
    featured: false,
    viewsCount: 31,
    tags: ['chicken', 'poultry', 'desi', 'eggs', 'tamil-nadu'],
    images: [
      'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800',
    ],
    specifications: {
      animalType: 'poultry',
      breed: 'Desi Country',
      ageMonths: 5,
      healthSummary: 'Vaccinated, no mortality in last 3 months',
      vaccinationSummary: 'ND, IBD, Marek done',
      sellerType: 'farmer',
      state: 'Tamil Nadu',
      city: 'Coimbatore',
      negotiable: false,
      verifiedListing: false,
    },
  },
  // ── MORE BUFFALOS ─────────────────────────────────────
  {
    name: 'Surti Buffalo — 14L/Day, Calm Temperament',
    description:
      'Surti breed buffalo, 4 years old, 2nd lactation. Producing 13–15 litres per day. Calm, easy to milk, good for small family dairy. Fully vaccinated. Moderate price — genuine seller, urgent sale due to migration. Located in Surat, Gujarat.',
    category: 'livestock',
    condition: 'used',
    price: 65000,
    location: 'Surat, Gujarat',
    sellerId: 'seller_012',
    sellerName: 'Ramesh Patel',
    sellerPhone: '9011223344',
    status: 'approved',
    featured: false,
    viewsCount: 48,
    tags: ['buffalo', 'surti', 'dairy', 'gujarat', 'family-dairy'],
    images: [
      'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=800',
    ],
    specifications: {
      animalType: 'buffalo',
      breed: 'Surti',
      ageYears: 4,
      milkYieldPerDay: 14,
      lactationStatus: '2nd lactation, 4 months',
      pregnant: false,
      healthSummary: 'Good health, no diseases',
      vaccinationSummary: 'FMD, HS done 2025',
      sellerType: 'farmer',
      state: 'Gujarat',
      city: 'Surat',
      negotiable: true,
      verifiedListing: false,
    },
  },
  {
    name: 'Jaffarabadi Buffalo — 16L/Day, 2nd Lactation',
    description:
      'Jaffarabadi buffalo — known for high fat content (8–9%). Age 5 years, 2nd lactation. 16L/day average. Heavy built, 650+ kg body weight. Best for ghee production. Fully vaccinated. Located near Junagadh, Gujarat.',
    category: 'livestock',
    condition: 'used',
    price: 105000,
    location: 'Junagadh, Gujarat',
    sellerId: 'seller_013',
    sellerName: 'Hiren Bhalala',
    sellerPhone: '9099887766',
    status: 'approved',
    featured: true,
    viewsCount: 124,
    tags: ['buffalo', 'jaffarabadi', 'high-fat', 'ghee', 'gujarat'],
    images: [
      'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=800',
    ],
    specifications: {
      animalType: 'buffalo',
      breed: 'Jaffarabadi',
      ageYears: 5,
      milkYieldPerDay: 16,
      lactationStatus: '2nd lactation, 2 months',
      pregnant: false,
      healthSummary: 'Excellent health, top breed',
      vaccinationSummary: 'FMD, HS, BQ done 2025',
      sellerType: 'farmer',
      state: 'Gujarat',
      city: 'Junagadh',
      negotiable: false,
      verifiedListing: true,
    },
  },
  // ── MORE COWS ──────────────────────────────────────────
  {
    name: 'Red Sindhi Cow — A2 Milk, 18L/Day',
    description:
      'Pure Red Sindhi cow, 3.5 years, 2nd lactation. Producing 17–19 litres A2 milk/day. Tick-resistant, well adapted to hot climate. Gentle temperament. Vaccinated. Good option for organic A2 dairy. Located in Jodhpur, Rajasthan.',
    category: 'livestock',
    condition: 'used',
    price: 75000,
    location: 'Jodhpur, Rajasthan',
    sellerId: 'seller_014',
    sellerName: 'Sumer Singh Rathore',
    sellerPhone: '9111222333',
    status: 'approved',
    featured: false,
    viewsCount: 60,
    tags: ['red-sindhi', 'cow', 'a2-milk', 'rajasthan', 'heat-tolerant'],
    images: [
      'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800',
    ],
    specifications: {
      animalType: 'cow',
      breed: 'Red Sindhi',
      ageYears: 3,
      ageMonths: 6,
      milkYieldPerDay: 18,
      lactationStatus: '2nd lactation, 3 months',
      pregnant: false,
      healthSummary: 'Excellent health, heat tolerant',
      vaccinationSummary: 'FMD, HS done 2025',
      sellerType: 'farmer',
      state: 'Rajasthan',
      city: 'Jodhpur',
      negotiable: true,
      verifiedListing: false,
    },
  },
  {
    name: 'Ongole Bull — Pure Breed, 3 Years',
    description:
      'Pure Ongole bull, 3 years, 450 kg, excellent body confirmation. Ideal for natural service or frozen semen collection. Papers available. Strong, healthy, good pedigree. Located in Guntur, Andhra Pradesh.',
    category: 'livestock',
    condition: 'used',
    price: 55000,
    location: 'Guntur, Andhra Pradesh',
    sellerId: 'seller_015',
    sellerName: 'Siva Prasad',
    sellerPhone: '9444555666',
    status: 'approved',
    featured: false,
    viewsCount: 35,
    tags: ['ongole', 'bull', 'breeding', 'andhra-pradesh'],
    images: [
      'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800',
    ],
    specifications: {
      animalType: 'cow',
      breed: 'Ongole',
      ageYears: 3,
      milkYieldPerDay: 0,
      healthSummary: 'Excellent, strong bull',
      vaccinationSummary: 'FMD, HS, BQ done 2025',
      sellerType: 'farmer',
      state: 'Andhra Pradesh',
      city: 'Guntur',
      negotiable: true,
      verifiedListing: false,
    },
  },
];

async function seedLivestock() {
  try {
    console.log('Connecting to MongoDB…');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected:', MONGODB_URI.replace(/\/\/.*@/, '//***@'));

    const ListingSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
    const MarketplaceListing =
      mongoose.models.MarketplaceListing ||
      mongoose.model('MarketplaceListing', ListingSchema);

    console.log('Clearing existing livestock listings…');
    const deleted = await MarketplaceListing.deleteMany({ category: 'livestock' });
    console.log(`Deleted ${deleted.deletedCount} old livestock listings`);

    console.log('Inserting new livestock data…');
    const result = await MarketplaceListing.insertMany(livestockData, { ordered: false });
    console.log(`\n✅ Inserted ${result.length} livestock listings:`);
    result.forEach((l, i) => {
      const spec = l.specifications || {};
      console.log(
        `  ${i + 1}. [${spec.animalType || '?'}/${spec.breed || '?'}] ${l.name} — ₹${Number(l.price).toLocaleString('en-IN')}`
      );
    });

    await mongoose.disconnect();
    console.log('\nDone.');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seedLivestock();
