import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_V1_URL } from '../config/api.js'
import { authFetch, clearWebToken, fetchMe } from '../services/authService.js'

const EMPTY_AUTHOR = { name: '', email: '', affiliation: '', corresponding: false }

export default function AuthorSubmit() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [journals, setJournals] = useState([])
  const [articleTypes, setArticleTypes] = useState([])
  const [title, setTitle] = useState('')
  const [abstract, setAbstract] = useState('')
  const [keywordsText, setKeywordsText] = useState('')
  const [journalId, setJournalId] = useState('')
  const [articleType, setArticleType] = useState('Research Article')
  const [authors, setAuthors] = useState([{ ...EMPTY_AUTHOR, corresponding: true }])
  const [files, setFiles] = useState([{ type: 'manuscript', name: '', url: '', size: 0 }])
  const [isSaving, setIsSaving] = useState(false)
  const [uploadingIndex, setUploadingIndex] = useState(-1)
  const [error, setError] = useState('')

  useEffect(() => {
    const init = async () => {
      try {
        const payload = await fetchMe()
        if (payload.user?.role !== 'author') throw new Error('Forbidden')
        const [jr, st] = await Promise.all([
          fetch(`${API_V1_URL}/journals`).then((r) => r.json()),
          fetch(`${API_V1_URL}/settings/public`).then((r) => r.json()),
        ])
        setJournals(Array.isArray(jr.items) ? jr.items : [])
        const types = Array.isArray(st.articleTypes) ? st.articleTypes : []
        setArticleTypes(types)
        if (types.length) setArticleType(types[0])
      } catch {
        clearWebToken()
        navigate('/login?next=/author/submit', { replace: true })
      }
    }
    init()
  }, [navigate])

  const next = () => setStep((s) => Math.min(4, s + 1))
  const prev = () => setStep((s) => Math.max(1, s - 1))

  const setAuthor = (index, key, value) => {
    setAuthors((list) => list.map((a, i) => (i === index ? { ...a, [key]: value } : a)))
  }

  const submit = async () => {
    setError('')
    if (!title.trim()) return setError('Title required')
    if (!journalId) return setError('Please select journal')
    setIsSaving(true)
    try {
      const keywords = keywordsText
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
      const payload = {
        title,
        abstract,
        articleType,
        journalId,
        keywords,
        authors: authors.filter((a) => a.name.trim()),
        files: files.filter((f) => f.type && f.name && f.url),
      }
      const response = await authFetch('/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!response.ok) {
        const apiError = await response.json().catch(() => ({ message: 'Could not create submission' }))
        throw new Error(apiError.message || 'Could not create submission')
      }
      navigate('/author/submissions', { replace: true })
    } catch (e) {
      setError(e.message)
    } finally {
      setIsSaving(false)
    }
  }

  const uploadFile = async (index) => {
    const target = files[index]
    if (!target?.localFile) {
      setError('Please choose a file first')
      return
    }
    setError('')
    setUploadingIndex(index)
    try {
      const formData = new FormData()
      formData.append('file', target.localFile)
      const response = await authFetch('/submissions/upload-file', {
        method: 'POST',
        body: formData,
      })
      if (!response.ok) {
        const apiError = await response.json().catch(() => ({ message: 'Upload failed' }))
        throw new Error(apiError.message || 'Upload failed')
      }
      const payload = await response.json()
      setFiles((list) =>
        list.map((f, i) =>
          i === index
            ? {
                ...f,
                name: payload.name || f.name,
                url: payload.url || '',
                size: payload.size || 0,
                localFile: null,
              }
            : f
        )
      )
    } catch (e) {
      setError(e.message)
    } finally {
      setUploadingIndex(-1)
    }
  }

  return (
    <section className="rounded-xl border border-neutral-200 bg-white">
      <header className="border-b border-neutral-200 px-4 py-3">
        <h1 className="text-xl font-semibold text-neutral-900">New submission</h1>
        <p className="text-xs text-neutral-500">Step {step} of 4</p>
      </header>

      <div className="p-4">
        {error ? <p className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

        {step === 1 ? (
          <div className="space-y-3">
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm" />
            <textarea value={abstract} onChange={(e) => setAbstract(e.target.value)} rows={6} placeholder="Abstract" className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm" />
            <input value={keywordsText} onChange={(e) => setKeywordsText(e.target.value)} placeholder="Keywords (comma separated)" className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm" />
            <select value={journalId} onChange={(e) => setJournalId(e.target.value)} className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm">
              <option value="">Select journal</option>
              {journals.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.name}
                </option>
              ))}
            </select>
            <select value={articleType} onChange={(e) => setArticleType(e.target.value)} className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm">
              {(articleTypes.length ? articleTypes : ['Research Article']).map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-3">
            {authors.map((a, index) => (
              <div key={index} className="grid gap-2 rounded-md border border-neutral-200 p-3 sm:grid-cols-2">
                <input value={a.name} onChange={(e) => setAuthor(index, 'name', e.target.value)} placeholder="Author name" className="rounded-md border border-neutral-300 px-3 py-2 text-sm" />
                <input value={a.email} onChange={(e) => setAuthor(index, 'email', e.target.value)} placeholder="Author email" className="rounded-md border border-neutral-300 px-3 py-2 text-sm" />
                <input value={a.affiliation} onChange={(e) => setAuthor(index, 'affiliation', e.target.value)} placeholder="Affiliation" className="rounded-md border border-neutral-300 px-3 py-2 text-sm sm:col-span-2" />
              </div>
            ))}
            <button type="button" className="rounded-md border border-neutral-300 px-3 py-2 text-sm" onClick={() => setAuthors((v) => [...v, { ...EMPTY_AUTHOR }])}>
              Add co-author
            </button>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-3">
            {files.map((f, index) => (
              <div key={index} className="grid gap-2 rounded-md border border-neutral-200 p-3 sm:grid-cols-3">
                <input value={f.type} onChange={(e) => setFiles((v) => v.map((x, i) => (i === index ? { ...x, type: e.target.value } : x)))} placeholder="Type (manuscript/supplementary)" className="rounded-md border border-neutral-300 px-3 py-2 text-sm" />
                <input value={f.name} onChange={(e) => setFiles((v) => v.map((x, i) => (i === index ? { ...x, name: e.target.value } : x)))} placeholder="File name" className="rounded-md border border-neutral-300 px-3 py-2 text-sm" />
                <div className="space-y-2">
                  <input
                    type="file"
                    onChange={(e) =>
                      setFiles((v) =>
                        v.map((x, i) =>
                          i === index ? { ...x, localFile: e.target.files?.[0] || null, name: e.target.files?.[0]?.name || x.name } : x
                        )
                      )
                    }
                    className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => uploadFile(index)}
                    disabled={uploadingIndex === index}
                    className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-xs"
                  >
                    {uploadingIndex === index ? 'Uploading...' : 'Upload file'}
                  </button>
                  <input value={f.url} readOnly placeholder="Uploaded file URL" className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm" />
                </div>
              </div>
            ))}
            <button type="button" className="rounded-md border border-neutral-300 px-3 py-2 text-sm" onClick={() => setFiles((v) => [...v, { type: 'supplementary', name: '', url: '', size: 0 }])}>
              Add file row
            </button>
          </div>
        ) : null}

        {step === 4 ? (
          <div className="space-y-2 rounded-md border border-neutral-200 bg-neutral-50 p-4 text-sm">
            <p><span className="font-semibold">Title:</span> {title || '—'}</p>
            <p><span className="font-semibold">Journal:</span> {journals.find((j) => j.id === journalId)?.name || '—'}</p>
            <p><span className="font-semibold">Article Type:</span> {articleType}</p>
            <p><span className="font-semibold">Authors:</span> {authors.filter((a) => a.name.trim()).length}</p>
            <p><span className="font-semibold">Files:</span> {files.filter((f) => f.name && f.url).length}</p>
          </div>
        ) : null}
      </div>

      <footer className="flex items-center justify-between border-t border-neutral-200 px-4 py-3">
        <button type="button" onClick={prev} className="rounded-md border border-neutral-300 px-4 py-2 text-sm" disabled={step === 1}>
          Back
        </button>
        {step < 4 ? (
          <button type="button" onClick={next} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
            Next
          </button>
        ) : (
          <button type="button" onClick={submit} disabled={isSaving} className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-neutral-900 disabled:opacity-60">
            {isSaving ? 'Submitting...' : 'Confirm & Submit'}
          </button>
        )}
      </footer>
    </section>
  )
}

