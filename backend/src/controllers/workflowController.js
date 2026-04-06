import { isDatabaseConnected } from '../config/db.js'
import { ReviewAssignment } from '../models/ReviewAssignment.js'
import { Submission } from '../models/Submission.js'
import { User } from '../models/User.js'
import { Journal } from '../models/Journal.js'
import { PlatformSetting } from '../models/PlatformSetting.js'
import { createAuditLog } from '../utils/auditLogger.js'
import { syncPublicationFromSubmission } from '../utils/publicationSync.js'

const requireDb = (res) => {
  if (isDatabaseConnected()) return true
  res.status(503).json({ message: 'Database unavailable. Please try again later.' })
  return false
}

const STATUS = {
  SUBMITTED: 'submitted',
  UNDER_REVIEW: 'under-review',
  REVISION_REQUESTED: 'revision-requested',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
}

const ALLOWED_TRANSITIONS = {
  [STATUS.SUBMITTED]: [STATUS.UNDER_REVIEW],
  [STATUS.UNDER_REVIEW]: [STATUS.REVISION_REQUESTED, STATUS.ACCEPTED, STATUS.REJECTED],
  [STATUS.REVISION_REQUESTED]: [STATUS.UNDER_REVIEW],
  [STATUS.ACCEPTED]: [],
  [STATUS.REJECTED]: [],
}

const canTransition = (from, to) => (ALLOWED_TRANSITIONS[from] || []).includes(to)

const normalizeKeywords = (raw) => {
  if (!Array.isArray(raw)) return []
  return raw
    .map((item) => item?.toString().trim())
    .filter(Boolean)
    .slice(0, 20)
}

const normalizeAuthors = (raw, fallbackAuthorName = '') => {
  if (!Array.isArray(raw) || !raw.length) {
    return [{ name: fallbackAuthorName || 'Author', corresponding: true }]
  }
  const cleaned = raw
    .map((item) => ({
      name: item?.name?.toString().trim() || '',
      email: item?.email?.toString().trim().toLowerCase() || '',
      affiliation: item?.affiliation?.toString().trim() || '',
      corresponding: Boolean(item?.corresponding),
    }))
    .filter((item) => item.name)
    .slice(0, 20)
  if (!cleaned.length) return [{ name: fallbackAuthorName || 'Author', corresponding: true }]
  if (!cleaned.some((item) => item.corresponding)) cleaned[0].corresponding = true
  return cleaned
}

const normalizeFiles = (raw, version = 1) => {
  if (!Array.isArray(raw)) return []
  return raw
    .map((item) => ({
      type: item?.type?.toString().trim() || '',
      name: item?.name?.toString().trim() || '',
      url: item?.url?.toString().trim() || '',
      size: Number(item?.size || 0),
      version,
      uploadedAt: new Date(),
    }))
    .filter((item) => item.type && item.name && item.url)
}

const canAccessSubmissionMessages = async (submissionId, user) => {
  if (user.role === 'reviewer') return null
  const query = { _id: submissionId }
  if (user.role === 'author') query.authorId = user._id.toString()
  return Submission.findOne(query)
}

const getEditorJournalIds = async (user) => {
  if (user.role === 'admin') return null
  const editorId = user._id.toString()
  const journals = await Journal.find({
    $or: [{ editorId }, { editorIds: editorId }],
  })
    .select({ _id: 1 })
    .lean()
  return journals.map((item) => item._id.toString())
}

const toAssignmentStatus = (assignment) => {
  const raw = assignment.status
  if (raw === 'completed' || raw === 'submitted') return 'completed'
  const deadline = assignment.deadline ? new Date(assignment.deadline) : null
  if (deadline && deadline < new Date()) return 'overdue'
  return 'pending'
}

const serializeAssignment = (item) => ({
  id: item._id.toString(),
  submissionId: item.submissionId,
  submissionTitle: item.submissionTitle,
  reviewerId: item.reviewerId,
  reviewerEmail: item.reviewerEmail,
  reviewerName: item.reviewerName,
  status: toAssignmentStatus(item),
  recommendation: item.recommendation,
  comments: item.comments,
  deadline: item.deadline || null,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
})

