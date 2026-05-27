import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) return <Navigate to="/login" replace />

  if (user.role === 'payment-entity' && !location.pathname.startsWith(`/payment-entity/${user.scope}`)) {
    return <Navigate to={`/payment-entity/${user.scope}`} replace />
  }
  if (user.role === 'publisher' && !location.pathname.startsWith(`/publisher/${user.scope}`)) {
    return <Navigate to={`/publisher/${user.scope}`} replace />
  }

  return children
}

export default ProtectedRoute
