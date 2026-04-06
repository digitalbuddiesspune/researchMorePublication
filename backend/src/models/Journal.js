import mongoose from 'mongoose'

const journalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    subject: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    editorId: { type: String, default: '' },
    editorName: { type: String, default: '', trim: true },
    editorEmail: { type: String, default: '', trim: true, lowercase: true },
    editorIds: { type: [String], default: [] },
    editorNames: { type: [String], default: [] },
    editorEmails: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

journalSchema.index({ subject: 1, name: 1 })

export const Journal = mongoose.model('Journal', journalSchema)