export const createSubmission = async (req, res) => {
  if (!requireDb(res)) return

  const title = req.body.title?.trim()
  const articleType = req.body.articleType?.trim() || 'Research Article'
  const abstract = req.body.abstract?.trim() || ''
  const keywords = normalizeKeywords(req.body.keywords)
  const authors = normalizeAuthors(req.body.authors, req.user.name)
  const files = normalizeFiles(req.body.files, 1)
  const journalId = req.body.journalId?.toString().trim()
  const legacyJournal = req.body.journal?.toString().trim()

  if (!title) return res.status(400).json({ message: 'title is required' })
  let selectedJournal = null
  if (journalId) {
    selectedJournal = await Journal.findOne({ _id: journalId, isActive: true }).lean()
  } else if (legacyJournal) {
    selectedJournal = await Journal.findOne({ subject: legacyJournal, isActive: true }).lean()
  }
  if (!selectedJournal) return res.status(400).json({ message: 'Selected journal is not available' })
  const articleTypesSetting = await PlatformSetting.findOne({ key: 'articleTypes' }).lean()
  let allowedArticleTypes = []
  try {
    const parsed = JSON.parse(articleTypesSetting?.value || '[]')
    allowedArticleTypes = Array.isArray(parsed) ? parsed : []
  } catch {
    allowedArticleTypes = []
  }
  if (allowedArticleTypes.length && !allowedArticleTypes.includes(articleType)) {
    return res.status(400).json({ message: 'Selected article type is not available' })
  }
  const created = await Submission.create({
    title,
    articleType,
    keywords,
    authors,
    abstract,
    journalId: selectedJournal._id,
    journal: selectedJournal.subject,
    files,
    currentVersion: 1,
    history: files.length
      ? [
          {
            version: 1,
            note: 'Initial submission',
            changedBy: req.user.name,
            files,
          },
        ]
      : [],
    authorId: req.user._id.toString(),
    authorName: req.user.name,
  })
  return res.status(201).json({
    id: created._id.toString(),
    title: created.title,
    articleType: created.articleType,
    keywords: created.keywords,
    authors: created.authors,
    abstract: created.abstract,
    journalId: created.journalId?.toString() || '',
    journal: created.journal,
    files: created.files,
    currentVersion: created.currentVersion,
    history: created.history,
    status: created.status,
    authorId: created.authorId,
    authorName: created.authorName,
    createdAt: created.createdAt,
    updatedAt: created.updatedAt,
    decision: created.decision,
    reviews: created.reviews,
  })
}

export const listMySubmissions = async (req, res) => {
  if (!requireDb(res)) return
  const userId = req.user._id.toString()
  const items = await Submission.find({ authorId: userId }).sort({ createdAt: -1 }).lean()
  return res.json(
    items.map((item) => ({
      id: item._id.toString(),
      title: item.title,
      articleType: item.articleType || 'Research Article',
      keywords: item.keywords || [],
      abstract: item.abstract,
      journalId: item.journalId?.toString() || '',
      journal: item.journal,
      currentVersion: item.currentVersion || 1,
      status: item.status,
      authorId: item.authorId,
      authorName: item.authorName,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      decision: item.decision,
      reviews: item.reviews,
    }))
  )
}

export const listEditorSubmissions = async (_req, res) => {
  if (!requireDb(res)) return
  const editorJournalIds = await getEditorJournalIds(_req.user)
  if (Array.isArray(editorJournalIds) && !editorJournalIds.length) return res.json([])
  const query =
    Array.isArray(editorJournalIds) && editorJournalIds.length
      ? { journalId: { $in: editorJournalIds } }
      : {}
  const items = await Submission.find(query).sort({ createdAt: -1 }).lean()
  return res.json(
    items.map((item) => ({
      id: item._id.toString(),
      title: item.title,
      articleType: item.articleType || 'Research Article',
      keywords: item.keywords || [],
      abstract: item.abstract,
      journalId: item.journalId?.toString() || '',
      journal: item.journal,
      currentVersion: item.currentVersion || 1,
      status: item.status,
      authorId: item.authorId,
      authorName: item.authorName,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      decision: item.decision,
      reviews: item.reviews,
    }))
  )
}

export const getEditorSubmissionDetail = async (req, res) => {
  if (!requireDb(res)) return
  const item = await Submission.findById(req.params.id).lean()
  if (!item) return res.status(404).json({ message: 'Submission not found' })
  const editorJournalIds = await getEditorJournalIds(req.user)
  if (
    Array.isArray(editorJournalIds) &&
    !editorJournalIds.includes(item.journalId?.toString() || '')
  ) {
    return res.status(403).json({ message: 'Not allowed for this submission' })
  }
  return res.json({
    id: item._id.toString(),
    title: item.title,
    articleType: item.articleType || 'Research Article',
    keywords: item.keywords || [],
    authors: item.authors || [],
    abstract: item.abstract,
    journalId: item.journalId?.toString() || '',
    journal: item.journal,
    files: item.files || [],
    currentVersion: item.currentVersion || 1,
    history: item.history || [],
    status: item.status,
    authorId: item.authorId,
    authorName: item.authorName,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    decision: item.decision,
    reviews: item.reviews || [],
    messages: item.messages || [],
  })
}

