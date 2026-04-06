const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const normalizedApiUrl = rawApiUrl.replace(/\/+$/, '')

export const API_V1_URL = normalizedApiUrl.endsWith('/api/v1')
  ? normalizedApiUrl
  : `${normalizedApiUrl}/api/v1`

