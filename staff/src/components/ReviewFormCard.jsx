import { useEffect, useState } from 'react'
import StatusBadge from './StatusBadge.jsx'
import { u } from '../lib/ui.js'

export default function ReviewFormCard({ assignment, onSubmit, submitting }) {
  const [recommendation, setRecommendation] = useState('')
  const [comments, setComments] = useState('')

  useEffect(() => {
    setRecommendation(assignment?.recommendation || '')
    setComments(assignment?.comments || '')
  }, [assignment])

  const alreadySubmitted = assignment?.status === 'submitted'

  const handle = () => {
    if (alreadySubmitted) return
    onSubmit(assignment.id, recommendation, comments)
  }

  return (
    <article className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <h3 className="m-0 text-base font-semibold text-slate-900">{assignment.submissionTitle}</h3>
      <div className="mt-2">
        <StatusBadge status={assignment.status} />
      </div>

      <div className="mt-3 grid gap-3 border-t border-slate-200 pt-3">
        <div className="grid gap-1.5">
          <label className={u.label}>Recommendation</label>
          <select
            className={u.select}
            value={recommendation || ''}
            onChange={(event) => setRecommendation(event.target.value)}
            disabled={alreadySubmitted}
          >
            <option value="">Select recommendation</option>
            <option value="accept">accept</option>
            <option value="minor-revision">minor-revision</option>
            <option value="major-revision">major-revision</option>
            <option value="reject">reject</option>
          </select>
        </div>

        <div className="grid gap-1.5">
          <label className={u.label}>Comments</label>
          <textarea
            className={`${u.input} min-h-[72px] resize-y`}
            value={comments}
            onChange={(event) => setComments(event.target.value)}
            placeholder="Review comments"
            rows={3}
            disabled={alreadySubmitted}
          />
        </div>

        <button
          className={`${u.btnPrimary} w-fit`}
          type="button"
          onClick={handle}
          disabled={alreadySubmitted || submitting}
        >
          {submitting ? 'Submitting...' : alreadySubmitted ? 'Submitted' : 'Submit review'}
        </button>
      </div>
    </article>
  )
}

