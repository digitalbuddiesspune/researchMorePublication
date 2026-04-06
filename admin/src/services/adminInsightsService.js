import { API_V1_URL } from '../config/api'
import { authFetch } from './authService'

const readJson = async (response, fallback) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: fallback }))
    throw new Error(error.message || fallback)
  }
  return response.json()
}

export const fetchSubmissionsMonitor = async () =>
  readJson(await authFetch(`${API_V1_URL}/admin/submissions-monitor`), 'Failed to load submissions monitor')

export const fetchReviewOversight = async () =>
  readJson(await authFetch(`${API_V1_URL}/admin/review-oversight`), 'Failed to load review oversight')

export const fetchAdminPublications = async () =>
  readJson(await authFetch(`${API_V1_URL}/admin/publications`), 'Failed to load publications')

export const updateAdminPublication = async (id, payload) =>
  readJson(
    await authFetch(`${API_V1_URL}/admin/publications/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
    'Failed to update publication'
  )

export const fetchAdminTrends = async () =>
  readJson(await authFetch(`${API_V1_URL}/admin/analytics/trends`), 'Failed to load analytics trends')

