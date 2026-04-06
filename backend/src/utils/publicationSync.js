import { Publication } from '../models/Publication.js'
import { Submission } from '../models/Submission.js'

/** Keep catalog rows in sync with submission workflow (accepted → article; otherwise remove). */
export const syncPublicationFromSubmission = async (submission) => {
  const sid = submission._id.toString()
  if (submission.status === 'accepted') {
    const payload = {
      title: submission.title,
      author: submission.authorName,
      abstract: submission.abstract || '',
      category: submission.journal || 'General',
      status: 'accepted',
      submissionId: sid,
    }
    const existing = await Publication.findOne({ submissionId: sid })
    if (existing) {
      await Publication.updateOne({ _id: existing._id }, { $set: payload })
    } else {
      await Publication.create(payload)
    }
    return
  }
  await Publication.deleteMany({ submissionId: sid })
}

/** Run after deploy if you already have accepted submissions without catalog rows. */
export const backfillPublicationsFromAcceptedSubmissions = async () => {
  const accepted = await Submission.find({ status: 'accepted' }).lean()
  for (const doc of accepted) {
    await syncPublicationFromSubmission(doc)
  }
  return { synced: accepted.length }
}
