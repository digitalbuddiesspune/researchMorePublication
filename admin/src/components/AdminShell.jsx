import { useCallback, useState } from 'react'
import { VIEW_TITLES } from '../constants/viewTitles.jsx'
import AdminSidebar from './AdminSidebar.jsx'
import DashboardPage from './views/DashboardPage.jsx'
import JournalsPage from './views/JournalsPage.jsx'
import LogsPage from './views/LogsPage.jsx'
import NewsManagerPage from './views/NewsManagerPage.jsx'
import SubmissionsMonitorPage from './views/SubmissionsMonitorPage.jsx'
import ReviewOversightPage from './views/ReviewOversightPage.jsx'
import PublicationsPage from './views/PublicationsPage.jsx'
import AnalyticsPage from './views/AnalyticsPage.jsx'
import SettingsPage from './views/SettingsPage.jsx'
import UsersPage from './views/UsersPage.jsx'

const noticeTone = {
  info: 'bg-blue-50 text-blue-900 border-blue-200',
  success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  error: 'bg-red-50 text-red-800 border-red-200',
}

export default function AdminShell({ onLogout }) {
  const [view, setView] = useState('dashboard')
  const [notice, setNoticeState] = useState({ message: '', variant: 'info' })
  const [logsReloadKey, setLogsReloadKey] = useState(0)
  const [dashReloadKey, setDashReloadKey] = useState(0)
  const [newsRefreshKey, setNewsRefreshKey] = useState(0)

  const setNotice = useCallback((message, variant = 'info') => {
    setNoticeState({ message, variant })
  }, [])

  const bumpLogs = useCallback(() => setLogsReloadKey((k) => k + 1), [])
  const bumpDash = useCallback(() => setDashReloadKey((k) => k + 1), [])

  const active = (key) => view === key

  return (
    <div className="min-h-screen grid grid-cols-1 bg-slate-100/90 md:grid-cols-[minmax(0,280px)_1fr]">
      <AdminSidebar activeView={view} onNavigate={setView} />
      <main className="min-h-screen overflow-x-hidden p-5 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-[1600px]">
          <header className="mb-6 flex flex-col gap-4 border-b border-slate-200/80 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-1 text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-slate-500">
                researchMorePublication
              </p>
              <h2 className="m-0 text-2xl font-semibold tracking-tight text-slate-900 sm:text-[1.65rem]">
                {VIEW_TITLES[view] || 'Dashboard'}
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                id="refresh-news"
                className={`inline-flex items-center justify-center rounded-lg border border-blue-600/20 bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 ${view === 'news-manager' ? '' : 'hidden'}`}
                onClick={() => setNewsRefreshKey((k) => k + 1)}
              >
                Refresh list
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                onClick={onLogout}
              >
                Log out
              </button>
            </div>
          </header>
          {notice.message ? (
            <p
              id="notice"
              className={`mb-6 rounded-xl border px-4 py-3 text-sm shadow-sm ${noticeTone[notice.variant] || noticeTone.info}`}
              role="status"
              aria-live="polite"
            >
              {notice.message}
            </p>
          ) : (
            <p id="notice" className="mb-0 min-h-0" aria-live="polite" />
          )}

        <DashboardPage active={active('dashboard')} dashReloadKey={dashReloadKey} setNotice={setNotice} />
        <NewsManagerPage active={active('news-manager')} newsRefreshKey={newsRefreshKey} setNotice={setNotice} />
        <UsersPage active={active('users')} setNotice={setNotice} bumpLogs={bumpLogs} />
        <SubmissionsMonitorPage active={active('submissions-monitor')} setNotice={setNotice} />
        <ReviewOversightPage active={active('review-oversight')} setNotice={setNotice} />
        <PublicationsPage active={active('publications')} setNotice={setNotice} />
        <JournalsPage active={active('journals')} setNotice={setNotice} bumpLogs={bumpLogs} />
        <AnalyticsPage active={active('analytics')} setNotice={setNotice} />
        <LogsPage active={active('logs')} logsReloadKey={logsReloadKey} setNotice={setNotice} />
        <SettingsPage active={active('settings')} setNotice={setNotice} bumpLogs={bumpLogs} />
        </div>
      </main>
    </div>
  )
}
