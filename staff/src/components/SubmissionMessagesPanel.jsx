import { useEffect, useState } from 'react'
import { fetchSubmissionMessages, postSubmissionMessage } from '../services/workflowService.js'
import { u } from '../lib/ui.js'

export default function SubmissionMessagesPanel({ submissionId, currentRole }) {
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    setError('')
    const payload = await fetchSubmissionMessages(submissionId)
    setMessages(Array.isArray(payload.messages) ? payload.messages : [])
  }

  useEffect(() => {
    load().catch((e) => setError(e?.message || 'Could not load messages'))
  }, [submissionId])

  const send = async () => {
    setError('')
    if (!text.trim()) return setError('Message is required')
    setIsSending(true)
    try {
      const payload = await postSubmissionMessage(submissionId, text.trim())
      setMessages(Array.isArray(payload.messages) ? payload.messages : [])
      setText('')
    } catch (e) {
      setError(e?.message || 'Could not send message')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <h2 className="text-lg font-semibold text-slate-900">Author messages</h2>
      <p className="mt-1 text-xs text-slate-500">
        Thread between author and editorial team.
      </p>

      {error ? <p className={`${u.alertErr} mt-3`}>{error}</p> : null}

      <div className="mt-3 max-h-64 space-y-2 overflow-auto pr-1">
        {messages.map((item, idx) => (
          <article key={`${item.createdAt || 'm'}-${idx}`} className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm">
            <p className="font-medium text-slate-900">
              {item.senderName}{' '}
              <span className="font-normal text-slate-500">({item.senderRole})</span>
            </p>
            <p className="mt-1 whitespace-pre-wrap text-slate-700">{item.message}</p>
            <p className="mt-1 text-xs text-slate-500">
              {item.createdAt ? new Date(item.createdAt).toLocaleString() : ''}
            </p>
          </article>
        ))}
        {!messages.length ? <p className="text-sm text-slate-500">No messages yet.</p> : null}
      </div>

      {currentRole === 'editor' ? (
        <div className="mt-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            placeholder="Reply to author"
            className={`${u.input} resize-y`}
          />
          <button
            type="button"
            onClick={send}
            disabled={isSending}
            className={`${u.btnPrimary} mt-2`}
          >
            {isSending ? 'Sending...' : 'Send message'}
          </button>
        </div>
      ) : null}
    </div>
  )
}

