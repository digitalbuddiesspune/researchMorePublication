import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ABOUT_GROUPS } from '../data/aboutPages.js'
import {
  ADMIN_APP_URL,
  EDITOR_APP_URL,
  REVIEWER_APP_URL,
  getPublicSettingsUrl,
} from '../config/api.js'
import { clearWebToken, fetchMe, getWebToken } from '../services/authService.js'

const SITE_NAME = 'researchMorePublication'
const NOTICE_REFRESH_MS = 15000

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false)
  const [platformNotice, setPlatformNotice] = useState('')
  const [currentUser, setCurrentUser] = useState(null)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const profileMenuRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const resolveSession = async () => {
      try {
        if (!getWebToken()) {
          setCurrentUser(null)
          return
        }
        const payload = await fetchMe()
        setCurrentUser(payload.user || null)
      } catch {
        clearWebToken()
        setCurrentUser(null)
      }
    }
    resolveSession()
  }, [location.pathname])

  useEffect(() => {
    setAboutOpen(false)
    setMobileMenuOpen(false)
    setMobileAboutOpen(false)
    setProfileMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!profileMenuOpen) return
    const closeOnClickOutside = (event) => {
      if (!profileMenuRef.current) return
      if (!profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', closeOnClickOutside)
    return () => document.removeEventListener('mousedown', closeOnClickOutside)
  }, [profileMenuOpen])

  useEffect(() => {
    let isMounted = true
    const loadNotice = async (signal) => {
      try {
        const response = await fetch(getPublicSettingsUrl(), { signal })
        if (!response.ok) return
        const payload = await response.json()
        if (isMounted) setPlatformNotice(payload.platformNotice || '')
      } catch {
        // Intentionally ignore on public header load.
      }
    }

    let controller = new AbortController()
    loadNotice(controller.signal)

    const intervalId = window.setInterval(() => {
      controller.abort()
      controller = new AbortController()
      loadNotice(controller.signal)
    }, NOTICE_REFRESH_MS)

    return () => {
      isMounted = false
      controller.abort()
      window.clearInterval(intervalId)
    }
  }, [])

  const onHero = location.pathname === '/' && !scrolled
  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
    setMobileAboutOpen(false)
  }

  const openRoleWorkspace = () => {
    if (!currentUser) {
      navigate('/login')
      return
    }
    if (currentUser.role === 'author') {
      navigate('/author/dashboard')
      return
    }
    if (currentUser.role === 'admin') {
      window.location.href = ADMIN_APP_URL
      return
    }
    if (currentUser.role === 'reviewer') {
      window.location.href = REVIEWER_APP_URL
      return
    }
    if (currentUser.role === 'editor') {
      window.location.href = EDITOR_APP_URL
    }
  }

  const logout = () => {
    clearWebToken()
    setCurrentUser(null)
    setProfileMenuOpen(false)
    navigate('/login', { replace: true })
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
  const submitTarget = currentUser?.role === 'author' ? '/author/dashboard' : '/login?next=/author/dashboard'

  return (
    <header className={`fixed inset-x-0 top-0 z-20 backdrop-blur-sm transition-colors duration-300 ${headerClasses}`}>
      {platformNotice ? (
        <div className="bg-amber-100 px-4 py-1 text-center text-xs font-medium text-amber-900 sm:text-sm">
          {platformNotice}
        </div>
      ) : null}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4 lg:px-0">
        <Link to="/" className="flex min-w-0 items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-xs font-bold uppercase tracking-tight text-white">
            RM
          </div>
          <span className="max-w-[150px] truncate text-sm font-semibold tracking-tight sm:max-w-none sm:text-lg">
            {SITE_NAME}
          </span>
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
          <Link to="/journals" className={navLinkClasses} onMouseEnter={() => setAboutOpen(false)}>
            All journals
          </Link>
          <Link to="/articles" className={navLinkClasses} onMouseEnter={() => setAboutOpen(false)}>
            All articles
          </Link>
          <Link
            to={submitTarget}
            className="rounded-full bg-emerald-500 px-4 py-1.5 text-sm font-semibold text-neutral-950 shadow-sm shadow-emerald-500/40 transition hover:bg-emerald-400"
          >
            Submit your research
          </Link>
        </nav>
        <div className="flex items-center gap-2 text-sm font-medium sm:gap-5">
          <button className={`hidden md:inline ${utilLinkClasses}`}>Search</button>
          {currentUser ? (
            <div ref={profileMenuRef} className="relative hidden items-center gap-2 sm:flex">
              <button
                type="button"
                onClick={() => setProfileMenuOpen((prev) => !prev)}
                className={`${utilLinkClasses} inline-flex h-10 w-10 items-center justify-center rounded-full border border-current/30 bg-neutral-900 text-xs font-bold uppercase text-white`}
                title={currentUser.name || 'Profile'}
              >
                {(currentUser.name || 'U').slice(0, 1)}
              </button>
              {profileMenuOpen ? (
                <div className="absolute right-0 top-12 z-50 w-72 overflow-hidden rounded-2xl border border-neutral-200 bg-white text-neutral-900 shadow-xl">
                  <div className="flex items-center gap-3 border-b border-neutral-200 p-4">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900 text-sm font-bold uppercase text-white">
                      {(currentUser.name || 'U').slice(0, 1)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-base font-semibold">{currentUser.name || 'User'}</p>
                      <p className="truncate text-sm text-neutral-500">{currentUser.email || ''}</p>
                    </div>
                  </div>
                  <div className="p-2 text-sm">
                    <button
                      type="button"
                      onClick={() => {
                        setProfileMenuOpen(false)
                        navigate('/my-profile')
                      }}
                      className="block w-full rounded-md px-3 py-2 text-left hover:bg-neutral-100"
                    >
                      My profile
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setProfileMenuOpen(false)
                        navigate('/my-workspace')
                      }}
                      className="block w-full rounded-md px-3 py-2 text-left hover:bg-neutral-100"
                    >
                      My workspace
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setProfileMenuOpen(false)
                        navigate('/settings-privacy')
                      }}
                      className="block w-full rounded-md px-3 py-2 text-left hover:bg-neutral-100"
                    >
                      Settings & Privacy
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setProfileMenuOpen(false)
                        navigate('/help-center')
                      }}
                      className="block w-full rounded-md px-3 py-2 text-left hover:bg-neutral-100"
                    >
                      Help center
                    </button>
                    <button
                      type="button"
                      onClick={logout}
                      className="mt-1 block w-full rounded-md px-3 py-2 text-left text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <Link to="/login" className={`hidden sm:inline ${utilLinkClasses}`}>
              Login
            </Link>
          )}
          <button
            type="button"
            className={`${utilLinkClasses} inline-flex h-8 items-center justify-center gap-2 rounded-md border border-current/25 px-2.5 text-xs sm:h-9 sm:px-3 sm:text-sm md:hidden`}
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-menu"
          >
            <span className="font-semibold uppercase tracking-[0.12em]">Menu</span>
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
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-0">
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
          mobileMenuOpen ? 'max-h-[calc(100vh-56px)] opacity-100 sm:max-h-[calc(100vh-64px)]' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="mx-auto max-w-7xl space-y-2 overflow-y-auto px-4 py-4 sm:px-5 lg:px-0">
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
              mobileAboutOpen ? 'max-h-[70vh] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="space-y-4 overflow-y-auto px-2 pb-2 pt-2">
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
          <Link
            to="/journals"
            onClick={closeMobileMenu}
            className="w-full rounded-md px-2 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-100"
          >
            All journals
          </Link>
          <Link
            to="/articles"
            onClick={closeMobileMenu}
            className="w-full rounded-md px-2 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-100"
          >
            All articles
          </Link>
          {currentUser ? (
            <>
              <button
                type="button"
                onClick={() => {
                  closeMobileMenu()
                  openRoleWorkspace()
                }}
                className="block w-full rounded-md px-2 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-100"
              >
                My workspace
              </button>
              <button
                type="button"
                onClick={() => {
                  closeMobileMenu()
                  logout()
                }}
                className="block w-full rounded-md px-2 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-100"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={closeMobileMenu}
              className="block w-full rounded-md px-2 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-100"
            >
              Login
            </Link>
          )}
          <Link
            to={submitTarget}
            onClick={closeMobileMenu}
            className="mt-2 block w-full rounded-full bg-emerald-500 px-4 py-2 text-center text-sm font-semibold text-neutral-950 shadow-sm shadow-emerald-500/40 transition hover:bg-emerald-400"
          >
            Submit your research
          </Link>
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

