import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

let dbConnection = global.mongoose;

if (!dbConnection) {
  dbConnection = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (dbConnection.conn) return dbConnection.conn;

  if (!dbConnection.promise) {
    dbConnection.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  dbConnection.conn = await dbConnection.promise;
  return dbConnection.conn;
}
