import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SiteFooter from '../sections/SiteFooter.jsx'
import { fetchMe, getWebToken } from '../services/authService.js'

export default function MyProfile() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const loadProfile = async () => {
      try {
        if (!getWebToken()) {
          navigate('/login', { replace: true })
          return
        }
        const payload = await fetchMe()
        setUser(payload.user || null)
      } catch {
        navigate('/login', { replace: true })
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [navigate])

  return (
    <>
      <section className="bg-neutral-50 pt-24">
        <div className="mx-auto max-w-4xl px-6 py-10 lg:px-0">
          <h1 className="text-3xl font-semibold text-neutral-900">My profile</h1>
          {loading ? (
            <p className="mt-4 text-sm text-neutral-600">Loading profile...</p>
          ) : (
            <div className="mt-6 rounded-xl bg-white p-6 shadow-sm shadow-neutral-200">
              <p className="text-sm text-neutral-500">Name</p>
              <p className="text-lg font-semibold text-neutral-900">{user?.name || '-'}</p>
              <p className="mt-4 text-sm text-neutral-500">Email</p>
              <p className="text-base text-neutral-800">{user?.email || '-'}</p>
              <p className="mt-4 text-sm text-neutral-500">Role</p>
              <p className="text-base capitalize text-neutral-800">{user?.role || '-'}</p>
              <p className="mt-4 text-sm text-neutral-500">Status</p>
              <p className="text-base capitalize text-neutral-800">{user?.status || '-'}</p>
            </div>
          )}
        </div>
      </section>
      <SiteFooter />
    </>
  )
}
