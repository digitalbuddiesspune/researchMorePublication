import { API_V1_URL } from '../config/api'

export const fetchStats = async () => {
  const response = await fetch(`${API_V1_URL}/stats`)
  if (!response.ok) throw new Error('Failed to load stats')
  return response.json()
}
