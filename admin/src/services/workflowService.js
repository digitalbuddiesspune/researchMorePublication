import { API_V1_URL } from '../config/api'
import { authFetch } from './authService'

export const fetchEditorSubmissions = async () => {
  const response = await authFetch(`${API_V1_URL}/editor/submissions`)
  if (!response.ok) throw new Error('Failed to load submissions')
  return response.json()
}

export const fetchReviewers = async () => {
  const response = await authFetch(`${API_V1_URL}/editor/reviewers`)
  if (!response.ok) throw new Error('Failed to load reviewers')
  return response.json()
}

export const assignReviewerToSubmission = async (submissionId, reviewerEmail) => {
  const response = await authFetch(`${API_V1_URL}/editor/submissions/${submissionId}/assign-reviewer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reviewerEmail }),
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Assign reviewer failed' }))
    throw new Error(error.message || 'Assign reviewer failed')
  }
  return response.json()
}

export const applySubmissionDecision = async (submissionId, decision, note) => {
  const response = await authFetch(`${API_V1_URL}/editor/submissions/${submissionId}/decision`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ decision, note }),
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Apply decision failed' }))
    throw new Error(error.message || 'Apply decision failed')
  }
  return response.json()
}
