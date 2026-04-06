import { API_V1_URL, getLoginUrl, getMeUrl, getRegisterUrl } from '../config/api.js'

const WEB_TOKEN_KEY = 'web_token'

export const getWebToken = () => localStorage.getItem(WEB_TOKEN_KEY) || ''
export const setWebToken = (token) => localStorage.setItem(WEB_TOKEN_KEY, token)
export const clearWebToken = () => localStorage.removeItem(WEB_TOKEN_KEY)

export const loginUser = async ({ email, password }) => {
  const response = await fetch(getLoginUrl(), {
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

export const registerUser = async ({ name, email, password }) => {
  const response = await fetch(getRegisterUrl(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Registration failed' }))
    throw new Error(error.message || 'Registration failed')
  }
  return response.json()
}

export const fetchMe = async () => {
  const token = getWebToken()
  if (!token) throw new Error('Authentication required')

  const response = await fetch(getMeUrl(), {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) throw new Error('Session expired')
  return response.json()
}

export const authFetch = async (path, options = {}) => {
  const token = getWebToken()
  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
  return fetch(`${API_V1_URL}${path}`, {
    ...options,
    headers,
  })
}
