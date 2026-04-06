/** Shared Tailwind class strings for admin view pages */
export const tw = {
  view: (active) => (active ? 'space-y-6' : 'hidden'),
  card: 'rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm ring-1 ring-slate-950/[0.04] md:p-6',
  cardTitle: 'm-0 text-lg font-semibold tracking-tight text-slate-900',
  cardTitleInline: 'm-0 text-base font-semibold text-slate-900',
  cardDesc: 'mt-1 text-sm leading-relaxed text-slate-500',
  toolbar: 'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4',
  muted: 'm-0 text-sm text-slate-500',
  label: 'grid gap-1.5',
  labelText: 'text-sm font-medium text-slate-700',
  input:
    'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20',
  textarea: 'min-h-[90px] resize-y',
  select:
    'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20',
  btnPrimary:
    'inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50',
  btnGhost:
    'inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50',
  btnSm:
    'inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50',
  btnDangerSm:
    'inline-flex items-center justify-center rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:opacity-50',
  tableWrap: 'overflow-x-auto rounded-xl border border-slate-200 bg-white',
  table: 'w-full min-w-[640px] border-collapse text-left text-sm',
  th: 'border-b border-slate-200 bg-slate-50/95 px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600',
  td: 'border-b border-slate-100 px-3 py-3 align-middle text-slate-800',
  tdMono: 'border-b border-slate-100 px-3 py-3 align-middle font-mono text-[0.8125rem] text-slate-700',
  tdEmpty: 'border-b-0 px-3 py-10 text-center text-sm text-slate-500',
  actions: 'flex flex-wrap items-center gap-2',
  selectInTable: 'min-w-0 max-w-[10.5rem] py-2 text-xs',
  pill: 'inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600',
}

/** Dashboard metric tiles */
export const statCardClass = (accent = 'blue') => {
  const border = {
    blue: 'border-l-blue-500',
    violet: 'border-l-violet-500',
    amber: 'border-l-amber-500',
    emerald: 'border-l-emerald-500',
  }[accent] || 'border-l-blue-500'
  return `${tw.card} border-l-4 ${border}`
}

export const placementBadge = (placement) => {
  const base = 'inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold'
  if (placement === 'spotlight') return `${base} bg-amber-100 text-amber-900`
  if (placement === 'side') return `${base} bg-blue-100 text-blue-900`
  if (placement === 'feature') return `${base} bg-emerald-100 text-emerald-900`
  return `${base} bg-slate-100 text-slate-800`
}

export const submissionStatusBadge = (status) => {
  const map = {
    submitted: 'bg-sky-100 text-sky-900',
    'under-review': 'bg-amber-100 text-amber-900',
    'revision-requested': 'bg-orange-100 text-orange-900',
    accepted: 'bg-emerald-100 text-emerald-900',
    rejected: 'bg-red-100 text-red-900',
  }
  const tone = map[status] || 'bg-slate-200 text-slate-800'
  return `inline-flex max-w-full truncate rounded-full px-2.5 py-1 text-xs font-semibold ${tone}`
}

export const activeBadge = (active) =>
  active
    ? 'inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800'
    : 'inline-flex rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-semibold text-slate-700'
