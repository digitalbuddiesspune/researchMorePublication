export default function NewsSection() {
  return (
    <section className="bg-neutral-50">
      <div className="mx-auto max-w-6xl px-6 py-16 lg:px-0">
        <h2 className="text-2xl font-semibold text-neutral-900">News</h2>
        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <article className="overflow-hidden rounded-2xl bg-white shadow-sm shadow-neutral-200">
            <div className="h-56 w-full bg-gradient-to-tr from-emerald-500/60 via-amber-500/60 to-rose-500/60" />
            <div className="space-y-2 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
                Spotlight
              </p>
              <h3 className="text-lg font-semibold text-neutral-900">
                How bacteria can reclaim lost energy, nutrients, and clean water from
                wastewater
              </h3>
              <p className="text-sm leading-relaxed text-neutral-700">
                Microbial communities are powering a new generation of circular
                technologies that turn waste streams into valuable resources.
              </p>
            </div>
          </article>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
            {[
              'Soil microbes can protect crops from climate extremes',
              'Can AI help us design better clinical trials?',
              'How do you measure research impact beyond citations?',
            ].map((title) => (
              <article
                key={title}
                className="flex gap-4 rounded-xl bg-white p-4 shadow-sm shadow-neutral-200"
              >
                <div className="h-16 w-20 flex-none rounded-lg bg-gradient-to-tr from-sky-500/70 to-indigo-500/70" />
                <div className="space-y-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-600">
                    News
                  </p>
                  <h3 className="text-sm font-semibold text-neutral-900">{title}</h3>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            'Exercise, metabolism, and a changing climate',
            'What arctic foxes teach us about adaptation',
            'Underground rivers beneath shrinking glaciers',
            'Stories from researchers driving open science',
          ].map((title) => (
            <article
              key={title}
              className="flex flex-col overflow-hidden rounded-xl bg-white shadow-sm shadow-neutral-200"
            >
              <div className="h-28 w-full bg-gradient-to-tr from-emerald-400/70 via-sky-500/70 to-indigo-500/70" />
              <div className="flex flex-1 flex-col gap-1 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-600">
                  Feature
                </p>
                <h3 className="text-sm font-semibold text-neutral-900">{title}</h3>
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

