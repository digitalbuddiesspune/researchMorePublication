import { useEffect, useState } from 'react'
import { fetchAdminAnalytics } from '../../services/statsService'
import { fetchSubmissionsMonitor } from '../../services/adminInsightsService'
import { statCardClass, tw } from '../../lib/adminUi'

export default function DashboardPage({ active, dashReloadKey, setNotice }) {
  const [totals, setTotals] = useState({
    users: 0,
    authors: 0,
    reviewers: 0,
    editors: 0,
    submissions: 0,
    accepted: 0,
    rejected: 0,
    journals: 0,
    pending: 0,
    noReviewer: 0,
  })

  useEffect(() => {
    if (!active) return
    const run = async () => {
      try {
        const analytics = await fetchAdminAnalytics()
        const monitor = await fetchSubmissionsMonitor()
        setTotals({
          users: analytics.users?.totalUsers || 0,
          authors: analytics.users?.authors || 0,
          reviewers: analytics.users?.reviewers || 0,
          editors: analytics.users?.editors || 0,
          submissions: analytics.submissions?.totalSubmissions || 0,
          accepted: analytics.submissions?.accepted || 0,
          rejected: analytics.submissions?.rejected || 0,
          journals: analytics.journals?.totalJournals || 0,
          pending: monitor.filter((m) => m.status === 'submitted' || m.status === 'under-review').length,
          noReviewer: monitor.filter((m) => !m.hasReviewerAssigned).length,
        })
      } catch (e) {
        setNotice(e.message, 'error')
      }
    }
    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- setNotice is stable from parent
  }, [active, dashReloadKey])

  return (
    <section className={tw.view(active)} data-view="dashboard">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Total users', value: totals.users, accent: 'blue' },
          { label: 'Total authors', value: totals.authors, accent: 'blue' },
          { label: 'Total reviewers', value: totals.reviewers, accent: 'blue' },
          { label: 'Total editors', value: totals.editors, accent: 'blue' },
          { label: 'Total submissions', value: totals.submissions, accent: 'violet' },
          { label: 'Accepted', value: totals.accepted, accent: 'emerald' },
          { label: 'Rejected', value: totals.rejected, accent: 'amber' },
          { label: 'Active journals', value: totals.journals, accent: 'violet' },
          { label: 'Pending submissions', value: totals.pending, accent: 'amber' },
          { label: 'No reviewer assigned', value: totals.noReviewer, accent: 'amber' },
        ].map((stat) => (
          <article key={stat.label} className={statCardClass(stat.accent)}>
            <p className="m-0 text-xs font-medium uppercase tracking-wide text-slate-500">{stat.label}</p>
            <strong className="mt-2 block text-2xl font-semibold tabular-nums tracking-tight text-slate-900">
              {stat.value}
            </strong>
          </article>
        ))}
      </div>
    </section>
  )
}
