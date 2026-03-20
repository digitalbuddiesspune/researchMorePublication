import express from 'express'
import cors from 'cors'
import crypto from 'crypto'
import mongoose from 'mongoose'
import { env } from './config/env.js'
import { isDatabaseConnected } from './config/db.js'
import { Publication } from './models/Publication.js'
import { Subscriber } from './models/Subscriber.js'
import { News } from './models/News.js'
import { memoryStore } from './data/memoryStore.js'

const validStatuses = ['draft', 'in-review', 'accepted', 'rejected']

const normalizePublicationPayload = (payload = {}) => ({
  title: payload.title?.trim(),
  author: payload.author?.trim(),
  status: payload.status?.trim() || 'draft',
  category: payload.category?.trim() || 'General',
  abstract: payload.abstract?.trim() || '',
})

const validatePublicationPayload = (payload) => {
  if (!payload.title || !payload.author) {
    return 'title and author are required'
  }
  if (!validStatuses.includes(payload.status)) {
    return `status must be one of: ${validStatuses.join(', ')}`
  }
  return ''
}

const normalizeSubscriberPayload = (payload = {}) => ({
  email: payload.email?.trim().toLowerCase(),
  firstName: payload.firstName?.trim() || '',
  lastName: payload.lastName?.trim() || '',
})

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '')
const validPlacements = ['spotlight', 'side', 'feature']

const normalizeNewsPayload = (payload = {}) => ({
  title: payload.title?.trim(),
  summary: payload.summary?.trim() || '',
  imageUrl: payload.imageUrl?.trim() || '',
  fallbackImage: payload.fallbackImage?.trim() || '',
  label: payload.label?.trim() || 'News',
  placement: payload.placement?.trim() || 'feature',
  isPublished: payload.isPublished ?? true,
})

const validateNewsPayload = (payload) => {
  if (!payload.title) return 'title is required'
  if (!validPlacements.includes(payload.placement)) {
    return `placement must be one of: ${validPlacements.join(', ')}`
  }
  return ''
}

