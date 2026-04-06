import { Router } from 'express'
import { getArticle, getJournal, listArticles, listJournals } from '../controllers/catalogController.js'

const catalogRouter = Router()

catalogRouter.get('/journals', listJournals)
catalogRouter.get('/journals/:id', getJournal)
catalogRouter.get('/articles', listArticles)
catalogRouter.get('/articles/:id', getArticle)

export default catalogRouter