export const getReviewerSubmissionDetail = async (req, res) => {
  if (!requireDb(res)) return
  const reviewerId = req.user._id.toString()
  const assignment = await ReviewAssignment.findOne({
    reviewerId,
    submissionId: req.params.id,
  }).lean()
  if (!assignment) return res.status(404).json({ message: 'Submission not found for reviewer' })
  const item = await Submission.findById(req.params.id).lean()
  if (!item) return res.status(404).json({ message: 'Submission not found' })
  return res.json({
    id: item._id.toString(),
    title: item.title,
    abstract: item.abstract,
    journal: item.journal,
    authors: item.authors || [],
    files: item.files || [],
    versionHistory: item.history || [],
    status: item.status,
  })
}

export const assignReviewer = async (req, res) => {
  if (!requireDb(res)) return
  const reviewerEmail = req.body.reviewerEmail?.trim().toLowerCase()
  if (!reviewerEmail) return res.status(400).json({ message: 'reviewerEmail is required' })

  const submission = await Submission.findById(req.params.id)
  if (!submission) return res.status(404).json({ message: 'Submission not found' })
  const editorJournalIds = await getEditorJournalIds(req.user)
  if (
    Array.isArray(editorJournalIds) &&
    !editorJournalIds.includes(submission.journalId?.toString() || '')
  ) {
    return res.status(403).json({ message: 'Not allowed for this submission' })
  }
  if (!canTransition(submission.status, STATUS.UNDER_REVIEW)) {
    return res.status(409).json({
      message: `Cannot move submission from ${submission.status} to ${STATUS.UNDER_REVIEW}`,
    })
  }
  const reviewer = await User.findOne({ email: reviewerEmail, role: 'reviewer' }).lean()
  if (!reviewer) return res.status(404).json({ message: 'Reviewer not found' })

  const existing = await ReviewAssignment.findOne({
    submissionId: submission._id.toString(),
    reviewerId: reviewer._id.toString(),
  }).lean()
  if (existing) return res.status(409).json({ message: 'Reviewer already assigned' })

  const setting = await PlatformSetting.findOne({ key: 'reviewDeadlineDays' }).lean()
  const deadlineDaysRaw = Number.parseInt(setting?.value || '14', 10)
  const deadlineDays = Number.isFinite(deadlineDaysRaw) && deadlineDaysRaw > 0 ? deadlineDaysRaw : 14
  const deadline = new Date(Date.now() + deadlineDays * 24 * 60 * 60 * 1000)

  const assignment = await ReviewAssignment.create({
    submissionId: submission._id.toString(),
    submissionTitle: submission.title,
    reviewerId: reviewer._id.toString(),
    reviewerEmail: reviewer.email,
    reviewerName: reviewer.name,
    status: 'pending',
    deadline,
  })
  submission.status = 'under-review'
  await submission.save()
  await createAuditLog({
    actor: req.user,
    action: 'submission.assign-reviewer',
    targetType: 'submission',
    targetId: submission._id.toString(),
    targetLabel: submission.title,
    metadata: { reviewerId: reviewer._id.toString(), reviewerEmail: reviewer.email },
  })
  return res.status(201).json({
    ...serializeAssignment(assignment),
  })
}

export const listAssignedReviews = async (req, res) => {
  if (!requireDb(res)) return
  const reviewerId = req.user._id.toString()
  const items = await ReviewAssignment.find({ reviewerId }).sort({ createdAt: -1 })
  for (const assignment of items) {
    const nextStatus = toAssignmentStatus(assignment)
    if (nextStatus === 'overdue' && assignment.status !== 'overdue') {
      assignment.status = 'overdue'
      // eslint-disable-next-line no-await-in-loop
      await assignment.save()
    }
  }
  return res.json(items.map((item) => serializeAssignment(item)))
}

export const getReviewerAssignmentDetail = async (req, res) => {
  if (!requireDb(res)) return
  const item = await ReviewAssignment.findOne({
    _id: req.params.id,
    reviewerId: req.user._id.toString(),
  }).lean()
  if (!item) return res.status(404).json({ message: 'Assignment not found' })
  return res.json(serializeAssignment(item))
}

