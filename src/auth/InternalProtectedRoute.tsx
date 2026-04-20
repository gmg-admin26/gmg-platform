import { Navigate, useLocation } from 'react-router-dom';
import { useSystemRole } from './AuthContext';
import { ROUTES } from '../lib/routes';
import type { ReactNode } from 'react';

export default function InternalProtectedRoute({ children }: { children: ReactNode }) {
  const { systemRole, access } = useSystemRole();
  const location = useLocation();

  if (!systemRole) {
    return <Navigate to={ROUTES.LOGIN_ROCKSTEADY} state={{ from: location }} replace />;
  }

  if (systemRole === 'ARTIST') {
    return <Navigate to={ROUTES.ARTIST_OS} replace />;
  }

  if (systemRole === 'CATALOG_CLIENT') {
    return <Navigate to={ROUTES.CATALOG_APP} replace />;
  }

  if (!access.canAccessAdminOS) {
    return <Navigate to={ROUTES.LOGIN_ROCKSTEADY} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
