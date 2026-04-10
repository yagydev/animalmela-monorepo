/**
 * mongodb.js — thin compatibility shim over the cached dbConnect singleton.
 *
 * Routes that import { connectDB } from this file continue to work unchanged,
 * but now share the single connection-pool managed by dbConnect.ts instead of
 * maintaining a separate module-level boolean that breaks under serverless.
 */
import dbConnect from './dbConnect';

export async function connectDB() {
  await dbConnect();
}

export default connectDB;
