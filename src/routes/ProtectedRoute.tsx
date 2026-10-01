import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export function ProtectedRoute() {
  const { session, loading } = useAuth()

  if (loading) return <p>Cargando...</p>
  if (!session) return <Navigate to="/login" replace />
  return <Outlet />
}
