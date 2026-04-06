import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { applySubmissionDecision, fetchEditorSubmissionById } from '../services/workflowService.js'
import { u } from '../lib/ui.js'
import ReviewComments from '../components/ReviewComments.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import SubmissionMessagesPanel from '../components/SubmissionMessagesPanel.jsx'

export default function DecisionPanel() {
  const { id } = useParams()

  const [submission, setSubmission] = useState(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const [decision, setDecision] = useState('')
  const [note, setNote] = useState('')

  const load = async () => {
    setError('')
    setNotice('')
    const found = await fetchEditorSubmissionById(id)
    setSubmission(found)
    setDecision(found?.decision?.value || '')
    setNote(found?.decision?.note || '')
  }

  useEffect(() => {
    let isMounted = true
    const run = async () => {
      try {
        setLoading(true)
        if (!isMounted) return
        await load()
      } catch (e) {
        if (!isMounted) return
        setError(e?.message || 'Could not load submission.')
      } finally {
        if (!isMounted) return
        setLoading(false)
      }
    }
    run()
    return () => {
      isMounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const backHref = useMemo(() => '/staff/submissions', [])

  const apply = async () => {
    setError('')
    setNotice('')
    if (!decision) {
      setError('Please select a decision first.')
      return
    }
    setBusy(true)
    try {
      await applySubmissionDecision(id, decision, note)
      await load()
      setNotice('Decision applied successfully.')
    } catch (e) {
      setError(e?.message || 'Could not apply decision.')
    } finally {
      setBusy(false)
    }
  }

  if (loading) return <div className="space-y-4">Loading...</div>

  if (!submission) {
    return (
      <div className="space-y-4">
        <div className={u.card}>
          <p className="text-sm text-slate-600">Submission not found.</p>
          <div className="mt-3">
            <Link to={backHref} className="text-blue-700 hover:text-blue-800">
              ← Back
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <header className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="m-0 text-2xl font-semibold tracking-tight text-slate-900">
            Decision panel
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">{submission.title}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-sm text-slate-600">Author: {submission.authorName || '-'}</span>
            <StatusBadge status={submission.status} />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to={backHref} className={u.btnGhost}>
            ← Submissions
          </Link>
        </div>
      </header>

      {error ? <p className={`${u.alertErr} mb-3`}>{error}</p> : null}
      {notice ? <p className={`${u.alertInfo} mb-3`}>{notice}</p> : null}

      <section className={u.card}>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <h2 className="text-lg font-semibold text-slate-900">Existing reviews</h2>
            <ReviewComments reviews={submission.reviews || []} />
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <h2 className="text-lg font-semibold text-slate-900">Make a decision</h2>

            <div className="mt-4 grid gap-4">
              <div className="grid gap-1.5">
                <label className={u.label}>Decision</label>
                <select className={u.select} value={decision} onChange={(e) => setDecision(e.target.value)}>
                  <option value="">Select decision</option>
                  <option value="accept">accept</option>
                  <option value="revise">revise</option>
                  <option value="reject">reject</option>
                </select>
              </div>

              <div className="grid gap-1.5">
                <label className={u.label}>Decision note</label>
                <textarea
                  className={`${u.input} min-h-[92px] resize-y`}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Optional note"
                  rows={4}
                />
              </div>

              <button className={u.btnPrimary} type="button" onClick={apply} disabled={busy}>
                {busy ? 'Applying...' : 'Apply decision'}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <SubmissionMessagesPanel submissionId={submission.id} currentRole="editor" />
        </div>
      </section>
    </div>
  )
}

