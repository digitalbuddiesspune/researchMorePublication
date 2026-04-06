import { useEffect, useState } from 'react'
import { tw } from '../../lib/adminUi'
import { fetchReviewOversight } from '../../services/adminInsightsService'

export default function ReviewOversightPage({ active, setNotice }) {
  const [rows, setRows] = useState([])

  useEffect(() => {
    if (!active) return
    fetchReviewOversight().then(setRows).catch((e) => setNotice(e.message, 'error'))
  }, [active])

  return (
    <section className={tw.view(active)} data-view="review-oversight">
      <section className={tw.card}>
        <h3 className={tw.cardTitle}>Reviewer performance</h3>
        <p className={`${tw.cardDesc} mb-5`}>Pending, completed, overdue reviews and ranking signal.</p>
        <div className={tw.tableWrap}>
          <table className={tw.table}>
            <thead>
              <tr>
                <th className={tw.th}>Reviewer</th>
                <th className={tw.th}>Assigned</th>
                <th className={tw.th}>Completed</th>
                <th className={tw.th}>Pending</th>
                <th className={tw.th}>Overdue</th>
              </tr>
            </thead>
            <tbody>
              {rows.length ? rows.map((item) => (
                <tr key={item.reviewerId} className="odd:bg-slate-50/80">
                  <td className={tw.td}>{item.reviewerName} ({item.reviewerEmail})</td>
                  <td className={tw.td}>{item.assigned}</td>
                  <td className={tw.td}>{item.submitted}</td>
                  <td className={tw.td}>{item.pending}</td>
                  <td className={tw.td}>{item.overdue}</td>
                </tr>
              )) : (
                <tr><td colSpan={5} className={tw.tdEmpty}>No reviewer assignments found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  )
}

