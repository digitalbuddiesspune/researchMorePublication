import mongoose from 'mongoose'

const subscriberSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    firstName: { type: String, default: '', trim: true },
    lastName: { type: String, default: '', trim: true },
  },
  { timestamps: true }
)

export const Subscriber = mongoose.model('Subscriber', subscriberSchema)
