/**
 * Seed script for marketplace product data
 * Run with: node scripts/seed-marketplace-product.js
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/animall';

const productData = [
  {
    name: "Organic Basmati Rice - Premium Quality",
    description: "Premium quality organic Basmati rice harvested fresh from our certified organic farm. Grade A quality with long grain and aromatic fragrance. No pesticides or chemicals used. Perfect for health-conscious consumers and premium restaurants. Stored in dry conditions. Available in 25kg bags.",
    category: "product",
    condition: "new",
    price: 120,
    images: [
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800",
      "https://images.unsplash.com/photo-1604950622007-38dd2e31d5d1?w=800",
      "https://images.unsplash.com/photo-1517816743773-6e0fd5182124?w=800"
    ],
    location: "Karnal, Haryana",
    sellerId: "seller-product-001",
    sellerName: "Rajesh Agriculture",
    sellerPhone: "+91 9876543401",
    status: "approved",
    featured: true,
    tags: ["product", "rice", "basmati", "organic", "karnal", "haryana", "premium-quality"],
    quantity: 25,
    unit: "kg",
    specifications: {
      variety: "Basmati",
      grade: "A",
      harvestDate: "2024-01-15",
      storage: "Dry storage",
      organic: "Yes",
      pesticideFree: "Yes",
      moisture: "12%"
    }
  },
  {
    name: "Fresh Organic Tomatoes - Garden Fresh",
    description: "Fresh, juicy organic tomatoes harvested daily from our garden. Perfect for cooking, salads, and canning. No pesticides or chemicals. Crisp, red, and flavorful. Available in bulk quantities.",
    category: "product",
    condition: "new",
    price: 45,
    images: [
      "https://images.unsplash.com/photo-1546094092-52e0a0f0ad53?w=800",
      "https://images.unsplash.com/photo-1592841200221-cc6f1b5c0d20?w=800"
    ],
    location: "Bangalore, Karnataka",
    sellerId: "seller-product-002",
    sellerName: "Priya Organic Farm",
    sellerPhone: "+91 9876543402",
    status: "approved",
    featured: true,
    tags: ["product", "tomatoes", "organic", "vegetables", "bangalore", "karnataka", "fresh"],
    quantity: 50,
    unit: "kg",
    specifications: {
      variety: "Cherry",
      grade: "A",
      harvestDate: "2024-01-20",
      storage: "Cool storage",
      organic: "Yes",
      pesticideFree: "Yes",
      moisture: "85%"
    }
  },
  {
    name: "Wheat Grains - Durum Variety",
    description: "High-quality durum wheat grains perfect for flour production. Clean, disease-free grains with excellent protein content. Stored in proper conditions. Ideal for commercial use or home milling.",
    category: "product",
    condition: "new",
    price: 28,
    images: [
      "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800",
      "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800"
    ],
    location: "Punjab, India",
    sellerId: "seller-product-003",
    sellerName: "Singh Farms",
    sellerPhone: "+91 9876543403",
    status: "approved",
    featured: false,
    tags: ["product", "wheat", "durum", "grains", "punjab", "flour"],
    quantity: 100,
    unit: "kg",
    specifications: {
      variety: "Durum",
      grade: "A",
      harvestDate: "2024-01-10",
      storage: "Dry storage",
      organic: "No",
      pesticideFree: "Yes",
      moisture: "10%"
    }
  },
  {
    name: "Fresh Carrots - Organic Farm",
    description: "Fresh, crunchy organic carrots from our farm. Rich in beta-carotene and vitamins. Perfect for salads, juices, and cooking. Farm-fresh quality guaranteed.",
    category: "product",
    condition: "new",
    price: 35,
    images: [
      "https://images.unsplash.com/photo-1608834344653-48986c3d7361?w=800",
      "https://images.unsplash.com/photo-1445282768818-728615cc910a?w=800"
    ],
    location: "Dehradun, Uttarakhand",
    sellerId: "seller-product-004",
    sellerName: "Mountain Fresh Produce",
    sellerPhone: "+91 9876543404",
    status: "approved",
    featured: false,
    tags: ["product", "carrots", "organic", "vegetables", "dehradun", "uttarakhand"],
    quantity: 30,
    unit: "kg",
    specifications: {
      variety: "Desi",
      grade: "A",
      harvestDate: "2024-01-18",
      storage: "Cool storage",
      organic: "Yes",
      pesticideFree: "Yes",
      moisture: "82%"
    }
  },
  {
    name: "Fresh Potatoes - Premium Quality",
    description: "Premium quality fresh potatoes suitable for cooking and commercial use. Clean, disease-free, and properly stored. Available in bulk quantities.",
    category: "product",
    condition: "new",
    price: 25,
    images: [
      "https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?w=800",
      "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800"
    ],
    location: "Agra, Uttar Pradesh",
    sellerId: "seller-product-005",
    sellerName: "UP Fresh Vegetables",
    sellerPhone: "+91 9876543405",
    status: "approved",
    featured: false,
    tags: ["product", "potatoes", "vegetables", "agra", "uttar-pradesh"],
    quantity: 100,
    unit: "kg",
    specifications: {
      variety: "Local",
      grade: "A",
      harvestDate: "2024-01-12",
      storage: "Dry storage",
      organic: "No",
      pesticideFree: "Yes",
      moisture: "78%"
    }
  },
  {
    name: "Fresh Onions - Bulb Variety",
    description: "Fresh, pungent onions perfect for cooking. Bulb variety with excellent storage quality. Clean and sorted. Available in bulk.",
    category: "product",
    condition: "new",
    price: 40,
    images: [
      "https://images.unsplash.com/photo-1618512496249-e72f73f5c2c1?w=800",
      "https://images.unsplash.com/photo-1605883969915-27b92c5503c6?w=800"
    ],
    location: "Nashik, Maharashtra",
    sellerId: "seller-product-006",
    sellerName: "Maharashtra Onion Farm",
    sellerPhone: "+91 9876543406",
    status: "approved",
    featured: false,
    tags: ["product", "onions", "vegetables", "nashik", "maharashtra"],
    quantity: 75,
    unit: "kg",
    specifications: {
      variety: "Bulb",
      grade: "A",
      harvestDate: "2024-01-14",
      storage: "Dry storage",
      organic: "No",
      pesticideFree: "Yes",
      moisture: "75%"
    }
  },
  {
    name: "Fresh Bananas - Organic Cavendish",
    description: "Fresh organic Cavendish bananas from our farm. Sweet, ripe, and perfectly ripened. No artificial ripening agents used. Perfect for direct consumption.",
    category: "product",
    condition: "new",
    price: 50,
    images: [
      "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=800",
      "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800"
    ],
    location: "Kerala, India",
    sellerId: "seller-product-007",
    sellerName: "Kerala Banana Farm",
    sellerPhone: "+91 9876543407",
    status: "approved",
    featured: true,
    tags: ["product", "bananas", "organic", "fruits", "kerala", "cavendish"],
    quantity: 25,
    unit: "kg",
    specifications: {
      variety: "Cavendish",
      grade: "A",
      harvestDate: "2024-01-19",
      storage: "Cool storage",
      organic: "Yes",
      pesticideFree: "Yes",
      moisture: "82%"
    }
  },
  {
    name: "Fresh Cabbage - Organic Green",
    description: "Fresh organic green cabbage from our farm. Crisp, leafy, and perfect for salads and cooking. No pesticides used. Available in bulk.",
    category: "product",
    condition: "new",
    price: 20,
    images: [
      "https://images.unsplash.com/photo-1617528227915-0bfe1bb51c0c?w=800",
      "https://images.unsplash.com/photo-1616704589447-341c0e4ecd47?w=800"
    ],
    location: "Himachal Pradesh, India",
    sellerId: "seller-product-008",
    sellerName: "HP Fresh Vegetables",
    sellerPhone: "+91 9876543408",
    status: "approved",
    featured: false,
    tags: ["product", "cabbage", "organic", "vegetables", "himachal-pradesh"],
    quantity: 40,
    unit: "kg",
    specifications: {
      variety: "Green",
      grade: "A",
      harvestDate: "2024-01-17",
      storage: "Cool storage",
      organic: "Yes",
      pesticideFree: "Yes",
      moisture: "85%"
    }
  }
];

async function seedProducts() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const MarketplaceListing = mongoose.model('MarketplaceListing', new mongoose.Schema({}, { strict: false }));

    console.log('Clearing existing product listings...');
    await MarketplaceListing.deleteMany({ category: 'product' });

    console.log('Inserting product data...');
    const result = await MarketplaceListing.insertMany(productData);

    console.log(`✅ Successfully inserted ${result.length} product listings:`);
    result.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - ₹${product.price}/${product.unit}`);
    });

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding product data:', error);
    process.exit(1);
  }
}

seedProducts();
