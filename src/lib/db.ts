import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;
if (!uri && process.env.NODE_ENV !== "production") console.warn("MONGODB_URI is missing. Database-backed features will be unavailable until configured.");

type Cache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
const globalCache = globalThis as typeof globalThis & { mongooseCache?: Cache };
const cache = globalCache.mongooseCache ?? (globalCache.mongooseCache = { conn: null, promise: null });

export async function connectDB() {
  if (!uri) throw new Error("Database is not configured. Add MONGODB_URI to your environment.");
  if (cache.conn) return cache.conn;
  if (!cache.promise) cache.promise = mongoose.connect(uri, { bufferCommands: false });
  try { cache.conn = await cache.promise; } catch (error) { cache.promise = null; throw error; }
  return cache.conn;
}
