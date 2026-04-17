const MANUSCRIPT_IMAGE_URL =
  'https://res.cloudinary.com/dz5dacly1/image/upload/v1776406777/manuscript_hxm1h2.png'

export default function ManuscriptModal({ isOpen, onClose, onContinue, onStartNew }) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Submit your manuscript"
      onClick={onClose}
    >
      <div
        className="relative grid w-full max-w-6xl overflow-hidden rounded-sm bg-white shadow-2xl lg:grid-cols-[1.05fr_1.45fr]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-3 z-10 text-3xl leading-none text-neutral-400 hover:text-neutral-600"
          aria-label="Close manuscript popup"
        >
          ×
        </button>

        <section className="space-y-5 px-6 py-10 sm:px-10 lg:py-12">
          <h2 className="max-w-sm text-4xl font-semibold leading-tight text-neutral-900">
            Submit your manuscript
          </h2>
          <p className="max-w-sm text-4xl font-semibold leading-tight text-sky-600">
            Rigorous, constructive, transparent and fast peer review
          </p>
          <p className="max-w-sm text-2xl leading-relaxed text-neutral-600">
            You have a submission in preparation. Do you want to continue or start a new
            submission?
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              type="button"
              onClick={onContinue}
              className="bg-sky-600 px-8 py-3 text-lg font-semibold text-white transition hover:bg-sky-700"
            >
              Continue
            </button>
            <button
              type="button"
              onClick={onStartNew}
              className="bg-sky-600 px-8 py-3 text-lg font-semibold text-white transition hover:bg-sky-700"
            >
              Start new
            </button>
          </div>
        </section>

        <section className="bg-sky-50 p-6 sm:p-10">
          <img
            src={MANUSCRIPT_IMAGE_URL}
            alt="Submission workflow: submission, peer review, final decision, publication"
            className="h-full w-full object-contain"
          />
        </section>
      </div>
    </div>
  )
}
