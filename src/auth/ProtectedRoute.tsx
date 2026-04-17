import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import type { ReactNode } from 'react';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { rocksteadyAuth } = useAuth();
  const location = useLocation();

  if (!rocksteadyAuth.authenticated) {
    return <Navigate to="/login/rocksteady" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
