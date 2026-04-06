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
    /** Set when this catalog row is created from an accepted submission (one publication per submission). */
    submissionId: { type: String, trim: true, sparse: true, unique: true },
    featured: { type: Boolean, default: false },
    seoTitle: { type: String, default: '', trim: true },
    seoDescription: { type: String, default: '', trim: true },
  },
  { timestamps: true }
)

export const Publication = mongoose.model('Publication', publicationSchema)