export const createApp = () => {
  const app = express()

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow non-browser tools (like curl/postman) and configured web origins.
        if (!origin || env.CORS_ORIGIN.includes(origin)) {
          return callback(null, true)
        }
        return callback(new Error(`CORS blocked for origin: ${origin}`))
      },
      credentials: true,
    })
  )
  app.use(express.json())

  app.get('/', (_req, res) => {
    res.json({
      message: 'researchMorePublication backend is running',
      version: '1.0.0',
    })
  })

  app.get('/api/health', (_req, res) => {
    res.json({
      ok: true,
      environment: env.NODE_ENV,
      database: isDatabaseConnected() ? 'connected' : 'in-memory',
      timestamp: new Date().toISOString(),
    })
  })

  app.get('/api/publications', async (_req, res, next) => {
    try {
      if (isDatabaseConnected()) {
        const publications = await Publication.find().sort({ createdAt: -1 }).lean()
        return res.json(publications)
      }
      return res.json(memoryStore.publications)
    } catch (error) {
      return next(error)
    }
  })

  app.get('/api/news', async (req, res, next) => {
    try {
      const onlyPublished = req.query.published === 'true'
      if (isDatabaseConnected()) {
        const query = onlyPublished ? { isPublished: true } : {}
        const news = await News.find(query).sort({ createdAt: -1 }).lean()
        return res.json(news)
      }
      const news = onlyPublished
        ? memoryStore.news.filter((item) => item.isPublished)
        : memoryStore.news
      return res.json(news)
    } catch (error) {
      return next(error)
    }
  })

  app.post('/api/news', async (req, res, next) => {
    try {
      const payload = normalizeNewsPayload(req.body)
      const validationError = validateNewsPayload(payload)
      if (validationError) return res.status(400).json({ message: validationError })

      if (isDatabaseConnected()) {
        const created = await News.create(payload)
        return res.status(201).json(created)
      }

      const now = new Date().toISOString()
      const record = {
        _id: crypto.randomUUID(),
        ...payload,
        createdAt: now,
        updatedAt: now,
      }
      memoryStore.news.unshift(record)
      return res.status(201).json(record)
    } catch (error) {
      return next(error)
    }
  })

  app.patch('/api/news/:id', async (req, res, next) => {
    try {
      const payload = normalizeNewsPayload(req.body)
      const validationError = validateNewsPayload(payload)
      if (validationError) return res.status(400).json({ message: validationError })

      if (isDatabaseConnected()) {
        const updated = await News.findByIdAndUpdate(req.params.id, payload, {
          new: true,
          runValidators: true,
        }).lean()
        if (!updated) return res.status(404).json({ message: 'News not found' })
        return res.json(updated)
      }

      const index = memoryStore.news.findIndex((item) => item._id === req.params.id)
      if (index === -1) return res.status(404).json({ message: 'News not found' })
      const updated = {
        ...memoryStore.news[index],
        ...payload,
        updatedAt: new Date().toISOString(),
      }
      memoryStore.news[index] = updated
      return res.json(updated)
    } catch (error) {
      return next(error)
    }
  })

  app.delete('/api/news/:id', async (req, res, next) => {
    try {
      if (isDatabaseConnected()) {
        const deleted = await News.findByIdAndDelete(req.params.id).lean()
        if (!deleted) return res.status(404).json({ message: 'News not found' })
        return res.status(204).send()
      }

      const before = memoryStore.news.length
      memoryStore.news = memoryStore.news.filter((item) => item._id !== req.params.id)
      if (memoryStore.news.length === before) {
        return res.status(404).json({ message: 'News not found' })
      }
      return res.status(204).send()
    } catch (error) {
      return next(error)
    }
  })

  app.get('/api/publications/:id', async (req, res, next) => {
    try {
      const { id } = req.params
      if (isDatabaseConnected()) {
        const publication = await Publication.findById(id).lean()
        if (!publication) return res.status(404).json({ message: 'Publication not found' })
        return res.json(publication)
      }
      const publication = memoryStore.publications.find((item) => item._id === id)
      if (!publication) return res.status(404).json({ message: 'Publication not found' })
      return res.json(publication)
    } catch (error) {
      return next(error)
    }
  })

  app.post('/api/publications', async (req, res, next) => {
    try {
      const payload = normalizePublicationPayload(req.body)
      const validationError = validatePublicationPayload(payload)
      if (validationError) return res.status(400).json({ message: validationError })

      if (isDatabaseConnected()) {
        const created = await Publication.create(payload)
        return res.status(201).json(created)
      }

      const now = new Date().toISOString()
      const record = {
        _id: crypto.randomUUID(),
        ...payload,
        createdAt: now,
        updatedAt: now,
      }
      memoryStore.publications.unshift(record)
      return res.status(201).json(record)
    } catch (error) {
      return next(error)
    }
  })

  app.patch('/api/publications/:id', async (req, res, next) => {
    try {
      const payload = normalizePublicationPayload(req.body)
      const validationError = validatePublicationPayload(payload)
      if (validationError) return res.status(400).json({ message: validationError })

      if (isDatabaseConnected()) {
        const updated = await Publication.findByIdAndUpdate(req.params.id, payload, {
          new: true,
          runValidators: true,
        }).lean()
        if (!updated) return res.status(404).json({ message: 'Publication not found' })
        return res.json(updated)
      }

      const index = memoryStore.publications.findIndex((item) => item._id === req.params.id)
      if (index === -1) return res.status(404).json({ message: 'Publication not found' })
      const updated = {
        ...memoryStore.publications[index],
        ...payload,
        updatedAt: new Date().toISOString(),
      }
      memoryStore.publications[index] = updated
      return res.json(updated)
    } catch (error) {
      return next(error)
    }
  })

  app.delete('/api/publications/:id', async (req, res, next) => {
    try {
      if (isDatabaseConnected()) {
        const deleted = await Publication.findByIdAndDelete(req.params.id).lean()
        if (!deleted) return res.status(404).json({ message: 'Publication not found' })
        return res.status(204).send()
      }
      const before = memoryStore.publications.length
      memoryStore.publications = memoryStore.publications.filter(
        (item) => item._id !== req.params.id
      )
      if (memoryStore.publications.length === before) {
        return res.status(404).json({ message: 'Publication not found' })
      }
      return res.status(204).send()
    } catch (error) {
      return next(error)
    }
  })

  app.post('/api/newsletter/subscribe', async (req, res, next) => {
    try {
      const payload = normalizeSubscriberPayload(req.body)
      if (!isValidEmail(payload.email)) {
        return res.status(400).json({ message: 'Valid email is required' })
      }

      if (isDatabaseConnected()) {
        const exists = await Subscriber.findOne({ email: payload.email }).lean()
        if (exists) return res.status(409).json({ message: 'Email already subscribed' })
        const created = await Subscriber.create(payload)
        return res.status(201).json({
          message: 'Subscription successful',
          subscriber: created,
        })
      }

      const exists = memoryStore.subscribers.some((item) => item.email === payload.email)
      if (exists) return res.status(409).json({ message: 'Email already subscribed' })
      const record = { _id: crypto.randomUUID(), ...payload, createdAt: new Date().toISOString() }
      memoryStore.subscribers.push(record)
      return res.status(201).json({
        message: 'Subscription successful',
        subscriber: record,
      })
    } catch (error) {
      return next(error)
    }
  })

  app.get('/api/stats', async (_req, res, next) => {
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
  })

  app.use((req, res) => {
    res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` })
  })

  app.use((error, _req, res, _next) => {
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({ message: 'Invalid resource id format' })
    }
    console.error(error)
    return res.status(500).json({ message: 'Internal server error' })
  })

  return app
}
