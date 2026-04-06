import SiteFooter from '../sections/SiteFooter.jsx'

export default function TermsAndConditions() {
  return (
    <>
      <section className="bg-white pt-24">
        <div className="mx-auto max-w-4xl space-y-6 px-6 py-10 text-neutral-800 lg:px-0">
          <h1 className="text-3xl font-semibold text-neutral-900">Terms &amp; Conditions</h1>
          <p className="text-sm leading-relaxed text-neutral-700">
            By using this website, you agree to follow our platform rules, publishing
            standards, and all applicable laws and regulations.
          </p>
          <p className="text-sm leading-relaxed text-neutral-700">
            Content is provided for informational purposes. We may update features or
            policies over time, and continued use means acceptance of those updates.
          </p>
          <p className="text-sm leading-relaxed text-neutral-700">
            Misuse of services, unauthorized access attempts, or violation of terms may
            result in restricted access or account action.
          </p>
        </div>
      </section>
      <SiteFooter />
    </>
  )
}
