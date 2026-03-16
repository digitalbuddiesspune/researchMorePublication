export default function OpenScienceSection() {
  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:px-0">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-neutral-900">
            Why open science is essential for our future
          </h2>
          <p className="text-sm leading-relaxed text-neutral-700">
            Open, transparent research speeds up discovery, builds public trust,
            and ensures that breakthroughs are shared with the people and
            communities who need them most. At researchMorePublication we connect
            millions of researchers, practitioners, and innovators to solve
            real-world challenges.
          </p>
          <p className="text-sm leading-relaxed text-neutral-700">
            From climate resilience to human health, we believe science should be
            collaborative, reproducible, and accessible to everyone.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl bg-white shadow-md shadow-neutral-200">
          <div className="relative aspect-video w-full">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-400 via-sky-400 to-indigo-400" />
            <button className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg shadow-neutral-400/60">
                <span className="ml-1 inline-block border-y-[10px] border-l-[16px] border-y-transparent border-l-emerald-600" />
              </span>
            </button>
          </div>
          <div className="px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
              Video
            </p>
            <p className="mt-1 text-sm font-semibold text-neutral-900">
              Science Unlocked: making research open to all
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

