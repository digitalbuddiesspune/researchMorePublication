import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getArticlesUrl } from '../config/api.js'
import SiteFooter from '../sections/SiteFooter.jsx'

export default function AllArticles() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [articles, setArticles] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 })
  const [searchInput, setSearchInput] = useState(searchParams.get('q') || '')
  const searchTerm = searchParams.get('q') || ''
  const journal = searchParams.get('journal') || ''
  const sort = searchParams.get('sort') || 'publishedAt:desc'
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
    if (journal) params.set('journal', journal)
    if (sort) params.set('sort', sort)
    params.set('page', String(page))
    params.set('limit', '10')

    const loadArticles = async () => {
      setIsLoading(true)
      setError('')
      try {
        const response = await fetch(getArticlesUrl(params.toString()), { signal: controller.signal })
        if (!response.ok) throw new Error('Failed to load articles')
        const payload = await response.json()
        setArticles(Array.isArray(payload.items) ? payload.items : [])
        setMeta({
          page: payload.meta?.page || 1,
          totalPages: payload.meta?.totalPages || 1,
        })
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          setError('Could not load articles right now.')
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadArticles()
    return () => controller.abort()
  }, [searchTerm, journal, sort, page])

  return (
    <>
      <section className="bg-neutral-50 pt-24">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-0">
          <h1 className="text-3xl font-semibold text-neutral-900">All articles</h1>
          <p className="mt-2 text-sm text-neutral-600">
            Browse published research and discover insights across journals.
          </p>

          <div className="mt-6 grid gap-4 rounded-xl bg-white p-4 shadow-sm shadow-neutral-200 md:grid-cols-[1fr_220px_220px]">
            <input
              type="text"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search articles by title or author..."
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none ring-emerald-500/40 transition focus:ring-2"
            />
            <input
              type="text"
              value={journal}
              onChange={(event) => updateParams({ journal: event.target.value, page: 1 })}
              placeholder="Filter by journal..."
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none ring-emerald-500/40 transition focus:ring-2"
            />
            <select
              value={sort}
              onChange={(event) => updateParams({ sort: event.target.value, page: 1 })}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none ring-emerald-500/40 transition focus:ring-2"
            >
              <option value="publishedAt:desc">Newest first</option>
              <option value="publishedAt:asc">Oldest first</option>
              <option value="title:asc">Title (A-Z)</option>
              <option value="title:desc">Title (Z-A)</option>
            </select>
          </div>

          {isLoading ? <p className="mt-6 text-sm text-neutral-600">Loading articles...</p> : null}
          {error ? <p className="mt-6 text-sm text-red-600">{error}</p> : null}

          {!isLoading && !error && articles.length === 0 ? (
            <p className="mt-6 text-sm text-neutral-600">No articles found.</p>
          ) : null}

          {!isLoading && !error && articles.length > 0 ? (
            <div className="mt-6 space-y-4">
              {articles.map((article) => (
                <article key={article.id} className="rounded-xl bg-white p-5 shadow-sm shadow-neutral-200">
                  <p className="text-xs uppercase tracking-[0.14em] text-emerald-600">
                    {article.journal || 'Journal'}
                  </p>
                  <h2 className="mt-2 text-lg font-semibold text-neutral-900">{article.title}</h2>
                  <p className="mt-2 text-sm text-neutral-700">By {article.author || 'Unknown author'}</p>
                  <p className="mt-3 text-sm leading-relaxed text-neutral-700">{article.abstract}</p>
                  <Link
                    to={`/articles/${article.id}`}
                    className="mt-4 inline-block text-sm font-semibold text-emerald-700 hover:text-emerald-600"
                  >
                    View article
                  </Link>
                </article>
              ))}
            </div>
          ) : null}
          {!isLoading && !error && articles.length > 0 ? (
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
