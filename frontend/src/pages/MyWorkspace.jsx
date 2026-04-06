import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ADMIN_APP_URL,
  EDITOR_APP_URL,
  REVIEWER_APP_URL,
} from '../config/api.js'
import SiteFooter from '../sections/SiteFooter.jsx'
import { fetchMe, getWebToken } from '../services/authService.js'

export default function MyWorkspace() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const loadUser = async () => {
      try {
        if (!getWebToken()) {
          navigate('/login', { replace: true })
          return
        }
        const payload = await fetchMe()
        setUser(payload.user || null)
      } catch {
        navigate('/login', { replace: true })
      }
    }
    loadUser()
  }, [navigate])

  const openWorkspace = () => {
    if (!user) return
    if (user.role === 'author') return navigate('/author/dashboard')
    if (user.role === 'admin') return (window.location.href = ADMIN_APP_URL)
    if (user.role === 'reviewer') return (window.location.href = REVIEWER_APP_URL)
    if (user.role === 'editor') return (window.location.href = EDITOR_APP_URL)
  }

  return (
    <>
      <section className="bg-neutral-50 pt-24">
        <div className="mx-auto max-w-4xl px-6 py-10 lg:px-0">
          <h1 className="text-3xl font-semibold text-neutral-900">My workspace</h1>
          <p className="mt-3 text-sm text-neutral-600">
            Open your role-specific workspace from here.
          </p>
          <button
            type="button"
            onClick={openWorkspace}
            className="mt-6 rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-neutral-950 transition hover:bg-emerald-400"
          >
            Open workspace
          </button>
        </div>
      </section>
      <SiteFooter />
    </>
  )
}
