export const ABOUT_GROUPS = [
  {
    title: 'Who we are',
    links: [
      { label: 'Mission and values', slug: 'mission-and-values' },
      { label: 'History', slug: 'history' },
      { label: 'Leadership', slug: 'leadership' },
      { label: 'Awards', slug: 'awards' },
    ],
  },
  {
    title: 'Impact and progress',
    links: [
      { label: "Frontiers' impact", slug: 'frontiers-impact' },
      { label: 'Our annual reports', slug: 'our-annual-reports' },
      { label: 'Thought leadership', slug: 'thought-leadership' },
    ],
  },
  {
    title: 'Publishing model',
    links: [
      { label: 'How we publish', slug: 'how-we-publish' },
      { label: 'Open access', slug: 'open-access' },
      { label: 'Peer review', slug: 'peer-review' },
      { label: 'Research integrity', slug: 'research-integrity' },
      { label: 'Research Topics', slug: 'research-topics' },
      { label: 'FAIR² Data Management', slug: 'fair2-data-management' },
      { label: 'Fee policy', slug: 'fee-policy' },
    ],
  },
  {
    title: 'Services',
    links: [
      { label: 'Societies', slug: 'societies' },
      { label: 'National consortia', slug: 'national-consortia' },
      { label: 'Institutional partnerships', slug: 'institutional-partnerships' },
      { label: 'Collaborators', slug: 'collaborators' },
    ],
  },
  {
    title: 'More from Frontiers',
    links: [
      { label: 'Frontiers Forum', slug: 'frontiers-forum' },
      { label: 'Frontiers Planet Prize', slug: 'frontiers-planet-prize' },
      { label: 'Press office', slug: 'press-office' },
      { label: 'Sustainability', slug: 'sustainability' },
      { label: 'Career opportunities', slug: 'career-opportunities' },
      { label: 'Contact us', slug: 'contact-us' },
    ],
  },
]

const PAGE_SUMMARIES = {
  'mission-and-values':
    'Discover how our mission to make science open is guided by transparency, collaboration, and research quality.',
  history:
    'Explore the key milestones that shaped our publishing platform, global community, and open science vision.',
  leadership:
    'Meet the leadership approach that aligns editorial excellence, technology, and long-term scientific impact.',
  awards:
    'See how awards and recognitions celebrate contributions from editors, reviewers, and research communities.',
  'frontiers-impact':
    'Understand the measurable outcomes of our publishing model across visibility, engagement, and societal progress.',
  'our-annual-reports':
    'Review annual performance highlights, growth metrics, and major initiatives delivered each year.',
  'thought-leadership':
    'Read perspectives on publishing innovation, policy, and future-ready research communication.',
  'how-we-publish':
    'Learn how manuscripts move from submission to publication through structured, transparent workflows.',
  'open-access':
    'See how open access increases discoverability, accelerates collaboration, and widens research reach.',
  'peer-review':
    'Understand the peer review framework designed to support quality, fairness, and constructive feedback.',
  'research-integrity':
    'Explore safeguards that protect trust in science through ethical standards and rigorous editorial checks.',
  'research-topics':
    'Discover interdisciplinary Research Topics that connect experts around urgent global challenges.',
  'fair2-data-management':
    'Learn how FAIR² practices improve discoverability, reuse, and reproducibility of research data.',
  'fee-policy':
    'Find clear guidance on publication fees, funding options, and transparent pricing principles.',
  societies:
    'See how societies collaborate with us to publish trusted content and strengthen their academic communities.',
  'national-consortia':
    'Understand how national agreements expand open access opportunities for institutions and researchers.',
  'institutional-partnerships':
    'Explore partnerships that support institutional publishing goals, visibility, and policy alignment.',
  collaborators:
    'Meet the collaborator ecosystem that helps scale scientific communication and publishing excellence.',
  'frontiers-forum':
    'Learn about our global forum bringing together science, policy, and innovation leaders.',
  'frontiers-planet-prize':
    'Discover the prize recognizing science-driven breakthroughs for planetary health and sustainability.',
  'press-office':
    'Access media resources, announcements, and expert insights from our communications team.',
  sustainability:
    'See how sustainability is integrated into operations, partnerships, and strategic decision-making.',
  'career-opportunities':
    'Explore career paths where publishing, technology, and research impact come together.',
  'contact-us':
    'Find the best way to reach our teams for publishing, partnerships, media, and support.',
}

const flattenPages = ABOUT_GROUPS.flatMap((group) =>
  group.links.map((link) => ({
    ...link,
    group: group.title,
  }))
)

export const ABOUT_PAGE_MAP = Object.fromEntries(
  flattenPages.map((page) => [
    page.slug,
    {
      ...page,
      summary: PAGE_SUMMARIES[page.slug],
      sections: [
        {
          id: 'overview',
          title: 'Overview',
          paragraphs: [
            PAGE_SUMMARIES[page.slug],
            `${page.label} is part of our ${page.group.toLowerCase()} focus area and supports a more open, high-quality research ecosystem.`,
          ],
        },
        {
          id: 'why-it-matters',
          title: 'Why it matters',
          paragraphs: [
            'Researchers, institutions, and society benefit when scientific communication is clear, timely, and trustworthy.',
            `This area strengthens decision-making and long-term impact by improving how knowledge is created, reviewed, and shared.`,
          ],
        },
        {
          id: 'our-approach',
          title: 'Our approach',
          paragraphs: [
            'We combine editorial expertise, technology, and global collaboration to deliver consistent publishing standards.',
            `Our teams continuously improve ${page.label.toLowerCase()} practices through feedback, data, and community engagement.`,
          ],
        },
        {
          id: 'looking-ahead',
          title: 'Looking ahead',
          paragraphs: [
            'We are investing in scalable workflows, better researcher experience, and stronger cross-disciplinary collaboration.',
            'Future updates will keep this area aligned with evolving science, policy, and open research expectations.',
          ],
        },
      ],
      keyFacts: [
        'Global researcher and editor participation',
        'Transparent policy and process updates',
        'Continuous improvements informed by community feedback',
      ],
    },
  ])
)
