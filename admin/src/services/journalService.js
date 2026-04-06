import { API_V1_URL } from '../config/api'
import { authFetch } from './authService'

export const fetchJournals = async () => {
  const response = await authFetch(`${API_V1_URL}/admin/journals`)
  if (!response.ok) throw new Error('Failed to load journals')
  return response.json()
}

export const createJournal = async (payload) => {
  const response = await authFetch(`${API_V1_URL}/admin/journals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to create journal' }))
    throw new Error(error.message || 'Failed to create journal')
  }
  return response.json()
}

export const updateJournal = async (id, payload) => {
  const response = await authFetch(`${API_V1_URL}/admin/journals/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to update journal' }))
    throw new Error(error.message || 'Failed to update journal')
  }
  return response.json()
}

export const deleteJournal = async (id) => {
  const response = await authFetch(`${API_V1_URL}/admin/journals/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to delete journal' }))
    throw new Error(error.message || 'Failed to delete journal')
  }
  return response.json()
}
