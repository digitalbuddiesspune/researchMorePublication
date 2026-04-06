import { API_V1_URL } from '../config/api'

const ADMIN_TOKEN_KEY = 'admin_token'

export const getAdminToken = () => localStorage.getItem(ADMIN_TOKEN_KEY) || ''
export const setAdminToken = (token) => localStorage.setItem(ADMIN_TOKEN_KEY, token)
export const clearAdminToken = () => localStorage.removeItem(ADMIN_TOKEN_KEY)

export const loginAdmin = async (email, password) => {
  const response = await fetch(`${API_V1_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Login failed' }))
    throw new Error(error.message || 'Login failed')
  }

  const payload = await response.json()
  return payload
}

export const fetchCurrentUser = async () => {
  const token = getAdminToken()
  if (!token) throw new Error('Authentication required')

  const response = await fetch(`${API_V1_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) throw new Error('Session expired')

  const payload = await response.json()
  return payload.user
}

export const authFetch = async (url, options = {}) => {
  const token = getAdminToken()
  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
  return fetch(url, { ...options, headers })
}
