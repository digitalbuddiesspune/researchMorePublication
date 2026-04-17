import { Link } from 'react-router-dom'
import SiteFooter from '../../sections/SiteFooter.jsx'
import useRequireSubmitAccess from './useRequireSubmitAccess.js'

export default function SubmitStepPage({ title, description }) {
  const { isChecking } = useRequireSubmitAccess()

  return (
    <>
      <section className="min-h-screen bg-neutral-100 pt-24">
        <div className="mx-auto max-w-5xl px-4 pb-24 sm:px-6 lg:px-0">
          <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
            <Link
              to="/submit"
              className="inline-flex items-center text-sm font-medium text-sky-700 transition hover:text-sky-800"
            >
              {'<'} Back to submission checklist
            </Link>
            <h1 className="mt-5 text-2xl font-semibold text-neutral-900 sm:text-3xl">{title}</h1>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600 sm:text-base">{description}</p>

            <div className="mt-8 rounded-md border border-dashed border-neutral-300 bg-neutral-50 p-4 text-sm text-neutral-500">
              {isChecking
                ? 'Checking session...'
                : 'Step form area ready. You can now build this page-specific form.'}
            </div>
          </div>
        </div>
      </section>
      <SiteFooter />
    </>
  )
}
