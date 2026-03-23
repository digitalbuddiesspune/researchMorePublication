import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ABOUT_GROUPS } from '../data/aboutPages.js'

const SITE_NAME = 'researchMorePublication'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setAboutOpen(false)
    setMobileMenuOpen(false)
    setMobileAboutOpen(false)
  }, [location.pathname])

  const onHero = location.pathname === '/' && !scrolled
  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
    setMobileAboutOpen(false)
  }

  const headerClasses = onHero
    ? 'border-b border-transparent bg-transparent text-white'
    : 'border-b border-neutral-200 bg-white/90 text-neutral-900'

  const navLinkClasses = onHero
    ? 'transition-colors hover:text-white text-white/80'
    : 'transition-colors hover:text-neutral-900 text-neutral-700'

  const utilLinkClasses = onHero
    ? 'transition-colors hover:text-white text-white/80'
    : 'transition-colors hover:text-neutral-900 text-neutral-700'

  return (
    <header className={`fixed inset-x-0 top-0 z-20 transition-colors duration-300 ${headerClasses}`}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-0">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-xs font-bold uppercase tracking-tight text-white">
            RM
          </div>
          <span className="text-lg font-semibold tracking-tight">{SITE_NAME}</span>
        </Link>
        <nav
          className="hidden items-center gap-8 text-sm font-medium md:flex"
          onMouseLeave={() => setAboutOpen(false)}
        >
          <button
            className={navLinkClasses}
            onMouseEnter={() => setAboutOpen(true)}
            onClick={() => setAboutOpen((open) => !open)}
            type="button"
            aria-expanded={aboutOpen}
            aria-controls="about-us-menu"
          >
            About us
          </button>
          <button className={navLinkClasses} onMouseEnter={() => setAboutOpen(false)}>
            All journals
          </button>
          <button className={navLinkClasses} onMouseEnter={() => setAboutOpen(false)}>
            All articles
          </button>
          <button className="rounded-full bg-emerald-500 px-4 py-1.5 text-sm font-semibold text-neutral-950 shadow-sm shadow-emerald-500/40 transition hover:bg-emerald-400">
            Submit your research
          </button>
        </nav>
        <div className="flex items-center gap-6 text-sm font-medium">
          <button className={`hidden sm:inline ${utilLinkClasses}`}>Search</button>
          <Link to="/login" className={utilLinkClasses}>
            Login
          </Link>
          <button
            type="button"
            className={`${utilLinkClasses} inline-flex h-9 items-center justify-center gap-2 rounded-md border border-current/25 px-3 md:hidden`}
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-menu"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.12em]">Menu</span>
            <span className="text-lg leading-none">{mobileMenuOpen ? 'x' : '⋮'}</span>
          </button>
        </div>
      </div>

      <div
        id="about-us-menu"
        className={`overflow-hidden border-t border-neutral-200 bg-white text-neutral-800 shadow-md transition-all duration-300 ${
          aboutOpen ? 'max-h-[430px] opacity-100' : 'max-h-0 opacity-0'
        }`}
        onMouseEnter={() => setAboutOpen(true)}
        onMouseLeave={() => setAboutOpen(false)}
      >
        <div className="mx-auto max-w-6xl px-6 py-8 lg:px-0">
          <div className="grid gap-8 md:grid-cols-5">
            {ABOUT_GROUPS.map((group) => (
              <div key={group.title} className="space-y-3">
                <h3 className="border-b border-neutral-300 pb-2 text-sm font-semibold text-neutral-900">
                  {group.title}
                </h3>
                <ul className="space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link.slug}>
                      <Link
                        to={`/about/${link.slug}`}
                        className="text-left text-sm text-neutral-600 transition-colors hover:text-neutral-900"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        id="mobile-nav-menu"
        className={`overflow-hidden border-t border-neutral-200 bg-white text-neutral-800 shadow-lg transition-all duration-300 md:hidden ${
          mobileMenuOpen ? 'max-h-[85vh] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="mx-auto max-w-6xl space-y-2 px-5 py-4 lg:px-0">
          <button
            type="button"
            className="flex w-full items-center justify-between rounded-md bg-neutral-100 px-3 py-2 text-left text-sm font-semibold text-neutral-900"
            onClick={() => setMobileAboutOpen((open) => !open)}
          >
            <span>About us</span>
            <span
              className={`text-xs transition-transform duration-200 ${
                mobileAboutOpen ? 'rotate-90' : ''
              }`}
            >
              {'>'}
            </span>
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ${
              mobileAboutOpen ? 'max-h-[640px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="space-y-4 px-2 pb-2 pt-2">
            {ABOUT_GROUPS.map((group) => (
              <div key={group.title} className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
                  {group.title}
                </p>
                <ul className="space-y-1.5">
                  {group.links.map((link) => (
                    <li key={link.slug}>
                      <Link
                        to={`/about/${link.slug}`}
                        onClick={closeMobileMenu}
                        className={`block rounded px-2 py-1 text-sm transition-colors ${
                          location.pathname === `/about/${link.slug}`
                            ? 'bg-emerald-50 font-semibold text-emerald-800'
                            : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900'
                        }`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setMobileAboutOpen(false)
            }}
            className="w-full rounded-md px-2 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-100"
          >
            All journals
          </button>
          <button
            type="button"
            onClick={() => {
              setMobileAboutOpen(false)
            }}
            className="w-full rounded-md px-2 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-100"
          >
            All articles
          </button>
          <button className="mt-2 w-full rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-neutral-950 shadow-sm shadow-emerald-500/40 transition hover:bg-emerald-400">
            Submit your research
          </button>
        </div>
      </div>

      {mobileMenuOpen ? (
        <button
          type="button"
          aria-label="Close mobile navigation"
          className="fixed inset-0 -z-10 bg-black/10 md:hidden"
          onClick={closeMobileMenu}
        />
      ) : null}
    </header>
  )
}

