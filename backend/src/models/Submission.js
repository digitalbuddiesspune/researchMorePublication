import mongoose from 'mongoose'

const reviewEntrySchema = new mongoose.Schema(
  {
    assignmentId: { type: String, required: true },
    reviewerName: { type: String, required: true, trim: true },
    recommendation: {
      type: String,
      enum: ['accept', 'minor-revision', 'major-revision', 'reject'],
      required: true,
    },
    comments: { type: String, default: '' },
    submittedAt: { type: Date, default: Date.now },
  },
  { _id: false }
)

const submissionAuthorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, default: '', trim: true, lowercase: true },
    affiliation: { type: String, default: '', trim: true },
    corresponding: { type: Boolean, default: false },
  },
  { _id: false }
)

const submissionFileSchema = new mongoose.Schema(
  {
    type: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    size: { type: Number, default: 0 },
    version: { type: Number, default: 1 },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false }
)

const submissionHistorySchema = new mongoose.Schema(
  {
    version: { type: Number, required: true },
    note: { type: String, default: '', trim: true },
    changedBy: { type: String, default: '', trim: true },
    files: { type: [submissionFileSchema], default: [] },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
)

const submissionMessageSchema = new mongoose.Schema(
  {
    senderId: { type: String, required: true, trim: true },
    senderName: { type: String, required: true, trim: true },
    senderRole: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
)

const decisionSchema = new mongoose.Schema(
  {
    value: { type: String, enum: ['accept', 'revise', 'reject'], required: true },
    note: { type: String, default: '' },
    by: { type: String, required: true, trim: true },
    at: { type: Date, default: Date.now },
  },
  { _id: false }
)

const submissionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    articleType: { type: String, default: 'Research Article', trim: true },
    keywords: { type: [String], default: [] },
    authors: { type: [submissionAuthorSchema], default: [] },
    abstract: { type: String, default: '' },
    journalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Journal', default: null, index: true },
    journal: { type: String, default: 'General', trim: true },
    files: { type: [submissionFileSchema], default: [] },
    currentVersion: { type: Number, default: 1 },
    history: { type: [submissionHistorySchema], default: [] },
    messages: { type: [submissionMessageSchema], default: [] },
    status: {
      type: String,
      enum: ['submitted', 'under-review', 'revision-requested', 'accepted', 'rejected'],
      default: 'submitted',
    },
    authorId: { type: String, required: true, index: true },
    authorName: { type: String, required: true, trim: true },
    decision: { type: decisionSchema, default: null },
    reviews: { type: [reviewEntrySchema], default: [] },
  },
  { timestamps: true }
)

export const Submission = mongoose.model('Submission', submissionSchema)
