import StatusBadge from './StatusBadge.jsx'

export default function SubmissionCard({ title, status, meta = [], children }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <h3 className="m-0 text-base font-semibold text-slate-900">{title}</h3>

      <div className="mt-2 flex flex-wrap gap-2 text-sm text-slate-600">
        {meta.map((m) => (
          <span key={m}>{m}</span>
        ))}
        <StatusBadge status={status} />
      </div>

      {children ? <div className="mt-3">{children}</div> : null}
    </article>
  )
}

