import bcrypt from 'bcryptjs'
import { env } from '../config/env.js'
import { User } from '../models/User.js'

const normalizeEmail = (email = '') => email.trim().toLowerCase()
const allowedStaffRoles = ['reviewer', 'editor']

const seedUser = async ({ email, password, name, role, label }) => {
  if (!email || !password) {
    console.warn(`${label} seed skipped. Missing email or password.`)
    return
  }

  if (password.length < 8) {
    console.warn(`${label} seed skipped. Password must be at least 8 characters.`)
    return
  }

  const existingAdmin = await User.findOne({ email }).lean()
  if (existingAdmin) return

  const passwordHash = await bcrypt.hash(password, 10)
  await User.create({
    name,
    email,
    passwordHash,
    role,
    status: 'active',
  })
  console.log(`${label} user seeded for ${email}`)
}

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

  await seedUser({ email, password, name, role: 'admin', label: 'Admin' })
}

export const seedStaffUser = async () => {
  const email = normalizeEmail(env.STAFF_SEED_EMAIL)
  const password = env.STAFF_SEED_PASSWORD?.toString() || ''
  const name = env.STAFF_SEED_NAME?.trim() || 'Staff User'
  const role = env.STAFF_SEED_ROLE?.toString().trim().toLowerCase() || 'editor'

  if (!email || !password) {
    console.warn(
      'Staff seed skipped. Set STAFF_SEED_EMAIL and STAFF_SEED_PASSWORD to create staff user.'
    )
    return
  }

  if (!allowedStaffRoles.includes(role)) {
    console.warn(`Staff seed skipped. STAFF_SEED_ROLE must be one of: ${allowedStaffRoles.join(', ')}`)
    return
  }

  await seedUser({ email, password, name, role, label: 'Staff' })
}
