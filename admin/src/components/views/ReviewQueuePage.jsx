import { useEffect, useMemo, useState } from 'react'
import { fetchEditorSubmissions } from '../../services/workflowService'
import { submissionStatusBadge, tw } from '../../lib/adminUi'

export default function ReviewQueuePage({ active, setNotice }) {
  const [submissions, setSubmissions] = useState([])
  const [statusFilter, setStatusFilter] = useState('')

  const loadAll = async () => {
    const subs = await fetchEditorSubmissions()
    setSubmissions(subs)
  }

  useEffect(() => {
    loadAll().catch(() => setNotice('Could not load review monitoring queue.', 'error'))
  }, [])

  useEffect(() => {
    if (!active) return
    loadAll().catch((e) => setNotice(e.message, 'error'))
  }, [active])

  const filtered = useMemo(
    () => submissions.filter((item) => (statusFilter ? item.status === statusFilter : true)),
    [submissions, statusFilter]
  )

  return (
    <section className={tw.view(active)} data-view="review-queue">
      <section className={tw.card}>
        <div className={`${tw.toolbar} mb-5`}>
          <div>
            <h3 className={tw.cardTitleInline}>
              Review monitoring{' '}
              <span className="font-normal text-slate-400">·</span>{' '}
              <span className="text-blue-600">{filtered.length}</span>
            </h3>
            <p className={tw.cardDesc}>Admin read-only view. Editorial actions are handled in staff panel.</p>
          </div>
          <select
            className={`${tw.select} w-full sm:max-w-[220px]`}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All statuses</option>
            <option value="submitted">submitted</option>
            <option value="under-review">under-review</option>
            <option value="revision-requested">revision-requested</option>
            <option value="accepted">accepted</option>
            <option value="rejected">rejected</option>
          </select>
        </div>
        <div className={tw.tableWrap}>
          <table className={`${tw.table} min-w-[900px]`}>
            <thead>
              <tr>
                <th className={tw.th}>Submission</th>
                <th className={tw.th}>Author</th>
                <th className={tw.th}>Status</th>
                <th className={tw.th}>Reviews</th>
                <th className={tw.th}>Latest decision</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length ? (
                filtered.map((submission) => (
                  <tr key={submission.id} className="odd:bg-slate-50/80">
                    <td className={tw.td}>{submission.title}</td>
                    <td className={tw.td}>{submission.authorName}</td>
                    <td className={tw.td}>
                      <span className={submissionStatusBadge(submission.status)} title={submission.status}>
                        {submission.status}
                      </span>
                    </td>
                    <td className={tw.td}>
                      {Array.isArray(submission.reviews) && submission.reviews.length
                        ? submission.reviews.length
                        : 0}
                    </td>
                    <td className={tw.td}>
                      {submission.decision
                        ? `${submission.decision.value}${submission.decision.by ? ` by ${submission.decision.by}` : ''}`
                        : '—'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className={tw.tdEmpty}>
                    No submissions in queue.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  )
}
