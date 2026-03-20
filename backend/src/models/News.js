import mongoose from 'mongoose'

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    summary: { type: String, default: '', trim: true },
    imageUrl: { type: String, default: '', trim: true },
    fallbackImage: { type: String, default: '', trim: true },
    label: { type: String, default: 'News', trim: true },
    placement: {
      type: String,
      enum: ['spotlight', 'side', 'feature'],
      default: 'feature',
    },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export const News = mongoose.model('News', newsSchema)
