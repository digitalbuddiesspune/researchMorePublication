import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const SITE_NAME = 'researchMorePublication'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const onHero = location.pathname === '/' && !scrolled

  const headerClasses = onHero
    ? 'border-b border-transparent bg-transparent text-white'
    : 'border-b border-neutral-200 bg-white/90 text-neutral-900'

  const navLinkClasses = scrolled
    ? 'transition-colors hover:text-neutral-900 text-neutral-700'
    : 'transition-colors hover:text-white text-white/80'

  const utilLinkClasses = scrolled
    ? 'transition-colors hover:text-neutral-900 text-neutral-700'
    : 'transition-colors hover:text-white text-white/80'

  return (
    <header
      className={`fixed inset-x-0 top-0 z-20 backdrop-blur-sm transition-colors duration-300 ${headerClasses}`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-0">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-xs font-bold uppercase tracking-tight text-white">
            RM
          </div>
          <span className="text-lg font-semibold tracking-tight">{SITE_NAME}</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          <button className={navLinkClasses}>About us</button>
          <button className={navLinkClasses}>All journals</button>
          <button className={navLinkClasses}>All articles</button>
          <button className="rounded-full bg-emerald-500 px-4 py-1.5 text-sm font-semibold text-neutral-950 shadow-sm shadow-emerald-500/40 transition hover:bg-emerald-400">
            Submit your research
          </button>
        </nav>
        <div className="flex items-center gap-6 text-sm font-medium">
          <button className={`hidden sm:inline ${utilLinkClasses}`}>Search</button>
          <Link to="/login" className={utilLinkClasses}>
            Login
          </Link>
        </div>
      </div>
    </header>
  )
}

