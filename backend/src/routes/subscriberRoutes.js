import { Router } from 'express'
import * as subscriberController from '../controllers/subscriberController.js'

const subscriberRouter = Router()

subscriberRouter.post('/subscribe', subscriberController.subscribeNewsletter)

export default subscriberRouter
