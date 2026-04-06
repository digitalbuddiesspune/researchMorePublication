import { Router } from 'express'
import { getAdminAnalytics, getStats } from '../controllers/statsController.js'
import { authRequired } from '../middleware/authRequired.js'
import { requireRole } from '../middleware/requireRole.js'

const statsRouter = Router()

statsRouter.get('/stats', getStats)
statsRouter.get('/admin/analytics', authRequired, requireRole(['admin']), getAdminAnalytics)

export default statsRouter
