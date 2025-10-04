#!/usr/bin/env node

const { connectDB, disconnectDB, getConnectionStatus } = require('../lib/mongodb');
const { Farmer, Product } = require('../lib/schemas');

/**
 * Test MongoDB connection and basic operations
 */
async function testMongoDBIntegration() {
  try {
    console.log('🧪 Testing MongoDB Integration...\n');
    
    // Test connection
    console.log('1️⃣ Testing MongoDB Connection...');
    await connectDB();
    const status = getConnectionStatus();
    console.log('✅ Connection Status:', status);
    
    // Test farmer operations
    console.log('\n2️⃣ Testing Farmer Operations...');
    
    // Count existing farmers
    const farmerCount = await Farmer.countDocuments();
    console.log(`📊 Current farmers in database: ${farmerCount}`);
    
    // Get all farmers
    const farmers = await Farmer.find({ isActive: true }).limit(3);
    console.log(`📋 Sample farmers:`);
    farmers.forEach((farmer, index) => {
      console.log(`  ${index + 1}. ${farmer.name} (${farmer.email}) - ${farmer.location.state}`);
    });
    
    // Test product operations
    console.log('\n3️⃣ Testing Product Operations...');
    
    // Count existing products
    const productCount = await Product.countDocuments();
    console.log(`📊 Current products in database: ${productCount}`);
    
    // Get all products
    const products = await Product.find({ isAvailable: true }).limit(3);
    console.log(`📋 Sample products:`);
    products.forEach((product, index) => {
      console.log(`  ${index + 1}. ${product.name} - ₹${product.price}/${product.unit} - ${product.category}`);
    });
    
    // Test aggregation
    console.log('\n4️⃣ Testing Aggregation Queries...');
    
    // Farmers by state
    const farmersByState = await Farmer.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$location.state', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    console.log('📊 Farmers by state:');
    farmersByState.forEach(state => {
      console.log(`  • ${state._id}: ${state.count} farmers`);
    });
    
    // Products by category
    const productsByCategory = await Product.aggregate([
      { $match: { isAvailable: true } },
      { $group: { _id: '$category', count: { $sum: 1 }, avgPrice: { $avg: '$price' } } },
      { $sort: { count: -1 } }
    ]);
    console.log('📊 Products by category:');
    productsByCategory.forEach(category => {
      console.log(`  • ${category._id}: ${category.count} products (avg: ₹${category.avgPrice.toFixed(2)})`);
    });
    
    console.log('\n✅ All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  } finally {
    await disconnectDB();
  }
}

/**
 * Test CRUD operations
 */
async function testCRUDOperations() {
  try {
    console.log('🧪 Testing CRUD Operations...\n');
    
    await connectDB();
    
    // Test CREATE
    console.log('1️⃣ Testing CREATE operation...');
    const testFarmer = new Farmer({
      name: 'Test Farmer',
      email: 'test@example.com',
      mobile: '9876543210',
      location: {
        state: 'Test State',
        district: 'Test District',
        pincode: '123456',
        village: 'Test Village'
      },
      products: ['Test Product'],
      images: ['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=200&fit=crop']
    });
    
    const savedFarmer = await testFarmer.save();
    console.log(`✅ Created farmer: ${savedFarmer.name} (ID: ${savedFarmer._id})`);
    
    // Test READ
    console.log('\n2️⃣ Testing READ operation...');
    const foundFarmer = await Farmer.findById(savedFarmer._id);
    console.log(`✅ Found farmer: ${foundFarmer.name}`);
    
    // Test UPDATE
    console.log('\n3️⃣ Testing UPDATE operation...');
    const updatedFarmer = await Farmer.findByIdAndUpdate(
      savedFarmer._id,
      { name: 'Updated Test Farmer', updatedAt: new Date() },
      { new: true }
    );
    console.log(`✅ Updated farmer: ${updatedFarmer.name}`);
    
    // Test DELETE (soft delete)
    console.log('\n4️⃣ Testing DELETE operation...');
    await Farmer.findByIdAndUpdate(
      savedFarmer._id,
      { isActive: false, updatedAt: new Date() }
    );
    console.log(`✅ Soft deleted farmer: ${savedFarmer.name}`);
    
    // Verify soft delete
    const activeFarmer = await Farmer.findOne({ _id: savedFarmer._id, isActive: true });
    console.log(`✅ Verified soft delete: ${activeFarmer ? 'Still active' : 'Successfully deactivated'}`);
    
    console.log('\n✅ All CRUD operations completed successfully!');
    
  } catch (error) {
    console.error('❌ CRUD test failed:', error);
    process.exit(1);
  } finally {
    await disconnectDB();
  }
}

// Command line interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const testType = args[0] || 'integration';
  
  if (testType === 'crud') {
    testCRUDOperations();
  } else {
    testMongoDBIntegration();
  }
}

module.exports = {
  testMongoDBIntegration,
  testCRUDOperations
};