export const submitReview = async (req, res) => {
  if (!requireDb(res)) return
  const recommendation = req.body.recommendation?.trim()
  const comments = req.body.comments?.trim() || ''
  const allowed = ['accept', 'minor-revision', 'major-revision', 'reject']
  if (!allowed.includes(recommendation)) {
    return res.status(400).json({ message: `recommendation must be one of: ${allowed.join(', ')}` })
  }

  const assignment = await ReviewAssignment.findById(req.params.id)
  if (!assignment) return res.status(404).json({ message: 'Assignment not found' })
  if (assignment.reviewerId !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not allowed for this assignment' })
  }
  if (['submitted', 'completed'].includes(assignment.status)) {
    return res.status(409).json({ message: 'Review already submitted for this assignment' })
  }
  assignment.status = 'completed'
  assignment.recommendation = recommendation
  assignment.comments = comments
  await assignment.save()

  const submission = await Submission.findById(assignment.submissionId)
  if (submission) {
    submission.reviews = submission.reviews.filter(
      (review) => review.assignmentId !== assignment._id.toString()
    )
    submission.reviews.push({
      assignmentId: assignment._id.toString(),
      reviewerName: req.user.name,
      recommendation,
      comments,
      submittedAt: new Date(),
    })
    await submission.save()
  }

  return res.json(serializeAssignment(assignment))
}

export const setEditorDecision = async (req, res) => {
  if (!requireDb(res)) return
  const decision = req.body.decision?.trim()
  const note = req.body.note?.trim() || ''
  const allowed = ['accept', 'revise', 'reject']
  if (!allowed.includes(decision)) {
    return res.status(400).json({ message: `decision must be one of: ${allowed.join(', ')}` })
  }

  const submission = await Submission.findById(req.params.id)
  if (!submission) return res.status(404).json({ message: 'Submission not found' })
  const editorJournalIds = await getEditorJournalIds(req.user)
  if (
    Array.isArray(editorJournalIds) &&
    !editorJournalIds.includes(submission.journalId?.toString() || '')
  ) {
    return res.status(403).json({ message: 'Not allowed for this submission' })
  }
  const nextStatus =
    decision === 'accept' ? STATUS.ACCEPTED : decision === 'reject' ? STATUS.REJECTED : STATUS.REVISION_REQUESTED
  if (!canTransition(submission.status, nextStatus)) {
    return res.status(409).json({
      message: `Cannot move submission from ${submission.status} to ${nextStatus}`,
    })
  }
  submission.decision = {
    value: decision,
    note,
    by: req.user.name,
    at: new Date(),
  }
  submission.status = nextStatus
  await submission.save()
  await syncPublicationFromSubmission(submission)
  await createAuditLog({
    actor: req.user,
    action: 'submission.decision',
    targetType: 'submission',
    targetId: submission._id.toString(),
    targetLabel: submission.title,
    metadata: { decision, note },
  })
  return res.json({
    id: submission._id.toString(),
    title: submission.title,
    articleType: submission.articleType || 'Research Article',
    abstract: submission.abstract,
    journalId: submission.journalId?.toString() || '',
    journal: submission.journal,
    status: submission.status,
    authorId: submission.authorId,
    authorName: submission.authorName,
    createdAt: submission.createdAt,
    updatedAt: submission.updatedAt,
    decision: submission.decision,
    reviews: submission.reviews,
  })
}

export const listReviewers = async (_req, res) => {
  if (!requireDb(res)) return
  const users = await User.find({ role: 'reviewer', status: 'active' })
    .select({ _id: 1, name: 1, email: 1, role: 1, expertise: 1 })
    .lean()
  const activeCounts = await ReviewAssignment.aggregate([
    { $match: { status: { $in: ['pending', 'overdue', 'assigned'] } } },
    { $group: { _id: '$reviewerId', count: { $sum: 1 } } },
  ])
  const activeMap = new Map(activeCounts.map((item) => [item._id, item.count]))
  return res.json(
    users.map((item) => ({
      id: item._id.toString(),
      name: item.name,
      email: item.email,
      role: item.role,
      expertise: Array.isArray(item.expertise) ? item.expertise : [],
      activeAssignments: activeMap.get(item._id.toString()) || 0,
    }))
  )
}

