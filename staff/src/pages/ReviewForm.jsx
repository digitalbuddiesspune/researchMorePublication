import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  fetchReviewerAssignmentById,
  submitReviewerDecision,
} from '../services/workflowService.js'
import { u } from '../lib/ui.js'
import ReviewFormCard from '../components/ReviewFormCard.jsx'

export default function ReviewForm() {
  const { id } = useParams()

  const [assignment, setAssignment] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setError('')
    setNotice('')
    const found = await fetchReviewerAssignmentById(id)
    setAssignment(found || null)
  }

  useEffect(() => {
    let isMounted = true
    const run = async () => {
      try {
        setLoading(true)
        await load()
      } catch (e) {
        if (!isMounted) return
        setError(e?.message || 'Could not load assignment.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    run()
    return () => {
      isMounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const handleSubmit = async (assignmentId, recommendation, comments) => {
    setError('')
    setNotice('')
    if (!recommendation) {
      setError('Please select a recommendation before submitting.')
      return
    }
    setBusy(true)
    try {
      await submitReviewerDecision(assignmentId, recommendation, comments)
      await load()
      setNotice('Review submitted successfully.')
    } catch (e) {
      setError(e?.message || 'Could not submit review.')
    } finally {
      setBusy(false)
    }
  }

  if (loading) return <div className="space-y-4">Loading...</div>
  if (error) return <div className="space-y-4">Error: {error}</div>
  if (!assignment)
    return (
      <div className="space-y-4">
        <div className={u.card}>
          <p className="text-sm text-slate-600">Assignment not found.</p>
          <div className="mt-3">
            <Link to="/staff/assignments" className="text-blue-700 hover:text-blue-800">
              ← Back
            </Link>
          </div>
        </div>
      </div>
    )

  return (
    <div className="space-y-4">
      <header className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="m-0 text-2xl font-semibold tracking-tight text-slate-900">Review submission</h1>
          <p className="mt-1.5 text-sm text-slate-500">{assignment.submissionTitle}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/staff/assignments" className={u.btnGhost}>
            ← Assignments
          </Link>
        </div>
      </header>

      {error ? <p className={`${u.alertErr} mb-3`}>{error}</p> : null}
      {notice ? <p className={`${u.alertInfo} mb-3`}>{notice}</p> : null}

      <section className={u.card}>
        <ReviewFormCard assignment={assignment} onSubmit={handleSubmit} submitting={busy} />
      </section>
    </div>
  )
}

