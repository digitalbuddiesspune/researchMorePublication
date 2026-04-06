import { API_V1_URL } from '../config/api'
import { authFetch } from './authService'

export const fetchAuditLogs = async (limit = 100) => {
  const response = await authFetch(`${API_V1_URL}/admin/logs?limit=${limit}`)
  if (!response.ok) throw new Error('Failed to load audit logs')
  return response.json()
}
