/**
 * Seed script for marketplace livestock data with REAL images
 * Run with: node scripts/seed-marketplace-livestock.js
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/animall';

const livestockData = [
  {
    name: "Gir Cow - Excellent Milk Producer",
    description: "Healthy Gir cow in excellent condition, producing 25-30 liters of milk daily. Properly vaccinated and well-maintained. Born in 2020, currently 4 years old. Ideal for dairy farming or breeding purposes. Comes with vaccination certificate and health records. Located in Ahmedabad, Gujarat. Ready for immediate sale.",
    category: "livestock",
    condition: "used",
    price: 85000,
    images: [
      "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800",
      "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800"
    ],
    location: "Ahmedabad, Gujarat",
    sellerId: "seller-001",
    sellerName: "Rajesh Patel",
    sellerPhone: "+91 9876543210",
    status: "approved",
    featured: true,
    tags: ["livestock", "gir", "cow", "dairy", "ahmedabad", "gujarat", "milk-producer"],
    quantity: 1,
    unit: "piece",
    specifications: {
      breed: "Gir",
      age: "4 years",
      weight: 450,
      gender: "Female",
      vaccinated: "Yes",
      healthStatus: "Excellent",
      milkProduction: "25-30 liters daily",
      pregnancy: "Not Pregnant"
    }
  },
  {
    name: "Holstein Friesian Cow - High Milk Yield",
    description: "Premium Holstein Friesian cow with excellent milk production capacity. Producing 35-40 liters per day. Age: 3 years. Fully vaccinated with all health certificates. Well-fed and maintained. Perfect for commercial dairy operations. Located in Pune, Maharashtra.",
    category: "livestock",
    condition: "used",
    price: 120000,
    images: [
      "https://images.unsplash.com/photo-1529148482759-b35b25c7fdf9?w=800",
      "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800",
      "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800"
    ],
    location: "Pune, Maharashtra",
    sellerId: "seller-002",
    sellerName: "Suresh Kumar",
    sellerPhone: "+91 9876543211",
    status: "approved",
    featured: true,
    tags: ["livestock", "holstein", "cow", "dairy", "pune", "maharashtra", "high-yield"],
    quantity: 1,
    unit: "piece",
    specifications: {
      breed: "Holstein Friesian",
      age: "3 years",
      weight: 500,
      gender: "Female",
      vaccinated: "Yes",
      healthStatus: "Excellent",
      milkProduction: "35-40 liters daily",
      pregnancy: "Not Pregnant"
    }
  },
  {
    name: "Cross-Bred Jersey Cow - 2 Cows",
    description: "Two healthy cross-bred Jersey cows for sale. Age: 2.5 years each. Producing 20-25 liters milk per day. Both are vaccinated and in excellent health. Well-maintained with proper feeding. Ideal for small to medium dairy farms. Located in Bangalore, Karnataka.",
    category: "livestock",
    condition: "used",
    price: 150000,
    images: [
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800",
      "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800"
    ],
    location: "Bangalore, Karnataka",
    sellerId: "seller-003",
    sellerName: "Venkatesh Reddy",
    sellerPhone: "+91 9876543212",
    status: "approved",
    featured: false,
    tags: ["livestock", "jersey", "cow", "dairy", "bangalore", "karnataka", "cross-bred"],
    quantity: 2,
    unit: "piece",
    specifications: {
      breed: "Cross-Bred Jersey",
      age: "2.5 years",
      weight: 380,
      gender: "Female",
      vaccinated: "Yes",
      healthStatus: "Excellent",
      milkProduction: "20-25 liters daily",
      pregnancy: "Not Pregnant"
    }
  },
  {
    name: "Murrah Buffalo - Premium Breed",
    description: "Premium Murrah buffalo with excellent milk production. Producing 18-22 liters of high-fat milk daily. Age: 5 years. Fully vaccinated and healthy. Comes with all health certificates. Perfect for dairy farming. Located in Ludhiana, Punjab.",
    category: "livestock",
    condition: "used",
    price: 95000,
    images: [
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800",
      "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800"
    ],
    location: "Ludhiana, Punjab",
    sellerId: "seller-004",
    sellerName: "Jaspreet Singh",
    sellerPhone: "+91 9876543213",
    status: "approved",
    featured: true,
    tags: ["livestock", "buffalo", "murrah", "dairy", "ludhiana", "punjab", "high-fat"],
    quantity: 1,
    unit: "piece",
    specifications: {
      breed: "Murrah",
      age: "5 years",
      weight: 550,
      gender: "Female",
      vaccinated: "Yes",
      healthStatus: "Excellent",
      milkProduction: "18-22 liters daily",
      pregnancy: "Not Pregnant"
    }
  },
  {
    name: "Sahiwal Cow - Pure Breed",
    description: "Pure Sahiwal cow with excellent genes. Age: 3 years. Producing 20-25 liters milk per day. Well-bred with proper lineage documentation. Vaccinated and healthy. Ideal for breeding and dairy. Located in Karnal, Haryana.",
    category: "livestock",
    condition: "used",
    price: 110000,
    images: [
      "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800",
      "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800"
    ],
    location: "Karnal, Haryana",
    sellerId: "seller-005",
    sellerName: "Ram Kumar",
    sellerPhone: "+91 9876543214",
    status: "approved",
    featured: false,
    tags: ["livestock", "sahiwal", "cow", "dairy", "karnal", "haryana", "pure-breed"],
    quantity: 1,
    unit: "piece",
    specifications: {
      breed: "Sahiwal",
      age: "3 years",
      weight: 420,
      gender: "Female",
      vaccinated: "Yes",
      healthStatus: "Excellent",
      milkProduction: "20-25 liters daily",
      pregnancy: "Not Pregnant"
    }
  },
  {
    name: "Goat Herd - 5 Goats",
    description: "Five healthy goats for sale. Mix of male and female. Age: 6 months to 2 years. All vaccinated and healthy. Well-fed and maintained. Perfect for meat production or dairy. Located in Hyderabad, Telangana.",
    category: "livestock",
    condition: "new",
    price: 35000,
    images: [
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800",
      "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800",
      "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800"
    ],
    location: "Hyderabad, Telangana",
    sellerId: "seller-006",
    sellerName: "Abdul Rahman",
    sellerPhone: "+91 9876543215",
    status: "approved",
    featured: false,
    tags: ["livestock", "goat", "herd", "meat", "dairy", "hyderabad", "telangana"],
    quantity: 5,
    unit: "piece",
    specifications: {
      breed: "Mixed",
      age: "6 months - 2 years",
      weight: 25,
      gender: "Mixed",
      vaccinated: "Yes",
      healthStatus: "Excellent",
      milkProduction: "N/A",
      pregnancy: "Unknown"
    }
  },
  {
    name: "Desi Chicken - 50 Hens",
    description: "Fifty healthy desi chickens for sale. Age: 4-6 months. All vaccinated and healthy. Ideal for egg production and meat. Well-fed with quality feed. Located in Coimbatore, Tamil Nadu.",
    category: "livestock",
    condition: "new",
    price: 25000,
    images: [
      "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800",
      "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800",
      "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800"
    ],
    location: "Coimbatore, Tamil Nadu",
    sellerId: "seller-007",
    sellerName: "Murugan M",
    sellerPhone: "+91 9876543216",
    status: "approved",
    featured: false,
    tags: ["livestock", "chicken", "poultry", "hens", "eggs", "coimbatore", "tamil-nadu"],
    quantity: 50,
    unit: "piece",
    specifications: {
      breed: "Desi",
      age: "4-6 months",
      weight: 2,
      gender: "Female",
      vaccinated: "Yes",
      healthStatus: "Excellent",
      milkProduction: "N/A",
      pregnancy: "N/A"
    }
  }
];

async function seedLivestock() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const MarketplaceListing = mongoose.model('MarketplaceListing', new mongoose.Schema({}, { strict: false }));

    console.log('Clearing existing livestock listings...');
    await MarketplaceListing.deleteMany({ category: 'livestock' });

    console.log('Inserting livestock data...');
    const result = await MarketplaceListing.insertMany(livestockData);

    console.log(`✅ Successfully inserted ${result.length} livestock listings:`);
    result.forEach((listing, index) => {
      console.log(`${index + 1}. ${listing.name} - ₹${listing.price.toLocaleString('en-IN')}`);
    });

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding livestock data:', error);
    process.exit(1);
  }
}

seedLivestock();