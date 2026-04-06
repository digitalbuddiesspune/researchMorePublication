import { API_V1_URL } from '../config/api'
import { authFetch } from './authService'

export const fetchUsers = async () => {
  const response = await authFetch(`${API_V1_URL}/admin/users`)
  if (!response.ok) throw new Error('Failed to load users')
  return response.json()
}

export const createUser = async (payload) => {
  const response = await authFetch(`${API_V1_URL}/admin/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Create user failed' }))
    throw new Error(error.message || 'Create user failed')
  }
  return response.json()
}

export const updateUser = async (id, payload) => {
  const response = await authFetch(`${API_V1_URL}/admin/users/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Update user failed' }))
    throw new Error(error.message || 'Update user failed')
  }
  return response.json()
}

export const deleteUser = async (id) => {
  const response = await authFetch(`${API_V1_URL}/admin/users/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Delete user failed' }))
    throw new Error(error.message || 'Delete user failed')
  }
  return response.json()
}
