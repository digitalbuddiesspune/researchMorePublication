import { Router } from 'express'
import * as newsController from '../controllers/newsController.js'

const newsRouter = Router()

newsRouter.get('/news', newsController.listNews)
newsRouter.post('/create-news', newsController.createNews)
newsRouter.patch('/update-news/:id', newsController.updateNews)
newsRouter.delete('/delete-news/:id', newsController.deleteNews)

export default  newsRouter;
