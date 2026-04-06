import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { isDatabaseConnected } from '../config/db.js'
import { User } from '../models/User.js'

const getBearerToken = (authorizationHeader = '') => {
  const [scheme, token] = authorizationHeader.split(' ')
  if (scheme !== 'Bearer' || !token) return ''
  return token
}

export const authRequired = async (req, res, next) => {
  try {
    if (!isDatabaseConnected()) {
      return res.status(503).json({ message: 'Database unavailable. Please try again later.' })
    }

    const token = getBearerToken(req.headers.authorization || '')
    if (!token) return res.status(401).json({ message: 'Authentication required' })

    const payload = jwt.verify(token, env.JWT_SECRET)
    const userId = payload.sub
    if (!userId) return res.status(401).json({ message: 'Invalid token payload' })

    const user = await User.findById(userId).lean()

    if (!user) return res.status(401).json({ message: 'User not found for token' })
    if (user.status !== 'active') return res.status(403).json({ message: 'Account is disabled' })

    req.user = user
    return next()
  } catch (_error) {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}
