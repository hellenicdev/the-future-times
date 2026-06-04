const mongoose = require('mongoose')
const config = require('./index')

async function connectDB() {
  if (!config.mongodbUri) {
    console.warn('MONGODB_URI not set — skipping database connection')
    return
  }
  try {
    await mongoose.connect(config.mongodbUri)
    console.log(`MongoDB connected: ${mongoose.connection.host}`)
  } catch (err) {
    console.error('MongoDB connection error:', err.message)
    process.exit(1)
  }
}

module.exports = connectDB
