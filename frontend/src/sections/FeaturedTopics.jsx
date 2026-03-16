const DEFAULT_TOPICS = [
  {
    id: 'fractals-climate',
    title: 'Fractals in climate science',
    articles: 24,
  },
  {
    id: 'toxic-algal-blooms',
    title: 'Inside toxic algal blooms',
    articles: 25,
  },
  {
    id: 'neural-deep-sea',
    title: 'Neural links in the deep sea',
    articles: 26,
  },
  {
    id: 'future-coral-reefs',
    title: 'Future of coral reefs',
    articles: 27,
  },
]

export default function FeaturedTopics({ topics = DEFAULT_TOPICS, onTopicClick }) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-6 py-12 lg:px-0">
        <div className="grid gap-6 md:grid-cols-4">
          {topics.map((topic) => (
            <button
              key={topic.id}
              type="button"
              onClick={() => onTopicClick?.(topic)}
              className="group flex flex-col overflow-hidden rounded-xl bg-white text-left shadow-sm ring-1 ring-neutral-200 transition hover:-translate-y-0.5 hover:shadow-md hover:ring-emerald-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              <div className="h-32 w-full bg-gradient-to-tr from-emerald-500/60 via-sky-500/60 to-indigo-500/60" />
              <div className="flex flex-1 flex-col gap-2 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
                  Research Topic
                </p>
                <h2 className="text-sm font-semibold leading-snug text-neutral-900 group-hover:text-emerald-700">
                  {topic.title}
                </h2>
                <p className="mt-1 line-clamp-3 text-xs text-neutral-600">
                  Explore curated research advancing our understanding of complex
                  systems and their impact on a changing planet.
                </p>
                <p className="mt-auto pt-2 text-xs font-medium text-neutral-700">
                  {topic.articles} articles · Open access
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

