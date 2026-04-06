import { Submission } from '../models/Submission.js'
import { ReviewAssignment } from '../models/ReviewAssignment.js'
import { Publication } from '../models/Publication.js'
import { User } from '../models/User.js'
import { isDatabaseConnected } from '../config/db.js'

const ensureDb = (res) => {
  if (isDatabaseConnected()) return true
  res.status(503).json({ message: 'Database unavailable. Please try again later.' })
  return false
}

const daysBetween = (dateA, dateB) => Math.floor((dateA - dateB) / (1000 * 60 * 60 * 24))

export const listAdminSubmissionsMonitor = async (_req, res, next) => {
  try {
    if (!ensureDb(res)) return
    const submissions = await Submission.find().sort({ createdAt: -1 }).lean()
    const assignments = await ReviewAssignment.find().lean()
    const assignmentCountBySubmission = assignments.reduce((acc, item) => {
      acc[item.submissionId] = (acc[item.submissionId] || 0) + 1
      return acc
    }, {})
    const now = new Date()
    const items = submissions.map((item) => {
      const submissionId = item._id.toString()
      const hasReviewerAssigned = Boolean(assignmentCountBySubmission[submissionId])
      const daysSinceUpdate = daysBetween(now, new Date(item.updatedAt || item.createdAt))
      return {
        id: submissionId,
        title: item.title,
        authorName: item.authorName,
        journal: item.journal,
        status: item.status,
        hasReviewerAssigned,
        daysSinceUpdate,
        stuck: daysSinceUpdate >= 14 && item.status !== 'accepted' && item.status !== 'rejected',
        updatedAt: item.updatedAt,
      }
    })
    return res.json(items)
  } catch (error) {
    return next(error)
  }
}

export const listAdminReviewOversight = async (_req, res, next) => {
  try {
    if (!ensureDb(res)) return
    const assignments = await ReviewAssignment.find().sort({ createdAt: -1 }).lean()
    const byReviewer = assignments.reduce((acc, item) => {
    if (!acc[item.reviewerId]) {
      acc[item.reviewerId] = {
        reviewerId: item.reviewerId,
        reviewerName: item.reviewerName,
        reviewerEmail: item.reviewerEmail,
        assigned: 0,
        submitted: 0,
        pending: 0,
        overdue: 0,
      }
    }
    acc[item.reviewerId].assigned += 1
    if (['submitted', 'completed'].includes(item.status)) acc[item.reviewerId].submitted += 1
    if (['assigned', 'pending', 'overdue'].includes(item.status)) {
      acc[item.reviewerId].pending += 1
      const isOverdue = item.status === 'overdue' || daysBetween(new Date(), new Date(item.createdAt)) > 14
      if (isOverdue) acc[item.reviewerId].overdue += 1
    }
    return acc
  }, {})
    const ranking = Object.values(byReviewer).sort((a, b) => b.submitted - a.submitted || a.overdue - b.overdue)
    return res.json(ranking)
  } catch (error) {
    return next(error)
  }
}

export const listAdminPublications = async (_req, res, next) => {
  try {
    if (!ensureDb(res)) return
    const publications = await Publication.find({ status: 'accepted' }).sort({ updatedAt: -1 }).lean()
    return res.json(
    publications.map((item) => ({
      id: item._id.toString(),
      title: item.title,
      author: item.author,
      abstract: item.abstract,
      category: item.category,
      status: item.status,
      submissionId: item.submissionId || '',
      featured: Boolean(item.featured),
      seoTitle: item.seoTitle || '',
      seoDescription: item.seoDescription || '',
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }))
    )
  } catch (error) {
    return next(error)
  }
}

export const updateAdminPublication = async (req, res, next) => {
  try {
    if (!ensureDb(res)) return
    const payload = {
    featured: Boolean(req.body.featured),
    seoTitle: req.body.seoTitle?.toString().trim() || '',
    seoDescription: req.body.seoDescription?.toString().trim() || '',
    title: req.body.title?.toString().trim() || undefined,
    abstract: req.body.abstract?.toString().trim() || undefined,
    category: req.body.category?.toString().trim() || undefined,
  }
    const cleaned = Object.fromEntries(Object.entries(payload).filter(([, v]) => v !== undefined))
    const updated = await Publication.findByIdAndUpdate(req.params.id, cleaned, {
      new: true,
      runValidators: true,
    }).lean()
    if (!updated) return res.status(404).json({ message: 'Publication not found' })
    return res.json({
    id: updated._id.toString(),
    title: updated.title,
    author: updated.author,
    abstract: updated.abstract,
    category: updated.category,
    featured: Boolean(updated.featured),
    seoTitle: updated.seoTitle || '',
    seoDescription: updated.seoDescription || '',
    updatedAt: updated.updatedAt,
    })
  } catch (error) {
    return next(error)
  }
}

const buildMonthMap = (months = 12) => {
  const now = new Date()
  const map = new Map()
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    map.set(key, 0)
  }
  return map
}

export const getAdminAnalyticsTrends = async (_req, res, next) => {
  try {
    if (!ensureDb(res)) return
    const submissions = await Submission.find().select({ createdAt: 1, status: 1, journal: 1 }).lean()
    const users = await User.find().select({ createdAt: 1 }).lean()

  const submissionMap = buildMonthMap(12)
  const activeUsersMap = buildMonthMap(12)

  submissions.forEach((item) => {
    const date = new Date(item.createdAt)
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    if (submissionMap.has(key)) submissionMap.set(key, submissionMap.get(key) + 1)
  })
  users.forEach((item) => {
    const date = new Date(item.createdAt)
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    if (activeUsersMap.has(key)) activeUsersMap.set(key, activeUsersMap.get(key) + 1)
  })

  const accepted = submissions.filter((item) => item.status === 'accepted').length
  const total = submissions.length || 1
  const acceptanceRate = Math.round((accepted / total) * 100)

  const byJournal = submissions.reduce((acc, item) => {
    const key = item.journal || 'General'
    if (!acc[key]) acc[key] = { journal: key, total: 0, accepted: 0 }
    acc[key].total += 1
    if (item.status === 'accepted') acc[key].accepted += 1
    return acc
  }, {})

    return res.json({
    submissionsPerMonth: Array.from(submissionMap.entries()).map(([month, count]) => ({ month, count })),
    activeUsersPerMonth: Array.from(activeUsersMap.entries()).map(([month, count]) => ({ month, count })),
    acceptanceRate,
    journalWiseStats: Object.values(byJournal).sort((a, b) => b.total - a.total),
    })
  } catch (error) {
    return next(error)
  }
}

