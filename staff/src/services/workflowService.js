import { authFetch } from './authService.js'

export const fetchEditorSubmissions = async () => {
  const res = await authFetch('/editor/submissions')
  if (!res.ok) throw new Error('Could not load submissions')
  return res.json()
}

export const fetchEditorSubmissionById = async (id) => {
  const res = await authFetch(`/editor/submissions/${id}`)
  if (!res.ok) throw new Error('Could not load submission detail')
  return res.json()
}

export const fetchEditorReviewers = async () => {
  const res = await authFetch('/editor/reviewers')
  if (!res.ok) throw new Error('Could not load reviewers')
  return res.json()
}

export const assignReviewerToSubmission = async (submissionId, reviewerEmail) => {
  const res = await authFetch(`/editor/submissions/${submissionId}/assign-reviewer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reviewerEmail }),
  })
  if (!res.ok) {
    const apiError = await res.json().catch(() => ({ message: 'Could not assign reviewer' }))
    throw new Error(apiError.message || 'Could not assign reviewer')
  }
  return res.json()
}

export const applySubmissionDecision = async (submissionId, decision, note) => {
  const res = await authFetch(`/editor/submissions/${submissionId}/decision`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ decision, note: note || '' }),
  })
  if (!res.ok) {
    const apiError = await res.json().catch(() => ({ message: 'Could not set decision' }))
    throw new Error(apiError.message || 'Could not set decision')
  }
  return res.json()
}

export const fetchReviewerAssignments = async () => {
  const res = await authFetch('/reviewer/assignments')
  if (!res.ok) throw new Error('Could not load assignments')
  return res.json()
}

export const fetchReviewerAssignmentById = async (id) => {
  const res = await authFetch(`/reviewer/assignments/${id}`)
  if (!res.ok) throw new Error('Could not load assignment detail')
  return res.json()
}

export const fetchReviewerSubmissionById = async (id) => {
  const res = await authFetch(`/reviewer/submissions/${id}`)
  if (!res.ok) throw new Error('Could not load reviewer submission detail')
  return res.json()
}

export const submitReviewerDecision = async (assignmentId, recommendation, comments) => {
  const res = await authFetch(`/reviewer/assignments/${assignmentId}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ recommendation, comments: comments || '' }),
  })
  if (!res.ok) {
    const apiError = await res.json().catch(() => ({ message: 'Could not submit review' }))
    throw new Error(apiError.message || 'Could not submit review')
  }
  return res.json()
}

export const fetchSubmissionMessages = async (submissionId) => {
  const res = await authFetch(`/submissions/${submissionId}/messages`)
  if (!res.ok) {
    const apiError = await res.json().catch(() => ({ message: 'Could not load messages' }))
    throw new Error(apiError.message || 'Could not load messages')
  }
  return res.json()
}

export const postSubmissionMessage = async (submissionId, message) => {
  const res = await authFetch(`/submissions/${submissionId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  })
  if (!res.ok) {
    const apiError = await res.json().catch(() => ({ message: 'Could not send message' }))
    throw new Error(apiError.message || 'Could not send message')
  }
  return res.json()
}

