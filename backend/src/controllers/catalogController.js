import { Publication } from '../models/Publication.js'
import { Journal } from '../models/Journal.js'
import { isDatabaseConnected } from '../config/db.js'
import { memoryStore } from '../data/memoryStore.js'

const paginate = (items, page, limit) => {
  const start = (page - 1) * limit
  return items.slice(start, start + limit)
}

const toNumber = (value, fallback) => {
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

const getSortDirection = (value) => (value === 'asc' ? 1 : -1)

export const listJournals = async (req, res, next) => {
  try {
    const search = (req.query.search || '').toString().trim().toLowerCase()
    const subject = (req.query.subject || '').toString().trim().toLowerCase()
    const page = toNumber(req.query.page, 1)
    const limit = toNumber(req.query.limit, 12)

    if (isDatabaseConnected()) {
      const journals = await Journal.find({ isActive: true }).sort({ createdAt: -1 }).lean()
      const publications = await Publication.find({ status: 'accepted' })
        .select({ category: 1 })
        .lean()
      const counts = publications.reduce((acc, item) => {
        const key = (item.category || '').trim().toLowerCase()
        if (!key) return acc
        acc[key] = (acc[key] || 0) + 1
        return acc
      }, {})

      const grouped = journals.map((item) => ({
        id: item._id.toString(),
        slug: item.name.toLowerCase().replace(/\s+/g, '-'),
        name: item.name,
        subject: item.subject,
        description: item.description || `Latest research and publication activity in ${item.subject}.`,
        articleCount: counts[item.subject.toLowerCase()] || 0,
        editorName: item.editorName || '',
      }))

      const sort = (req.query.sort || 'name:asc').toString()
      const [sortField, sortDirectionRaw] = sort.split(':')
      const sortDirection = sortDirectionRaw === 'desc' ? -1 : 1

      let filtered = grouped
      if (search) {
        filtered = filtered.filter((item) => item.name.toLowerCase().includes(search))
      }
      if (subject) {
        filtered = filtered.filter((item) => item.subject.toLowerCase() === subject)
      }
      filtered = filtered.sort((a, b) => {
        if (sortField === 'articleCount') return (a.articleCount - b.articleCount) * sortDirection
        return a.name.localeCompare(b.name) * sortDirection
      })

      const total = filtered.length
      const items = paginate(filtered, page, limit)
      return res.json({
        items,
        meta: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
      })
    }

    const publications = memoryStore.publications.filter((item) => item.status === 'accepted')
    const grouped = publications.reduce((acc, item) => {
      const key = item.category || 'General'
      if (!acc[key]) {
        acc[key] = {
          id: key.toLowerCase().replace(/\s+/g, '-'),
          slug: key.toLowerCase().replace(/\s+/g, '-'),
          name: `${key} Journal`,
          subject: key,
          description: `Latest research and publication activity in ${key}.`,
          articleCount: 0,
          editorName: '',
        }
      }
      acc[key].articleCount += 1
      return acc
    }, {})

    const sort = (req.query.sort || 'name:asc').toString()
    const [sortField, sortDirectionRaw] = sort.split(':')
    const sortDirection = sortDirectionRaw === 'desc' ? -1 : 1

    let journals = Object.values(grouped)
    if (search) {
      journals = journals.filter((item) => item.name.toLowerCase().includes(search))
    }
    if (subject) {
      journals = journals.filter((item) => item.subject.toLowerCase() === subject)
    }
    journals = journals.sort((a, b) => {
      if (sortField === 'articleCount') return (a.articleCount - b.articleCount) * sortDirection
      return a.name.localeCompare(b.name) * sortDirection
    })

    const total = journals.length
    const items = paginate(journals, page, limit)
    return res.json({
      items,
      meta: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
    })
  } catch (error) {
    return next(error)
  }
}

export const listArticles = async (req, res, next) => {
  try {
    const search = (req.query.search || '').toString().trim().toLowerCase()
    const journal = (req.query.journal || '').toString().trim().toLowerCase()
    const year = (req.query.year || '').toString().trim()
    const sort = (req.query.sort || 'publishedAt:desc').toString()
    const page = toNumber(req.query.page, 1)
    const limit = toNumber(req.query.limit, 12)

    const publications = isDatabaseConnected()
      ? await Publication.find({ status: 'accepted' }).sort({ createdAt: -1 }).lean()
      : memoryStore.publications.filter((item) => item.status === 'accepted')

    let articles = publications.map((item) => ({
      id: item._id,
      title: item.title,
      author: item.author,
      abstract: item.abstract || '',
      journal: item.category || 'General',
      status: item.status,
      publishedAt: item.updatedAt || item.createdAt,
    }))

    if (search) {
      articles = articles.filter(
        (item) =>
          item.title.toLowerCase().includes(search) || item.author.toLowerCase().includes(search)
      )
    }
    if (journal) {
      articles = articles.filter((item) => item.journal.toLowerCase() === journal)
    }
    if (year) {
      articles = articles.filter((item) => {
        const date = new Date(item.publishedAt)
        return Number.isFinite(date.valueOf()) && date.getFullYear().toString() === year
      })
    }
    const [sortField, sortDirectionRaw] = sort.split(':')
    const sortDirection = getSortDirection(sortDirectionRaw)
    articles = articles.sort((a, b) => {
      if (sortField === 'title') return a.title.localeCompare(b.title) * sortDirection
      return (new Date(a.publishedAt) - new Date(b.publishedAt)) * sortDirection
    })

    const total = articles.length
    const items = paginate(articles, page, limit)
    return res.json({
      items,
      meta: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
    })
  } catch (error) {
    return next(error)
  }
}

export const getJournal = async (req, res, next) => {
  try {
    if (isDatabaseConnected()) {
      const journal = await Journal.findById(req.params.id).lean()
      if (!journal || !journal.isActive) return res.status(404).json({ message: 'Journal not found' })

      const journalPublications = await Publication.find({
        category: journal.subject,
        status: 'accepted',
      })
        .sort({ createdAt: -1 })
        .lean()

      return res.json({
        id: journal._id.toString(),
        slug: journal.name.toLowerCase().replace(/\s+/g, '-'),
        name: journal.name,
        subject: journal.subject,
        description: journal.description || `Latest research and publication activity in ${journal.subject}.`,
        articleCount: journalPublications.length,
        editorName: journal.editorName || '',
        latestArticles: journalPublications.slice(0, 6).map((item) => ({
          id: item._id,
          title: item.title,
          author: item.author,
          abstract: item.abstract || '',
          status: item.status,
        })),
      })
    }

    const publications = memoryStore.publications.filter((item) => item.status === 'accepted')
    const journalKey = req.params.id.toLowerCase()
    const journalPublications = publications.filter(
      (item) => (item.category || 'General').toLowerCase().replace(/\s+/g, '-') === journalKey
    )
    if (journalPublications.length === 0) return res.status(404).json({ message: 'Journal not found' })
    const subject = journalPublications[0].category || 'General'
    return res.json({
      id: journalKey,
      slug: journalKey,
      name: `${subject} Journal`,
      subject,
      description: `Latest research and publication activity in ${subject}.`,
      articleCount: journalPublications.length,
      editorName: '',
      latestArticles: journalPublications.slice(0, 6).map((item) => ({
        id: item._id,
        title: item.title,
        author: item.author,
        abstract: item.abstract || '',
        status: item.status,
      })),
    })
  } catch (error) {
    return next(error)
  }
}

export const getArticle = async (req, res, next) => {
  try {
    const publications = isDatabaseConnected()
      ? await Publication.find({ status: 'accepted' }).sort({ createdAt: -1 }).lean()
      : memoryStore.publications.filter((item) => item.status === 'accepted')
    const article = publications.find((item) => item._id.toString() === req.params.id)
    if (!article) return res.status(404).json({ message: 'Article not found' })

    return res.json({
      id: article._id,
      title: article.title,
      author: article.author,
      abstract: article.abstract || '',
      journal: article.category || 'General',
      status: article.status,
      publishedAt: article.updatedAt || article.createdAt,
    })
  } catch (error) {
    return next(error)
  }
}
