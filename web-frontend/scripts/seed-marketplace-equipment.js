/**
 * Seed script for marketplace equipment data
 * Run with: node scripts/seed-marketplace-equipment.js
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/animall';

const equipmentData = [
  {
    name: "Mahindra Arjun 605 DI Tractor - Well Maintained",
    description: "Well-maintained Mahindra Arjun 605 DI tractor with only 1200 hours of use. Excellent condition with regular servicing. Perfect for medium-scale farming operations. Recently serviced and ready to use immediately. Comes with all accessories and documentation.",
    category: "equipment",
    condition: "used",
    price: 450000,
    images: [
      "https://images.unsplash.com/photo-1581094794329-c8110a22af8f?w=800",
      "https://images.unsplash.com/photo-1592841200221-cc6f1b5c0d20?w=800",
      "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800"
    ],
    location: "Pune, Maharashtra",
    sellerId: "seller-equipment-001",
    sellerName: "Rajesh Tractor Sales",
    sellerPhone: "+91 9876543601",
    status: "approved",
    featured: true,
    tags: ["equipment", "tractor", "mahindra", "farming", "pune", "maharashtra", "used-tractor"],
    quantity: 1,
    unit: "piece",
    specifications: {
      brand: "Mahindra",
      model: "Arjun 605 DI",
      year: 2020,
      hours: 1200,
      fuelType: "Diesel",
      power: 50,
      maintenance: "Regular"
    }
  },
  {
    name: "John Deere 5050 Tractor - Premium Quality",
    description: "Premium John Deere 5050 tractor in excellent condition. Well-maintained with 2000 hours of operation. Perfect for medium to large-scale farming. All service records available. Ready for immediate use.",
    category: "equipment",
    condition: "used",
    price: 650000,
    images: [
      "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800",
      "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800"
    ],
    location: "Ludhiana, Punjab",
    sellerId: "seller-equipment-002",
    sellerName: "Singh Farm Equipment",
    sellerPhone: "+91 9876543602",
    status: "approved",
    featured: true,
    tags: ["equipment", "tractor", "john-deere", "farming", "ludhiana", "punjab"],
    quantity: 1,
    unit: "piece",
    specifications: {
      brand: "John Deere",
      model: "5050",
      year: 2018,
      hours: 2000,
      fuelType: "Diesel",
      power: 55,
      maintenance: "Regular"
    }
  },
  {
    name: "Irrigation Pump Set - 5HP Electric Motor",
    description: "High-efficiency irrigation pump set with 5HP electric motor. Suitable for small to medium farms. Includes all accessories and pipes. Brand new, never used. Perfect for water pumping and irrigation needs.",
    category: "equipment",
    condition: "new",
    price: 35000,
    images: [
      "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800",
      "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800"
    ],
    location: "Ahmedabad, Gujarat",
    sellerId: "seller-equipment-003",
    sellerName: "Gujarat Pump Solutions",
    sellerPhone: "+91 9876543603",
    status: "approved",
    featured: false,
    tags: ["equipment", "pump", "irrigation", "motor", "ahmedabad", "gujarat"],
    quantity: 1,
    unit: "piece",
    specifications: {
      brand: "Kirloskar",
      model: "KP-5",
      year: 2024,
      hours: 0,
      fuelType: "Electric",
      power: 5,
      maintenance: "Not Required"
    }
  },
  {
    name: "Rotary Tiller - 2 Wheel Drive",
    description: "Heavy-duty rotary tiller perfect for soil preparation. 2-wheel drive with excellent tilling capacity. Well-maintained and ready to use. Ideal for small to medium farms. Includes all attachments.",
    category: "equipment",
    condition: "used",
    price: 85000,
    images: [
      "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800",
      "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800"
    ],
    location: "Bangalore, Karnataka",
    sellerId: "seller-equipment-004",
    sellerName: "Karnataka Farm Tools",
    sellerPhone: "+91 9876543604",
    status: "approved",
    featured: false,
    tags: ["equipment", "tiller", "farming", "bangalore", "karnataka"],
    quantity: 1,
    unit: "piece",
    specifications: {
      brand: "Mahindra",
      model: "Tiller-2WD",
      year: 2021,
      hours: 800,
      fuelType: "Diesel",
      power: 20,
      maintenance: "Regular"
    }
  },
  {
    name: "Harvester Combine - 4-Wheel Drive",
    description: "Heavy-duty combine harvester in excellent condition. 4-wheel drive with excellent harvesting capacity. Perfect for large-scale farming operations. Well-maintained with service records.",
    category: "equipment",
    condition: "used",
    price: 1500000,
    images: [
      "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800",
      "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800"
    ],
    location: "Haryana, India",
    sellerId: "seller-equipment-005",
    sellerName: "Haryana Agricultural Equipment",
    sellerPhone: "+91 9876543605",
    status: "approved",
    featured: true,
    tags: ["equipment", "harvester", "combine", "farming", "haryana"],
    quantity: 1,
    unit: "piece",
    specifications: {
      brand: "John Deere",
      model: "Combine-4WD",
      year: 2019,
      hours: 1500,
      fuelType: "Diesel",
      power: 100,
      maintenance: "Regular"
    }
  },
  {
    name: "Seed Drill Machine - 8 Row",
    description: "High-quality seed drill machine with 8 rows. Perfect for precision sowing. Excellent condition with minimal use. Includes all accessories and documentation. Ideal for wheat, rice, and other crops.",
    category: "equipment",
    condition: "used",
    price: 75000,
    images: [
      "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800",
      "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800"
    ],
    location: "Uttar Pradesh, India",
    sellerId: "seller-equipment-006",
    sellerName: "UP Farm Solutions",
    sellerPhone: "+91 9876543606",
    status: "approved",
    featured: false,
    tags: ["equipment", "seed-drill", "farming", "uttar-pradesh"],
    quantity: 1,
    unit: "piece",
    specifications: {
      brand: "Mahindra",
      model: "Seed-Drill-8",
      year: 2022,
      hours: 500,
      fuelType: "Diesel",
      power: 30,
      maintenance: "Regular"
    }
  },
  {
    name: "Power Tiller - 8HP Diesel",
    description: "Compact power tiller with 8HP diesel engine. Perfect for small farms and gardens. Easy to operate and maintain. Includes all accessories. Excellent fuel efficiency.",
    category: "equipment",
    condition: "used",
    price: 45000,
    images: [
      "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800",
      "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800"
    ],
    location: "Tamil Nadu, India",
    sellerId: "seller-equipment-007",
    sellerName: "TN Farm Equipment",
    sellerPhone: "+91 9876543607",
    status: "approved",
    featured: false,
    tags: ["equipment", "power-tiller", "farming", "tamil-nadu"],
    quantity: 1,
    unit: "piece",
    specifications: {
      brand: "Mahindra",
      model: "Power-Tiller-8HP",
      year: 2021,
      hours: 600,
      fuelType: "Diesel",
      power: 8,
      maintenance: "Regular"
    }
  },
  {
    name: "Plough - Heavy Duty",
    description: "Heavy-duty plough for deep soil cultivation. Excellent condition with minimal wear. Perfect for medium to large farms. Includes all attachments and documentation.",
    category: "equipment",
    condition: "used",
    price: 25000,
    images: [
      "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800",
      "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800"
    ],
    location: "Rajasthan, India",
    sellerId: "seller-equipment-008",
    sellerName: "Rajasthan Farm Tools",
    sellerPhone: "+91 9876543608",
    status: "approved",
    featured: false,
    tags: ["equipment", "plough", "farming", "rajasthan"],
    quantity: 1,
    unit: "piece",
    specifications: {
      brand: "Mahindra",
      model: "Plough-HD",
      year: 2020,
      hours: 700,
      fuelType: "Diesel",
      power: 25,
      maintenance: "Regular"
    }
  }
];

async function seedEquipment() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const MarketplaceListing = mongoose.model('MarketplaceListing', new mongoose.Schema({}, { strict: false }));

    console.log('Clearing existing equipment listings...');
    await MarketplaceListing.deleteMany({ category: 'equipment' });

    console.log('Inserting equipment data...');
    const result = await MarketplaceListing.insertMany(equipmentData);

    console.log(`✅ Successfully inserted ${result.length} equipment listings:`);
    result.forEach((equipment, index) => {
      console.log(`${index + 1}. ${equipment.name} - ₹${equipment.price.toLocaleString('en-IN')}`);
    });

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding equipment data:', error);
    process.exit(1);
  }
}

seedEquipment();
