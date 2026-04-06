import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authFetch, clearWebToken, fetchMe } from '../services/authService.js'

export default function AuthorSubmissions() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [error, setError] = useState('')

  const load = async () => {
    const response = await authFetch('/submissions/my')
    if (!response.ok) throw new Error('Could not load submissions')
    setItems(await response.json())
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
  }, [navigate])

  return (
    <section className="rounded-xl border border-neutral-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-neutral-900">My submissions</h1>
        <Link to="/author/submit" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
          Create New Submission
        </Link>
      </div>
      {error ? <p className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

      <div className="overflow-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-200 text-neutral-600">
              <th className="px-2 py-2">Title</th>
              <th className="px-2 py-2">Status</th>
              <th className="px-2 py-2">Last Update</th>
              <th className="px-2 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-neutral-100">
                <td className="px-2 py-2">{item.title}</td>
                <td className="px-2 py-2">{item.status}</td>
                <td className="px-2 py-2">{new Date(item.updatedAt).toLocaleString()}</td>
                <td className="px-2 py-2">
                  <Link to={`/author/submissions/${item.id}`} className="text-blue-600 hover:text-blue-700">
                    View details
                  </Link>
                </td>
              </tr>
            ))}
            {!items.length ? (
              <tr>
                <td className="px-2 py-3 text-neutral-500" colSpan={4}>
                  No submissions found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  )
}

