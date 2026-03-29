import crypto from 'crypto'
import { Publication } from '../models/Publication.js'
import { isDatabaseConnected } from '../config/db.js'
import { memoryStore } from '../data/memoryStore.js'

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

export const listPublications = async (_req, res, next) => {
  try {
    if (isDatabaseConnected()) {
      const publications = await Publication.find().sort({ createdAt: -1 }).lean()
      return res.json(publications)
    }
    return res.json(memoryStore.publications)
  } catch (error) {
    return next(error)
  }
}

export const getPublication = async (req, res, next) => {
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
}

export const createPublication = async (req, res, next) => {
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
}

export const updatePublication = async (req, res, next) => {
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
}

export const deletePublication = async (req, res, next) => {
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
}
