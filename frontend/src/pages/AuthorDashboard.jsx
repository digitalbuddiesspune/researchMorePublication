import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { authFetch, clearWebToken, fetchMe } from '../services/authService.js'

export default function AuthorDashboard() {
  const [user, setUser] = useState(null)
  const [submissions, setSubmissions] = useState([])
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  const loadSubmissions = async () => {
    const response = await authFetch('/submissions/my')
    if (!response.ok) throw new Error('Could not load submissions')
    setSubmissions(await response.json())
  }

  useEffect(() => {
    const init = async () => {
      try {
        const payload = await fetchMe()
        if (payload.user?.role !== 'author') throw new Error('Only author account is allowed here')
        setUser(payload.user)
        await loadSubmissions()
      } catch {
        clearWebToken()
        navigate('/login?next=/author/dashboard', { replace: true })
      } finally {
        setIsLoading(false)
      }
    }
    init()
  }, [navigate])

  const stats = useMemo(() => {
    const accepted = submissions.filter((item) => item.status === 'accepted').length
    const rejected = submissions.filter((item) => item.status === 'rejected').length
    const submitted = submissions.filter((item) => item.status === 'submitted').length
    const underReview = submissions.filter((item) => item.status === 'under-review').length
    const revision = submissions.filter((item) => item.status === 'revision-requested').length
    return { accepted, rejected, submitted, underReview, revision }
  }, [submissions])

  const logout = () => {
    clearWebToken()
    navigate('/login', { replace: true })
  }

  if (isLoading) {
    return <section className="mx-auto max-w-6xl px-6 pb-12 pt-28 text-sm text-neutral-600">Loading author dashboard...</section>
  }

  return (
    <section className="space-y-4">
      <div className="rounded-xl border border-neutral-200 bg-white p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="text-xl font-semibold text-neutral-900">Author dashboard</h1>
            <p className="text-sm text-neutral-600">{user ? `${user.name} (${user.role})` : ''}</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() =>
                loadSubmissions()
                  .then(() => setNotice('Submissions refreshed.'))
                  .catch((e) => setError(e.message))
              }
              className="rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm"
            >
              Refresh
            </button>
            <button type="button" onClick={logout} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
              Logout
            </button>
          </div>
        </div>

        {error ? <p className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
        {notice ? <p className="mb-3 rounded-md bg-blue-50 px-3 py-2 text-sm text-blue-700">{notice}</p> : null}

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4"><p className="text-xs text-neutral-500">Total</p><p className="text-2xl font-semibold">{submissions.length}</p></div>
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4"><p className="text-xs text-neutral-500">Submitted</p><p className="text-2xl font-semibold">{stats.submitted}</p></div>
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4"><p className="text-xs text-neutral-500">Under review</p><p className="text-2xl font-semibold">{stats.underReview}</p></div>
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4"><p className="text-xs text-neutral-500">Revision</p><p className="text-2xl font-semibold">{stats.revision}</p></div>
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4"><p className="text-xs text-neutral-500">Accepted / Rejected</p><p className="text-2xl font-semibold">{stats.accepted}/{stats.rejected}</p></div>
        </div>

        <div className="mt-4 flex gap-2">
          <Link to="/author/submit" className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-neutral-900">
            Create New Submission
          </Link>
          <Link to="/author/submissions" className="rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm">
            View My Submissions
          </Link>
        </div>
      </div>
    </section>
  )
}
