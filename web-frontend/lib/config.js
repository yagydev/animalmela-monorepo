// MongoDB Configuration
module.exports = {
  // MongoDB connection string
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/kisaanmela',
  
  // JWT configuration
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  
  // Database configuration
  DB_NAME: process.env.DB_NAME || 'kisaanmela',
  DB_HOST: process.env.DB_HOST || '127.0.0.1',
  DB_PORT: process.env.DB_PORT || 27017,
  
  // API configuration
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000
};
