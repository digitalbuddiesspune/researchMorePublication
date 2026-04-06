import { Router } from 'express'
import * as newsController from '../controllers/newsController.js'
import { authRequired } from '../middleware/authRequired.js'
import { requireRole } from '../middleware/requireRole.js'

const newsRouter = Router()

newsRouter.get('/news', newsController.listNews)
newsRouter.post('/create-news', authRequired, requireRole(['admin']), newsController.createNews)
newsRouter.patch('/update-news/:id', authRequired, requireRole(['admin']), newsController.updateNews)
newsRouter.delete('/delete-news/:id', authRequired, requireRole(['admin']), newsController.deleteNews)

export default  newsRouter;
