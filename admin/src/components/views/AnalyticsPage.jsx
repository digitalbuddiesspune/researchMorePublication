import { useEffect, useState } from 'react'
import { tw } from '../../lib/adminUi'
import { fetchAdminTrends } from '../../services/adminInsightsService'

export default function AnalyticsPage({ active, setNotice }) {
  const [data, setData] = useState({
    acceptanceRate: 0,
    submissionsPerMonth: [],
    activeUsersPerMonth: [],
    journalWiseStats: [],
  })

  useEffect(() => {
    if (!active) return
    fetchAdminTrends().then(setData).catch((e) => setNotice(e.message, 'error'))
  }, [active])

  return (
    <section className={tw.view(active)} data-view="analytics">
      <section className={tw.card}>
        <h3 className={tw.cardTitle}>System performance</h3>
        <p className={`${tw.cardDesc} mb-4`}>Acceptance rate: <strong>{data.acceptanceRate}%</strong></p>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className={tw.tableWrap}>
            <table className={tw.table}>
              <thead><tr><th className={tw.th}>Month</th><th className={tw.th}>Submissions</th><th className={tw.th}>New users</th></tr></thead>
              <tbody>
                {(data.submissionsPerMonth || []).map((row, idx) => (
                  <tr key={row.month} className="odd:bg-slate-50/80">
                    <td className={tw.td}>{row.month}</td>
                    <td className={tw.td}>{row.count}</td>
                    <td className={tw.td}>{data.activeUsersPerMonth?.[idx]?.count || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={tw.tableWrap}>
            <table className={tw.table}>
              <thead><tr><th className={tw.th}>Journal</th><th className={tw.th}>Total</th><th className={tw.th}>Accepted</th></tr></thead>
              <tbody>
                {(data.journalWiseStats || []).length ? data.journalWiseStats.map((row) => (
                  <tr key={row.journal} className="odd:bg-slate-50/80">
                    <td className={tw.td}>{row.journal}</td>
                    <td className={tw.td}>{row.total}</td>
                    <td className={tw.td}>{row.accepted}</td>
                  </tr>
                )) : <tr><td colSpan={3} className={tw.tdEmpty}>No journal stats.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </section>
  )
}

