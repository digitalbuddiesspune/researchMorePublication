/**
 * One-time: create Publication rows for submissions already marked accepted.
 * Usage (from backend folder): node scripts/backfillAcceptedPublications.mjs
 */
import mongoose from 'mongoose'
import { env } from '../src/config/env.js'
import { backfillPublicationsFromAcceptedSubmissions } from '../src/utils/publicationSync.js'

async function main() {
  if (!env.MONGO_URI) {
    console.error('MONGO_URI is required.')
    process.exit(1)
  }
  await mongoose.connect(env.MONGO_URI)
  const result = await backfillPublicationsFromAcceptedSubmissions()
  console.log('Backfill done:', result)
  await mongoose.disconnect()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
