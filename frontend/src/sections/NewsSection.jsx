import { useEffect, useMemo, useState } from 'react'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// News-related images (Unsplash): science, nature, research
const NEWS_IMAGES = {
  spotlight:
    'https://images.unsplash.com/photo-1576085898323-3a335ffa5968?w=800&q=80',
  thumb1:
    'https://images.unsplash.com/photo-1416879594150-469a2c89e1c2?w=200&q=80',
  thumb2:
    'https://images.unsplash.com/photo-1677442136019-3e4c79f27665?w=200&q=80',
  thumb3:
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=200&q=80',
  feature1:
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b8196?w=400&q=80',
  feature2:
    'https://images.unsplash.com/photo-1564349688832-2e0e48e2a97d?w=400&q=80',
  feature3:
    'https://images.unsplash.com/photo-1531366930617-4c2464175f?w=400&q=80',
  feature4:
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&q=80',
}

const FALLBACK_NEWS_IMAGES = {
  spotlight:
    'https://images.unsplash.com/photo-1421789665209-c9b2a435e3dc?w=800&q=80',
  thumb1:
    'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=200&q=80',
  thumb2:
    'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=200&q=80',
  thumb3:
    'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=200&q=80',
  feature1:
    'https://images.unsplash.com/photo-1431801542461-44ec2f11b8c1?w=400&q=80',
  feature2:
    'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=400&q=80',
  feature3:
    'https://images.unsplash.com/photo-1451186859696-371d9477be93?w=400&q=80',
  feature4:
    'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=400&q=80',
}

const buildNewsBackground = (imageUrl, fallbackImage) =>
  `url(${imageUrl || fallbackImage}), url(${fallbackImage})`

const defaultNewsItems = [
  {
    id: 'spotlight-1',
    title:
      'How bacteria can reclaim lost energy, nutrients, and clean water from wastewater',
    summary:
      'Microbial communities are powering a new generation of circular technologies that turn waste streams into valuable resources.',
    imageUrl: NEWS_IMAGES.spotlight,
    fallbackImage: FALLBACK_NEWS_IMAGES.spotlight,
    label: 'Spotlight',
    placement: 'spotlight',
  },
  {
    id: 'side-1',
    title: 'Soil microbes can protect crops from climate extremes',
    imageUrl: NEWS_IMAGES.thumb1,
    fallbackImage: FALLBACK_NEWS_IMAGES.thumb1,
    label: 'News',
    placement: 'side',
  },
  {
    id: 'side-2',
    title: 'Can AI help us design better clinical trials?',
    imageUrl: NEWS_IMAGES.thumb2,
    fallbackImage: FALLBACK_NEWS_IMAGES.thumb2,
    label: 'News',
    placement: 'side',
  },
  {
    id: 'side-3',
    title: 'How do you measure research impact beyond citations?',
    imageUrl: NEWS_IMAGES.thumb3,
    fallbackImage: FALLBACK_NEWS_IMAGES.thumb3,
    label: 'News',
    placement: 'side',
  },
  {
    id: 'feature-1',
    title: 'Exercise, metabolism, and a changing climate',
    imageUrl: NEWS_IMAGES.feature1,
    fallbackImage: FALLBACK_NEWS_IMAGES.feature1,
    label: 'Feature',
    placement: 'feature',
  },
  {
    id: 'feature-2',
    title: 'What arctic foxes teach us about adaptation',
    imageUrl: NEWS_IMAGES.feature2,
    fallbackImage: FALLBACK_NEWS_IMAGES.feature2,
    label: 'Feature',
    placement: 'feature',
  },
  {
    id: 'feature-3',
    title: 'Underground rivers beneath shrinking glaciers',
    imageUrl: NEWS_IMAGES.feature3,
    fallbackImage: FALLBACK_NEWS_IMAGES.feature3,
    label: 'Feature',
    placement: 'feature',
  },
  {
    id: 'feature-4',
    title: 'Stories from researchers driving open science',
    imageUrl: NEWS_IMAGES.feature4,
    fallbackImage: FALLBACK_NEWS_IMAGES.feature4,
    label: 'Feature',
    placement: 'feature',
  },
]

export default function NewsSection() {
  const [newsItems, setNewsItems] = useState(defaultNewsItems)

  useEffect(() => {
    const loadNews = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/news?published=true`)
        if (!response.ok) return
        const payload = await response.json()
        if (!Array.isArray(payload) || payload.length === 0) return
        const normalized = payload.map((item, index) => ({
          id: item._id || item.id || `news-${index}`,
          title: item.title,
          summary: item.summary || '',
          imageUrl: item.imageUrl || '',
          fallbackImage: item.fallbackImage || FALLBACK_NEWS_IMAGES[item.placement] || '',
          label: item.label || 'News',
          placement: item.placement || 'feature',
        }))
        setNewsItems(normalized)
      } catch (_error) {
        // Keep default UI content if backend is unavailable.
      }
    }
    loadNews()
  }, [])

  const spotlight = useMemo(
    () => newsItems.find((item) => item.placement === 'spotlight') || newsItems[0],
    [newsItems]
  )
  const sideItems = useMemo(
    () => newsItems.filter((item) => item.placement === 'side'),
    [newsItems]
  )
  const featureItems = useMemo(
    () => newsItems.filter((item) => item.placement === 'feature'),
    [newsItems]
  )

  return (
    <section className="bg-neutral-50">
      <div className="mx-auto max-w-6xl px-6 py-16 lg:px-0">
        <h2 className="text-2xl font-semibold text-neutral-900">News</h2>
        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <article className="overflow-hidden rounded-2xl bg-white shadow-sm shadow-neutral-200">
            <div
              className="h-56 w-full bg-neutral-200 bg-cover bg-center"
              style={{
                backgroundImage: buildNewsBackground(
                  spotlight?.imageUrl,
                  spotlight?.fallbackImage || FALLBACK_NEWS_IMAGES.spotlight
                ),
              }}
            />
            <div className="space-y-2 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
                {spotlight?.label || 'Spotlight'}
              </p>
              <h3 className="text-lg font-semibold text-neutral-900">
                {spotlight?.title}
              </h3>
              <p className="text-sm leading-relaxed text-neutral-700">
                {spotlight?.summary}
              </p>
            </div>
          </article>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
            {sideItems.map((item) => (
              <article
                key={item.id}
                className="flex gap-4 rounded-xl bg-white p-4 shadow-sm shadow-neutral-200"
              >
                <div
                  className="h-16 w-20 flex-none shrink-0 rounded-lg bg-neutral-200 bg-cover bg-center"
                  style={{
                    backgroundImage: buildNewsBackground(item.imageUrl, item.fallbackImage),
                  }}
                />
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-600">
                    {item.label}
                  </p>
                  <h3 className="text-sm font-semibold text-neutral-900">{item.title}</h3>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featureItems.map((item) => (
            <article
              key={item.id}
              className="flex flex-col overflow-hidden rounded-xl bg-white shadow-sm shadow-neutral-200"
            >
              <div
                className="h-28 w-full bg-neutral-200 bg-cover bg-center"
                style={{
                  backgroundImage: buildNewsBackground(item.imageUrl, item.fallbackImage),
                }}
              />
              <div className="flex flex-1 flex-col gap-1 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-600">
                  {item.label}
                </p>
                <h3 className="text-sm font-semibold text-neutral-900">{item.title}</h3>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <button className="rounded-full border border-neutral-300 bg-white px-6 py-2 text-sm font-semibold text-neutral-900 shadow-sm hover:border-neutral-400">
            View more news
          </button>
        </div>
      </div>
    </section>
  )
}

