import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { clearWebToken, fetchMe } from '../services/authService.js'

const linkClass = ({ isActive }) =>
  `block rounded-md px-3 py-2 text-sm font-medium ${
    isActive ? 'bg-blue-600 text-white' : 'text-neutral-700 hover:bg-neutral-100'
  }`

export default function AuthorLayout() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const init = async () => {
      try {
        const payload = await fetchMe()
        if (payload.user?.role !== 'author') throw new Error('Forbidden')
        setUser(payload.user)
      } catch {
        clearWebToken()
        navigate('/login?next=/author/dashboard', { replace: true })
      }
    }
    init()
  }, [navigate])

  return (
    <section className="bg-neutral-50 pt-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-6 pb-10 lg:grid-cols-[230px_1fr] lg:px-0">
        <aside className="rounded-xl border border-neutral-200 bg-white p-3">
          <h2 className="mb-2 px-3 text-sm font-semibold text-neutral-900">Author panel</h2>
          <p className="mb-3 px-3 text-xs text-neutral-500">{user ? user.name : 'Loading...'}</p>
          <nav className="space-y-1">
            <NavLink to="/author/dashboard" className={linkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/author/submit" className={linkClass}>
              New Submission
            </NavLink>
            <NavLink to="/author/submissions" className={linkClass}>
              My Submissions
            </NavLink>
            <NavLink to="/author/messages" className={linkClass}>
              Messages
            </NavLink>
            <NavLink to="/my-profile" className={linkClass}>
              Profile
            </NavLink>
            <NavLink to="/settings-privacy" className={linkClass}>
              Settings
            </NavLink>
          </nav>
        </aside>

        <main>
          <Outlet />
        </main>
      </div>
    </section>
  )
}

