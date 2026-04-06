import { useState } from 'react'
import { tw } from '../lib/adminUi'
import { clearAdminToken, loginAdmin, setAdminToken } from '../services/authService'

export default function AdminLogin({ onSuccess, message: initialMessage }) {
  const [message, setMessage] = useState(initialMessage || '')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = e.target
    const email = form.email.value?.trim() || ''
    const password = form.password.value || ''
    setSubmitting(true)
    setMessage('')
    try {
      const payload = await loginAdmin(email, password)
      if (payload.user?.role !== 'admin') throw new Error('Only admin users are allowed in this panel.')
      setAdminToken(payload.token)
      onSuccess()
    } catch (err) {
      clearAdminToken()
      setMessage(err.message || 'Login failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="grid min-h-screen place-items-center bg-gradient-to-b from-slate-50 to-slate-200/90 p-6">
      <form
        className={`${tw.card} grid w-full max-w-md gap-4 shadow-lg ring-slate-950/[0.06]`}
        onSubmit={handleSubmit}
      >
        <div>
          <h1 className="m-0 text-xl font-semibold tracking-tight text-slate-900">Admin sign in</h1>
          <p className={`${tw.muted} mt-1`}>Use an admin account to open the console.</p>
        </div>
        {message ? (
          <p className="m-0 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800">{message}</p>
        ) : null}
        <label className={tw.label}>
          <span className={tw.labelText}>Email</span>
          <input
            type="email"
            name="email"
            required
            placeholder="admin@example.com"
            autoComplete="username"
            className={tw.input}
          />
        </label>
        <label className={tw.label}>
          <span className={tw.labelText}>Password</span>
          <input
            type="password"
            name="password"
            required
            placeholder="••••••••"
            autoComplete="current-password"
            className={tw.input}
          />
        </label>
        <button type="submit" disabled={submitting} className={`${tw.btnPrimary} w-full`}>
          {submitting ? 'Signing in…' : 'Continue'}
        </button>
      </form>
    </section>
  )
}
