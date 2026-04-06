/**
 * One-time script to backfill new submission fields.
 * Usage: node scripts/backfillSubmissionDefaults.mjs
 */
import mongoose from 'mongoose'
import { env } from '../src/config/env.js'
import { Submission } from '../src/models/Submission.js'

async function main() {
  if (!env.MONGO_URI) {
    console.error('MONGO_URI is required.')
    process.exit(1)
  }

  await mongoose.connect(env.MONGO_URI)

  const items = await Submission.find().lean()
  let updated = 0

  for (const item of items) {
    const patch = {}
    if (!Array.isArray(item.keywords)) patch.keywords = []
    if (!Array.isArray(item.authors) || !item.authors.length) {
      patch.authors = [{ name: item.authorName || 'Author', corresponding: true }]
    }
    if (!Array.isArray(item.files)) patch.files = []
    if (!Number.isFinite(item.currentVersion)) patch.currentVersion = 1
    if (!Array.isArray(item.history)) patch.history = []
    if (!Array.isArray(item.messages)) patch.messages = []

    if (Object.keys(patch).length) {
      await Submission.updateOne({ _id: item._id }, { $set: patch })
      updated += 1
    }
  }

  console.log('Backfill complete:', { total: items.length, updated })
  await mongoose.disconnect()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

