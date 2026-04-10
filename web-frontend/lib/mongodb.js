import mongoose from 'mongoose';

// MongoDB connection configuration
function getMongoUri() {
  const a = process.env.MONGODB_URI?.trim();
  const b = process.env.DATABASE_URL?.trim();
  if (a?.startsWith('mongodb')) return a;
  if (b?.startsWith('mongodb')) return b;
  return 'mongodb://127.0.0.1:27017/kisaanmela';
}
const MONGODB_URI = getMongoUri();

// Connection options (modern Mongoose 6+ doesn't need deprecated options)
const connectionOptions = {
  // These are automatically handled in Mongoose 6+
  // useNewUrlParser: true,    // Deprecated - handled automatically
  // useUnifiedTopology: true, // Deprecated - handled automatically
};

// Connection state tracking
let isConnected = false;

/**
 * Connect to MongoDB using modern Mongoose practices
 * @returns {Promise<void>}
 */
async function connectDB() {
  try {
    // Prevent multiple connections
    if (isConnected) {
      console.log('✅ MongoDB already connected');
      return;
    }

    console.log('🔄 Connecting to MongoDB...');
    
    // Connect using modern Mongoose 6+ syntax
    await mongoose.connect(MONGODB_URI, connectionOptions);
    
    isConnected = true;
    console.log('✅ MongoDB connected successfully!');
    console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);
    console.log(`🌐 Host: ${mongoose.connection.host}:${mongoose.connection.port}`);
    
    // Set max listeners to prevent memory leak warnings
    mongoose.connection.setMaxListeners(20);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected');
      isConnected = false;
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
      isConnected = true;
    });

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    isConnected = false;
    // Don't exit process - let the API route handle the error gracefully
    throw error;
  }
}

/**
 * Disconnect from MongoDB
 * @returns {Promise<void>}
 */
async function disconnectDB() {
  try {
    if (isConnected) {
      await mongoose.connection.close();
      isConnected = false;
      console.log('✅ MongoDB disconnected successfully');
    }
  } catch (error) {
    console.error('❌ Error disconnecting from MongoDB:', error);
  }
}

/**
 * Check if MongoDB is connected
 * @returns {boolean}
 */
function isDBConnected() {
  return isConnected && mongoose.connection.readyState === 1;
}

/**
 * Get connection status
 * @returns {object}
 */
function getConnectionStatus() {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  
  return {
    isConnected: isDBConnected(),
    state: states[mongoose.connection.readyState],
    host: mongoose.connection.host,
    port: mongoose.connection.port,
    database: mongoose.connection.db?.databaseName
  };
}

export {
  connectDB,
  disconnectDB,
  isDBConnected,
  getConnectionStatus,
  mongoose
};