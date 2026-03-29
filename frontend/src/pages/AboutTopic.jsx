import { Link, useParams } from 'react-router-dom'
import { ABOUT_GROUPS, ABOUT_PAGE_MAP } from '../data/aboutPages.js'
import SiteFooter from '../sections/SiteFooter.jsx'

const VIDEO_THUMB =
  'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&q=80'

export default function AboutTopic() {
  const { slug } = useParams()
  const page = ABOUT_PAGE_MAP[slug]

  if (!page) {
    return (
      <section className="bg-white pt-24">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-0">
          <h1 className="text-3xl font-semibold text-neutral-900">Page not found</h1>
          <p className="mt-3 text-sm text-neutral-700">
            The requested About page does not exist.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-neutral-950"
          >
            Back to home
          </Link>
        </div>
      </section>
    )
  }

  const inPageSections = page.sections.map((section) => ({
    id: section.id,
    label: section.title,
  }))
  const relatedPages = ABOUT_GROUPS.find((group) => group.title === page.group)?.links || []

  return (
    <>
      <section className="bg-white pt-20 sm:pt-24">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-0">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_260px]">
            <article className="space-y-10">
              <header className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  About Frontiers
                </p>
                <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
                  {page.label}
                </h1>
                <p className="max-w-3xl text-sm leading-relaxed text-neutral-700">
                  {page.summary}
                </p>
                <div className="overflow-hidden rounded-lg border border-neutral-200">
                  <div
                    className="relative h-44 w-full bg-cover bg-center sm:h-60"
                    style={{ backgroundImage: `url(${VIDEO_THUMB})` }}
                  >
                    <div className="absolute inset-0 bg-black/35" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg">
                        <span className="ml-1 inline-block border-y-[10px] border-l-[16px] border-y-transparent border-l-red-600" />
                      </span>
                    </div>
                  </div>
                </div>
              </header>

              {page.sections.map((section) => (
                <section id={section.id} key={section.id} className="space-y-3">
                  <h2 className="text-2xl font-semibold text-neutral-900">{section.title}</h2>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="text-sm leading-relaxed text-neutral-700">
                      {paragraph}
                    </p>
                  ))}
                </section>
              ))}

              <section id="key-facts" className="space-y-3">
                <h2 className="text-2xl font-semibold text-neutral-900">Key facts</h2>
                <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-neutral-700">
                  {page.keyFacts.map((fact) => (
                    <li key={fact}>{fact}</li>
                  ))}
                </ul>
              </section>
            </article>

            <aside className="h-fit space-y-6 rounded-lg border border-neutral-200 bg-neutral-50 p-4 lg:sticky lg:top-24">
              <div>
                <h3 className="text-sm font-semibold text-neutral-900">In this page</h3>
                <ul className="mt-3 space-y-2">
                  {inPageSections.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className="text-sm text-neutral-600 transition-colors hover:text-neutral-900"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                  <li>
                    <a
                      href="#key-facts"
                      className="text-sm text-neutral-600 transition-colors hover:text-neutral-900"
                    >
                      Key facts
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-neutral-900">Related content</h3>
                <ul className="mt-3 space-y-2">
                  {relatedPages.map((item) => (
                    <li key={item.slug}>
                      <Link
                        to={`/about/${item.slug}`}
                        className={`text-sm transition-colors hover:text-neutral-900 ${
                          item.slug === slug ? 'font-semibold text-neutral-900' : 'text-neutral-600'
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>
      <SiteFooter />
    </>
  )
}
