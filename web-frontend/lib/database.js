const mongoose = require('mongoose');

// MongoDB connection configuration for frontend API routes
const connectDB = async () => {
  try {
    // Use MongoDB Atlas or local MongoDB
    // In production Docker setup, use the MongoDB container
    const mongoUri = process.env.MONGODB_URI || 
                    process.env.DATABASE_URL || 
                    (process.env.NODE_ENV === 'production' ? 'mongodb://mongodb:27017/kisaanmela_prod' : 'mongodb://localhost:27017/kisaanmela');
    
    console.log(`Attempting to connect to MongoDB: ${mongoUri.replace(/\/\/.*@/, '//***:***@')}`);
    
    // Modern Mongoose 6+ doesn't need deprecated options
    const conn = await mongoose.connect(mongoUri);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('Database connection failed:', error);
    // Don't throw error - let the API route handle it gracefully
    throw error;
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

module.exports = {
  connectDB
};
