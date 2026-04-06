import { useEffect, useMemo, useState } from 'react'
import { submissionStatusBadge, tw } from '../../lib/adminUi'
import { fetchSubmissionsMonitor } from '../../services/adminInsightsService'

export default function SubmissionsMonitorPage({ active, setNotice }) {
  const [items, setItems] = useState([])
  const [statusFilter, setStatusFilter] = useState('')

  const load = async () => {
    const data = await fetchSubmissionsMonitor()
    setItems(data)
  }

  useEffect(() => {
    if (!active) return
    load().catch((e) => setNotice(e.message, 'error'))
  }, [active])

  const filtered = useMemo(
    () => items.filter((item) => (statusFilter ? item.status === statusFilter : true)),
    [items, statusFilter]
  )

  return (
    <section className={tw.view(active)} data-view="submissions-monitor">
      <section className={tw.card}>
        <div className={`${tw.toolbar} mb-5`}>
          <div>
            <h3 className={tw.cardTitleInline}>Submissions monitor</h3>
            <p className={tw.cardDesc}>Track stuck submissions and missing reviewer assignments.</p>
          </div>
          <select className={`${tw.select} w-full sm:max-w-[220px]`} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All statuses</option>
            <option value="submitted">submitted</option>
            <option value="under-review">under-review</option>
            <option value="revision-requested">revision-requested</option>
            <option value="accepted">accepted</option>
            <option value="rejected">rejected</option>
          </select>
        </div>
        <div className={tw.tableWrap}>
          <table className={`${tw.table} min-w-[980px]`}>
            <thead>
              <tr>
                <th className={tw.th}>Title</th>
                <th className={tw.th}>Author</th>
                <th className={tw.th}>Status</th>
                <th className={tw.th}>Reviewer assigned</th>
                <th className={tw.th}>Days idle</th>
                <th className={tw.th}>Alert</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length ? (
                filtered.map((item) => (
                  <tr key={item.id} className="odd:bg-slate-50/80">
                    <td className={tw.td}>{item.title}</td>
                    <td className={tw.td}>{item.authorName}</td>
                    <td className={tw.td}><span className={submissionStatusBadge(item.status)}>{item.status}</span></td>
                    <td className={tw.td}>{item.hasReviewerAssigned ? 'yes' : 'no'}</td>
                    <td className={tw.td}>{item.daysSinceUpdate}</td>
                    <td className={tw.td}>{item.stuck ? 'stuck >14 days' : '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className={tw.tdEmpty}>No submissions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  )
}

