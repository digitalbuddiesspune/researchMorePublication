import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getJournalsUrl } from '../config/api.js'
import SiteFooter from '../sections/SiteFooter.jsx'

export default function AllJournals() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [journals, setJournals] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 })
  const [searchInput, setSearchInput] = useState(searchParams.get('q') || '')
  const searchTerm = searchParams.get('q') || ''
  const subject = searchParams.get('subject') || ''
  const sort = searchParams.get('sort') || 'name:asc'
  const page = Number.parseInt(searchParams.get('page') || '1', 10) || 1

  const updateParams = (updates) => {
    const next = new URLSearchParams(searchParams)
    Object.entries(updates).forEach(([key, value]) => {
      if (value === '' || value === null || value === undefined) {
        next.delete(key)
      } else {
        next.set(key, String(value))
      }
    })
    setSearchParams(next)
  }

  useEffect(() => {
    setSearchInput(searchTerm)
  }, [searchTerm])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== searchTerm) {
        updateParams({ q: searchInput, page: 1 })
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [searchInput, searchTerm])

  useEffect(() => {
    const controller = new AbortController()
    const params = new URLSearchParams()
    if (searchTerm.trim()) params.set('search', searchTerm.trim())
    if (subject) params.set('subject', subject)
    if (sort) params.set('sort', sort)
    params.set('page', String(page))
    params.set('limit', '9')

    const loadJournals = async () => {
      setIsLoading(true)
      setError('')
      try {
        const response = await fetch(getJournalsUrl(params.toString()), { signal: controller.signal })
        if (!response.ok) throw new Error('Failed to load journals')
        const payload = await response.json()
        setJournals(Array.isArray(payload.items) ? payload.items : [])
        setMeta({
          page: payload.meta?.page || 1,
          totalPages: payload.meta?.totalPages || 1,
        })
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          setError('Could not load journals right now.')
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadJournals()
    return () => controller.abort()
  }, [searchTerm, subject, sort, page])

  const subjects = useMemo(() => {
    const values = journals.map((journal) => journal.subject).filter(Boolean)
    return [...new Set(values)].sort((a, b) => a.localeCompare(b))
  }, [journals])

  return (
    <>
      <section className="bg-neutral-50 pt-24">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-0">
          <h1 className="text-3xl font-semibold text-neutral-900">All journals</h1>
          <p className="mt-2 text-sm text-neutral-600">
            Discover journals across disciplines and explore the latest published work.
          </p>

          <div className="mt-6 grid gap-4 rounded-xl bg-white p-4 shadow-sm shadow-neutral-200 md:grid-cols-[1fr_220px_220px]">
            <input
              type="text"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search journals by name..."
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none ring-emerald-500/40 transition focus:ring-2"
            />
            <select
              value={subject}
              onChange={(event) => updateParams({ subject: event.target.value, page: 1 })}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none ring-emerald-500/40 transition focus:ring-2"
            >
              <option value="">All subjects</option>
              {subjects.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(event) => updateParams({ sort: event.target.value, page: 1 })}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none ring-emerald-500/40 transition focus:ring-2"
            >
              <option value="name:asc">Name (A-Z)</option>
              <option value="name:desc">Name (Z-A)</option>
              <option value="articleCount:desc">Most published</option>
            </select>
          </div>

          {isLoading ? <p className="mt-6 text-sm text-neutral-600">Loading journals...</p> : null}
          {error ? <p className="mt-6 text-sm text-red-600">{error}</p> : null}

          {!isLoading && !error && journals.length === 0 ? (
            <p className="mt-6 text-sm text-neutral-600">No journals found.</p>
          ) : null}

          {!isLoading && !error && journals.length > 0 ? (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {journals.map((journal) => (
                <article key={journal.id} className="rounded-xl bg-white p-5 shadow-sm shadow-neutral-200">
                  <p className="text-xs uppercase tracking-[0.14em] text-emerald-600">
                    {journal.subject || 'General'}
                  </p>
                  <h2 className="mt-2 text-lg font-semibold text-neutral-900">{journal.name}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-700">{journal.description}</p>
                  <p className="mt-3 text-xs text-neutral-500">
                    {journal.articleCount} published item{journal.articleCount === 1 ? '' : 's'}
                  </p>
                  <Link
                    to={`/journals/${journal.id}`}
                    className="mt-4 inline-block text-sm font-semibold text-emerald-700 hover:text-emerald-600"
                  >
                    View journal
                  </Link>
                </article>
              ))}
            </div>
          ) : null}
          {!isLoading && !error && journals.length > 0 ? (
            <div className="mt-8 flex items-center justify-between">
              <button
                type="button"
                disabled={meta.page <= 1}
                onClick={() => updateParams({ page: meta.page - 1 })}
                className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <p className="text-sm text-neutral-600">
                Page {meta.page} of {meta.totalPages}
              </p>
              <button
                type="button"
                disabled={meta.page >= meta.totalPages}
                onClick={() => updateParams({ page: meta.page + 1 })}
                className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          ) : null}
        </div>
      </section>
      <SiteFooter />
    </>
  )
}
