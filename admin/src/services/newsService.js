import { API_V1_URL } from '../config/api'

export const fetchNews = async () => {
  const response = await fetch(`${API_V1_URL}/news`)
  if (!response.ok) throw new Error('Failed to load news')
  return response.json()
}

export const createNews = async (payload) => {
  const response = await fetch(`${API_V1_URL}/create-news`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Save failed' }))
    throw new Error(error.message || 'Save failed')
  }
}

export const updateNews = async (id, payload) => {
  const response = await fetch(`${API_V1_URL}/update-news/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Save failed' }))
    throw new Error(error.message || 'Save failed')
  }
}

export const removeNews = async (id) => {
  const response = await fetch(`${API_V1_URL}/delete-news/${id}`, { method: 'DELETE' })
  if (!response.ok) throw new Error('Delete failed')
}
