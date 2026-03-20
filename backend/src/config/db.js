import mongoose from 'mongoose'
import { env } from './env.js'

export const connectDatabase = async () => {
  if (!env.MONGO_URI) {
    console.warn('MONGO_URI not set. Running with in-memory data store.')
    return false
  }

  try {
    await mongoose.connect(env.MONGO_URI)
    console.log('Connected to MongoDB')
    return true
  } catch (error) {
    console.warn('MongoDB connection failed. Falling back to in-memory data store.')
    console.warn(`Reason: ${error.message}`)
    return false
  }
}

export const isDatabaseConnected = () => mongoose.connection.readyState === 1
