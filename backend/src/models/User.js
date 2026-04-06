import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['author', 'reviewer', 'editor', 'admin'],
      default: 'author',
    },
    status: {
      type: String,
      enum: ['active', 'disabled'],
      default: 'active',
    },
    expertise: { type: [String], default: [] },
    activeAssignments: { type: Number, default: 0 },
    reviewsCompleted: { type: Number, default: 0 },
    avgResponseTimeHours: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export const User = mongoose.model('User', userSchema)
