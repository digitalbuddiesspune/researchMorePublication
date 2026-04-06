import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Submissions from './pages/Submissions.jsx'
import Assignments from './pages/Assignments.jsx'
import SubmissionView from './pages/SubmissionView.jsx'
import ReviewForm from './pages/ReviewForm.jsx'
import DecisionPanel from './pages/DecisionPanel.jsx'
import DecisionQueue from './pages/DecisionQueue.jsx'
import Messages from './pages/Messages.jsx'
import ProtectedRoute from './routes/ProtectedRoute.jsx'
import StaffShell from './components/StaffShell.jsx'

export default function App() {
  const { user, loading } = useAuth()

  // While auth loads, keep routes stable.
  if (loading) return null

  return (
    <Routes>
      <Route path="/staff/login" element={<Login />} />

      <Route
        path="/staff"
        element={
          <ProtectedRoute allowedRoles={['editor', 'reviewer']} user={user}>
            <StaffShell />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route
          path="submissions"
          element={
            <ProtectedRoute allowedRoles={['editor']} user={user}>
              <Submissions />
            </ProtectedRoute>
          }
        />
        <Route
          path="assignments"
          element={
            <ProtectedRoute allowedRoles={['reviewer']} user={user}>
              <Assignments />
            </ProtectedRoute>
          }
        />
        <Route path="submissions/:id" element={<SubmissionView />} />
        <Route
          path="review/:id"
          element={
            <ProtectedRoute allowedRoles={['reviewer']} user={user}>
              <ReviewForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="decision/:id"
          element={
            <ProtectedRoute allowedRoles={['editor']} user={user}>
              <DecisionPanel />
            </ProtectedRoute>
          }
        />
        <Route
          path="decisions"
          element={
            <ProtectedRoute allowedRoles={['editor']} user={user}>
              <DecisionQueue />
            </ProtectedRoute>
          }
        />
        <Route
          path="messages"
          element={
            <ProtectedRoute allowedRoles={['editor']} user={user}>
              <Messages />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route
        path="*"
        element={
          user ? (
            <Navigate to="/staff/dashboard" replace />
          ) : (
            <Navigate to="/staff/login" replace />
          )
        }
      />
    </Routes>
  )
}

