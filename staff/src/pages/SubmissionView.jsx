import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import {
  fetchEditorSubmissionById,
  fetchReviewerSubmissionById,
} from '../services/workflowService.js'
import { u } from '../lib/ui.js'
import ArticlePreview from '../components/ArticlePreview.jsx'
import ReviewComments from '../components/ReviewComments.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import SubmissionMessagesPanel from '../components/SubmissionMessagesPanel.jsx'

export default function SubmissionView() {
  const { id } = useParams()
  const { user } = useAuth()

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const [editorSubmission, setEditorSubmission] = useState(null)
  const [reviewerSubmission, setReviewerSubmission] = useState(null)

  const backHref = useMemo(() => {
    if (!user) return '/staff/dashboard'
    return user.role === 'editor' ? '/staff/submissions' : '/staff/assignments'
  }, [user])

  useEffect(() => {
    let isMounted = true
    const run = async () => {
      try {
        setError('')
        setLoading(true)
        if (user.role === 'editor') {
          const found = await fetchEditorSubmissionById(id)
          if (!isMounted) return
          setEditorSubmission(found)
        } else {
          const found = await fetchReviewerSubmissionById(id)
          if (!isMounted) return
          setReviewerSubmission(found)
        }
      } catch (e) {
        if (!isMounted) return
        setError(e?.message || 'Could not load submission.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    run()
    return () => {
      isMounted = false
    }
  }, [id, user?.role])

  if (loading) return <div className="space-y-4">Loading...</div>
  if (error) return <div className="space-y-4">Error: {error}</div>

  if (user.role === 'editor') {
    if (!editorSubmission) {
      return (
        <div className="space-y-4">
          <div className={u.card}>
            <p className="text-sm text-slate-600">Submission not found.</p>
            <div className="mt-3">
              <Link to={backHref} className="text-blue-700 hover:text-blue-800">
                ← Back
              </Link>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        <div className={u.card}>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">{editorSubmission.title}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="text-sm text-slate-600">Author: {editorSubmission.authorName || '-'}</span>
                <StatusBadge status={editorSubmission.status} />
              </div>
            </div>
            <div>
              <Link to={backHref} className="text-blue-700 hover:text-blue-800">
                ← Back
              </Link>
            </div>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1.05fr]">
            <ArticlePreview
              journal={editorSubmission.journal}
              articleType={editorSubmission.articleType}
              abstract={editorSubmission.abstract}
            />
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <h2 className="text-lg font-semibold text-slate-900">Review comments</h2>
              <ReviewComments reviews={editorSubmission.reviews || []} />
              <div className="mt-4">
                <Link to={`/staff/decision/${editorSubmission.id}`} className="text-blue-700 hover:text-blue-800">
                  Go to decision →
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <SubmissionMessagesPanel submissionId={editorSubmission.id} currentRole="editor" />
          </div>
        </div>
      </div>
    )
  }

  // reviewer view
  if (!reviewerSubmission) {
    return (
      <div className="space-y-4">
        <div className={u.card}>
          <p className="text-sm text-slate-600">No reviewer submission view found.</p>
          <div className="mt-3">
            <Link to={backHref} className="text-blue-700 hover:text-blue-800">
              ← Back
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className={u.card}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">{reviewerSubmission.title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="text-sm text-slate-600">Reviewer safe view</span>
              <StatusBadge status={reviewerSubmission.status} />
            </div>
          </div>
          <div>
            <Link to={backHref} className="text-blue-700 hover:text-blue-800">
              ← Back
            </Link>
          </div>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1.05fr]">
          <ArticlePreview
            journal={reviewerSubmission.journal}
            articleType="Submission"
            abstract={reviewerSubmission.abstract}
          />
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h2 className="text-lg font-semibold text-slate-900">Authors and files</h2>
            <p className="mt-2 text-sm text-slate-700">
              Authors: {(reviewerSubmission.authors || []).map((a) => a.name).join(', ') || '-'}
            </p>
            <div className="mt-2 space-y-1 text-sm text-slate-700">
              {(reviewerSubmission.files || []).map((f, idx) => (
                <a key={`${f.url}-${idx}`} href={f.url} target="_blank" rel="noreferrer" className="block text-blue-700 hover:text-blue-800">
                  {f.name} ({f.type})
                </a>
              ))}
              {!reviewerSubmission.files?.length ? <p>No files attached.</p> : null}
            </div>
            <div className="mt-4">
              <Link to="/staff/assignments" className="text-blue-700 hover:text-blue-800">
                Open assignments →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

