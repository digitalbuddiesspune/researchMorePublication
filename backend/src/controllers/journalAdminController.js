import { isDatabaseConnected } from '../config/db.js'
import { Journal } from '../models/Journal.js'
import { User } from '../models/User.js'
import { createAuditLog } from '../utils/auditLogger.js'

const serializeJournal = (item) => ({
  id: item._id.toString(),
  name: item.name,
  subject: item.subject,
  description: item.description || '',
  editorId: item.editorId || '',
  editorName: item.editorName || '',
  editorEmail: item.editorEmail || '',
  editorIds: Array.isArray(item.editorIds) ? item.editorIds : [],
  editorNames: Array.isArray(item.editorNames) ? item.editorNames : [],
  editorEmails: Array.isArray(item.editorEmails) ? item.editorEmails : [],
  isActive: Boolean(item.isActive),
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
})

const ensureDatabaseConnection = (res) => {
  if (isDatabaseConnected()) return true
  res.status(503).json({ message: 'Database unavailable. Please try again later.' })
  return false
}

const resolveEditors = async (editorIds = []) => {
  const clean = (Array.isArray(editorIds) ? editorIds : [])
    .map((item) => item?.toString().trim())
    .filter(Boolean)
  if (!clean.length) return []
  const editors = await User.find({
    _id: { $in: clean },
    role: 'editor',
    status: 'active',
  }).lean()
  return editors
}

export const listAdminJournals = async (_req, res, next) => {
  try {
    if (!ensureDatabaseConnection(res)) return
    const journals = await Journal.find().sort({ createdAt: -1 }).lean()
    return res.json(journals.map(serializeJournal))
  } catch (error) {
    return next(error)
  }
}

export const createJournal = async (req, res, next) => {
  try {
    if (!ensureDatabaseConnection(res)) return
    const name = req.body.name?.trim()
    const subject = req.body.subject?.trim()
    const description = req.body.description?.trim() || ''
    const editorId = req.body.editorId?.toString() || ''
    const editorIdsRaw = Array.isArray(req.body.editorIds) ? req.body.editorIds : []
    const requestedEditorIds = editorIdsRaw.length ? editorIdsRaw : editorId ? [editorId] : []

    if (!name || !subject) {
      return res.status(400).json({ message: 'name and subject are required' })
    }

    const existing = await Journal.findOne({ name }).lean()
    if (existing) return res.status(409).json({ message: 'Journal with same name already exists' })

    const editors = await resolveEditors(requestedEditorIds)
    if (requestedEditorIds.length && !editors.length) {
      return res.status(404).json({ message: 'Active editor not found' })
    }

    const created = await Journal.create({
      name,
      subject,
      description,
      editorId: editors[0]?._id.toString() || '',
      editorName: editors[0]?.name || '',
      editorEmail: editors[0]?.email || '',
      editorIds: editors.map((ed) => ed._id.toString()),
      editorNames: editors.map((ed) => ed.name),
      editorEmails: editors.map((ed) => ed.email),
      isActive: true,
    })

    await createAuditLog({
      actor: req.user,
      action: 'journal.create',
      targetType: 'journal',
      targetId: created._id.toString(),
      targetLabel: created.name,
      metadata: { subject: created.subject, editorIds: created.editorIds || [] },
    })

    return res.status(201).json(serializeJournal(created))
  } catch (error) {
    return next(error)
  }
}

export const updateJournal = async (req, res, next) => {
  try {
    if (!ensureDatabaseConnection(res)) return
    const name = req.body.name?.trim()
    const subject = req.body.subject?.trim()
    const description = req.body.description?.trim() || ''
    const editorId = req.body.editorId?.toString() || ''
    const editorIdsRaw = Array.isArray(req.body.editorIds) ? req.body.editorIds : []
    const requestedEditorIds = editorIdsRaw.length ? editorIdsRaw : editorId ? [editorId] : []
    const isActive = req.body.isActive

    const journal = await Journal.findById(req.params.id)
    if (!journal) return res.status(404).json({ message: 'Journal not found' })

    if (name) journal.name = name
    if (subject) journal.subject = subject
    journal.description = description
    if (typeof isActive === 'boolean') journal.isActive = isActive

    const editors = await resolveEditors(requestedEditorIds)
    if (requestedEditorIds.length && !editors.length) {
      return res.status(404).json({ message: 'Active editor not found' })
    }
    journal.editorId = editors[0]?._id.toString() || ''
    journal.editorName = editors[0]?.name || ''
    journal.editorEmail = editors[0]?.email || ''
    journal.editorIds = editors.map((ed) => ed._id.toString())
    journal.editorNames = editors.map((ed) => ed.name)
    journal.editorEmails = editors.map((ed) => ed.email)

    await journal.save()

    await createAuditLog({
      actor: req.user,
      action: 'journal.update',
      targetType: 'journal',
      targetId: journal._id.toString(),
      targetLabel: journal.name,
      metadata: { subject: journal.subject, isActive: journal.isActive },
    })

    return res.json(serializeJournal(journal))
  } catch (error) {
    return next(error)
  }
}

export const deleteJournal = async (req, res, next) => {
  try {
    if (!ensureDatabaseConnection(res)) return
    const journal = await Journal.findById(req.params.id)
    if (!journal) return res.status(404).json({ message: 'Journal not found' })

    await Journal.deleteOne({ _id: journal._id })
    await createAuditLog({
      actor: req.user,
      action: 'journal.delete',
      targetType: 'journal',
      targetId: journal._id.toString(),
      targetLabel: journal.name,
      metadata: { subject: journal.subject },
    })
    return res.json({ ok: true })
  } catch (error) {
    return next(error)
  }
}
