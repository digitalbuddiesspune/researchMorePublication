import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { clearToken, getToken, me, setToken } from '../services/authService.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const logout = useCallback(() => {
    clearToken()
    setUser(null)
    setError('')
  }, [])

  const signIn = useCallback(async (token) => {
    setLoading(true)
    setError('')
    try {
      setToken(token)
      const payload = await me()
      const role = payload?.user?.role
      if (!role || !['editor', 'reviewer'].includes(role)) {
        setUser(null)
        setError('Access denied for staff panel.')
        return
      }
      setUser({ id: payload.user.id, role, name: payload.user.name, email: payload.user.email })
    } catch {
      setUser(null)
      setError('Session expired. Please login again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let isMounted = true
    const resolveAuth = async () => {
      try {
        const token = getToken()
        if (!token) {
          if (!isMounted) return
          setUser(null)
          setError('')
          return
        }
        const payload = await me()
        const role = payload?.user?.role
        if (!role || !['editor', 'reviewer'].includes(role)) {
          if (!isMounted) return
          setUser(null)
          setError('Access denied for staff panel.')
          return
        }
        if (!isMounted) return
        setUser({ id: payload.user.id, role, name: payload.user.name, email: payload.user.email })
      } catch {
        if (!isMounted) return
        setUser(null)
        setError('Session expired. Please login again.')
      } finally {
        if (!isMounted) return
        setLoading(false)
      }
    }
    resolveAuth()
    return () => {
      isMounted = false
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      logout,
      signIn,
    }),
    [user, loading, error, logout, signIn],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

