import { useCallback, useEffect, useState } from 'react'
import { tw } from './lib/adminUi'
import { clearAdminToken, fetchCurrentUser, getAdminToken } from './services/authService'
import AdminLogin from './components/AdminLogin.jsx'
import AdminShell from './components/AdminShell.jsx'

export default function App() {
  const [auth, setAuth] = useState('checking')
  const [logoutMessage, setLogoutMessage] = useState('')

  const verifySession = useCallback(async () => {
    if (!getAdminToken()) {
      setAuth('out')
      return
    }
    try {
      const user = await fetchCurrentUser()
      if (user.role !== 'admin') throw new Error('Only admin users are allowed in this panel.')
      setAuth('in')
    } catch {
      clearAdminToken()
      setAuth('out')
      setLogoutMessage('Please sign in to continue.')
    }
  }, [])

  useEffect(() => {
    verifySession()
  }, [verifySession])

  const handleLoggedIn = () => {
    setLogoutMessage('')
    setAuth('in')
  }

  const handleLogout = () => {
    clearAdminToken()
    setLogoutMessage('You have been logged out.')
    setAuth('out')
  }

  if (auth === 'checking') {
    return (
      <section className="grid min-h-screen place-items-center bg-gradient-to-b from-slate-50 to-slate-200/90 p-6">
        <div className={`${tw.card} flex max-w-sm items-center gap-3`}>
          <span className="h-2 w-2 animate-pulse rounded-full bg-blue-500" aria-hidden />
          <p className="m-0 text-sm font-medium text-slate-600">Checking session…</p>
        </div>
      </section>
    )
  }

  if (auth === 'out') {
    return <AdminLogin onSuccess={handleLoggedIn} message={logoutMessage} />
  }

  return <AdminShell onLogout={handleLogout} />
}
