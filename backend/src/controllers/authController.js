import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { isDatabaseConnected } from '../config/db.js'
import { User } from '../models/User.js'
import { Submission } from '../models/Submission.js'
import { ReviewAssignment } from '../models/ReviewAssignment.js'
import { createAuditLog } from '../utils/auditLogger.js'

const serializeUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.status,
  expertise: Array.isArray(user.expertise) ? user.expertise : [],
  reviewsCompleted: Number(user.reviewsCompleted || 0),
  avgResponseTimeHours: Number(user.avgResponseTimeHours || 0),
})

const signToken = (user) =>
  jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
      email: user.email,
    },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  )

const normalizeEmail = (email = '') => email.trim().toLowerCase()
const ensureDatabaseConnection = (res) => {
  if (isDatabaseConnected()) return true
  res.status(503).json({ message: 'Database unavailable. Please try again later.' })
  return false
}

export const register = async (req, res, next) => {
  try {
    if (!ensureDatabaseConnection(res)) return

    const name = req.body.name?.trim()
    const email = normalizeEmail(req.body.email)
    const password = req.body.password?.toString()

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email and password are required' })
    }
    if (password.length < 8) {
      return res.status(400).json({ message: 'password must be at least 8 characters' })
    }

    const existing = await User.findOne({ email }).lean()
    if (existing) return res.status(409).json({ message: 'Email already registered' })

    const passwordHash = await bcrypt.hash(password, 10)
    const created = await User.create({ name, email, passwordHash, role: 'author' })
    const token = signToken(created)
    return res.status(201).json({ token, user: serializeUser(created) })
  } catch (error) {
    return next(error)
  }
}

export const login = async (req, res, next) => {
  try {
    if (!ensureDatabaseConnection(res)) return

    const email = normalizeEmail(req.body.email)
    const password = req.body.password?.toString()
    if (!email || !password) return res.status(400).json({ message: 'email and password are required' })

    const user = await User.findOne({ email })

    if (!user) return res.status(401).json({ message: 'Invalid credentials' })
    if (user.status !== 'active') return res.status(403).json({ message: 'Account is disabled' })

    const isValidPassword = await bcrypt.compare(password, user.passwordHash)
    if (!isValidPassword) return res.status(401).json({ message: 'Invalid credentials' })

    const token = signToken(user)
    return res.json({ token, user: serializeUser(user) })
  } catch (error) {
    return next(error)
  }
}

export const me = async (req, res) => {
  return res.json({ user: serializeUser(req.user) })
}

export const listUsers = async (_req, res, next) => {
  try {
    if (!ensureDatabaseConnection(res)) return
    const users = await User.find().sort({ createdAt: -1 }).lean()
    const [submissionCounts, reviewCounts] = await Promise.all([
      Submission.aggregate([{ $group: { _id: '$authorId', count: { $sum: 1 } } }]),
      ReviewAssignment.aggregate([{ $group: { _id: '$reviewerId', count: { $sum: 1 } } }]),
    ])
    const submissionMap = new Map(submissionCounts.map((x) => [x._id, x.count]))
    const reviewMap = new Map(reviewCounts.map((x) => [x._id, x.count]))
    return res.json(
      users.map((item) => ({
        ...serializeUser(item),
        submissionsCount: submissionMap.get(item._id.toString()) || 0,
        reviewsCount: reviewMap.get(item._id.toString()) || 0,
      }))
    )
  } catch (error) {
    return next(error)
  }
}

export const createUserByAdmin = async (req, res, next) => {
  try {
    if (!ensureDatabaseConnection(res)) return

    const name = req.body.name?.trim()
    const email = normalizeEmail(req.body.email)
    const password = req.body.password?.toString()
    const role = req.body.role?.toString() || 'author'
    const expertise = (Array.isArray(req.body.expertise) ? req.body.expertise : [])
      .map((item) => item?.toString().trim())
      .filter(Boolean)
      .slice(0, 20)
    const allowedRoles = ['author', 'reviewer', 'editor', 'admin']

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email and password are required' })
    }
    if (password.length < 8) {
      return res.status(400).json({ message: 'password must be at least 8 characters' })
    }
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: `role must be one of: ${allowedRoles.join(', ')}` })
    }

    const existing = await User.findOne({ email }).lean()
    if (existing) return res.status(409).json({ message: 'Email already registered' })
    const passwordHash = await bcrypt.hash(password, 10)
    const created = await User.create({
      name,
      email,
      passwordHash,
      role,
      status: 'active',
      expertise,
    })
    await createAuditLog({
      actor: req.user,
      action: 'user.create',
      targetType: 'user',
      targetId: created._id.toString(),
      targetLabel: created.email,
      metadata: { role: created.role, status: created.status },
    })
    return res.status(201).json(serializeUser(created))
  } catch (error) {
    return next(error)
  }
}

export const updateUserRoleStatus = async (req, res, next) => {
  try {
    if (!ensureDatabaseConnection(res)) return

    const role = req.body.role?.toString()
    const status = req.body.status?.toString()
    const expertise = Array.isArray(req.body.expertise)
      ? req.body.expertise.map((item) => item?.toString().trim()).filter(Boolean).slice(0, 20)
      : null
    const reviewsCompleted = Number.isFinite(Number(req.body.reviewsCompleted))
      ? Number(req.body.reviewsCompleted)
      : null
    const avgResponseTimeHours = Number.isFinite(Number(req.body.avgResponseTimeHours))
      ? Number(req.body.avgResponseTimeHours)
      : null
    const allowedRoles = ['author', 'reviewer', 'editor', 'admin']
    const allowedStatuses = ['active', 'disabled']

    if (role && !allowedRoles.includes(role)) {
      return res.status(400).json({ message: `role must be one of: ${allowedRoles.join(', ')}` })
    }
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({ message: `status must be one of: ${allowedStatuses.join(', ')}` })
    }

    const update = {}
    if (role) update.role = role
    if (status) update.status = status
    if (expertise) update.expertise = expertise
    if (reviewsCompleted !== null) update.reviewsCompleted = Math.max(0, reviewsCompleted)
    if (avgResponseTimeHours !== null) update.avgResponseTimeHours = Math.max(0, avgResponseTimeHours)
    const user = await User.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    }).lean()
    if (!user) return res.status(404).json({ message: 'User not found' })
    await createAuditLog({
      actor: req.user,
      action: 'user.update-role-status',
      targetType: 'user',
      targetId: user._id.toString(),
      targetLabel: user.email,
      metadata: { role: user.role, status: user.status },
    })
    return res.json(serializeUser(user))
  } catch (error) {
    return next(error)
  }
}

export const deleteUserByAdmin = async (req, res, next) => {
  try {
    if (!ensureDatabaseConnection(res)) return
    const targetId = req.params.id?.toString()
    if (!targetId) return res.status(400).json({ message: 'User id is required' })
    if (req.user._id.toString() === targetId) {
      return res.status(409).json({ message: 'You cannot delete your own admin account' })
    }

    const user = await User.findById(targetId)
    if (!user) return res.status(404).json({ message: 'User not found' })

    await User.deleteOne({ _id: user._id })
    await createAuditLog({
      actor: req.user,
      action: 'user.delete',
      targetType: 'user',
      targetId: user._id.toString(),
      targetLabel: user.email,
      metadata: { role: user.role },
    })
    return res.json({ ok: true, deleted: true })
  } catch (error) {
    return next(error)
  }
}
