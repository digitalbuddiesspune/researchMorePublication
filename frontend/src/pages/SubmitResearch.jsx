import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SiteFooter from '../sections/SiteFooter.jsx'
import { fetchMe, getWebToken } from '../services/authService.js'

export default function SubmitResearch() {
  const navigate = useNavigate()
  const [isChecking, setIsChecking] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const checkUser = async () => {
      try {
        if (!getWebToken()) {
          navigate('/login?next=/author/submit', { replace: true })
          return
        }
        const payload = await fetchMe()
        const sessionUser = payload.user || null
        if (sessionUser?.role !== 'author') {
          navigate('/login?next=/author/submit', { replace: true })
          return
        }
        setUser(sessionUser)
      } catch {
        navigate('/login?next=/author/submit', { replace: true })
      } finally {
        setIsChecking(false)
      }
    }
    checkUser()
  }, [navigate])

  const openAuthorFlow = () => {
    if (user?.role === 'author') {
      navigate('/author/submit')
      return
    }
    navigate('/login?next=/author/submit')
  }

  return (
    <>
      <section className="bg-neutral-50 pt-24">
        <div className="mx-auto max-w-4xl px-6 py-12 lg:px-0">
          <h1 className="text-3xl font-semibold text-neutral-900">Submit your research</h1>
          <p className="mt-3 text-sm leading-relaxed text-neutral-700">
            Start your submission journey by preparing your manuscript details below.
            This is the initial page for the author submission workflow.
          </p>

          <div className="mt-8 grid gap-4 rounded-xl bg-white p-5 shadow-sm shadow-neutral-200">
            <input
              type="text"
              placeholder="Manuscript title"
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
            <input
              type="text"
              placeholder="Primary author"
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
            <textarea
              rows={5}
              placeholder="Abstract"
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={openAuthorFlow}
              disabled={isChecking}
              className="w-fit rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-neutral-950 transition hover:bg-emerald-400 disabled:opacity-60"
            >
              {isChecking ? 'Checking session...' : 'Continue submission'}
            </button>
          </div>
        </div>
      </section>
      <SiteFooter />
    </>
  )
}
