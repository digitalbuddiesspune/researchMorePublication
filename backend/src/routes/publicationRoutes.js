import { Router } from 'express'
import * as publicationController from '../controllers/publicationController.js'

const publicationRouter = Router()

publicationRouter.get('/publications', publicationController.listPublications)
publicationRouter.post('/create-publication', publicationController.createPublication)
publicationRouter.get('/get-publication/:id', publicationController.getPublication)
publicationRouter.patch('/update-publication/:id', publicationController.updatePublication)
publicationRouter.delete('/delete-publication/:id', publicationController.deletePublication)

export default publicationRouter
