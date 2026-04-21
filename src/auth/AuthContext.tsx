import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { ROLE_USERS, CATALOG_OS_USERS, SYSTEM_ACCESS, type SystemRole, type CatalogOSUser } from './roles';

export const AOS_KEY_AUTH = 'artistos_authenticated';
export const AOS_KEY_USER = 'artistos_user';

export const RS_KEY_AUTH = 'rocksteady_authenticated';
export const RS_KEY_USER = 'rocksteady_user';

export const COS_KEY_AUTH = 'catalogos_authenticated';
export const COS_KEY_USER = 'catalogos_user';
export const COS_KEY_ROLE = 'catalogos_role';
export const COS_KEY_CLIENT_ID = 'catalogos_client_id';

interface AuthState {
  authenticated: boolean;
  email: string;
}

interface CatalogOSAuthState extends AuthState {
  role: string;
  clientId: string;
}

interface AuthContextValue {
  auth: AuthState;
  rocksteadyAuth: AuthState;
  catalogOSAuth: CatalogOSAuthState;
  login: (email: string, password: string) => boolean;
  loginRocksteady: (email: string, password: string) => boolean;
  loginCatalogOS: (email: string, password: string) => boolean;
  logout: () => void;
  logoutRocksteady: () => void;
  logoutCatalogOS: () => void;
  clearSession: () => void;
}

const ROCKSTEADY_CREDS = [
  { email: 'admin@gmg.ai', password: 'rocksteady123' },
  { email: 'admin@gmgtest.com', password: 'GMGadmin123!' },
  { email: 'operator@gmgtest.com', password: 'GMGoperator123!' },
];

function isValidArtistOS(email: string, password: string): boolean {
  return ROLE_USERS.some(u => u.email === email && u.password === password);
}

function isValidRocksteady(email: string, password: string): boolean {
  return ROCKSTEADY_CREDS.some(c => c.email === email && c.password === password)
    || ROLE_USERS.some(u => u.email === email && u.password === password);
}


function persist(authKey: string, userKey: string, email: string) {
  localStorage.setItem(authKey, 'true');
  localStorage.setItem(userKey, email);
  sessionStorage.setItem(authKey, 'true');
  sessionStorage.setItem(userKey, email);
}

function wipe(authKey: string, userKey: string) {
  localStorage.removeItem(authKey);
  localStorage.removeItem(userKey);
  sessionStorage.removeItem(authKey);
  sessionStorage.removeItem(userKey);
}

function load(authKey: string, userKey: string): AuthState {
  try {
    const flag = localStorage.getItem(authKey) || sessionStorage.getItem(authKey);
    const user = localStorage.getItem(userKey) || sessionStorage.getItem(userKey);
    if (flag === 'true' && user) return { authenticated: true, email: user };
  } catch {}
  return { authenticated: false, email: '' };
}

function loadCatalogOS(): CatalogOSAuthState {
  try {
    const flag = localStorage.getItem(COS_KEY_AUTH) || sessionStorage.getItem(COS_KEY_AUTH);
    const user = localStorage.getItem(COS_KEY_USER) || sessionStorage.getItem(COS_KEY_USER);
    const role = localStorage.getItem(COS_KEY_ROLE) || sessionStorage.getItem(COS_KEY_ROLE);
    const clientId = localStorage.getItem(COS_KEY_CLIENT_ID) || sessionStorage.getItem(COS_KEY_CLIENT_ID) || '';
    if (flag === 'true' && user && role) return { authenticated: true, email: user, role, clientId };
  } catch {}
  return { authenticated: false, email: '', role: '', clientId: '' };
}

export function clearRocksteadySession() {
  wipe(RS_KEY_AUTH, RS_KEY_USER);
  wipe('rocksteady_authenticated', 'rocksteady_user');
}

export function clearArtistOSSession() {
  wipe(AOS_KEY_AUTH, AOS_KEY_USER);
}

