import { useEffect, useMemo, useState } from 'react'
import { authFetch, clearWebToken, fetchMe } from '../services/authService.js'
import { useNavigate } from 'react-router-dom'

export default function AuthorMessages() {
  const navigate = useNavigate()
  const [submissions, setSubmissions] = useState([])
  const [submissionId, setSubmissionId] = useState('')
  const [messages, setMessages] = useState([])
  const [messageText, setMessageText] = useState('')
  const [error, setError] = useState('')
  const [isSending, setIsSending] = useState(false)

  const selectedSubmission = useMemo(
    () => submissions.find((item) => item.id === submissionId),
    [submissions, submissionId],
  )

  const loadSubmissions = async () => {
    const response = await authFetch('/submissions/my')
    if (!response.ok) throw new Error('Could not load submissions')
    const items = await response.json()
    setSubmissions(items)
    if (!submissionId && items.length) setSubmissionId(items[0].id)
  }

  const loadMessages = async (id) => {
    if (!id) {
      setMessages([])
      return
    }
    const response = await authFetch(`/submissions/${id}/messages`)
    if (!response.ok) throw new Error('Could not load messages')
    const payload = await response.json()
    setMessages(Array.isArray(payload.messages) ? payload.messages : [])
  }

  useEffect(() => {
    const init = async () => {
      try {
        const payload = await fetchMe()
        if (payload.user?.role !== 'author') throw new Error('Forbidden')
        await loadSubmissions()
      } catch {
        clearWebToken()
        navigate('/login?next=/author/messages', { replace: true })
      }
    }
    init()
  }, [navigate])

  useEffect(() => {
    loadMessages(submissionId).catch((e) => setError(e.message))
  }, [submissionId])

  const send = async () => {
    setError('')
    if (!submissionId) return setError('Please select a submission')
    if (!messageText.trim()) return setError('Message is required')
    setIsSending(true)
    try {
      const response = await authFetch(`/submissions/${submissionId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText }),
      })
      if (!response.ok) {
        const apiError = await response.json().catch(() => ({ message: 'Could not send message' }))
        throw new Error(apiError.message || 'Could not send message')
      }
      const payload = await response.json()
      setMessages(Array.isArray(payload.messages) ? payload.messages : [])
      setMessageText('')
    } catch (e) {
      setError(e.message)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <section className="rounded-xl border border-neutral-200 bg-white p-4">
      <h1 className="text-xl font-semibold text-neutral-900">Messages</h1>
      <p className="mt-1 text-sm text-neutral-600">Communicate with editorial team per submission.</p>

      {error ? <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

      <div className="mt-3">
        <label className="mb-1 block text-sm font-semibold text-neutral-800">Submission</label>
        <select
          value={submissionId}
          onChange={(e) => setSubmissionId(e.target.value)}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        >
          <option value="">Select submission</option>
          {submissions.map((item) => (
            <option key={item.id} value={item.id}>
              {item.title}
            </option>
          ))}
        </select>
      </div>

      {selectedSubmission ? (
        <div className="mt-2 text-xs text-neutral-500">Status: {selectedSubmission.status}</div>
      ) : null}

      <div className="mt-3 space-y-2">
        {messages.map((item, index) => (
          <article key={`${item.createdAt || 'm'}-${index}`} className="rounded-md border border-neutral-200 bg-neutral-50 p-3 text-sm">
            <p className="font-medium text-neutral-900">
              {item.senderName} <span className="font-normal text-neutral-500">({item.senderRole})</span>
            </p>
            <p className="mt-1 text-neutral-700">{item.message}</p>
            <p className="mt-1 text-xs text-neutral-500">
              {item.createdAt ? new Date(item.createdAt).toLocaleString() : ''}
            </p>
          </article>
        ))}
        {!messages.length ? (
          <p className="text-sm text-neutral-500">No messages yet for this submission.</p>
        ) : null}
      </div>

      <div className="mt-3">
        <textarea
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          rows={4}
          placeholder="Write message to editor"
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={send}
          disabled={isSending}
          className="mt-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {isSending ? 'Sending...' : 'Send message'}
        </button>
      </div>
    </section>
  )
}

