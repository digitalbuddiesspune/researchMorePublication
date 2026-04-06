import { Publication } from '../models/Publication.js'
import { ReviewAssignment } from '../models/ReviewAssignment.js'
import { Submission } from '../models/Submission.js'
import { Subscriber } from '../models/Subscriber.js'
import { News } from '../models/News.js'
import { isDatabaseConnected } from '../config/db.js'
import { memoryStore } from '../data/memoryStore.js'
import { User } from '../models/User.js'
import { Journal } from '../models/Journal.js'

/** Aggregates counts across models (dashboard / admin). */
export const getStats = async (_req, res, next) => {
  try {
    if (isDatabaseConnected()) {
      const [totalPublications, totalSubscribers, reviewQueue] = await Promise.all([
        Publication.countDocuments({ status: 'accepted' }),
        Subscriber.countDocuments(),
        Publication.countDocuments({ status: 'in-review' }),
      ])
      const totalNews = await News.countDocuments()
      return res.json({ totalPublications, totalSubscribers, reviewQueue, totalNews })
    }

    const totalPublications = memoryStore.publications.filter((item) => item.status === 'accepted')
      .length
    const totalSubscribers = memoryStore.subscribers.length
    const reviewQueue = memoryStore.publications.filter(
      (item) => item.status === 'in-review'
    ).length
    const totalNews = memoryStore.news.length
    return res.json({ totalPublications, totalSubscribers, reviewQueue, totalNews })
  } catch (error) {
    return next(error)
  }
}

export const getAdminAnalytics = async (_req, res, next) => {
  try {
    if (isDatabaseConnected()) {
      const [
        totalUsers,
        authors,
        reviewers,
        editors,
        admins,
        totalSubmissions,
        underReview,
        accepted,
        rejected,
        reviewAssigned,
        reviewSubmitted,
        totalJournals,
        activeReviewers,
      ] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: 'author' }),
        User.countDocuments({ role: 'reviewer' }),
        User.countDocuments({ role: 'editor' }),
        User.countDocuments({ role: 'admin' }),
        Submission.countDocuments(),
        Submission.countDocuments({ status: 'under-review' }),
        Submission.countDocuments({ status: 'accepted' }),
        Submission.countDocuments({ status: 'rejected' }),
        ReviewAssignment.countDocuments({ status: { $in: ['assigned', 'pending', 'overdue'] } }),
        ReviewAssignment.countDocuments({ status: { $in: ['submitted', 'completed'] } }),
        Journal.countDocuments({ isActive: true }),
        User.countDocuments({ role: 'reviewer', status: 'active' }),
      ])

      return res.json({
        users: { totalUsers, authors, reviewers, editors, admins },
        submissions: { totalSubmissions, underReview, accepted, rejected },
        reviews: { assigned: reviewAssigned, submitted: reviewSubmitted },
        journals: { totalJournals },
        reviewers: { activeReviewers },
      })
    }

    const users = memoryStore.users || []
    const submissions = memoryStore.submissions || []
    const assignments = memoryStore.reviewAssignments || []
    return res.json({
      users: {
        totalUsers: users.length,
        authors: users.filter((item) => item.role === 'author').length,
        reviewers: users.filter((item) => item.role === 'reviewer').length,
        editors: users.filter((item) => item.role === 'editor').length,
        admins: users.filter((item) => item.role === 'admin').length,
      },
      submissions: {
        totalSubmissions: submissions.length,
        underReview: submissions.filter((item) => item.status === 'under-review').length,
        accepted: submissions.filter((item) => item.status === 'accepted').length,
        rejected: submissions.filter((item) => item.status === 'rejected').length,
      },
      reviews: {
        assigned: assignments.filter((item) => ['assigned', 'pending', 'overdue'].includes(item.status)).length,
        submitted: assignments.filter((item) => ['submitted', 'completed'].includes(item.status)).length,
      },
    })
  } catch (error) {
    return next(error)
  }
}
