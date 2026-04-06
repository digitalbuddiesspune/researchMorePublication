import { AuditLog } from '../models/AuditLog.js'

export const createAuditLog = async ({
  actor,
  action,
  targetType,
  targetId = '',
  targetLabel = '',
  metadata = {},
}) => {
  if (!actor?._id || !action || !targetType) return

  await AuditLog.create({
    actorId: actor._id.toString(),
    actorName: actor.name || 'Unknown',
    actorEmail: actor.email || 'unknown@example.com',
    actorRole: actor.role || 'unknown',
    action,
    targetType,
    targetId: targetId?.toString() || '',
    targetLabel,
    metadata,
  })
}
