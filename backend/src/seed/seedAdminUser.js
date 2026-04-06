import bcrypt from 'bcryptjs'
import { env } from '../config/env.js'
import { User } from '../models/User.js'

const normalizeEmail = (email = '') => email.trim().toLowerCase()

export const seedAdminUser = async () => {
  const email = normalizeEmail(env.ADMIN_SEED_EMAIL)
  const password = env.ADMIN_SEED_PASSWORD?.toString() || ''
  const name = env.ADMIN_SEED_NAME?.trim() || 'Admin User'

  if (!email || !password) {
    console.warn(
      'Admin seed skipped. Set ADMIN_SEED_EMAIL and ADMIN_SEED_PASSWORD to create admin user.'
    )
    return
  }

  if (password.length < 8) {
    console.warn('Admin seed skipped. ADMIN_SEED_PASSWORD must be at least 8 characters.')
    return
  }

  const existingAdmin = await User.findOne({ email }).lean()
  if (existingAdmin) return

  const passwordHash = await bcrypt.hash(password, 10)
  await User.create({
    name,
    email,
    passwordHash,
    role: 'admin',
    status: 'active',
  })
  console.log(`Admin user seeded for ${email}`)
}
