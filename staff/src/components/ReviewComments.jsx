export default function ReviewComments({ reviews = [] }) {
  if (!reviews.length) return <p className="mt-2 text-sm text-slate-500">No reviews yet.</p>

  return (
    <div className="mt-2 space-y-3">
      {reviews.map((r, idx) => (
        <div key={`${r.reviewerName || 'review'}-${idx}`} className="rounded-lg border border-slate-200 bg-white p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-sm font-semibold text-slate-900">{r.reviewerName || 'Reviewer'}</h4>
            {r.recommendation ? (
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-800">
                {r.recommendation}
              </span>
            ) : null}
          </div>
          {r.comments ? <p className="mt-2 text-sm text-slate-700 whitespace-pre-wrap">{r.comments}</p> : null}
          {r.submittedAt ? (
            <p className="mt-2 text-xs text-slate-500">
              {new Date(r.submittedAt).toLocaleString()}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  )
}

