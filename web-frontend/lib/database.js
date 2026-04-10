import mongoose from 'mongoose';

function resolveMongoUri() {
  const fromEnv =
    process.env.MONGODB_URI?.trim() || process.env.DATABASE_URL?.trim();
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL) {
    throw new Error(
      'Missing MONGODB_URI or DATABASE_URL. In Vercel: Project → Settings → Environment Variables, add the same mongodb+srv://… string for both (Production + Preview). Atlas must allow connections from the internet (e.g. 0.0.0.0/0).'
    );
  }
  if (process.env.NODE_ENV === 'production') {
    return 'mongodb://mongodb:27017/kisaanmela_prod';
  }
  return 'mongodb://localhost:27017/kisaanmela';
}

// MongoDB connection configuration for frontend API routes
const connectDB = async () => {
  try {
    const mongoUri = resolveMongoUri();
    
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

export { connectDB };
