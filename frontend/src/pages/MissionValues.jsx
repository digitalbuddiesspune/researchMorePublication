import SiteFooter from '../sections/SiteFooter.jsx'

const VIDEO_THUMB =
  'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&q=80'

const SECTIONS = [
  { id: 'mission', label: 'Our mission' },
  { id: 'innovations', label: 'Our innovations' },
  { id: 'key-facts', label: 'Key facts' },
  { id: 'values', label: 'Our values' },
]

export default function MissionValues() {
  return (
    <>
      <section className="bg-white pt-24">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-0">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_240px]">
            <article className="space-y-10">
              <header className="space-y-4">
                <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
                  About Frontiers
                </h1>
                <p className="max-w-3xl text-sm leading-relaxed text-neutral-700">
                  We are on a mission to make all science open. By accelerating solutions
                  for healthy lives on a healthy planet, we enable researchers and society
                  to work together on the world&apos;s most urgent challenges.
                </p>
                <p className="max-w-3xl text-sm leading-relaxed text-neutral-700">
                  Our publishing model is designed around transparency, research quality,
                  and collaboration so science can create measurable impact at scale.
                </p>
                <div className="overflow-hidden rounded-lg border border-neutral-200">
                  <div
                    className="relative h-60 w-full bg-cover bg-center"
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

              <section id="mission" className="space-y-3">
                <h2 className="text-2xl font-semibold text-neutral-900">Our mission</h2>
                <p className="text-sm leading-relaxed text-neutral-700">
                  We transform how science is shared and used. Through open access,
                  community-driven peer review, and global collaboration, we empower
                  researchers to drive faster and more trustworthy progress.
                </p>
                <p className="text-sm leading-relaxed text-neutral-700">
                  Our goal is to remove barriers between discovery and real-world impact
                  so that scientific knowledge is accessible to everyone.
                </p>
              </section>

              <section id="innovations" className="space-y-3">
                <h2 className="text-2xl font-semibold text-neutral-900">Our innovations</h2>
                <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-neutral-700">
                  <li>Collaborative and transparent peer review workflows</li>
                  <li>Open-access-first publishing infrastructure</li>
                  <li>AI-assisted editorial support for quality and speed</li>
                  <li>Topic-based communities connecting disciplines</li>
                  <li>Global visibility and discoverability for published research</li>
                </ul>
              </section>

              <section id="key-facts" className="space-y-3">
                <h2 className="text-2xl font-semibold text-neutral-900">Key facts</h2>
                <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-neutral-700">
                  <li>Millions of monthly readers across research domains</li>
                  <li>Thousands of active editors and reviewers worldwide</li>
                  <li>Strong focus on reproducibility and research integrity</li>
                </ul>
              </section>

              <section id="values" className="space-y-3">
                <h2 className="text-2xl font-semibold text-neutral-900">Our values</h2>
                <p className="text-sm leading-relaxed text-neutral-700">
                  We value openness, collaboration, and integrity. These principles guide
                  every decision we make, from editorial standards to product innovation.
                </p>
                <p className="text-sm leading-relaxed text-neutral-700">
                  By putting science and community first, we help build a trustworthy and
                  inclusive ecosystem for discovery.
                </p>
              </section>
            </article>

            <aside className="h-fit space-y-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4 lg:sticky lg:top-24">
              <h3 className="text-sm font-semibold text-neutral-900">In this page</h3>
              <ul className="space-y-2">
                {SECTIONS.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="text-sm text-neutral-600 transition-colors hover:text-neutral-900"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </section>
      <SiteFooter />
    </>
  )
}
