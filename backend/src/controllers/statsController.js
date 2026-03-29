import { Publication } from '../models/Publication.js'
import { Subscriber } from '../models/Subscriber.js'
import { News } from '../models/News.js'
import { isDatabaseConnected } from '../config/db.js'
import { memoryStore } from '../data/memoryStore.js'

/** Aggregates counts across models (dashboard / admin). */
export const getStats = async (_req, res, next) => {
  try {
    if (isDatabaseConnected()) {
      const [totalPublications, totalSubscribers, reviewQueue] = await Promise.all([
        Publication.countDocuments(),
        Subscriber.countDocuments(),
        Publication.countDocuments({ status: 'in-review' }),
      ])
      const totalNews = await News.countDocuments()
      return res.json({ totalPublications, totalSubscribers, reviewQueue, totalNews })
    }

    const totalPublications = memoryStore.publications.length
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
