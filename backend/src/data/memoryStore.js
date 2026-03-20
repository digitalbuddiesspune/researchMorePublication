import crypto from 'crypto'

const now = new Date().toISOString()

export const memoryStore = {
  publications: [
    {
      _id: crypto.randomUUID(),
      title: 'Ocean biodiversity and AI mapping',
      author: 'Dr. Elena Park',
      status: 'in-review',
      category: 'Marine Science',
      abstract: 'Using machine learning to map biodiversity changes at scale.',
      createdAt: now,
      updatedAt: now,
    },
    {
      _id: crypto.randomUUID(),
      title: 'Microplastics in freshwater systems',
      author: 'Rahul Menon',
      status: 'accepted',
      category: 'Environment',
      abstract: 'A multi-city assessment of microplastic concentration trends.',
      createdAt: now,
      updatedAt: now,
    },
  ],
  news: [
    {
      _id: crypto.randomUUID(),
      title: 'How bacteria can reclaim lost energy, nutrients, and clean water from wastewater',
      summary:
        'Microbial communities are powering circular technologies that turn waste streams into valuable resources.',
      imageUrl:
        'https://images.unsplash.com/photo-1576085898323-3a335ffa5968?w=800&q=80',
      fallbackImage:
        'https://images.unsplash.com/photo-1421789665209-c9b2a435e3dc?w=800&q=80',
      label: 'Spotlight',
      placement: 'spotlight',
      isPublished: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      _id: crypto.randomUUID(),
      title: 'Soil microbes can protect crops from climate extremes',
      summary: '',
      imageUrl:
        'https://images.unsplash.com/photo-1416879594150-469a2c89e1c2?w=200&q=80',
      fallbackImage:
        'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=200&q=80',
      label: 'News',
      placement: 'side',
      isPublished: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      _id: crypto.randomUUID(),
      title: 'Can AI help us design better clinical trials?',
      summary: '',
      imageUrl:
        'https://images.unsplash.com/photo-1677442136019-3e4c79f27665?w=200&q=80',
      fallbackImage:
        'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=200&q=80',
      label: 'News',
      placement: 'side',
      isPublished: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      _id: crypto.randomUUID(),
      title: 'How do you measure research impact beyond citations?',
      summary: '',
      imageUrl:
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=200&q=80',
      fallbackImage:
        'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=200&q=80',
      label: 'News',
      placement: 'side',
      isPublished: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      _id: crypto.randomUUID(),
      title: 'Exercise, metabolism, and a changing climate',
      summary: '',
      imageUrl:
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b8196?w=400&q=80',
      fallbackImage:
        'https://images.unsplash.com/photo-1431801542461-44ec2f11b8c1?w=400&q=80',
      label: 'Feature',
      placement: 'feature',
      isPublished: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      _id: crypto.randomUUID(),
      title: 'What arctic foxes teach us about adaptation',
      summary: '',
      imageUrl:
        'https://images.unsplash.com/photo-1564349688832-2e0e48e2a97d?w=400&q=80',
      fallbackImage:
        'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=400&q=80',
      label: 'Feature',
      placement: 'feature',
      isPublished: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      _id: crypto.randomUUID(),
      title: 'Underground rivers beneath shrinking glaciers',
      summary: '',
      imageUrl:
        'https://images.unsplash.com/photo-1531366930617-4c2464175f?w=400&q=80',
      fallbackImage:
        'https://images.unsplash.com/photo-1451186859696-371d9477be93?w=400&q=80',
      label: 'Feature',
      placement: 'feature',
      isPublished: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      _id: crypto.randomUUID(),
      title: 'Stories from researchers driving open science',
      summary: '',
      imageUrl:
        'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&q=80',
      fallbackImage:
        'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=400&q=80',
      label: 'Feature',
      placement: 'feature',
      isPublished: true,
      createdAt: now,
      updatedAt: now,
    },
  ],
  subscribers: [],
}
