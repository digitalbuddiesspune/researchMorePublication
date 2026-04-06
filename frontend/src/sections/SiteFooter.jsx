import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPublicSettingsUrl } from '../config/api.js'

const NOTICE_REFRESH_MS = 15000

export default function SiteFooter() {
  const [platformNotice, setPlatformNotice] = useState('')

  useEffect(() => {
    let isMounted = true
    const loadNotice = async (signal) => {
      try {
        const response = await fetch(getPublicSettingsUrl(), { signal })
        if (!response.ok) return
        const payload = await response.json()
        if (isMounted) setPlatformNotice(payload.platformNotice || '')
      } catch {
        // Ignore footer notice load failure.
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

  return (
    <footer className="bg-neutral-100 text-neutral-800">
      <div className="mx-auto max-w-7xl px-6 py-12 text-sm lg:px-0">
        {platformNotice ? (
          <div className="mb-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {platformNotice}
          </div>
        ) : null}
        <div className="grid gap-8 border-b border-neutral-300 pb-10 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
              Get to know us
            </h3>
            <ul className="mt-3 space-y-1">
              <li>About researchMorePublication</li>
              <li>Our editorial boards</li>
              <li>Partnerships</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
              Explore
            </h3>
            <ul className="mt-3 space-y-1">
              <li>All journals</li>
              <li>All articles</li>
              <li>Research topics</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
              Support
            </h3>
            <ul className="mt-3 space-y-1">
              <li>Help center</li>
              <li>Publishing policies</li>
              <li>Contact support</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
              Connect
            </h3>
            <ul className="mt-3 space-y-1">
              <li>Twitter</li>
              <li>LinkedIn</li>
              <li>YouTube</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-4 pt-6 text-xs text-neutral-500 sm:flex-row">
          <p>© {new Date().getFullYear()} researchMorePublication. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <Link className="hover:text-neutral-700" to="/privacy-policy">
              Privacy policy
            </Link>
            <Link className="hover:text-neutral-700" to="/terms-and-conditions">
              Terms &amp; conditions
            </Link>
            <Link className="hover:text-neutral-700" to="/cookies">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

