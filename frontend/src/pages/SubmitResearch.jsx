import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import SiteFooter from '../sections/SiteFooter.jsx'
import ManuscriptModal from '../components/ManuscriptModal.jsx'
import useRequireSubmitAccess from './submit/useRequireSubmitAccess.js'

export default function SubmitResearch() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isChecking } = useRequireSubmitAccess()
  const [isManuscriptModalOpen, setIsManuscriptModalOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('Submission details')

  const submissionSections = useMemo(
    () => [
      {
        label: 'Submission details',
        status: 'Incomplete',
        accent: 'text-red-600',
        icon: 'x',
        path: '/submit/submission-details',
        details:
          'Set article type, target journal, and core submission configuration before moving to manuscript fields.',
      },
      {
        label: 'Manuscript information',
        status: 'To be completed',
        accent: 'text-neutral-400',
        icon: 'i',
        path: '/submit/manuscript-information',
        details:
          'Add manuscript title, abstract, keywords, and upload the files required for editorial screening.',
      },
      {
        label: 'Related Frontiers article',
        status: 'To be completed',
        accent: 'text-neutral-400',
        icon: 'i',
        path: '/submit/related-frontiers-article',
        details:
          'Reference previously published Frontiers articles connected to this submission when relevant.',
      },
      {
        label: 'Manuscript summary information',
        status: 'To be completed',
        accent: 'text-neutral-400',
        icon: 'i',
        path: '/submit/manuscript-summary-information',
        details:
          'Provide concise highlights and key scientific contribution summaries for reviewers and editors.',
      },
      {
        label: 'Authors and contributors',
        status: 'To be completed',
        accent: 'text-neutral-400',
        icon: 'i',
        path: '/submit/authors-and-contributors',
        details:
          'Manage author order, affiliations, contributor roles, and contact information for all contributors.',
      },
      {
        label: 'Editorial',
        status: 'To be completed',
        accent: 'text-neutral-400',
        icon: 'i',
        path: '/submit/editorial',
        details: 'Capture editorial handling preferences and submission information required by the office.',
      },
      {
        label: 'Statements',
        status: 'To be completed',
        accent: 'text-neutral-400',
        icon: 'i',
        path: '/submit/statements',
        details:
          'Complete ethics, conflicts of interest, funding declarations, and mandatory compliance statements.',
      },
      {
        label: 'Payment',
        status: 'To be completed',
        accent: 'text-neutral-400',
        icon: 'i',
        path: null,
        details: 'Complete invoice and payment details when all previous sections are finished.',
      },
    ],
    [],
  )

  useEffect(() => {
    if (location.state?.openManuscriptModal) {
      setIsManuscriptModalOpen(true)
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location.pathname, location.state, navigate])

  return (
    <>
      <section className="min-h-screen bg-neutral-100 pt-24">
        <div className="mx-auto max-w-7xl px-3 pb-24 sm:px-6 lg:px-0">
          <div className="overflow-hidden border border-neutral-200 bg-white shadow-sm">
            {submissionSections.map((section, index) => (
              <div
                key={section.label}
                className={`${
                  index !== submissionSections.length - 1 ? 'border-b border-neutral-200' : ''
                }`}
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-neutral-50"
                  onClick={() =>
                    setActiveSection((current) => (current === section.label ? '' : section.label))
                  }
                  aria-expanded={activeSection === section.label}
                >
                  <div className="min-w-0">
                    <p className="text-[15px] font-semibold text-neutral-700">{section.label}</p>
                    <p className={`mt-1 text-sm ${section.accent}`}>
                      <span className="mr-1.5 text-xs">{section.icon}</span>
                      {section.status}
                    </p>
                  </div>
                  <span
                    className={`ml-4 inline-flex h-6 w-6 items-center justify-center rounded-full text-neutral-400 transition-transform ${
                      activeSection === section.label ? 'rotate-180' : ''
                    }`}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </span>
                </button>
                {activeSection === section.label ? (
                  <div className="bg-neutral-50 px-5 pb-5 pt-1">
                    <div className="rounded-md border border-neutral-200 bg-white p-4">
                      <p className="text-sm leading-relaxed text-neutral-600">{section.details}</p>
                      <div className="mt-4 flex items-center justify-between gap-3">
                        <span className="text-xs text-neutral-500">Expanded section page view</span>
                        {section.path ? (
                          <button
                            type="button"
                            onClick={() => navigate(section.path)}
                            className="rounded bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-sky-700"
                          >
                            Open full page
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-neutral-200 bg-white/95 px-4 py-3 backdrop-blur">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-end gap-2">
            <button
              type="button"
              disabled={isChecking}
              className="rounded border border-neutral-200 bg-sky-100 px-4 py-1.5 text-xs font-medium text-sky-700 transition hover:bg-sky-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Preview
            </button>
            <button
              type="button"
              disabled={isChecking}
              className="rounded border border-sky-300 bg-sky-200 px-4 py-1.5 text-xs font-semibold text-sky-700 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Submit
            </button>
          </div>
        </div>
      </section>
      <ManuscriptModal
        isOpen={isManuscriptModalOpen}
        onClose={() => setIsManuscriptModalOpen(false)}
        onContinue={() => setIsManuscriptModalOpen(false)}
        onStartNew={() => setIsManuscriptModalOpen(false)}
      />
      <SiteFooter />
    </>
  )
}
