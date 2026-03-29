// Science/research-themed images (Unsplash)
const TOPIC_IMAGES = {
  'fractals-climate':
    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&q=80',
  'toxic-algal-blooms':
    'https://images.unsplash.com/photo-1559827263-247faa2f3dc1?w=600&q=80',
  'neural-deep-sea':
    'https://images.unsplash.com/photo-1582719471384-894f522a3b2f?w=600&q=80',
  'future-coral-reefs':
    'https://images.unsplash.com/photo-1532187649962-549a911349c2?w=600&q=80',
}

const TOPIC_FALLBACK_IMAGES = {
  'fractals-climate':
    'https://images.unsplash.com/photo-1473773508845-188df298d2d1?w=600&q=80',
  'toxic-algal-blooms':
    'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=600&q=80',
  'neural-deep-sea':
    'https://images.unsplash.com/photo-1498623116890-37e912163d5d?w=600&q=80',
  'future-coral-reefs':
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80',
}

const buildTopicBackground = (imageUrl, fallbackImage) =>
  `url(${imageUrl || fallbackImage}), url(${fallbackImage})`

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
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-0">
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {topics.map((topic) => (
            <button
              key={topic.id}
              type="button"
              onClick={() => onTopicClick?.(topic)}
              className="group flex flex-col overflow-hidden rounded-xl bg-white text-left shadow-sm ring-1 ring-neutral-200 transition hover:-translate-y-0.5 hover:shadow-md hover:ring-emerald-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              <div
                className="h-32 w-full bg-neutral-200 bg-cover bg-center"
                style={{
                  backgroundImage: buildTopicBackground(
                    TOPIC_IMAGES[topic.id],
                    TOPIC_FALLBACK_IMAGES[topic.id] ??
                      TOPIC_FALLBACK_IMAGES['fractals-climate']
                  ),
                }}
              />
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

