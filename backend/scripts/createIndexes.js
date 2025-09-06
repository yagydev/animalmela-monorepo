// MongoDB Indexing Script for AnimalMela - Scalability Optimization
const mongoose = require('mongoose');

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/animalmela', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected for indexing');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Create indexes for optimal performance
const createIndexes = async () => {
  try {
    const db = mongoose.connection.db;
    
    console.log('Creating database indexes...');

    // User collection indexes
    await db.collection('users').createIndexes([
      { key: { email: 1 }, unique: true, sparse: true },
      { key: { phone: 1 }, unique: true, sparse: true },
      { key: { user_type: 1 } },
      { key: { location: '2dsphere' } },
      { key: { 'kyc_documents.status': 1 } },
      { key: { 'business_info.farm_details.farm_registration_number': 1 }, sparse: true },
      { key: { created_at: -1 } },
      { key: { 'business_info.service_areas': 1 } },
      { key: { 'business_info.service_types': 1 } }
    ]);

    // Pet/Livestock collection indexes
    await db.collection('pets').createIndexes([
      { key: { owner_id: 1 } },
      { key: { species: 1 } },
      { key: { 'livestock_info.indian_breed_name': 1 } },
      { key: { 'livestock_info.sex': 1 } },
      { key: { 'livestock_info.age_months': 1 } },
      { key: { 'livestock_info.weight_kg': 1 } },
      { key: { 'livestock_info.price': 1 } },
      { key: { 'livestock_info.location': '2dsphere' } },
      { key: { 'livestock_info.verification_status': 1 } },
      { key: { 'livestock_info.promotion.is_hot_deal': 1 } },
      { key: { 'livestock_info.promotion.is_featured': 1 } },
      { key: { 'livestock_info.status': 1 } },
      { key: { 'livestock_info.dairy_info.yield_liters_per_day': 1 } },
      { key: { 'livestock_info.health_status': 1 } },
      { key: { created_at: -1 } },
      { key: { updated_at: -1 } },
      // Compound indexes for common queries
      { key: { species: 1, 'livestock_info.indian_breed_name': 1 } },
      { key: { species: 1, 'livestock_info.location': '2dsphere' } },
      { key: { 'livestock_info.price': 1, 'livestock_info.age_months': 1 } },
      { key: { 'livestock_info.verification_status': 1, 'livestock_info.promotion.is_featured': 1 } }
    ]);

    // Listing collection indexes
    await db.collection('listings').createIndexes([
      { key: { seller_id: 1 } },
      { key: { pet_id: 1 } },
      { key: { category: 1 } },
      { key: { subcategory: 1 } },
      { key: { price: 1 } },
      { key: { location: '2dsphere' } },
      { key: { status: 1 } },
      { key: { 'promotion.is_hot_deal': 1 } },
      { key: { 'promotion.is_featured': 1 } },
      { key: { 'banner_ad.is_active': 1 } },
      { key: { created_at: -1 } },
      { key: { updated_at: -1 } },
      // Text search index
      { key: { title: 'text', description: 'text', 'livestock_details.breed_type': 'text' } },
      // Compound indexes
      { key: { category: 1, status: 1 } },
      { key: { category: 1, price: 1 } },
      { key: { status: 1, 'promotion.is_featured': 1 } }
    ]);

    // Order collection indexes
    await db.collection('orders').createIndexes([
      { key: { buyer_id: 1 } },
      { key: { seller_id: 1 } },
      { key: { listing_id: 1 } },
      { key: { pet_id: 1 } },
      { key: { status: 1 } },
      { key: { payment_status: 1 } },
      { key: { created_at: -1 } },
      { key: { updated_at: -1 } },
      { key: { 'advance_payment.payment_date': -1 } },
      // Compound indexes
      { key: { buyer_id: 1, status: 1 } },
      { key: { seller_id: 1, status: 1 } },
      { key: { status: 1, payment_status: 1 } }
    ]);

    // Booking collection indexes
    await db.collection('livestockbookings').createIndexes([
      { key: { buyer_id: 1 } },
      { key: { seller_id: 1 } },
      { key: { listing_id: 1 } },
      { key: { pet_id: 1 } },
      { key: { booking_status: 1 } },
      { key: { payment_status: 1 } },
      { key: { payment_method: 1 } },
      { key: { created_at: -1 } },
      { key: { delivery_date: 1 } },
      // Compound indexes
      { key: { buyer_id: 1, booking_status: 1 } },
      { key: { seller_id: 1, booking_status: 1 } },
      { key: { booking_status: 1, payment_status: 1 } }
    ]);

    // Transport Request indexes
    await db.collection('transportrequests').createIndexes([
      { key: { booking_id: 1 } },
      { key: { buyer_id: 1 } },
      { key: { seller_id: 1 } },
      { key: { transport_provider_id: 1 } },
      { key: { transport_status: 1 } },
      { key: { vehicle_type: 1 } },
      { key: { pickup_date: 1 } },
      { key: { delivery_date: 1 } },
      { key: { 'pickup_address.coordinates': '2dsphere' } },
      { key: { 'delivery_address.coordinates': '2dsphere' } },
      { key: { created_at: -1 } }
    ]);

    // Insurance Request indexes
    await db.collection('insurancerequests').createIndexes([
      { key: { buyer_id: 1 } },
      { key: { listing_id: 1 } },
      { key: { pet_id: 1 } },
      { key: { insurance_provider_id: 1 } },
      { key: { insurance_type: 1 } },
      { key: { request_status: 1 } },
      { key: { created_at: -1 } },
      { key: { policy_start_date: 1 } },
      { key: { policy_end_date: 1 } }
    ]);

    // Veterinary Consultation indexes
    await db.collection('veterinaryconsultations').createIndexes([
      { key: { buyer_id: 1 } },
      { key: { pet_id: 1 } },
      { key: { veterinarian_id: 1 } },
      { key: { consultation_type: 1 } },
      { key: { consultation_status: 1 } },
      { key: { consultation_date: 1 } },
      { key: { created_at: -1 } }
    ]);

    // Review indexes
    await db.collection('reviews').createIndexes([
      { key: { reviewer_id: 1 } },
      { key: { reviewee_id: 1 } },
      { key: { listing_id: 1 } },
      { key: { order_id: 1 } },
      { key: { booking_id: 1 } },
      { key: { rating: 1 } },
      { key: { review_type: 1 } },
      { key: { created_at: -1 } },
      // Compound indexes
      { key: { reviewee_id: 1, rating: 1 } },
      { key: { listing_id: 1, rating: 1 } }
    ]);

    // Conversation indexes
    await db.collection('conversations').createIndexes([
      { key: { 'participants.user_id': 1 } },
      { key: { listing_id: 1 } },
      { key: { order_id: 1 } },
      { key: { conversation_type: 1 } },
      { key: { status: 1 } },
      { key: { created_at: -1 } },
      { key: { 'last_message.timestamp': -1 } }
    ]);

    // Message indexes
    await db.collection('messages').createIndexes([
      { key: { conversation_id: 1 } },
      { key: { sender_id: 1 } },
      { key: { message_type: 1 } },
      { key: { created_at: -1 } },
      { key: { 'read_by.user_id': 1 } }
    ]);

    // Notification indexes
    await db.collection('notifications').createIndexes([
      { key: { user_id: 1 } },
      { key: { type: 1 } },
      { key: { status: 1 } },
      { key: { created_at: -1 } },
      { key: { scheduled_at: 1 } },
      // Compound indexes
      { key: { user_id: 1, status: 1 } },
      { key: { user_id: 1, type: 1 } }
    ]);

    // Service provider indexes
    await db.collection('transportservices').createIndexes([
      { key: { provider_id: 1 } },
      { key: { vehicle_type: 1 } },
      { key: { 'service_areas': 1 } },
      { key: { active: 1 } },
      { key: { created_at: -1 } }
    ]);

    await db.collection('insuranceservices').createIndexes([
      { key: { provider_id: 1 } },
      { key: { 'insurance_types': 1 } },
      { key: { 'service_areas': 1 } },
      { key: { active: 1 } },
      { key: { created_at: -1 } }
    ]);

    await db.collection('veterinaryservices').createIndexes([
      { key: { provider_id: 1 } },
      { key: { 'specialization': 1 } },
      { key: { 'services_offered': 1 } },
      { key: { 'service_areas': 1 } },
      { key: { active: 1 } },
      { key: { created_at: -1 } }
    ]);

    console.log('All indexes created successfully!');
    
    // Display index statistics
    await displayIndexStats();
    
  } catch (error) {
    console.error('Error creating indexes:', error);
  }
};

