import mongoose from 'mongoose'

const platformSettingSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, trim: true, unique: true },
    value: { type: String, default: '', trim: true },
    updatedById: { type: String, default: '' },
    updatedByName: { type: String, default: '', trim: true },
  },
  { timestamps: true }
)

export const PlatformSetting = mongoose.model('PlatformSetting', platformSettingSchema)