export function clearCatalogOSSession() {
  wipe(COS_KEY_AUTH, COS_KEY_USER);
  localStorage.removeItem(COS_KEY_ROLE);
  sessionStorage.removeItem(COS_KEY_ROLE);
  localStorage.removeItem(COS_KEY_CLIENT_ID);
  sessionStorage.removeItem(COS_KEY_CLIENT_ID);
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(() => load(AOS_KEY_AUTH, AOS_KEY_USER));
  const [rocksteadyAuth, setRocksteadyAuth] = useState<AuthState>(() => load(RS_KEY_AUTH, RS_KEY_USER));
  const [catalogOSAuth, setCatalogOSAuth] = useState<CatalogOSAuthState>(loadCatalogOS);

  const login = useCallback((email: string, password: string): boolean => {
    if (!isValidArtistOS(email, password)) return false;
    persist(AOS_KEY_AUTH, AOS_KEY_USER, email);
    setAuth({ authenticated: true, email });
    return true;
  }, []);

  const loginRocksteady = useCallback((email: string, password: string): boolean => {
    if (!isValidRocksteady(email, password)) return false;
    persist(RS_KEY_AUTH, RS_KEY_USER, email);
    setRocksteadyAuth({ authenticated: true, email });
    const aosUser = ROLE_USERS.find(u => u.email === email && u.password === password && u.role === 'admin_team');
    if (aosUser) {
      persist(AOS_KEY_AUTH, AOS_KEY_USER, email);
      localStorage.setItem('artistos_role', 'admin_team');
      sessionStorage.setItem('artistos_role', 'admin_team');
      setAuth({ authenticated: true, email });
    }
    return true;
  }, []);

  const loginCatalogOS = useCallback((email: string, password: string): boolean => {
    const match = CATALOG_OS_USERS.find(u => u.email === email && u.password === password);
    if (!match) return false;
    const role = match.role;
    const clientId = match.clientId ?? '';
    persist(COS_KEY_AUTH, COS_KEY_USER, email);
    localStorage.setItem(COS_KEY_ROLE, role);
    sessionStorage.setItem(COS_KEY_ROLE, role);
    localStorage.setItem(COS_KEY_CLIENT_ID, clientId);
    sessionStorage.setItem(COS_KEY_CLIENT_ID, clientId);
    setCatalogOSAuth({ authenticated: true, email, role, clientId });
    return true;
  }, []);

  const logout = useCallback(() => {
    clearArtistOSSession();
    setAuth({ authenticated: false, email: '' });
  }, []);

  const logoutRocksteady = useCallback(() => {
    clearRocksteadySession();
    setRocksteadyAuth({ authenticated: false, email: '' });
  }, []);

  const logoutCatalogOS = useCallback(() => {
    clearCatalogOSSession();
    setCatalogOSAuth({ authenticated: false, email: '', role: '', clientId: '' });
  }, []);

  const clearSession = useCallback(() => {
    clearArtistOSSession();
    clearRocksteadySession();
    clearCatalogOSSession();
    setAuth({ authenticated: false, email: '' });
    setRocksteadyAuth({ authenticated: false, email: '' });
    setCatalogOSAuth({ authenticated: false, email: '', role: '', clientId: '' });
  }, []);

  return (
    <AuthContext.Provider value={{ auth, rocksteadyAuth, catalogOSAuth, login, loginRocksteady, loginCatalogOS, logout, logoutRocksteady, logoutCatalogOS, clearSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function resolveSystemRole(
  auth: { authenticated: boolean; email: string },
  rocksteadyAuth: { authenticated: boolean },
  catalogOSAuth: { authenticated: boolean; role: string },
  artistOSRole: string | null,
): SystemRole | null {
  if (rocksteadyAuth.authenticated) {
    const user = ROLE_USERS.find(u => u.email === auth.email || u.role === 'admin_team');
    if (auth.authenticated && artistOSRole === 'admin_team') return 'ADMIN';
    return 'INTERNAL_OPERATOR';
  }
  if (auth.authenticated) {
    if (artistOSRole === 'admin_team') return 'ADMIN';
    if (artistOSRole === 'artist_manager' || artistOSRole === 'label_partner') return 'ARTIST';
    return 'ARTIST';
  }
  if (catalogOSAuth.authenticated) {
    return 'CATALOG_CLIENT';
  }
  return null;
}

export function useSystemRole(): {
  systemRole: SystemRole | null;
  access: typeof SYSTEM_ACCESS[SystemRole];
} {
  const { auth, rocksteadyAuth, catalogOSAuth } = useAuth();
  const artistOSRole = (() => {
    try {
      return localStorage.getItem('artistos_role') || sessionStorage.getItem('artistos_role');
    } catch { return null; }
  })();

  const systemRole = resolveSystemRole(auth, rocksteadyAuth, catalogOSAuth, artistOSRole);
  const access = systemRole ? SYSTEM_ACCESS[systemRole] : SYSTEM_ACCESS['ARTIST'];
  return { systemRole, access };
}
