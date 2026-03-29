import { Router } from 'express'
import { getStats } from '../controllers/statsController.js'

const statsRouter = Router()

statsRouter.get('/stats', getStats)

export default statsRouter
