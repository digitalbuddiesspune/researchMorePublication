import { API_V1_URL } from '../config/api'
import { authFetch } from './authService'

export const fetchStats = async () => {
  const response = await authFetch(`${API_V1_URL}/stats`)
  if (!response.ok) throw new Error('Failed to load stats')
  return response.json()
}

export const fetchAdminAnalytics = async () => {
  const response = await authFetch(`${API_V1_URL}/admin/analytics`)
  if (!response.ok) throw new Error('Failed to load admin analytics')
  return response.json()
}
