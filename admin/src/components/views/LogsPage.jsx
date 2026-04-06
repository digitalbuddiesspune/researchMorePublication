import { useEffect, useState } from 'react'
import { fetchAuditLogs } from '../../services/auditService'
import { tw } from '../../lib/adminUi'

export default function LogsPage({ active, logsReloadKey, setNotice }) {
  const [logs, setLogs] = useState([])

  const load = async () => {
    try {
      const data = await fetchAuditLogs(100)
      setLogs(data)
    } catch (e) {
      setNotice(e.message, 'error')
    }
  }

  useEffect(() => {
    load().catch(() => setNotice('Could not load audit logs.', 'error'))
  }, [logsReloadKey])

  useEffect(() => {
    if (!active) return
    load().catch((e) => setNotice(e.message, 'error'))
  }, [active])

  return (
    <section className={tw.view(active)} data-view="logs">
      <section className={tw.card}>
        <h3 className={tw.cardTitle}>Audit log</h3>
        <p className={`${tw.cardDesc} mb-5`}>Role changes, assignments, decisions, and settings (latest 100).</p>
        <div className={tw.tableWrap}>
          <table className={`${tw.table} min-w-[720px]`}>
            <thead>
              <tr>
                <th className={tw.th}>Time</th>
                <th className={tw.th}>Actor</th>
                <th className={tw.th}>Action</th>
                <th className={tw.th}>Target</th>
              </tr>
            </thead>
            <tbody>
              {logs.length ? (
                logs.map((item, idx) => (
                  <tr key={item._id || item.id || `log-${idx}`} className="odd:bg-slate-50/80">
                    <td className={tw.tdMono}>{new Date(item.createdAt).toLocaleString()}</td>
                    <td className={tw.td}>
                      {item.actorName} ({item.actorRole})
                    </td>
                    <td className={tw.td}>{item.action}</td>
                    <td className={tw.td}>
                      {item.targetType}: {item.targetLabel || item.targetId || '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className={tw.tdEmpty}>
                    No activity logs found.
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
