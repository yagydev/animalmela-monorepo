import mongoose from 'mongoose';

function resolveMongoUri(): string {
  const fromEnv =
    process.env.MONGODB_URI?.trim() || process.env.DATABASE_URL?.trim();
  if (fromEnv?.startsWith('mongodb')) {
    return fromEnv;
  }
  return 'mongodb://localhost:27017/kisaanmela';
}

const MONGODB_URI = resolveMongoUri();

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10_000,
      socketTimeoutMS: 45_000,
      maxPoolSize: 10,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
