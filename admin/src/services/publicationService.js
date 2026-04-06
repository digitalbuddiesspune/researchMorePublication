import { API_V1_URL } from '../config/api'
import { authFetch } from './authService'

export const fetchPublications = async () => {
  const response = await authFetch(`${API_V1_URL}/publications`)
  if (!response.ok) throw new Error('Failed to load publications')
  return response.json()
}

export const getPublication = async (id) => {
  const response = await authFetch(`${API_V1_URL}/get-publication/${id}`)
  if (!response.ok) throw new Error('Publication not found')
  return response.json()
}

export const createPublication = async (payload) => {
  const response = await authFetch(`${API_V1_URL}/create-publication`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Save failed' }))
    throw new Error(error.message || 'Save failed')
  }
}

export const updatePublication = async (id, payload) => {
  const response = await authFetch(`${API_V1_URL}/update-publication/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Save failed' }))
    throw new Error(error.message || 'Save failed')
  }
}

export const removePublication = async (id) => {
  const response = await authFetch(`${API_V1_URL}/delete-publication/${id}`, { method: 'DELETE' })
  if (!response.ok) throw new Error('Delete failed')
}
