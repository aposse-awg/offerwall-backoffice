import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) return <Navigate to="/login" replace />

  if (user.role === 'carrier' && !location.pathname.startsWith(`/carrier/${user.scope}`)) {
    return <Navigate to={`/carrier/${user.scope}`} replace />
  }
  if (user.role === 'publisher' && !location.pathname.startsWith(`/publisher/${user.scope}`)) {
    return <Navigate to={`/publisher/${user.scope}`} replace />
  }

  return children
}

export default ProtectedRoute
