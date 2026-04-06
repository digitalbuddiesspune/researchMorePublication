import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getJournalUrl } from '../config/api.js'
import SiteFooter from '../sections/SiteFooter.jsx'

export default function JournalDetail() {
  const { id } = useParams()
  const [journal, setJournal] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadJournal = async () => {
      setIsLoading(true)
      setError('')
      try {
        const response = await fetch(getJournalUrl(id))
        if (!response.ok) throw new Error('Failed to load journal')
        setJournal(await response.json())
      } catch (_error) {
        setError('Could not load this journal right now.')
      } finally {
        setIsLoading(false)
      }
    }
    loadJournal()
  }, [id])

  return (
    <>
      <section className="bg-neutral-50 pt-24">
        <div className="mx-auto max-w-5xl px-6 py-12 lg:px-0">
          <Link to="/journals" className="text-sm font-semibold text-emerald-700 hover:text-emerald-600">
            ← Back to all journals
          </Link>
          {isLoading ? <p className="mt-6 text-sm text-neutral-600">Loading journal details...</p> : null}
          {error ? <p className="mt-6 text-sm text-red-600">{error}</p> : null}

          {!isLoading && !error && journal ? (
            <div className="mt-6 space-y-5 rounded-xl bg-white p-6 shadow-sm shadow-neutral-200">
              <p className="text-xs uppercase tracking-[0.14em] text-emerald-600">{journal.subject}</p>
              <h1 className="text-3xl font-semibold text-neutral-900">{journal.name}</h1>
              <p className="text-sm leading-relaxed text-neutral-700">{journal.description}</p>
              <p className="text-sm text-neutral-600">
                {journal.articleCount} article{journal.articleCount === 1 ? '' : 's'} available
              </p>

              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-neutral-900">Latest articles</h2>
                {journal.latestArticles?.map((article) => (
                  <article key={article.id} className="rounded-lg border border-neutral-200 p-4">
                    <h3 className="text-base font-semibold text-neutral-900">{article.title}</h3>
                    <p className="mt-1 text-sm text-neutral-700">By {article.author}</p>
                    <p className="mt-2 text-sm text-neutral-700">{article.abstract}</p>
                    <Link
                      to={`/articles/${article.id}`}
                      className="mt-3 inline-block text-sm font-semibold text-emerald-700 hover:text-emerald-600"
                    >
                      Read article
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>
      <SiteFooter />
    </>
  )
}
