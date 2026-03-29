import { API_V1_URL } from '../config/api'

export const subscribeNewsletter = async (payload) => {
  const response = await fetch(`${API_V1_URL}/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Subscribe failed' }))
    throw new Error(error.message || 'Subscribe failed')
  }
  return response.json()
}
