import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ allowedRoles, user, children }) {
  if (!user) {
    return <Navigate to="/staff/login" replace />
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Role mismatch: block access by redirecting to staff dashboard.
    return <Navigate to="/staff/dashboard" replace />
  }
  return children
}

