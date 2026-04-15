import mongoose from 'mongoose';
import { getMongoConnectionUri } from './mongoConnectionUri';

// MongoDB connection configuration for frontend API routes
const connectDB = async () => {
  try {
    // Reuse existing socket (important on Vercel serverless — avoids redundant connects / races)
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }

    const mongoUri = getMongoConnectionUri();

    // Skip connection if in demo mode
    if (mongoUri === 'demo-mode') {
      console.log('Demo mode: Skipping MongoDB connection');
      return null;
    }

    console.log(`Attempting to connect to MongoDB: ${mongoUri.replace(/\/\/.*@/, '//***:***@')}`);

    const conn = await mongoose.connect(mongoUri);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('Database connection failed:', error);
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

export { connectDB };
