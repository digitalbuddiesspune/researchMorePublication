import SiteFooter from '../sections/SiteFooter.jsx'

export default function PrivacyPolicy() {
  return (
    <>
      <section className="bg-white pt-24">
        <div className="mx-auto max-w-4xl space-y-6 px-6 py-10 text-neutral-800 lg:px-0">
          <h1 className="text-3xl font-semibold text-neutral-900">Privacy Policy</h1>
          <p className="text-sm leading-relaxed text-neutral-700">
            We collect only the information needed to provide and improve this platform,
            such as account details, usage metrics, and support requests.
          </p>
          <p className="text-sm leading-relaxed text-neutral-700">
            Personal data is processed securely and used for core operations, analytics,
            and communication related to your use of researchMorePublication.
          </p>
          <p className="text-sm leading-relaxed text-neutral-700">
            You can request data access, correction, or deletion by contacting support.
            We review and respond to privacy requests in line with applicable laws.
          </p>
        </div>
      </section>
      <SiteFooter />
    </>
  )
}
