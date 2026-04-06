import { isDatabaseConnected } from '../config/db.js'
import { PlatformSetting } from '../models/PlatformSetting.js'
import { createAuditLog } from '../utils/auditLogger.js'

const DEFAULT_SETTINGS = {
  submissionRules: '',
  reviewGuidelines: '',
  platformNotice: '',
  reviewDeadlineDays: '14',
  emailTemplates: JSON.stringify({
    submissionReceived: 'Your submission was received.',
    reviewAssigned: 'A reviewer has been assigned.',
    decisionIssued: 'A decision has been posted.',
  }),
  articleTypes: JSON.stringify([
    'Research Article',
    'Opinion',
    'Brief Research Report',
    'Technology and Code',
    'Data Report',
  ]),
}

const ensureDatabaseConnection = (res) => {
  if (isDatabaseConnected()) return true
  res.status(503).json({ message: 'Database unavailable. Please try again later.' })
  return false
}

export const getPlatformSettings = async (_req, res, next) => {
  try {
    if (!ensureDatabaseConnection(res)) return
    const items = await PlatformSetting.find().lean()
    const map = items.reduce((acc, item) => {
      acc[item.key] = item.value
      return acc
    }, { ...DEFAULT_SETTINGS })
    return res.json(map)
  } catch (error) {
    return next(error)
  }
}

export const getPublicPlatformSettings = async (_req, res, next) => {
  try {
    if (!ensureDatabaseConnection(res)) return
    const [notice, articleTypesSetting] = await Promise.all([
      PlatformSetting.findOne({ key: 'platformNotice' }).lean(),
      PlatformSetting.findOne({ key: 'articleTypes' }).lean(),
    ])

    let articleTypes = []
    try {
      const parsed = JSON.parse(articleTypesSetting?.value || '[]')
      articleTypes = Array.isArray(parsed) ? parsed.filter((item) => item?.toString().trim()) : []
    } catch {
      articleTypes = []
    }

    return res.json({
      platformNotice: notice?.value || '',
      articleTypes,
    })
  } catch (error) {
    return next(error)
  }
}

export const upsertPlatformSettings = async (req, res, next) => {
  try {
    if (!ensureDatabaseConnection(res)) return
    const payload = {
      submissionRules: req.body.submissionRules?.toString() || '',
      reviewGuidelines: req.body.reviewGuidelines?.toString() || '',
      platformNotice: req.body.platformNotice?.toString() || '',
      reviewDeadlineDays: Number.parseInt(req.body.reviewDeadlineDays, 10) > 0
        ? String(Number.parseInt(req.body.reviewDeadlineDays, 10))
        : '14',
      emailTemplates: JSON.stringify(req.body.emailTemplates || {}),
      articleTypes: JSON.stringify(
        (Array.isArray(req.body.articleTypes) ? req.body.articleTypes : [])
          .map((item) => item?.toString().trim())
          .filter(Boolean)
      ),
    }

    await Promise.all(
      Object.entries(payload).map(([key, value]) =>
        PlatformSetting.findOneAndUpdate(
          { key },
          {
            key,
            value,
            updatedById: req.user._id.toString(),
            updatedByName: req.user.name,
          },
          { upsert: true, new: true, runValidators: true }
        )
      )
    )

    await createAuditLog({
      actor: req.user,
      action: 'settings.update',
      targetType: 'platform-settings',
      targetLabel: 'Platform settings',
      metadata: { keys: Object.keys(payload) },
    })

    return res.json(payload)
  } catch (error) {
    return next(error)
  }
}
