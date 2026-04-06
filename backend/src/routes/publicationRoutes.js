import { Router } from 'express'
import * as publicationController from '../controllers/publicationController.js'

const publicationRouter = Router()

publicationRouter.get('/publications', publicationController.listPublications)
publicationRouter.get('/get-publication/:id', publicationController.getPublication)

export default publicationRouter
