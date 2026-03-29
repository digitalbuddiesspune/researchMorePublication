import crypto from 'crypto'
import { News } from '../models/News.js'
import { isDatabaseConnected } from '../config/db.js'
import { memoryStore } from '../data/memoryStore.js'

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

export const listNews = async (req, res, next) => {
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
}

export const createNews = async (req, res, next) => {
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
}

export const updateNews = async (req, res, next) => {
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
}

export const deleteNews = async (req, res, next) => {
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
}
