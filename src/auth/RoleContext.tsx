import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { type ArtistOSRole, type RoleUser, ROLE_USERS } from './roles';

export const ROLE_STORAGE_KEY = 'artistos_role';
export const ROLE_EMAIL_KEY = 'artistos_email';

interface RoleState {
  role: ArtistOSRole | null;
  user: RoleUser | null;
}

interface RoleContextValue {
  roleState: RoleState;
  setRole: (role: ArtistOSRole) => void;
  clearRole: () => void;
  resolveRoleFromCredentials: (email: string, password: string) => ArtistOSRole | null;
  isDemoMode: boolean;
  setIsDemoMode: (v: boolean) => void;
}

function persistRole(role: ArtistOSRole, email: string) {
  localStorage.setItem(ROLE_STORAGE_KEY, role);
  localStorage.setItem(ROLE_EMAIL_KEY, email);
  sessionStorage.setItem(ROLE_STORAGE_KEY, role);
  sessionStorage.setItem(ROLE_EMAIL_KEY, email);
}

function wipeRole() {
  localStorage.removeItem(ROLE_STORAGE_KEY);
  localStorage.removeItem(ROLE_EMAIL_KEY);
  sessionStorage.removeItem(ROLE_STORAGE_KEY);
  sessionStorage.removeItem(ROLE_EMAIL_KEY);
}

function loadRoleState(): RoleState {
  try {
    const role = (localStorage.getItem(ROLE_STORAGE_KEY) || sessionStorage.getItem(ROLE_STORAGE_KEY)) as ArtistOSRole | null;
    const email = localStorage.getItem(ROLE_EMAIL_KEY) || sessionStorage.getItem(ROLE_EMAIL_KEY);
    if (role && email) {
      const user = ROLE_USERS.find(u => u.email === email && u.role === role) ?? null;
      return { role, user };
    }
  } catch {}
  return { role: null, user: null };
}

const RoleContext = createContext<RoleContextValue | null>(null);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [roleState, setRoleState] = useState<RoleState>(loadRoleState);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const setRole = useCallback((role: ArtistOSRole) => {
    const currentEmail = roleState.user?.email ?? localStorage.getItem(ROLE_EMAIL_KEY) ?? '';
    const user = ROLE_USERS.find(u => u.email === currentEmail && u.role === role)
      ?? ROLE_USERS.find(u => u.role === role && u.email !== '')
      ?? null;
    persistRole(role, user?.email ?? currentEmail);
    setRoleState({ role, user });
  }, [roleState.user?.email]);

  const clearRole = useCallback(() => {
    wipeRole();
    setRoleState({ role: null, user: null });
  }, []);

  const resolveRoleFromCredentials = useCallback((email: string, password: string): ArtistOSRole | null => {
    const match = ROLE_USERS.find(u => u.email === email && u.password === password);
    if (match) {
      persistRole(match.role, match.email);
      setRoleState({ role: match.role, user: match });
      return match.role;
    }
    return null;
  }, []);

  useEffect(() => {
    if (import.meta.env.DEV) setIsDemoMode(true);
  }, []);

  return (
    <RoleContext.Provider value={{ roleState, setRole, clearRole, resolveRoleFromCredentials, isDemoMode, setIsDemoMode }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error('useRole must be used within RoleProvider');
  return ctx;
}
