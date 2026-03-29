const HERO_BACKGROUND =
  'https://res.cloudinary.com/dzd47mpdo/image/upload/v1774786106/banner01_vxmdsk.svg'

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-neutral-800">
        <img
          src={HERO_BACKGROUND}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center sm:object-contain"
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/40 to-black/75"></div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 pb-4 pt-24 sm:gap-7 sm:px-6 sm:pb-5 sm:pt-28 lg:gap-8 lg:px-0 lg:pb-6 lg:pt-28">
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

        <div className="grid gap-4 border-t border-white/10 pt-4 text-sm text-white sm:grid-cols-3 sm:gap-6 sm:text-base lg:pt-5">
          <div className="space-y-1">
            <p className="text-2xl font-semibold sm:text-xl">3 million</p>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-200/80">
              Researchers
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-semibold sm:text-xl">4 billion</p>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-200/80">
              Article views &amp; downloads
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-semibold sm:text-xl">12 million</p>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-200/80">
              Citations
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

