import crypto from 'crypto'
import { Subscriber } from '../models/Subscriber.js'
import { isDatabaseConnected } from '../config/db.js'
import { memoryStore } from '../data/memoryStore.js'

const normalizeSubscriberPayload = (payload = {}) => ({
  email: payload.email?.trim().toLowerCase(),
  firstName: payload.firstName?.trim() || '',
  lastName: payload.lastName?.trim() || '',
})

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '')

export const subscribeNewsletter = async (req, res, next) => {
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
}
