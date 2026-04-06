import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { fetchEditorSubmissions, fetchReviewerAssignments } from '../services/workflowService.js'
import { u } from '../lib/ui.js'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const [editorStats, setEditorStats] = useState({ total: 0, pendingReviews: 0 })
  const [reviewerStats, setReviewerStats] = useState({ assigned: 0, completed: 0 })
  const [loading, setLoading] = useState(false)

  const refresh = async () => {
    setError('')
    setNotice('')
    setLoading(true)
    try {
      if (user.role === 'editor') {
        const subs = await fetchEditorSubmissions()
        const pendingReviews = subs.filter((s) => s.status === 'under-review').length
        setEditorStats({ total: subs.length, pendingReviews })
      } else {
        const assignments = await fetchReviewerAssignments()
        const completed = assignments.filter((a) => a.status === 'submitted').length
        setReviewerStats({ assigned: assignments.length, completed })
      }
      setNotice('Dashboard refreshed.')
    } catch (e) {
      setError(e?.message || 'Could not load dashboard.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!user) return
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.role])

  const roleTitle = useMemo(() => {
    if (!user) return ''
    return user.role === 'editor' ? 'Editor Dashboard' : 'Reviewer Dashboard'
  }, [user])

  return (
    <div className="space-y-4">
      <header className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="m-0 text-2xl font-semibold tracking-tight text-slate-900">{roleTitle}</h1>
          <p className="mt-1.5 text-sm text-slate-500">Role: {user.role}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={u.btnGhost}
            onClick={() => refresh().catch(() => {})}
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </header>

      {error ? <p className={`${u.alertErr} mb-3`}>{error}</p> : null}
      {notice ? <p className={`${u.alertInfo} mb-3`}>{notice}</p> : null}

      {user.role === 'editor' ? (
        <section className={u.card}>
          <h2 className="m-0 text-lg font-semibold text-slate-900">Submission intake queue</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-500">Total submissions</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{editorStats.total}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-500">Pending reviews</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{editorStats.pendingReviews}</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              className={u.btnPrimary}
              onClick={() => navigate('/staff/submissions')}
            >
              Open submissions
            </button>
          </div>
        </section>
      ) : (
        <section className={u.card}>
          <h2 className="m-0 text-lg font-semibold text-slate-900">Assigned reviews</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-500">Assigned</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{reviewerStats.assigned}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-500">Completed</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{reviewerStats.completed}</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              className={u.btnPrimary}
              onClick={() => navigate('/staff/assignments')}
            >
              Open assignments
            </button>
          </div>
        </section>
      )}
    </div>
  )
}

