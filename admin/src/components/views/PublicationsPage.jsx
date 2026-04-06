import { useEffect, useState } from 'react'
import { tw } from '../../lib/adminUi'
import { fetchAdminPublications, updateAdminPublication } from '../../services/adminInsightsService'

export default function PublicationsPage({ active, setNotice }) {
  const [items, setItems] = useState([])
  const [drafts, setDrafts] = useState({})

  const load = async () => {
    const rows = await fetchAdminPublications()
    setItems(rows)
    const next = {}
    rows.forEach((item) => {
      next[item.id] = {
        featured: Boolean(item.featured),
        seoTitle: item.seoTitle || '',
        seoDescription: item.seoDescription || '',
      }
    })
    setDrafts(next)
  }

  useEffect(() => {
    if (!active) return
    load().catch((e) => setNotice(e.message, 'error'))
  }, [active])

  const save = async (id) => {
    const draft = drafts[id]
    if (!draft) return
    try {
      await updateAdminPublication(id, draft)
      await load()
      setNotice('Publication metadata updated.', 'success')
    } catch (e) {
      setNotice(e.message, 'error')
    }
  }

  return (
    <section className={tw.view(active)} data-view="publications">
      <section className={tw.card}>
        <h3 className={tw.cardTitle}>Publications (accepted only)</h3>
        <p className={`${tw.cardDesc} mb-5`}>Metadata-only edit. Creation stays tied to accepted submissions.</p>
        <div className={tw.tableWrap}>
          <table className={`${tw.table} min-w-[1100px]`}>
            <thead>
              <tr>
                <th className={tw.th}>Title</th>
                <th className={tw.th}>Author</th>
                <th className={tw.th}>Featured</th>
                <th className={tw.th}>SEO title</th>
                <th className={tw.th}>SEO description</th>
                <th className={tw.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.length ? items.map((item) => (
                <tr key={item.id} className="odd:bg-slate-50/80">
                  <td className={tw.td}>{item.title}</td>
                  <td className={tw.td}>{item.author}</td>
                  <td className={tw.td}>
                    <input
                      type="checkbox"
                      checked={Boolean(drafts[item.id]?.featured)}
                      onChange={(e) => setDrafts((prev) => ({ ...prev, [item.id]: { ...prev[item.id], featured: e.target.checked } }))}
                    />
                  </td>
                  <td className={tw.td}>
                    <input
                      className={tw.input}
                      value={drafts[item.id]?.seoTitle || ''}
                      onChange={(e) => setDrafts((prev) => ({ ...prev, [item.id]: { ...prev[item.id], seoTitle: e.target.value } }))}
                    />
                  </td>
                  <td className={tw.td}>
                    <input
                      className={tw.input}
                      value={drafts[item.id]?.seoDescription || ''}
                      onChange={(e) => setDrafts((prev) => ({ ...prev, [item.id]: { ...prev[item.id], seoDescription: e.target.value } }))}
                    />
                  </td>
                  <td className={tw.td}><button type="button" className={tw.btnSm} onClick={() => save(item.id)}>Save</button></td>
                </tr>
              )) : (
                <tr><td colSpan={6} className={tw.tdEmpty}>No accepted publications found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  )
}

