import SiteFooter from '../sections/SiteFooter.jsx'

export default function CookiesPolicy() {
  return (
    <>
      <section className="bg-white pt-24">
        <div className="mx-auto max-w-4xl space-y-6 px-6 py-10 text-neutral-800 lg:px-0">
          <h1 className="text-3xl font-semibold text-neutral-900">Cookies</h1>
          <p className="text-sm leading-relaxed text-neutral-700">
            We use cookies and similar technologies to keep the site working, remember
            preferences, and measure usage for performance improvements.
          </p>
          <p className="text-sm leading-relaxed text-neutral-700">
            Essential cookies are required for core functionality. Optional cookies may
            be used for analytics and product optimization.
          </p>
          <p className="text-sm leading-relaxed text-neutral-700">
            You can manage cookie preferences through your browser settings, where you
            can block or remove cookies at any time.
          </p>
        </div>
      </section>
      <SiteFooter />
    </>
  )
}
