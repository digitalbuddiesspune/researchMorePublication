import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { authFetch, clearWebToken, fetchMe } from '../services/authService.js'

export default function AuthorSubmissionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [error, setError] = useState('')
  const [revisionFile, setRevisionFile] = useState(null)
  const [fileUpdate, setFileUpdate] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  const load = async () => {
    const response = await authFetch(`/submissions/my/${id}`)
    if (!response.ok) throw new Error('Could not load submission detail')
    setItem(await response.json())
  }

  useEffect(() => {
    const init = async () => {
      try {
        const payload = await fetchMe()
        if (payload.user?.role !== 'author') throw new Error('Forbidden')
        await load()
      } catch (e) {
        clearWebToken()
        navigate('/login?next=/author/submissions', { replace: true })
      }
    }
    init()
  }, [id, navigate])

  const uploadAsset = async (file) => {
    if (!file) throw new Error('Please choose a file')
    const formData = new FormData()
    formData.append('file', file)
    const response = await authFetch('/submissions/upload-file', {
      method: 'POST',
      body: formData,
    })
    if (!response.ok) {
      const apiError = await response.json().catch(() => ({ message: 'Could not upload file' }))
      throw new Error(apiError.message || 'Could not upload file')
    }
    return response.json()
  }

  const uploadRevision = async () => {
    setError('')
    if (!revisionFile) return setError('Revision file is required')
    setIsSaving(true)
    try {
      const uploaded = await uploadAsset(revisionFile)
      const response = await authFetch(`/submissions/${id}/revision`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          note: 'Author uploaded revision',
          files: [{ type: 'manuscript', name: uploaded.name, url: uploaded.url, size: uploaded.size }],
        }),
      })
      if (!response.ok) {
        const apiError = await response.json().catch(() => ({ message: 'Could not upload revision' }))
        throw new Error(apiError.message || 'Could not upload revision')
      }
      setRevisionFile(null)
      await load()
    } catch (e) {
      setError(e.message)
    } finally {
      setIsSaving(false)
    }
  }

  if (!item) return <section className="rounded-xl border border-neutral-200 bg-white p-4 text-sm">Loading...</section>

  return (
    <section className="space-y-4">
      <div className="rounded-xl border border-neutral-200 bg-white p-4">
        <div className="mb-2 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-neutral-900">{item.title}</h1>
          <Link to="/author/submissions" className="text-sm text-blue-600 hover:text-blue-700">
            ← Back
          </Link>
        </div>
        <p className="text-sm text-neutral-600">Status: <span className="font-medium">{item.status}</span></p>
        <p className="mt-2 text-sm text-neutral-700">{item.abstract || 'No abstract'}</p>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-4">
        <h2 className="text-base font-semibold">Uploaded files</h2>
        <div className="mt-2 space-y-2 text-sm">
          {(item.files || []).map((file, idx) => (
            <div key={`${file.name}-${idx}`} className="rounded-md border border-neutral-200 p-2">
              <p>{file.type} - {file.name}</p>
              <a href={file.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-700">
                {file.url}
              </a>
            </div>
          ))}
          {!item.files?.length ? <p className="text-neutral-500">No files uploaded.</p> : null}
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-4">
        <h2 className="text-base font-semibold">Version history</h2>
        <div className="mt-2 space-y-2 text-sm">
          {(item.history || []).map((h, idx) => (
            <div key={`${h.version}-${idx}`} className="rounded-md border border-neutral-200 p-2">
              <p className="font-medium">Version {h.version}</p>
              <p className="text-neutral-600">{h.note || '—'}</p>
            </div>
          ))}
          {!item.history?.length ? <p className="text-neutral-500">No history yet.</p> : null}
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-4">
        <h2 className="text-base font-semibold">Decision & reviewer comments</h2>
        <p className="mt-2 text-sm text-neutral-700">
          Decision: {item.decision?.value || 'Pending'}
        </p>
        <div className="mt-2 space-y-2 text-sm">
          {(item.reviews || []).map((review, idx) => (
            <div key={`${review.assignmentId || idx}`} className="rounded-md border border-neutral-200 p-2">
              <p className="font-medium">{review.reviewerName} - {review.recommendation}</p>
              <p className="text-neutral-700">{review.comments || 'No comments'}</p>
            </div>
          ))}
          {!item.reviews?.length ? <p className="text-neutral-500">No reviewer comments yet.</p> : null}
        </div>
      </div>

      {item.status === 'revision-requested' ? (
        <div className="rounded-xl border border-neutral-200 bg-white p-4">
          <h2 className="text-base font-semibold">Upload revision</h2>
          {error ? <p className="mt-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
          <input
            type="file"
            onChange={(e) => setRevisionFile(e.target.files?.[0] || null)}
            className="mt-2 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={uploadRevision}
            disabled={isSaving}
            className="mt-2 rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-neutral-900 disabled:opacity-60"
          >
            {isSaving ? 'Uploading...' : 'Upload revision'}
          </button>
        </div>
      ) : null}

      {['submitted', 'revision-requested'].includes(item.status) ? (
        <div className="rounded-xl border border-neutral-200 bg-white p-4">
          <h2 className="text-base font-semibold">Update files</h2>
          <input
            type="file"
            onChange={(e) => setFileUpdate(e.target.files?.[0] || null)}
            className="mt-2 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={async () => {
              setError('')
              if (!fileUpdate) return setError('File is required')
              setIsSaving(true)
              try {
                const uploaded = await uploadAsset(fileUpdate)
                const response = await authFetch(`/submissions/${id}/files`, {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    note: 'Author updated files',
                    files: [{ type: 'manuscript', name: uploaded.name, url: uploaded.url, size: uploaded.size }],
                  }),
                })
                if (!response.ok) {
                  const apiError = await response.json().catch(() => ({ message: 'Could not update files' }))
                  throw new Error(apiError.message || 'Could not update files')
                }
                setFileUpdate(null)
                await load()
              } catch (e) {
                setError(e.message)
              } finally {
                setIsSaving(false)
              }
            }}
            disabled={isSaving}
            className="mt-2 rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm disabled:opacity-60"
          >
            {isSaving ? 'Saving...' : 'Update files'}
          </button>
        </div>
      ) : null}
    </section>
  )
}