export const getMySubmissionDetail = async (req, res) => {
  if (!requireDb(res)) return
  const item = await Submission.findOne({
    _id: req.params.id,
    authorId: req.user._id.toString(),
  }).lean()
  if (!item) return res.status(404).json({ message: 'Submission not found' })
  return res.json({
    id: item._id.toString(),
    title: item.title,
    articleType: item.articleType || 'Research Article',
    keywords: item.keywords || [],
    authors: item.authors || [],
    abstract: item.abstract,
    journalId: item.journalId?.toString() || '',
    journal: item.journal,
    status: item.status,
    authorId: item.authorId,
    authorName: item.authorName,
    files: item.files || [],
    currentVersion: item.currentVersion || 1,
    history: item.history || [],
    messages: item.messages || [],
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    decision: item.decision,
    reviews: item.reviews || [],
  })
}

export const uploadRevision = async (req, res) => {
  if (!requireDb(res)) return
  const note = req.body.note?.toString().trim() || 'Revision uploaded'
  const files = normalizeFiles(req.body.files, 1)
  if (!files.length) return res.status(400).json({ message: 'At least one revision file is required' })

  const submission = await Submission.findOne({
    _id: req.params.id,
    authorId: req.user._id.toString(),
  })
  if (!submission) return res.status(404).json({ message: 'Submission not found' })
  if (submission.status !== STATUS.REVISION_REQUESTED) {
    return res.status(409).json({
      message: `Cannot upload revision while status is ${submission.status}`,
    })
  }

  const nextVersion = (submission.currentVersion || 1) + 1
  const nextFiles = files.map((item) => ({ ...item, version: nextVersion, uploadedAt: new Date() }))
  submission.currentVersion = nextVersion
  submission.files = nextFiles
  submission.history.push({
    version: nextVersion,
    note,
    changedBy: req.user.name,
    files: nextFiles,
    createdAt: new Date(),
  })
  submission.status = STATUS.UNDER_REVIEW
  await submission.save()

  return res.json({
    id: submission._id.toString(),
    status: submission.status,
    currentVersion: submission.currentVersion,
    files: submission.files,
    history: submission.history,
    updatedAt: submission.updatedAt,
  })
}

export const uploadSubmissionFiles = async (req, res) => {
  if (!requireDb(res)) return
  const note = req.body.note?.toString().trim() || 'Files updated'
  const files = normalizeFiles(req.body.files, 1)
  if (!files.length) return res.status(400).json({ message: 'At least one file is required' })

  const submission = await Submission.findOne({
    _id: req.params.id,
    authorId: req.user._id.toString(),
  })
  if (!submission) return res.status(404).json({ message: 'Submission not found' })
  if (![STATUS.SUBMITTED, STATUS.REVISION_REQUESTED].includes(submission.status)) {
    return res.status(409).json({
      message: `Cannot update files while status is ${submission.status}`,
    })
  }

  const nextVersion = submission.currentVersion || 1
  const nextFiles = files.map((item) => ({ ...item, version: nextVersion, uploadedAt: new Date() }))
  submission.files = nextFiles
  submission.history.push({
    version: nextVersion,
    note,
    changedBy: req.user.name,
    files: nextFiles,
    createdAt: new Date(),
  })
  await submission.save()

  return res.json({
    id: submission._id.toString(),
    status: submission.status,
    currentVersion: submission.currentVersion,
    files: submission.files,
    history: submission.history,
    updatedAt: submission.updatedAt,
  })
}

export const listSubmissionMessages = async (req, res) => {
  if (!requireDb(res)) return
  const submission = await canAccessSubmissionMessages(req.params.id, req.user)
  if (!submission) return res.status(404).json({ message: 'Submission not found' })
  return res.json({
    submissionId: submission._id.toString(),
    messages: submission.messages || [],
  })
}

export const postSubmissionMessage = async (req, res) => {
  if (!requireDb(res)) return
  const message = req.body.message?.toString().trim()
  if (!message) return res.status(400).json({ message: 'message is required' })
  const submission = await canAccessSubmissionMessages(req.params.id, req.user)
  if (!submission) return res.status(404).json({ message: 'Submission not found' })

  submission.messages.push({
    senderId: req.user._id.toString(),
    senderName: req.user.name,
    senderRole: req.user.role,
    message,
    createdAt: new Date(),
  })
  await submission.save()
  return res.status(201).json({
    submissionId: submission._id.toString(),
    messages: submission.messages || [],
  })
}

export const uploadSubmissionAsset = async (req, res) => {
  if (!requireDb(res)) return
  if (!req.file) return res.status(400).json({ message: 'File is required' })

  const base = `${req.protocol}://${req.get('host')}`
  const relativePath = `/uploads/submissions/${req.file.filename}`
  return res.status(201).json({
    name: req.file.originalname,
    url: `${base}${relativePath}`,
    size: req.file.size || 0,
    mimeType: req.file.mimetype || 'application/octet-stream',
  })
}
