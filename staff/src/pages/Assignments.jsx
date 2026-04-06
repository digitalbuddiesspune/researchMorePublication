import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchReviewerAssignments, submitReviewerDecision } from '../services/workflowService.js'
import { u } from '../lib/ui.js'
import ReviewFormCard from '../components/ReviewFormCard.jsx'

export default function Assignments() {
  const [assignments, setAssignments] = useState([])
  const [busyId, setBusyId] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const load = async () => {
    setError('')
    const data = await fetchReviewerAssignments()
    setAssignments(data)
  }

  useEffect(() => {
    load().catch((e) => setError(e?.message || 'Could not load assignments.'))
  }, [])

  const handleSubmit = async (assignmentId, recommendation, comments) => {
    setError('')
    setNotice('')
    if (!recommendation) {
      setError('Please select a recommendation before submitting.')
      return
    }
    setBusyId(assignmentId)
    try {
      await submitReviewerDecision(assignmentId, recommendation, comments)
      await load()
      setNotice('Review submitted successfully.')
    } catch (e) {
      setError(e?.message || 'Could not submit review.')
    } finally {
      setBusyId('')
    }
  }

  return (
    <div className="space-y-4">
      <header className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="m-0 text-2xl font-semibold tracking-tight text-slate-900">Assigned reviews</h1>
          <p className="mt-1.5 text-sm text-slate-500">Submit recommendations and comments.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className={u.btnGhost} type="button" onClick={() => load().catch(() => {})}>
            Refresh
          </button>
        </div>
      </header>

      {error ? <p className={`${u.alertErr} mb-3`}>{error}</p> : null}
      {notice ? <p className={`${u.alertInfo} mb-3`}>{notice}</p> : null}

      <section className={u.card}>
        {assignments.length === 0 ? <p className="mt-2 text-sm text-slate-500">No assignments yet.</p> : null}
        <div className="mt-4 grid gap-3">
          {assignments.map((a) => (
            <div key={a.id} className="grid gap-3">
              <div className="text-xs text-slate-600">
                Deadline: {a.deadline ? new Date(a.deadline).toLocaleDateString() : '-'} | Status: {a.status}
              </div>
              <ReviewFormCard
                assignment={a}
                onSubmit={handleSubmit}
                submitting={busyId === a.id}
              />

              <div className="-mt-1 flex items-center justify-end">
                <Link
                  to={`/staff/submissions/${a.submissionId}`}
                  className="text-sm font-semibold text-blue-700 hover:text-blue-800"
                >
                  View submission →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

