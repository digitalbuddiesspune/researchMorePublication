/**
 * Seed one admin and one staff account.
 * Usage example:
 * ADMIN_SEED_EMAIL=admin@example.com ADMIN_SEED_PASSWORD=Password123 \
 * STAFF_SEED_EMAIL=staff@example.com STAFF_SEED_PASSWORD=Password123 \
 * STAFF_SEED_ROLE=editor node scripts/seedUsers.mjs
 */
import mongoose from 'mongoose'
import { env } from '../src/config/env.js'
import { seedAdminUser, seedStaffUser } from '../src/seed/seedAdminUser.js'

async function main() {
  if (!env.MONGO_URI) {
    console.error('MONGO_URI is required.')
    process.exit(1)
  }

  await mongoose.connect(env.MONGO_URI)
  await seedAdminUser()
  await seedStaffUser()
  await mongoose.disconnect()
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
