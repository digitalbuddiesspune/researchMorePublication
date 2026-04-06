import { useEffect, useMemo, useState } from 'react'
import { createNews, fetchNews, removeNews, updateNews } from '../../services/newsService'
import { placementBadge, tw } from '../../lib/adminUi'

const PREVIEW_FALLBACK = 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600&q=80'

const emptyForm = () => ({
  id: '',
  title: '',
  summary: '',
  imageUrl: '',
  fallbackImage: '',
  label: 'News',
  placement: 'feature',
  isPublished: true,
})

export default function NewsManagerPage({ active, newsRefreshKey, setNotice }) {
  const [newsList, setNewsList] = useState([])
  const [search, setSearch] = useState('')
  const [placementFilter, setPlacementFilter] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [editing, setEditing] = useState(false)

  const loadNews = async () => {
    const list = await fetchNews()
    setNewsList(list)
  }

  useEffect(() => {
    loadNews().catch(() => setNotice('Could not connect backend. Start backend on configured API URL.', 'error'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newsRefreshKey])

  useEffect(() => {
    if (active) {
      setSearch('')
      setPlacementFilter('')
    }
  }, [active])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return newsList.filter(
      (item) => item.title.toLowerCase().includes(q) && (placementFilter ? item.placement === placementFilter : true)
    )
  }, [newsList, search, placementFilter])

  const previewBg = form.imageUrl.trim() || form.fallbackImage.trim() || PREVIEW_FALLBACK

  const resetForm = () => {
    setForm(emptyForm())
    setEditing(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const title = form.title.trim()
    if (!title) return setNotice('Title is required', 'error')
    const payload = {
      id: form.id || undefined,
      title,
      summary: form.summary.trim() || '',
      imageUrl: form.imageUrl.trim() || '',
      fallbackImage: form.fallbackImage.trim() || '',
      label: form.label.trim() || 'News',
      placement: form.placement || 'feature',
      isPublished: form.isPublished,
    }
    try {
      form.id ? await updateNews(form.id, payload) : await createNews(payload)
      resetForm()
      await loadNews()
      setNotice('News item saved.', 'success')
    } catch (err) {
      setNotice(err.message, 'error')
    }
  }

  const startEdit = (item) => {
    setForm({
      id: item._id,
      title: item.title || '',
      summary: item.summary || '',
      imageUrl: item.imageUrl || '',
      fallbackImage: item.fallbackImage || '',
      label: item.label || 'News',
      placement: item.placement || 'feature',
      isPublished: Boolean(item.isPublished),
    })
    setEditing(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this news item?')) return
    try {
      await removeNews(id)
      await loadNews()
      setNotice('News item deleted.', 'success')
    } catch (err) {
      setNotice(err.message, 'error')
    }
  }

  return (
    <section className={tw.view(active)} data-view="news-manager">
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <section className={tw.card}>
          <div className={`${tw.toolbar} mb-5`}>
            <h3 className={tw.cardTitleInline}>Add / edit news</h3>
            <span className={tw.pill}>{editing ? 'Editing item' : 'New item'}</span>
          </div>
          <form className="grid gap-3" onSubmit={handleSubmit}>
            <label className={tw.label}>
              <span className={tw.labelText}>
                News title <em className="not-italic text-red-600">*</em>
              </span>
              <input
                className={tw.input}
                name="title"
                required
                placeholder="e.g. Soil microbes can protect crops from climate extremes"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
            </label>
            <label className={tw.label}>
              <span className={tw.labelText}>Short summary</span>
              <textarea
                className={`${tw.input} ${tw.textarea}`}
                name="summary"
                placeholder="Optional: add 1-2 line summary for spotlight cards"
                value={form.summary}
                onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
              />
            </label>
            <label className={tw.label}>
              <span className={tw.labelText}>Primary image URL</span>
              <input
                className={tw.input}
                name="imageUrl"
                placeholder="https://..."
                value={form.imageUrl}
                onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
              />
            </label>
            <label className={tw.label}>
              <span className={tw.labelText}>Fallback image URL</span>
              <input
                className={tw.input}
                name="fallbackImage"
                placeholder="https://..."
                value={form.fallbackImage}
                onChange={(e) => setForm((f) => ({ ...f, fallbackImage: e.target.value }))}
              />
            </label>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_160px_auto] lg:items-end">
              <label className={tw.label}>
                <span className={tw.labelText}>Label</span>
                <input
                  className={tw.input}
                  name="label"
                  placeholder="News / Feature / Spotlight"
                  value={form.label}
                  onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                />
              </label>
              <label className={tw.label}>
                <span className={tw.labelText}>Placement</span>
                <select
                  className={tw.select}
                  name="placement"
                  value={form.placement}
                  onChange={(e) => setForm((f) => ({ ...f, placement: e.target.value }))}
                >
                  <option value="spotlight">spotlight</option>
                  <option value="side">side</option>
                  <option value="feature">feature</option>
                </select>
              </label>
              <label className="flex items-center gap-2 pb-2 text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  name="isPublished"
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  checked={form.isPublished}
                  onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))}
                />
                Published
              </label>
            </div>
            <p className="text-xs leading-relaxed text-slate-600">
              Tip: choose <strong>spotlight</strong> for main hero card, <strong>side</strong> for right-side list, and{' '}
              <strong>feature</strong> for bottom grid cards.
            </p>
            <div className="flex flex-wrap gap-2">
              <button type="submit" className={tw.btnPrimary}>
                {editing ? 'Update news' : 'Save news'}
              </button>
              <button
                type="button"
                className={tw.btnGhost}
                onClick={() => {
                  resetForm()
                  setNotice('Form cleared.', 'info')
                }}
              >
                Clear
              </button>
            </div>
          </form>
        </section>

        <section className={`${tw.card} h-fit lg:sticky lg:top-28`}>
          <h3 className={tw.cardTitle}>Live preview</h3>
          <p className={tw.cardDesc}>Approximate card as it may appear on the site.</p>
          <article className="overflow-hidden rounded-xl border border-slate-200">
            <div className="h-40 bg-slate-200 bg-cover bg-center" style={{ backgroundImage: `url(${previewBg})` }} />
            <div className="p-3">
              <p className="m-0 mb-1 text-xs font-bold uppercase tracking-wider text-blue-600">
                {form.label.trim() || 'News'}
              </p>
              <h4 className="m-0 mb-1 text-base font-semibold text-slate-900">{form.title.trim() || 'News title preview'}</h4>
              <p className="m-0 text-sm text-slate-600">{form.summary.trim() || 'Summary preview appears here while typing.'}</p>
            </div>
          </article>
        </section>
      </div>

      <section className={tw.card}>
        <div className={`${tw.toolbar} mb-5`}>
          <div>
            <h3 className={tw.cardTitleInline}>
              All news{' '}
              <span className="font-normal text-slate-400">·</span>{' '}
              <span className="text-blue-600">{newsList.length}</span>
            </h3>
            <p className={tw.cardDesc}>Search and filter by placement.</p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <input
              className={tw.input}
              id="search-news"
              type="search"
              placeholder="Search title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className={`${tw.select} sm:w-44`}
              id="filter-placement"
              value={placementFilter}
              onChange={(e) => setPlacementFilter(e.target.value)}
            >
              <option value="">All placements</option>
              <option value="spotlight">Spotlight</option>
              <option value="side">Side</option>
              <option value="feature">Feature</option>
            </select>
          </div>
        </div>
        <div className={tw.tableWrap}>
          <table className={tw.table}>
            <thead>
              <tr>
                <th className={tw.th}>Title</th>
                <th className={tw.th}>Placement</th>
                <th className={tw.th}>Published</th>
                <th className={tw.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length ? (
                filtered.map((item) => (
                  <tr key={item._id} className="odd:bg-slate-50/80">
                    <td className={tw.td}>{item.title}</td>
                    <td className={tw.td}>
                      <span className={placementBadge(item.placement)}>{item.placement}</span>
                    </td>
                    <td className={tw.td}>
                      <span className={item.isPublished ? 'font-semibold text-emerald-700' : 'font-semibold text-red-700'}>
                        {item.isPublished ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className={tw.td}>
                      <div className={tw.actions}>
                        <button type="button" className={tw.btnSm} onClick={() => startEdit(item)}>
                          Edit
                        </button>
                        <button type="button" className={tw.btnDangerSm} onClick={() => handleDelete(item._id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className={tw.tdEmpty}>
                    No matching news items.
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
