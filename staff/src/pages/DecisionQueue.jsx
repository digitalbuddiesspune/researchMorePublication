import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchEditorSubmissions } from '../services/workflowService.js'
import { u } from '../lib/ui.js'
import StatusBadge from '../components/StatusBadge.jsx'

export default function DecisionQueue() {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')

  const load = async () => {
    setError('')
    const list = await fetchEditorSubmissions()
    setItems(Array.isArray(list) ? list : [])
  }

  useEffect(() => {
    load().catch((e) => setError(e?.message || 'Could not load decision queue'))
  }, [])

  const queue = useMemo(
    () => items.filter((item) => ['under-review', 'revision-requested'].includes(item.status)),
    [items],
  )

  return (
    <section className="space-y-4">
      {error ? <p className={u.alertErr}>{error}</p> : null}
      <div className={u.card}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Decision queue</h2>
          <button type="button" className={u.btnGhost} onClick={() => load().catch(() => {})}>
            Refresh
          </button>
        </div>
        <div className="space-y-2">
          {queue.map((item) => (
            <div key={item.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold text-slate-900">{item.title}</p>
                  <p className="text-xs text-slate-600">Author: {item.authorName || '-'}</p>
                </div>
                <StatusBadge status={item.status} />
              </div>
              <div className="mt-2">
                <Link to={`/staff/decision/${item.id}`} className="text-sm font-semibold text-blue-700 hover:text-blue-800">
                  Open decision panel →
                </Link>
              </div>
            </div>
          ))}
          {!queue.length ? <p className="text-sm text-slate-500">No submissions pending decision.</p> : null}
        </div>
      </div>
    </section>
  )
}

