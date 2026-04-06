const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const normalizedApiUrl = rawApiUrl.replace(/\/+$/, '')

export const API_V1_URL = normalizedApiUrl.endsWith('/api/v1')
  ? normalizedApiUrl
  : `${normalizedApiUrl}/api/v1`
export const ADMIN_APP_URL = import.meta.env.VITE_ADMIN_APP_URL || 'http://localhost:5173'
export const STAFF_APP_URL =
  import.meta.env.VITE_STAFF_APP_URL || 'http://localhost:5178/staff/dashboard'
// Backward compatible constants (now both roles share the staff panel).
export const REVIEWER_APP_URL = import.meta.env.VITE_STAFF_APP_URL || STAFF_APP_URL
export const EDITOR_APP_URL = import.meta.env.VITE_STAFF_APP_URL || STAFF_APP_URL

/** Matches backend `GET /api/v1/news` (newsRoutes). */
export const getPublishedNewsUrl = () => `${API_V1_URL}/news?published=true`
export const getJournalsUrl = (query = '') =>
  `${API_V1_URL}/journals${query ? `?${query}` : ''}`
export const getArticlesUrl = (query = '') =>
  `${API_V1_URL}/articles${query ? `?${query}` : ''}`
export const getJournalUrl = (id) => `${API_V1_URL}/journals/${id}`
export const getArticleUrl = (id) => `${API_V1_URL}/articles/${id}`
export const getLoginUrl = () => `${API_V1_URL}/auth/login`
export const getRegisterUrl = () => `${API_V1_URL}/auth/register`
export const getMeUrl = () => `${API_V1_URL}/auth/me`
export const getPublicSettingsUrl = () => `${API_V1_URL}/settings/public`
