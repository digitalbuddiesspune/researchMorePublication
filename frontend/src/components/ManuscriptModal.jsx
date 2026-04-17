import { createPortal } from 'react-dom'

const MANUSCRIPT_IMAGE_URL =
  'https://res.cloudinary.com/dz5dacly1/image/upload/v1776406777/manuscript_hxm1h2.png'

export default function ManuscriptModal({ isOpen, onClose, onContinue, onStartNew }) {
  if (!isOpen) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Submit your manuscript"
      onClick={onClose}
    >
      <div
        className="relative grid w-full max-w-4xl overflow-hidden rounded-sm bg-white shadow-2xl lg:grid-cols-2"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-3 z-10 text-2xl leading-none text-neutral-400 transition hover:text-neutral-600"
          aria-label="Close manuscript popup"
        >
          ×
        </button>

        <div className="flex flex-col items-center justify-center gap-4 px-6 py-10 text-center sm:px-8 sm:py-12">
          <h2 className="uppercase text-2xl font-semibold leading-tight text-neutral-900">
            Submit your manuscript
          </h2>
          <p className="max-w-[260px] text-xl font-semibold leading-snug text-sky-600">
            Rigorous, constructive, transparent and fast peer review
          </p>
          <p className="max-w-[300px] text-sm leading-relaxed text-neutral-600">
            You have a submission in preparation. Do you want to continue or start a new
            submission?
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <button
              type="button"
              onClick={onContinue}
              className="min-w-24 bg-sky-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-sky-700"
            >
              Continue
            </button>
            <button
              type="button"
              onClick={onStartNew}
              className="min-w-24 bg-sky-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-sky-700"
            >
              Start new
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <img
            src={MANUSCRIPT_IMAGE_URL}
            alt="Submission workflow: submission, peer review, final decision, publication"
            className="h-full w-full max-w-md object-contain"
          />
        </div>
      </div>
    </div>,
    document.body
  )
}
