import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';

export const IOS_KEY_AUTH = 'industryos_authenticated';
export const IOS_KEY_USER = 'industryos_user';
export const IOS_KEY_STATUS = 'industryos_status';
export const IOS_KEY_PROJECT = 'industryos_project_assignment';

export type MembershipStatus = 'pending' | 'approved' | 'waitlisted';

export interface IndustryOSMember {
  id: string;
  email: string;
  full_name: string;
  location: string;
  primary_industry: string;
  primary_industry_other?: string;
  member_current_role?: string;
  desired_role?: string;
  instagram?: string;
  linkedin?: string;
  website?: string;
  badge_type: string;
  membership_status: MembershipStatus;
  has_project_assignment: boolean;
  interests: string[];
  created_at: string;
}

interface IndustryOSAuthState {
  authenticated: boolean;
  member: IndustryOSMember | null;
}

interface IndustryOSContextValue {
  iosAuth: IndustryOSAuthState;
  loginIndustryOS: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signupIndustryOS: (data: SignupData) => Promise<{ ok: boolean; error?: string }>;
  logoutIndustryOS: () => void;
}

export interface SignupData {
  email: string;
  password: string;
  full_name: string;
  location: string;
  primary_industry: string;
  primary_industry_other?: string;
  member_current_role?: string;
  desired_role?: string;
  instagram: string;
  linkedin: string;
  website?: string;
  promo_code?: string;
  interests: string[];
}

function simpleHash(s: string): string {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    const char = s.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return String(Math.abs(hash));
}

function loadFromStorage(): IndustryOSAuthState {
  try {
    const flag = localStorage.getItem(IOS_KEY_AUTH) || sessionStorage.getItem(IOS_KEY_AUTH);
    const raw = localStorage.getItem(IOS_KEY_USER) || sessionStorage.getItem(IOS_KEY_USER);
    if (flag === 'true' && raw) {
      const member = JSON.parse(raw) as IndustryOSMember;
      return { authenticated: true, member };
    }
  } catch {}
  return { authenticated: false, member: null };
}

function persist(member: IndustryOSMember) {
  localStorage.setItem(IOS_KEY_AUTH, 'true');
  localStorage.setItem(IOS_KEY_USER, JSON.stringify(member));
  sessionStorage.setItem(IOS_KEY_AUTH, 'true');
  sessionStorage.setItem(IOS_KEY_USER, JSON.stringify(member));
}

function wipe() {
  localStorage.removeItem(IOS_KEY_AUTH);
  localStorage.removeItem(IOS_KEY_USER);
  localStorage.removeItem(IOS_KEY_STATUS);
  localStorage.removeItem(IOS_KEY_PROJECT);
  sessionStorage.removeItem(IOS_KEY_AUTH);
  sessionStorage.removeItem(IOS_KEY_USER);
  sessionStorage.removeItem(IOS_KEY_STATUS);
  sessionStorage.removeItem(IOS_KEY_PROJECT);
}

const IndustryOSContext = createContext<IndustryOSContextValue | null>(null);

export function IndustryOSProvider({ children }: { children: ReactNode }) {
  const [iosAuth, setIosAuth] = useState<IndustryOSAuthState>(loadFromStorage);

  const loginIndustryOS = useCallback(async (email: string, password: string) => {
    const hash = simpleHash(password);
    const { data, error } = await supabase
      .from('industry_os_members')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .eq('password_hash', hash)
      .maybeSingle();

    if (error || !data) {
      return { ok: false, error: 'Invalid email or password' };
    }

    const member = data as IndustryOSMember;
    persist(member);
    setIosAuth({ authenticated: true, member });
    return { ok: true };
  }, []);

  const signupIndustryOS = useCallback(async (formData: SignupData) => {
    const { data: existing } = await supabase
      .from('industry_os_members')
      .select('id')
      .eq('email', formData.email.toLowerCase().trim())
      .maybeSingle();

    if (existing) {
      return { ok: false, error: 'An account with this email already exists' };
    }

    const hash = simpleHash(formData.password);

    const { data, error } = await supabase
      .from('industry_os_members')
      .insert({
        email: formData.email.toLowerCase().trim(),
        full_name: formData.full_name,
        location: formData.location,
        primary_industry: formData.primary_industry,
        primary_industry_other: formData.primary_industry_other || null,
        member_current_role: formData.member_current_role || null,
        desired_role: formData.desired_role || null,
        instagram: formData.instagram,
        linkedin: formData.linkedin,
        website: formData.website || null,
        promo_code: formData.promo_code || null,
        interests: formData.interests,
        membership_status: 'pending',
        has_project_assignment: false,
        password_hash: hash,
        badge_type: 'member',
      })
      .select('*')
      .maybeSingle();

    if (error || !data) {
      return { ok: false, error: 'Failed to create account. Please try again.' };
    }

    const member = data as IndustryOSMember;
    persist(member);
    setIosAuth({ authenticated: true, member });
    return { ok: true };
  }, []);

  const logoutIndustryOS = useCallback(() => {
    wipe();
    setIosAuth({ authenticated: false, member: null });
  }, []);

  return (
    <IndustryOSContext.Provider value={{ iosAuth, loginIndustryOS, signupIndustryOS, logoutIndustryOS }}>
      {children}
    </IndustryOSContext.Provider>
  );
}

export function useIndustryOS() {
  const ctx = useContext(IndustryOSContext);
  if (!ctx) throw new Error('useIndustryOS must be used within IndustryOSProvider');
  return ctx;
}
