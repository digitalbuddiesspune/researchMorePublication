import { API_V1_URL } from '../config/api.js'

const TOKEN_KEY = 'token'

export const getToken = () => localStorage.getItem(TOKEN_KEY) || ''
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token)
export const clearToken = () => localStorage.removeItem(TOKEN_KEY)

export const login = async (email, password) => {
  const response = await fetch(`${API_V1_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Login failed' }))
    throw new Error(error.message || 'Login failed')
  }
  return response.json()
}

export const me = async () => {
  const token = getToken()
  if (!token) throw new Error('Unauthorized')
  const response = await fetch(`${API_V1_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) throw new Error('Unauthorized')
  return response.json()
}

export const authFetch = async (path, options = {}) => {
  const token = getToken()
  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
  return fetch(`${API_V1_URL}${path}`, { ...options, headers })
}

