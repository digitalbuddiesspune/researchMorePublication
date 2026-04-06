import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  assignReviewerToSubmission,
  fetchEditorReviewers,
  fetchEditorSubmissions,
} from '../services/workflowService.js'
import { u } from '../lib/ui.js'
import SubmissionCard from '../components/SubmissionCard.jsx'

export default function Submissions() {
  const [submissions, setSubmissions] = useState([])
  const [reviewers, setReviewers] = useState([])

  const [reviewerEmailById, setReviewerEmailById] = useState({})

  const [busyId, setBusyId] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const loadAll = async () => {
    const [subs, revs] = await Promise.all([fetchEditorSubmissions(), fetchEditorReviewers()])
    setSubmissions(subs)
    setReviewers(
      [...revs].sort(
        (a, b) => (a.activeAssignments || 0) - (b.activeAssignments || 0) || a.name.localeCompare(b.name),
      ),
    )
  }

  useEffect(() => {
    loadAll().catch((e) => setError(e?.message || 'Could not load submissions.'))
  }, [])

  const assignReviewer = async (submissionId) => {
    setError('')
    setNotice('')
    const reviewerEmail = reviewerEmailById[submissionId] || ''
    if (!reviewerEmail) {
      setError('Please select a reviewer first.')
      return
    }
    setBusyId(submissionId)
    try {
      await assignReviewerToSubmission(submissionId, reviewerEmail)
      await loadAll()
      setNotice('Reviewer assigned successfully.')
    } catch (e) {
      setError(e?.message || 'Could not assign reviewer.')
    } finally {
      setBusyId('')
    }
  }

  const headerTitle = useMemo(() => 'Submission intake queue', [])

  return (
    <div className="space-y-4">
      <header className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="m-0 text-2xl font-semibold tracking-tight text-slate-900">{headerTitle}</h1>
          <p className="mt-1.5 text-sm text-slate-500">Assign reviewers and record decisions.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className={u.btnGhost} type="button" onClick={() => loadAll().catch(() => {})}>
            Refresh
          </button>
        </div>
      </header>

      {error ? <p className={`${u.alertErr} mb-3`}>{error}</p> : null}
      {notice ? <p className={`${u.alertInfo} mb-3`}>{notice}</p> : null}

      <section className={u.card}>
        {submissions.length === 0 ? <p className="mt-2 text-sm text-slate-500">No submissions yet.</p> : null}
        <div className="mt-4 grid gap-3">
          {submissions.map((item) => (
            <SubmissionCard
              key={item.id}
              title={item.title}
              status={item.status}
              meta={[
                `Author: ${item.authorName || '-'}`,
                `Journal: ${(item.journal || 'General').toString()}`,
              ]}
            >
              <div className="mt-3 grid gap-3 border-t border-slate-200 pt-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="grid flex-1 gap-1.5">
                    <label className={u.label}>Assign reviewer</label>
                    <select
                      className={u.select}
                      value={reviewerEmailById[item.id] || ''}
                      onChange={(event) =>
                        setReviewerEmailById((prev) => ({ ...prev, [item.id]: event.target.value }))
                      }
                      disabled={busyId === item.id}
                    >
                      <option value="">Select reviewer</option>
                      {reviewers.map((reviewer) => (
                        <option key={reviewer.id} value={reviewer.email}>
                          {reviewer.name} ({reviewer.email}) | load {reviewer.activeAssignments || 0}
                        </option>
                      ))}
                    </select>
                      <p className="text-xs text-slate-500">
                        {reviewers.find((r) => r.email === (reviewerEmailById[item.id] || ''))?.expertise?.join(', ') || 'No expertise tags'}
                      </p>
                  </div>

                  <button
                    className={`${u.btnPrimary} w-fit`}
                    type="button"
                    onClick={() => assignReviewer(item.id)}
                    disabled={busyId === item.id}
                  >
                    Assign reviewer
                  </button>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <Link
                    to={`/staff/submissions/${item.id}`}
                    className="text-sm font-semibold text-blue-700 hover:text-blue-800"
                  >
                    View submission →
                  </Link>
                  <Link to={`/staff/decision/${item.id}`} className="text-sm font-semibold text-blue-700 hover:text-blue-800">
                    Open decision panel →
                  </Link>
                </div>
              </div>
            </SubmissionCard>
          ))}
        </div>
      </section>
    </div>
  )
}

