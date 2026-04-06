import SiteFooter from '../sections/SiteFooter.jsx'

export default function HelpCenter() {
  return (
    <>
      <section className="bg-neutral-50 pt-24">
        <div className="mx-auto max-w-4xl px-6 py-10 lg:px-0">
          <h1 className="text-3xl font-semibold text-neutral-900">Help center</h1>
          <div className="mt-6 rounded-xl bg-white p-6 shadow-sm shadow-neutral-200">
            <p className="text-sm leading-relaxed text-neutral-700">
              Need help? Contact support and check publishing, review, and account-related FAQs
              here.
            </p>
          </div>
        </div>
      </section>
      <SiteFooter />
    </>
  )
}
