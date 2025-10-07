const mongoose = require('mongoose');

// MongoDB connection configuration for frontend API routes
const connectDB = async () => {
  try {
    // Use MongoDB Atlas or local MongoDB
    // For Vercel: Use MongoDB Atlas connection string
    // For Docker: Use local MongoDB container
    // For development: Use local MongoDB
    const mongoUri = process.env.MONGODB_URI || 
                    process.env.DATABASE_URL || 
                    (process.env.NODE_ENV === 'production' ? 
                      (process.env.VERCEL ? 'mongodb://localhost:27017/kisaanmela_prod' : 'mongodb://mongodb:27017/kisaanmela_prod') : 
                      'mongodb://localhost:27017/kisaanmela');
    
    // Skip connection if in demo mode
    if (mongoUri === 'demo-mode') {
      console.log('Demo mode: Skipping MongoDB connection');
      return null;
    }
    
    console.log(`Attempting to connect to MongoDB: ${mongoUri.replace(/\/\/.*@/, '//***:***@')}`);
    
    // Modern Mongoose 6+ doesn't need deprecated options
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

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
