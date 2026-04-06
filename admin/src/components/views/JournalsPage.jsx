import { useEffect, useMemo, useState } from 'react'
import { createJournal, deleteJournal, fetchJournals, updateJournal } from '../../services/journalService'
import { fetchUsers } from '../../services/userService'
import { activeBadge, tw } from '../../lib/adminUi'

export default function JournalsPage({ active, setNotice, bumpLogs }) {
  const [journals, setJournals] = useState([])
  const [users, setUsers] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    id: '',
    name: '',
    subject: '',
    description: '',
    editorId: '',
    editorIds: [],
    isActive: true,
  })

  const editorOptions = useMemo(
    () => users.filter((u) => u.role === 'editor' && u.status === 'active'),
    [users]
  )

  const loadJournals = async () => {
    let u = users
    if (!u.length) {
      u = await fetchUsers()
      setUsers(u)
    }
    const list = await fetchJournals()
    setJournals(list)
  }

  useEffect(() => {
    loadJournals().catch(() => setNotice('Could not load journals.', 'error'))
  }, [])

  useEffect(() => {
    if (!active) return
    loadJournals().catch((e) => setNotice(e.message, 'error'))
  }, [active])

  const resetForm = () => {
    setForm({ id: '', name: '', subject: '', description: '', editorId: '', editorIds: [], isActive: true })
    setShowForm(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const mergedEditorIds = Array.from(new Set([...(form.editorIds || []), form.editorId].filter(Boolean)))
    const payload = {
      name: form.name.trim(),
      subject: form.subject.trim(),
      description: form.description.trim() || '',
      editorId: form.editorId || '',
      editorIds: mergedEditorIds,
      isActive: form.isActive,
    }
    try {
      form.id ? await updateJournal(form.id, payload) : await createJournal(payload)
      resetForm()
      await loadJournals()
      bumpLogs()
      setNotice('Journal saved successfully.', 'success')
    } catch (err) {
      setNotice(err.message, 'error')
    }
  }

  const startEdit = (j) => {
    setForm({
      id: j.id,
      name: j.name,
      subject: j.subject,
      description: j.description || '',
      editorId: j.editorId || '',
      editorIds: Array.isArray(j.editorIds) ? j.editorIds : [],
      isActive: Boolean(j.isActive),
    })
    setShowForm(true)
  }

  const toggleActive = async (journal) => {
    try {
      await updateJournal(journal.id, {
        name: journal.name,
        subject: journal.subject,
        description: journal.description || '',
        editorId: journal.editorId || '',
        editorIds: Array.isArray(journal.editorIds) ? journal.editorIds : [],
        isActive: !journal.isActive,
      })
      await loadJournals()
      bumpLogs()
      setNotice(`Journal marked ${journal.isActive ? 'inactive' : 'active'}.`, 'success')
    } catch (err) {
      setNotice(err.message, 'error')
    }
  }

  const removeJournal = async (journal) => {
    const confirmed = window.confirm(`Delete journal "${journal.name}"?`)
    if (!confirmed) return
    try {
      await deleteJournal(journal.id)
      await loadJournals()
      bumpLogs()
      if (form.id === journal.id) resetForm()
      setNotice('Journal deleted successfully.', 'success')
    } catch (err) {
      setNotice(err.message, 'error')
    }
  }

  return (
    <section className={tw.view(active)} data-view="journals">
      <div className="flex justify-end">
        <button
          type="button"
          className={tw.btnPrimary}
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? 'Close form' : 'Add journal'}
        </button>
      </div>

      {showForm ? (
      <section className={tw.card}>
        <h3 className={tw.cardTitle}>Journal</h3>
        <p className={`${tw.cardDesc} mb-5`}>Create a new journal or clear the form after editing another row.</p>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-3 md:grid-cols-3">
            <label className={tw.label}>
              <span className={tw.labelText}>Journal name</span>
              <input
                className={tw.input}
                required
                placeholder="AI Journal"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </label>
            <label className={tw.label}>
              <span className={tw.labelText}>Subject</span>
              <input
                className={tw.input}
                required
                placeholder="Artificial Intelligence"
                value={form.subject}
                onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
              />
            </label>
            <label className={tw.label}>
              <span className={tw.labelText}>Assign editor</span>
              <select className={tw.select} value={form.editorId} onChange={(e) => setForm((f) => ({ ...f, editorId: e.target.value }))}>
                <option value="">Unassigned</option>
                {editorOptions.map((ed) => (
                  <option key={ed.id} value={ed.id}>
                    {ed.name} ({ed.email})
                  </option>
                ))}
              </select>
            </label>
            <label className={tw.label}>
              <span className={tw.labelText}>Additional editors</span>
              <select
                multiple
                className={`${tw.select} min-h-[110px]`}
                value={form.editorIds}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    editorIds: Array.from(e.target.selectedOptions).map((opt) => opt.value),
                  }))
                }
              >
                {editorOptions.map((ed) => (
                  <option key={ed.id} value={ed.id}>
                    {ed.name} ({ed.email})
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className={tw.label}>
            <span className={tw.labelText}>Description</span>
            <textarea
              className={`${tw.input} ${tw.textarea}`}
              rows={3}
              placeholder="Short journal description"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </label>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className={`${tw.label} w-full sm:max-w-[220px]`}>
              <span className={tw.labelText}>Status</span>
              <select
                className={tw.select}
                value={form.isActive ? 'true' : 'false'}
                onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.value === 'true' }))}
              >
                <option value="true">active</option>
                <option value="false">inactive</option>
              </select>
            </label>
            <div className="flex flex-wrap gap-2">
              <button type="submit" className={tw.btnPrimary}>
                Save journal
              </button>
              <button type="button" className={tw.btnGhost} onClick={resetForm}>
                Clear
              </button>
            </div>
          </div>
        </form>
      </section>
      ) : null}
      <section className={tw.card}>
        <div className={`${tw.toolbar} mb-5`}>
          <div>
            <h3 className={tw.cardTitleInline}>
              All journals{' '}
              <span className="font-normal text-slate-400">·</span>{' '}
              <span className="text-blue-600">{journals.length}</span>
            </h3>
            <p className={tw.cardDesc}>Editor assignment and active flag.</p>
          </div>
        </div>
        <div className={tw.tableWrap}>
          <table className={`${tw.table} table-fixed`}>
            <colgroup>
              <col className="w-[26%]" />
              <col className="w-[22%]" />
              <col className="w-[27%]" />
              <col className="w-[12%]" />
              <col className="w-[13%]" />
            </colgroup>
            <thead>
              <tr>
                <th className={tw.th}>Name</th>
                <th className={tw.th}>Subject</th>
                <th className={tw.th}>Editor</th>
                <th className={tw.th}>Status</th>
                <th className={tw.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {journals.length ? (
                journals.map((item) => (
                  <tr key={item.id} className="odd:bg-slate-50/80">
                    <td className={`${tw.td} py-2 text-xs`}>{item.name}</td>
                    <td className={`${tw.td} py-2 text-xs`}>{item.subject}</td>
                    <td className={`${tw.td} py-2 text-xs truncate`} title={(item.editorNames && item.editorNames.length ? item.editorNames : [item.editorName]).filter(Boolean).join(', ') || '-'}>
                      {(item.editorNames && item.editorNames.length ? item.editorNames : [item.editorName]).filter(Boolean).join(', ') || '-'}
                    </td>
                    <td className={`${tw.td} py-2`}>
                      <span className={activeBadge(item.isActive)}>{item.isActive ? 'active' : 'inactive'}</span>
                    </td>
                    <td className={`${tw.td} py-2`}>
                      <div className="grid grid-cols-1 gap-1">
                        <button type="button" className="inline-flex h-7 w-full items-center justify-center rounded-md bg-blue-600 px-2 text-xs font-semibold text-white hover:bg-blue-700" onClick={() => startEdit(item)}>
                          Edit
                        </button>
                        <button type="button" className="inline-flex h-7 w-full items-center justify-center rounded-md border border-slate-300 bg-white px-2 text-xs font-semibold text-slate-700 hover:bg-slate-50" onClick={() => toggleActive(item)}>
                          {item.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button type="button" className="inline-flex h-7 w-full items-center justify-center rounded-md bg-red-600 px-2 text-xs font-semibold text-white hover:bg-red-700" onClick={() => removeJournal(item)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className={tw.tdEmpty}>
                    No journals found.
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
