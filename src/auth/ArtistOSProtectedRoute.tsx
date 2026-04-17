import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useRole } from './RoleContext';
import { type ArtistOSRole } from './roles';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  allowedRoles?: ArtistOSRole[];
}

const ROLE_HOME: Record<ArtistOSRole, string> = {
  artist_manager: '/dashboard/artist-os',
  label_partner: '/dashboard/artist-os',
  admin_team: '/dashboard/artist-os',
};

export default function ArtistOSProtectedRoute({ children, allowedRoles }: Props) {
  const { auth } = useAuth();
  const { roleState } = useRole();
  const location = useLocation();

  if (!auth.authenticated) {
    return <Navigate to="/login/artist-os" state={{ from: location }} replace />;
  }

  if (allowedRoles && roleState.role && !allowedRoles.includes(roleState.role)) {
    const home = ROLE_HOME[roleState.role];
    return <Navigate to={home} replace />;
  }

  return <>{children}</>;
}
