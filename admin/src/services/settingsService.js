import { API_V1_URL } from '../config/api'
import { authFetch } from './authService'

export const fetchSettings = async () => {
  const response = await authFetch(`${API_V1_URL}/admin/settings`)
  if (!response.ok) throw new Error('Failed to load settings')
  return response.json()
}

export const saveSettings = async (payload) => {
  const response = await authFetch(`${API_V1_URL}/admin/settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to save settings' }))
    throw new Error(error.message || 'Failed to save settings')
  }
  return response.json()
}
