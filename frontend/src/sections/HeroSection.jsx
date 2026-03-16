const HERO_BACKGROUND =
  'https://res.cloudinary.com/dkbco28hu/image/upload/v1773665548/WebsiteWebP_XL-shutterstock_1895343883_qjbzvb.webp'

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center"
        style={{
          backgroundImage: `url(${HERO_BACKGROUND})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/55 to-black"></div>
      </div>

      <div className="mx-auto flex min-h-[360px] max-w-6xl flex-col justify-between px-4 pb-6 pt-28 sm:px-6 lg:px-0 lg:pb-10 lg:pt-32">
        <div className="max-w-2xl space-y-4 sm:space-y-5 md:space-y-6 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
            Open-access science platform
          </p>
          <h1 className="text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-[40px]">
            Where scientists empower society
          </h1>
          <p className="max-w-xl text-sm text-white/90 sm:text-base">
            Creating solutions for healthy lives on a healthy planet. Publish
            your research with a global community of readers and collaborators.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-neutral-950 shadow-lg shadow-white/20 transition hover:bg-neutral-100">
              Submit your research
            </button>
            <button className="rounded-full border border-white/40 px-6 py-2.5 text-sm font-semibold text-white/90 backdrop-blur transition hover:border-white hover:text-white">
              Explore journals
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 border-t border-white/10 pt-6 text-sm text-white sm:grid-cols-3 sm:text-base lg:mt-10 lg:pt-8">
          <div className="space-y-1">
            <p className="text-2xl font-semibold sm:text-3xl">3 million</p>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-200/80">
              Researchers
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-semibold sm:text-3xl">4 billion</p>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-200/80">
              Article views &amp; downloads
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-semibold sm:text-3xl">12 million</p>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-200/80">
              Citations
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

