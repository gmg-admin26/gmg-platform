import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, useSystemRole } from './AuthContext';
import { ROUTES } from '../lib/routes';
import type { ReactNode } from 'react';
import { Lock, ArrowRight } from 'lucide-react';

function AccessDeniedScreen() {
  const { catalogOSAuth } = useAuth();

  return (
    <div className="min-h-screen bg-[#040D09] flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.18)' }}>
          <Lock className="w-7 h-7 text-[#10B981]" />
        </div>

        <p className="text-[9.5px] font-mono text-[#10B981]/50 uppercase tracking-widest mb-3">
          Access Required
        </p>
        <h1 className="text-[22px] font-bold text-white/90 mb-3 tracking-tight">
          Catalog OS Access Required
        </h1>
        <p className="text-[13px] text-white/40 leading-relaxed mb-8 max-w-sm mx-auto">
          Your account ({catalogOSAuth.email}) does not have access to Catalog OS.
          Access is provisioned directly by Greater Music Group for approved catalog operators and partners.
        </p>

        <a
          href="mailto:catalog@gmg.ai?subject=Catalog OS Access Request"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-[13px] font-semibold transition-all"
          style={{
            background: 'linear-gradient(135deg,rgba(16,185,129,0.16),rgba(5,150,105,0.1))',
            border: '1px solid rgba(16,185,129,0.28)',
            color: 'rgba(52,211,153,0.95)',
          }}
        >
          Request Access
          <ArrowRight className="w-4 h-4" />
        </a>

        <p className="mt-6 text-[11px] text-white/20">
          Contact Greater Music Group to be provisioned for Catalog OS
        </p>
      </div>
    </div>
  );
}

interface Props {
  children: ReactNode;
  requiredRole?: 'catalog_owner' | 'catalog_admin';
}

export default function CatalogOSProtectedRoute({ children, requiredRole }: Props) {
  const { catalogOSAuth, auth, rocksteadyAuth } = useAuth();
  const { systemRole, access } = useSystemRole();
  const location = useLocation();

  const isAnythingAuthenticated =
    catalogOSAuth.authenticated || auth.authenticated || rocksteadyAuth.authenticated;

  if (!isAnythingAuthenticated || !systemRole) {
    return <Navigate to={ROUTES.LOGIN_CATALOG_ALT} state={{ from: location }} replace />;
  }

  if (systemRole === 'ARTIST') {
    return <Navigate to={ROUTES.ARTIST_OS} replace />;
  }

  if (!access.canAccessCatalogOS) {
    return <Navigate to={ROUTES.LOGIN_CATALOG_ALT} state={{ from: location }} replace />;
  }

  if (systemRole === 'CATALOG_CLIENT') {
    if (requiredRole && catalogOSAuth.role !== requiredRole && catalogOSAuth.role !== 'catalog_admin') {
      return <AccessDeniedScreen />;
    }
  }

  return <>{children}</>;
}