// Display index statistics
const displayIndexStats = async () => {
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    console.log('\n=== Index Statistics ===');
    
    for (const collection of collections) {
      const stats = await db.collection(collection.name).stats();
      const indexes = await db.collection(collection.name).indexes();
      
      console.log(`\nCollection: ${collection.name}`);
      console.log(`  Documents: ${stats.count}`);
      console.log(`  Indexes: ${indexes.length}`);
      console.log(`  Total Index Size: ${(stats.totalIndexSize / 1024 / 1024).toFixed(2)} MB`);
      
      indexes.forEach(index => {
        console.log(`    - ${index.name}: ${JSON.stringify(index.key)}`);
      });
    }
  } catch (error) {
    console.error('Error displaying index stats:', error);
  }
};

// Pagination utility
const createPaginationQuery = (page = 1, limit = 20, sortBy = 'created_at', sortOrder = -1) => {
  const skip = (page - 1) * limit;
  const sort = { [sortBy]: sortOrder };
  
  return { skip, limit, sort };
};

// Geospatial query helper
const createLocationQuery = (longitude, latitude, maxDistance = 50000) => {
  return {
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: maxDistance // in meters
      }
    }
  };
};

// Text search query helper
const createTextSearchQuery = (searchTerm, fields = ['title', 'description']) => {
  return {
    $text: {
      $search: searchTerm,
      $caseSensitive: false,
      $diacriticSensitive: false
    }
  };
};

// Main execution
const main = async () => {
  await connectDB();
  await createIndexes();
  
  console.log('\nIndexing completed successfully!');
  process.exit(0);
};

// Export utilities for use in other modules
module.exports = {
  createIndexes,
  createPaginationQuery,
  createLocationQuery,
  createTextSearchQuery,
  displayIndexStats
};

// Run if called directly
if (require.main === module) {
  main();
}
