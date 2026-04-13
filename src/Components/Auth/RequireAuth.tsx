import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../storage/AuthContext'

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace state={{ from: location.pathname }} />
  }

  return children
}
