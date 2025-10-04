const { connectDB, disconnectDB } = require('../lib/mongodb');
const { Farmer, Product } = require('../lib/schemas');

// Sample farmers data
const sampleFarmers = [
  {
    name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    mobile: '9876543210',
    location: {
      state: 'Punjab',
      district: 'Ludhiana',
      pincode: '141001',
      village: 'Village A'
    },
    products: ['Wheat', 'Rice', 'Corn'],
    images: [
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=200&fit=crop',
      'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&h=200&fit=crop'
    ],
    rating: {
      average: 4.5,
      count: 12
    }
  },
  {
    name: 'Priya Sharma',
    email: 'priya@example.com',
    mobile: '9876543211',
    location: {
      state: 'Haryana',
      district: 'Karnal',
      pincode: '132001',
      village: 'Village B'
    },
    products: ['Rice', 'Vegetables', 'Fruits'],
    images: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop'
    ],
    rating: {
      average: 4.2,
      count: 8
    }
  },
  {
    name: 'Amit Singh',
    email: 'amit@example.com',
    mobile: '9876543212',
    location: {
      state: 'Uttar Pradesh',
      district: 'Meerut',
      pincode: '250001',
      village: 'Village C'
    },
    products: ['Sugarcane', 'Potatoes', 'Onions'],
    images: [
      'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=300&h=200&fit=crop'
    ],
    rating: {
      average: 4.8,
      count: 15
    }
  },
  {
    name: 'Sunita Devi',
    email: 'sunita@example.com',
    mobile: '9876543213',
    location: {
      state: 'Bihar',
      district: 'Patna',
      pincode: '800001',
      village: 'Village D'
    },
    products: ['Rice', 'Lentils', 'Spices'],
    images: [
      'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=300&h=200&fit=crop'
    ],
    rating: {
      average: 4.3,
      count: 10
    }
  },
  {
    name: 'Vikram Patel',
    email: 'vikram@example.com',
    mobile: '9876543214',
    location: {
      state: 'Gujarat',
      district: 'Ahmedabad',
      pincode: '380001',
      village: 'Village E'
    },
    products: ['Cotton', 'Groundnuts', 'Sesame'],
    images: [
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300&h=200&fit=crop'
    ],
    rating: {
      average: 4.6,
      count: 20
    }
  }
];

// Sample products data
const sampleProducts = [
  {
    name: 'Organic Wheat',
    category: 'crop',
    description: 'Premium quality organic wheat grown without pesticides',
    price: 2500,
    unit: 'quintal',
    availableQuantity: 10,
    quality: 'organic',
    images: [
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=200&fit=crop'
    ],
    location: {
      state: 'Punjab',
      district: 'Ludhiana',
      pincode: '141001',
      village: 'Village A'
    },
    rating: {
      average: 4.5,
      count: 25
    }
  },
  {
    name: 'Fresh Tomatoes',
    category: 'vegetables',
    description: 'Fresh, juicy tomatoes perfect for cooking and salads',
    price: 40,
    unit: 'kg',
    availableQuantity: 50,
    quality: 'premium',
    images: [
      'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&h=200&fit=crop'
    ],
    location: {
      state: 'Haryana',
      district: 'Karnal',
      pincode: '132001',
      village: 'Village B'
    },
    rating: {
      average: 4.2,
      count: 18
    }
  },
  {
    name: 'Mangoes (Alphonso)',
    category: 'fruits',
    description: 'Sweet and juicy Alphonso mangoes, king of fruits',
    price: 120,
    unit: 'kg',
    availableQuantity: 25,
    quality: 'premium',
    images: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop'
    ],
    location: {
      state: 'Uttar Pradesh',
      district: 'Meerut',
      pincode: '250001',
      village: 'Village C'
    },
    rating: {
      average: 4.8,
      count: 32
    }
  },
  {
    name: 'Fresh Milk',
    category: 'dairy',
    description: 'Pure, fresh cow milk delivered daily',
    price: 60,
    unit: 'litre',
    availableQuantity: 100,
    quality: 'organic',
    images: [
      'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=300&h=200&fit=crop'
    ],
    location: {
      state: 'Bihar',
      district: 'Patna',
      pincode: '800001',
      village: 'Village D'
    },
    rating: {
      average: 4.3,
      count: 15
    }
  },
  {
    name: 'Cotton Seeds',
    category: 'seeds',
    description: 'High-quality cotton seeds for better yield',
    price: 500,
    unit: 'kg',
    availableQuantity: 20,
    quality: 'premium',
    images: [
      'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=300&h=200&fit=crop'
    ],
    location: {
      state: 'Gujarat',
      district: 'Ahmedabad',
      pincode: '380001',
      village: 'Village E'
    },
    rating: {
      average: 4.6,
      count: 22
    }
  }
];

