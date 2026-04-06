import React from 'react'

const statusStyles = {
  accepted: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
  'under-review': 'bg-amber-100 text-amber-900 border-amber-200',
  'revision-requested': 'bg-amber-50 text-amber-900 border-amber-200',
  submitted: 'bg-blue-50 text-blue-900 border-blue-200',
  assigned: 'bg-slate-100 text-slate-800 border-slate-200',
}

export default function StatusBadge({ status = '' }) {
  const key = status || 'unknown'
  const cls = statusStyles[key] || 'bg-slate-200 text-slate-800 border-slate-200'

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${cls}`}
    >
      {status}
    </span>
  )
}

