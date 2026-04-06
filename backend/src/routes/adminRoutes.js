import { Router } from 'express'
import { authRequired } from '../middleware/authRequired.js'
import { requireRole } from '../middleware/requireRole.js'
import {
  createJournal,
  deleteJournal,
  listAdminJournals,
  updateJournal,
} from '../controllers/journalAdminController.js'
import {
  getAdminAnalyticsTrends,
  listAdminPublications,
  listAdminReviewOversight,
  listAdminSubmissionsMonitor,
  updateAdminPublication,
} from '../controllers/adminInsightsController.js'
import {
  getPlatformSettings,
  getPublicPlatformSettings,
  upsertPlatformSettings,
} from '../controllers/settingsController.js'
import { listAuditLogs } from '../controllers/auditController.js'

const adminRouter = Router()

adminRouter.get('/settings/public', getPublicPlatformSettings)

adminRouter.use(authRequired, requireRole(['admin']))

adminRouter.get('/admin/journals', listAdminJournals)
adminRouter.post('/admin/journals', createJournal)
adminRouter.patch('/admin/journals/:id', updateJournal)
adminRouter.delete('/admin/journals/:id', deleteJournal)

adminRouter.get('/admin/settings', getPlatformSettings)
adminRouter.put('/admin/settings', upsertPlatformSettings)

adminRouter.get('/admin/logs', listAuditLogs)
adminRouter.get('/admin/submissions-monitor', listAdminSubmissionsMonitor)
adminRouter.get('/admin/review-oversight', listAdminReviewOversight)
adminRouter.get('/admin/publications', listAdminPublications)
adminRouter.patch('/admin/publications/:id', updateAdminPublication)
adminRouter.get('/admin/analytics/trends', getAdminAnalyticsTrends)

export default adminRouter
