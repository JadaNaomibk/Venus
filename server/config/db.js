// config/db.js
// this file is just me setting up a small helper
// so my main server file stays clean.
// it connects to MongoDB using the url from my .env file.

import mongoose from 'mongoose'

export async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log(`MongoDB connected: ${conn.connection.host}`)
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message)
    process.exit(1)
  }
}
