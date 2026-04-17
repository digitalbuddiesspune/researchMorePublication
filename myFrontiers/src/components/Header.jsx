import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Overview', end: true },
  { to: '/my-projects', label: 'My projects' },
  { to: '/resources', label: 'Resources' },
  { to: '/certificates', label: 'Certificates' },
  { to: '/inbox', label: 'Inbox' },
]

const getNavClasses = ({ isActive }) =>
  `border-b-2 px-1 py-4 text-sm transition ${
    isActive
      ? 'border-blue-700 text-blue-700'
      : 'border-transparent text-neutral-600 hover:text-neutral-900'
  }`

export default function Header({ onSubmitResearchClick }) {
  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-5">
          <NavLink to="/" className="py-4 text-base font-semibold text-neutral-800">
            frontiers
          </NavLink>
          <span className="hidden h-6 w-px bg-neutral-200 sm:block" />
          <span className="hidden text-sm text-neutral-600 sm:block">My Frontiers</span>
          <nav className="flex items-center gap-4 md:gap-6">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={getNavClasses}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <button
          type="button"
          onClick={onSubmitResearchClick}
          className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-800 transition hover:bg-neutral-100"
        >
          Submit your research
        </button>
      </div>
    </header>
  )
}
