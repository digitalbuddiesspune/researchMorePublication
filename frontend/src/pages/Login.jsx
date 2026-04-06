import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  ADMIN_APP_URL,
  EDITOR_APP_URL,
  REVIEWER_APP_URL,
} from '../config/api.js'
import { fetchMe, getWebToken, loginUser, registerUser, setWebToken } from '../services/authService.js'

export default function Login({ forceRegisterMode = false }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRegisterMode, setIsRegisterMode] = useState(forceRegisterMode)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const next = searchParams.get('next') || '/author/dashboard'


  const redirectByRole = (payload) => {
    if (payload.user?.role === 'admin') {
      window.location.href = ADMIN_APP_URL
      return
    }
    if (payload.user?.role === 'author') {
      navigate(next, { replace: true })
      return
    }
    if (payload.user?.role === 'reviewer') {
      window.location.href = REVIEWER_APP_URL
      return
    }
    if (payload.user?.role === 'editor') {
      window.location.href = EDITOR_APP_URL
      return
    }
    navigate('/', { replace: true })
  }

  const handleLogin = async () => {
    const payload = await loginUser({ email, password })
    setWebToken(payload.token)
    redirectByRole(payload)
  }

  const handleRegister = async () => {
    const payload = await registerUser({ name, email, password })
    setWebToken(payload.token)
    redirectByRole(payload)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      if (isRegisterMode) {
        await handleRegister()
      } else {
        await handleLogin()
      }
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (forceRegisterMode) setIsRegisterMode(true)
  }, [forceRegisterMode])

  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        if (!getWebToken()) return
        const payload = await fetchMe()
        redirectByRole(payload)
      } catch {
        // Ignore and stay on login form.
      }
    }
    checkExistingSession()
  }, [searchParams])

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white px-6 py-8 shadow-sm ring-1 ring-neutral-200">
        <div className="mb-4 flex items-center justify-between text-sm">
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-700"
          >
            ← Back to home
          </Link>
        </div>

        <h1 className="text-center text-2xl font-semibold text-neutral-900">Login</h1>
        <p className="mt-2 text-center text-sm text-neutral-600">
          {isRegisterMode ? 'Already have an account?' : "Don't have an account?"}{' '}
          {isRegisterMode ? (
            <Link className="font-semibold text-blue-600 hover:text-blue-700" to={`/login?next=${encodeURIComponent(next)}`}>
              Login
            </Link>
          ) : (
            <Link className="font-semibold text-blue-600 hover:text-blue-700" to={`/register?next=${encodeURIComponent(next)}`}>
              Register
            </Link>
          )}
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
          {isRegisterMode ? (
            <div className="space-y-1">
              <label className="block text-sm font-medium text-neutral-800">
                Full name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                className="h-11 w-full rounded-lg border border-neutral-300 bg-neutral-50 px-3 text-sm text-neutral-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500"
                placeholder="Your full name"
                required
              />
            </div>
          ) : null}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-neutral-800">
              Email address<span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              className="h-11 w-full rounded-lg border border-neutral-300 bg-neutral-50 px-3 text-sm text-neutral-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-neutral-800">
              Password<span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={isRegisterMode ? 'new-password' : 'current-password'}
              className="h-11 w-full rounded-lg border border-neutral-300 bg-neutral-50 px-3 text-sm text-neutral-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-neutral-700">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Remember me</span>
            </label>
            <button className="text-blue-600 hover:text-blue-700">
              Forgot password
            </button>
          </div>

          <button type="submit" disabled={isLoading} className="mt-4 h-11 w-full rounded-full bg-blue-600 text-sm font-semibold text-white shadow-md hover:bg-blue-700">
            {isLoading ? (isRegisterMode ? 'Creating account...' : 'Logging in...') : isRegisterMode ? 'Create account' : 'Log in with email'}
          </button>
        </form>
      </div>
    </div>
  )
}