/**
 * Clear existing data
 */
async function clearData() {
  try {
    console.log('🗑️  Clearing existing data...');
    await Farmer.deleteMany({});
    await Product.deleteMany({});
    console.log('✅ Data cleared successfully');
  } catch (error) {
    console.error('❌ Error clearing data:', error);
    throw error;
  }
}

/**
 * Seed farmers data
 */
async function seedFarmers() {
  try {
    console.log('🌱 Seeding farmers data...');
    
    const farmers = await Farmer.insertMany(sampleFarmers);
    console.log(`✅ ${farmers.length} farmers seeded successfully`);
    
    return farmers;
  } catch (error) {
    console.error('❌ Error seeding farmers:', error);
    throw error;
  }
}

/**
 * Seed products data
 */
async function seedProducts(farmers) {
  try {
    console.log('🌱 Seeding products data...');
    
    // Map products to farmers
    const productsWithFarmers = sampleProducts.map((product, index) => {
      const farmer = farmers[index % farmers.length];
      return {
        ...product,
        farmer: farmer._id
      };
    });
    
    const products = await Product.insertMany(productsWithFarmers);
    console.log(`✅ ${products.length} products seeded successfully`);
    
    return products;
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    throw error;
  }
}

/**
 * Main seeding function
 */
async function seedDatabase() {
  try {
    console.log('🚀 Starting database seeding...');
    
    // Connect to database
    await connectDB();
    
    // Clear existing data
    await clearData();
    
    // Seed farmers
    const farmers = await seedFarmers();
    
    // Seed products
    const products = await seedProducts(farmers);
    
    console.log('🎉 Database seeding completed successfully!');
    console.log(`📊 Total farmers: ${farmers.length}`);
    console.log(`📊 Total products: ${products.length}`);
    
    // Display summary
    console.log('\n📋 Farmers Summary:');
    farmers.forEach(farmer => {
      console.log(`  • ${farmer.name} (${farmer.email}) - ${farmer.location.state}`);
    });
    
    console.log('\n📋 Products Summary:');
    products.forEach(product => {
      console.log(`  • ${product.name} - ₹${product.price}/${product.unit} - ${product.category}`);
    });
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  } finally {
    // Disconnect from database
    await disconnectDB();
  }
}

/**
 * Check if data already exists
 */
async function checkExistingData() {
  try {
    await connectDB();
    
    const farmerCount = await Farmer.countDocuments();
    const productCount = await Product.countDocuments();
    
    console.log(`📊 Current data: ${farmerCount} farmers, ${productCount} products`);
    
    if (farmerCount > 0 || productCount > 0) {
      console.log('⚠️  Data already exists. Use --force to clear and reseed.');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('❌ Error checking existing data:', error);
    return false;
  } finally {
    await disconnectDB();
  }
}

// Command line interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const force = args.includes('--force');
  
  if (force) {
    console.log('🔄 Force mode enabled - will clear existing data');
    seedDatabase();
  } else {
    checkExistingData().then(hasData => {
      if (!hasData) {
        seedDatabase();
      } else {
        console.log('💡 Run with --force to clear and reseed data');
        process.exit(0);
      }
    });
  }
}

module.exports = {
  seedDatabase,
  clearData,
  seedFarmers,
  seedProducts,
  checkExistingData
};
