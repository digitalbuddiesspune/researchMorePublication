import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearToken, login, setToken } from '../services/authService.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const navigate = useNavigate()
  const { signIn } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      const payload = await login(email, password)
      const role = payload?.user?.role
      if (role !== 'editor' && role !== 'reviewer') {
        throw new Error('Only editor/reviewer accounts can use staff panel.')
      }
      setToken(payload.token)
      signIn(payload.token)
      navigate('/staff/dashboard', { replace: true })
    } catch (e) {
      clearToken()
      setError(e?.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-slate-200 p-6 antialiased">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/10">
        <h1 className="m-0 text-xl font-semibold text-slate-900">Staff Panel</h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Assign reviewers (editor) and submit reviews (reviewer).
        </p>

        <form className="mt-4 grid gap-3" onSubmit={handleSubmit}>
          {error ? (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
              {error}
            </p>
          ) : null}

          <div className="grid gap-1.5">
            <label className="text-sm font-semibold text-slate-700" htmlFor="staff-email">
              Email
            </label>
            <input
              id="staff-email"
              type="email"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="grid gap-1.5">
            <label className="text-sm font-semibold text-slate-700" htmlFor="staff-password">
              Password
            </label>
            <input
              id="staff-password"
              type="password"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </section>
    </div>
  )
}

