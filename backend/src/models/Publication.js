import mongoose from 'mongoose'

const publicationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['draft', 'in-review', 'accepted', 'rejected'],
      default: 'draft',
    },
    category: { type: String, default: 'General', trim: true },
    abstract: { type: String, default: '' },
  },
  { timestamps: true }
)

export const Publication = mongoose.model('Publication', publicationSchema)
