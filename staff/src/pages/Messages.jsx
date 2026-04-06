import { useEffect, useState } from 'react'
import SubmissionMessagesPanel from '../components/SubmissionMessagesPanel.jsx'
import { fetchEditorSubmissions } from '../services/workflowService.js'
import { u } from '../lib/ui.js'

export default function Messages() {
  const [items, setItems] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const run = async () => {
      setError('')
      const subs = await fetchEditorSubmissions()
      setItems(Array.isArray(subs) ? subs : [])
      if (subs?.length) setSelectedId(subs[0].id)
    }
    run().catch((e) => setError(e?.message || 'Could not load submissions'))
  }, [])

  return (
    <section className="space-y-4">
      {error ? <p className={u.alertErr}>{error}</p> : null}
      <div className={u.card}>
        <h2 className="text-lg font-semibold text-slate-900">Author messages</h2>
        <p className="mt-1 text-sm text-slate-600">Editor to author communication thread per submission.</p>
        <div className="mt-3 max-w-md">
          <select className={u.select} value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
            {items.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
        </div>
        {selectedId ? <div className="mt-4"><SubmissionMessagesPanel submissionId={selectedId} currentRole="editor" /></div> : null}
      </div>
    </section>
  )
}

