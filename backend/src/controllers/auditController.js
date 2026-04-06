import { isDatabaseConnected } from '../config/db.js'
import { AuditLog } from '../models/AuditLog.js'

const ensureDatabaseConnection = (res) => {
  if (isDatabaseConnected()) return true
  res.status(503).json({ message: 'Database unavailable. Please try again later.' })
  return false
}

export const listAuditLogs = async (req, res, next) => {
  try {
    if (!ensureDatabaseConnection(res)) return
    const limitRaw = Number.parseInt(req.query.limit, 10)
    const limit = Number.isFinite(limitRaw) && limitRaw > 0 ? Math.min(limitRaw, 200) : 50
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(limit).lean()
    return res.json(
      logs.map((item) => ({
        id: item._id.toString(),
        actorName: item.actorName,
        actorEmail: item.actorEmail,
        actorRole: item.actorRole,
        action: item.action,
        targetType: item.targetType,
        targetId: item.targetId || '',
        targetLabel: item.targetLabel || '',
        metadata: item.metadata || {},
        createdAt: item.createdAt,
      }))
    )
  } catch (error) {
    return next(error)
  }
}
