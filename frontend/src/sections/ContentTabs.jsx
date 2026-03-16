const TABS = ['Articles', 'Latest research', 'Collections']

export default function ContentTabs({ activeTab, onTabChange }) {
  return (
    <div className="border-b border-neutral-200 bg-white/95">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 lg:px-0">
        <div className="flex gap-6 text-sm font-medium text-neutral-700">
          {TABS.map((tab) => {
            const isActive = tab === activeTab
            return (
              <button
                key={tab}
                type="button"
                onClick={() => onTabChange?.(tab)}
                className={`pb-3 pt-2 transition-colors ${
                  isActive
                    ? 'border-b-2 border-emerald-500 text-emerald-700'
                    : 'border-b-2 border-transparent text-neutral-500 hover:text-neutral-900'
                }`}
              >
                {tab}
              </button>
            )
          })}
        </div>
        <button className="hidden text-xs font-medium uppercase tracking-[0.18em] text-neutral-500 sm:block">
          View all
        </button>
      </div>
    </div>
  )
}

