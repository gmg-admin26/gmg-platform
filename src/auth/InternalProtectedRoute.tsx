import { Navigate, useLocation } from 'react-router-dom';
import { useSystemRole } from './AuthContext';
import type { ReactNode } from 'react';

export default function InternalProtectedRoute({ children }: { children: ReactNode }) {
  const { systemRole, access } = useSystemRole();
  const location = useLocation();

  if (!systemRole) {
    return <Navigate to="/login/rocksteady" state={{ from: location }} replace />;
  }

  if (systemRole === 'ARTIST') {
    return <Navigate to="/dashboard/artist-os" replace />;
  }

  if (systemRole === 'CATALOG_CLIENT') {
    return <Navigate to="/catalog/app" replace />;
  }

  if (!access.canAccessAdminOS) {
    return <Navigate to="/login/rocksteady" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
