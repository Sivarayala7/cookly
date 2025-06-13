/**
 * Lightweight MongoDB connector
 * Uses mongoose for models and is imported once in server.js
 */

import mongoose from 'mongoose';                          // ODM lib    // #1

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);       // #2
    console.log(`✅ MongoDB: ${conn.connection.host}`);               // #3
  } catch (err) {
    console.error(`❌ Mongo error: ${err.message}`);                  // #4
    process.exit(1);                                                 // #5
  }
};
export default connectDB;                                            // #6
