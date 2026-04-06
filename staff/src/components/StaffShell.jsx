import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const navClass = ({ isActive }) =>
  `block rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100'
  }`

export default function StaffShell() {
  const { user, logout } = useAuth()

  const editorItems = [
    { to: '/staff/dashboard', label: 'Dashboard' },
    { to: '/staff/submissions', label: 'Submissions' },
    { to: '/staff/decisions', label: 'Decision Queue' },
    { to: '/staff/messages', label: 'Messages' },
  ]
  const reviewerItems = [
    { to: '/staff/dashboard', label: 'Dashboard' },
    { to: '/staff/assignments', label: 'Assignments' },
  ]
  const items = user?.role === 'editor' ? editorItems : reviewerItems

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-200 antialiased">
      <div className="mx-auto grid min-h-screen w-full max-w-[1300px] grid-cols-1 gap-4 px-4 py-5 md:grid-cols-[240px_1fr]">
        <aside className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <h2 className="px-2 text-sm font-semibold text-slate-900">Staff Panel</h2>
          <p className="px-2 pt-1 text-xs text-slate-500">Role: {user?.role || '-'}</p>
          <nav className="mt-3 space-y-1">
            {items.map((item) => (
              <NavLink key={item.to} to={item.to} className={navClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <div className="min-w-0">
          <header className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <div>
              <h1 className="text-lg font-semibold text-slate-900">Execution Workspace</h1>
              <p className="text-xs text-slate-500">Editor and reviewer operations</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                {user?.name || user?.email || 'Staff'}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                {user?.role}
              </span>
              <button
                type="button"
                onClick={logout}
                className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Logout
              </button>
            </div>
          </header>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

