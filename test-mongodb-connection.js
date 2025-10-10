#!/usr/bin/env node

/**
 * MongoDB Atlas Connection Test Script
 * Tests the connection to MongoDB Atlas cluster
 */

const mongoose = require('mongoose');

// MongoDB Atlas connection string
const MONGODB_URI = 'mongodb+srv://yagydev:Kishutryu%402124@cluster0.fwjkpvc.mongodb.net/animalmela_db?retryWrites=true&w=majority&appName=Cluster0';

console.log('🔍 Testing MongoDB Atlas Connection...');
console.log('📍 Cluster: cluster0.fwjkpvc.mongodb.net');
console.log('🗄️  Database: animalmela_db');
console.log('👤 User: yagydev');
console.log('');

async function testConnection() {
  try {
    console.log('🔄 Attempting to connect...');
    
    // Set connection timeout
    const connectionOptions = {
      serverSelectionTimeoutMS: 10000, // 10 seconds
      connectTimeoutMS: 10000,
      socketTimeoutMS: 10000,
    };
    
    const conn = await mongoose.connect(MONGODB_URI, connectionOptions);
    
    console.log('✅ MongoDB connected successfully!');
    console.log(`📊 Database: ${conn.connection.db.databaseName}`);
    console.log(`🌐 Host: ${conn.connection.host}`);
    console.log(`🔌 Port: ${conn.connection.port}`);
    console.log(`📈 Ready State: ${conn.connection.readyState}`);
    
    // Test a simple operation
    const collections = await conn.connection.db.listCollections().toArray();
    console.log(`📁 Collections: ${collections.length}`);
    
    if (collections.length > 0) {
      console.log('📋 Available collections:');
      collections.forEach(col => {
        console.log(`   - ${col.name}`);
      });
    }
    
    console.log('');
    console.log('🎉 Connection test successful!');
    
    // Close connection
    await mongoose.disconnect();
    console.log('🔌 Connection closed');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ MongoDB connection failed!');
    console.error('');
    console.error('🔍 Error Details:');
    console.error(`   Type: ${error.name}`);
    console.error(`   Message: ${error.message}`);
    console.error(`   Code: ${error.code || 'N/A'}`);
    
    if (error.reason) {
      console.error(`   Reason: ${error.reason.message || error.reason}`);
    }
    
    console.error('');
    console.error('🛠️  Common Solutions:');
    console.error('   1. Check IP whitelist in MongoDB Atlas');
    console.error('   2. Verify database user permissions');
    console.error('   3. Ensure cluster is running');
    console.error('   4. Check network connectivity');
    console.error('');
    console.error('📖 For detailed fix instructions, see: MONGODB_ATLAS_FIX.md');
    
    process.exit(1);
  }
}

// Handle process termination
process.on('SIGINT', async () => {
  console.log('\n🛑 Test interrupted');
  await mongoose.disconnect();
  process.exit(0);
});

// Run the test
testConnection();
