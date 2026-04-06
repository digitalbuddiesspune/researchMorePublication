import mongoose from 'mongoose'

const reviewAssignmentSchema = new mongoose.Schema(
  {
    submissionId: { type: String, required: true, index: true },
    submissionTitle: { type: String, required: true, trim: true },
    reviewerId: { type: String, required: true, index: true },
    reviewerEmail: { type: String, required: true, trim: true, lowercase: true },
    reviewerName: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['pending', 'completed', 'overdue', 'assigned', 'submitted'],
      default: 'pending',
    },
    deadline: { type: Date, default: null },
    recommendation: { type: String, default: '' },
    comments: { type: String, default: '' },
  },
  { timestamps: true }
)

reviewAssignmentSchema.index({ submissionId: 1, reviewerId: 1 }, { unique: true })

export const ReviewAssignment = mongoose.model('ReviewAssignment', reviewAssignmentSchema)
