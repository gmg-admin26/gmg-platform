import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useRole } from './RoleContext';
import { type ArtistOSRole } from './roles';
import { ROUTES } from '../lib/routes';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  allowedRoles?: ArtistOSRole[];
}

const ROLE_HOME: Record<ArtistOSRole, string> = {
  artist_manager: ROUTES.ARTIST_OS,
  label_partner:  ROUTES.ARTIST_OS,
  admin_team:     ROUTES.ARTIST_OS,
};

export default function ArtistOSProtectedRoute({ children, allowedRoles }: Props) {
  const { auth } = useAuth();
  const { roleState } = useRole();
  const location = useLocation();

  if (!auth.authenticated) {
    return <Navigate to={ROUTES.LOGIN_ARTIST_OS} state={{ from: location }} replace />;
  }

  if (allowedRoles && roleState.role && !allowedRoles.includes(roleState.role)) {
    const home = ROLE_HOME[roleState.role];
    return <Navigate to={home} replace />;
  }

  return <>{children}</>;
}
