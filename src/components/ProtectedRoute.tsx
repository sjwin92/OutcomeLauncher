import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import type { Role } from '../data/types'
import { useStore } from '../data/store'
import { isAdminEmail } from '../lib/utils'

export function ProtectedRoute({
  children,
  role,
  adminOnly = false,
}: {
  children: ReactNode
  role?: Role
  adminOnly?: boolean
}) {
  const { currentUser } = useStore()
  const location = useLocation()

  if (!currentUser) {
    return <Navigate to="/signin" replace state={{ from: location.pathname }} />
  }
  if (adminOnly && !isAdminEmail(currentUser.email)) {
    return <Navigate to="/dashboard" replace />
  }
  if (role && currentUser.role !== role) {
    return <Navigate to="/dashboard" replace />
  }
  return children
}
