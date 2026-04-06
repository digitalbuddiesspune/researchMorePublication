import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getArticleUrl } from '../config/api.js'
import SiteFooter from '../sections/SiteFooter.jsx'

export default function ArticleDetail() {
  const { id } = useParams()
  const [article, setArticle] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadArticle = async () => {
      setIsLoading(true)
      setError('')
      try {
        const response = await fetch(getArticleUrl(id))
        if (!response.ok) throw new Error('Failed to load article')
        setArticle(await response.json())
      } catch (_error) {
        setError('Could not load this article right now.')
      } finally {
        setIsLoading(false)
      }
    }
    loadArticle()
  }, [id])

  return (
    <>
      <section className="bg-neutral-50 pt-24">
        <div className="mx-auto max-w-4xl px-6 py-12 lg:px-0">
          <Link to="/articles" className="text-sm font-semibold text-emerald-700 hover:text-emerald-600">
            ← Back to all articles
          </Link>
          {isLoading ? <p className="mt-6 text-sm text-neutral-600">Loading article details...</p> : null}
          {error ? <p className="mt-6 text-sm text-red-600">{error}</p> : null}

          {!isLoading && !error && article ? (
            <article className="mt-6 rounded-xl bg-white p-6 shadow-sm shadow-neutral-200">
              <p className="text-xs uppercase tracking-[0.14em] text-emerald-600">{article.journal}</p>
              <h1 className="mt-2 text-3xl font-semibold text-neutral-900">{article.title}</h1>
              <p className="mt-3 text-sm text-neutral-700">By {article.author}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.12em] text-neutral-500">
                Status: {article.status}
              </p>
              <div className="mt-5 space-y-3 text-sm leading-relaxed text-neutral-700">
                <p>{article.abstract || 'No abstract available for this article.'}</p>
              </div>
            </article>
          ) : null}
        </div>
      </section>
      <SiteFooter />
    </>
  )
}
