import { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useParams } from 'react-router-dom';
import {
  Library, BarChart2, DollarSign, CheckSquare, Calendar, Megaphone,
  Users, Heart, Mic2, TrendingUp, ShoppingBag, FileText, Video, Globe,
  ChevronRight, BookOpen, Bug, Activity, Layers, Wallet, LogOut,
  HelpCircle, X, Rocket, UserMinus, Shield, Target,
} from 'lucide-react';
import { useHelp } from '../../context/HelpContext';
import { CatalogClientProvider, useCatalogClient } from '../../context/CatalogClientContext';
import CatalogClientSwitcher from '../../components/catalog/CatalogClientSwitcher';
import { useAuth } from '../../../auth/AuthContext';

// ── Nav item definitions ──────────────────────────────────────────────────────

interface NavItemDef {
  icon: typeof Library;
  label: string;
  slug: string;
  end: boolean;
}

// Admin-only nav — no client-context items
const ADMIN_GROUP_A: NavItemDef[] = [
  { icon: Shield,      label: 'Admin Overview',    slug: 'admin',        end: false },
  { icon: Users,       label: 'Catalog Clients',   slug: 'roster',       end: false },
  { icon: UserMinus,   label: 'Dropped Queue',     slug: 'dropped-queue',end: false },
  { icon: Rocket,      label: 'Futures',            slug: 'futures',      end: false },
  { icon: Target,      label: 'Team Progress',     slug: 'progress',     end: false },
  { icon: Activity,    label: 'Tasks',              slug: 'tasks',        end: false },
];

// Client nav — no admin-only items
const CLIENT_GROUP_A: NavItemDef[] = [
  { icon: Library,     label: 'Overview',           slug: 'overview',    end: false },
  { icon: TrendingUp,  label: 'Catalog Value',      slug: 'value',       end: false },
  { icon: Layers,      label: 'Asset Library',      slug: 'assets',      end: false },
  { icon: DollarSign,  label: 'Revenue',            slug: 'revenue',     end: false },
  { icon: Megaphone,   label: 'Campaigns',          slug: 'campaigns',   end: false },
  { icon: Heart,       label: 'Fan Intelligence',   slug: 'fans',        end: false },
  { icon: Users,       label: 'Fan OS',             slug: 'fan-os',      end: false },
  { icon: Rocket,      label: 'Futures',            slug: 'futures',     end: false },
  { icon: Calendar,    label: '12-Month Plan',      slug: 'timeline',    end: false },
  { icon: Video,       label: 'Reports',            slug: 'meetings',    end: false },
  { icon: BarChart2,   label: 'Brand Health',       slug: 'brand',       end: false },
  { icon: FileText,    label: 'Rights + Contracts', slug: 'rights',      end: false },
  { icon: Globe,       label: 'Business Entities',  slug: 'entities',    end: false },
];

const CLIENT_GROUP_B: NavItemDef[] = [
  { icon: CheckSquare, label: 'Tasks',              slug: 'tasks',       end: false },
  { icon: Activity,    label: 'Team Progress',      slug: 'progress',    end: false },
  { icon: Mic2,        label: 'Touring',            slug: 'touring',     end: false },
  { icon: ShoppingBag, label: 'Inventory + Merch',  slug: 'inventory',   end: false },
  { icon: Wallet,      label: 'Project OS',         slug: 'workers',     end: false },
];

// ── Floating support button (shared) ─────────────────────────────────────────

function FloatingSupportButton() {
  const { openFAQ, openBugReport } = useHelp();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  const parts = location.pathname.split('/').filter(Boolean);
  const last = parts[parts.length - 1];
  const labelMap: Record<string, string> = {
    'app': 'Overview', 'overview': 'Overview', 'value': 'Catalog Value',
    'assets': 'Asset Library', 'revenue': 'Revenue', 'campaigns': 'Campaigns',
    'fans': 'Fan Intelligence', 'fan-os': 'Fan OS', 'futures': 'Futures',
    'timeline': '12-Month Plan', 'meetings': 'Reports', 'brand': 'Brand Health',
    'rights': 'Rights + Contracts', 'entities': 'Business Entities',
    'tasks': 'Tasks', 'progress': 'Team Progress', 'roster': 'Catalog Clients',
    'dropped-queue': 'Dropped Queue', 'admin': 'Admin Operations',
    'touring': 'Touring', 'inventory': 'Inventory + Merch', 'workers': 'Project OS',
  };
  const pageLabel = labelMap[last] ?? 'Catalog OS';

  return (
    <div ref={ref} style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 600 }}>
      <button
        onClick={() => setOpen(p => !p)}
        title="Support"
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '8px 14px', borderRadius: 10,
          background: open ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.06)',
          border: `1px solid ${open ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.1)'}`,
          color: open ? '#10B981' : 'rgba(255,255,255,0.45)',
          cursor: 'pointer', transition: 'all 0.14s',
          boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
        }}
        onMouseEnter={e => { if (!open) { const b = e.currentTarget as HTMLButtonElement; b.style.background = 'rgba(255,255,255,0.09)'; b.style.color = 'rgba(255,255,255,0.8)'; } }}
        onMouseLeave={e => { if (!open) { const b = e.currentTarget as HTMLButtonElement; b.style.background = 'rgba(255,255,255,0.06)'; b.style.color = 'rgba(255,255,255,0.45)'; } }}
      >
        <HelpCircle size={14} />
        <span style={{ fontSize: 11, fontWeight: 600, fontFamily: 'monospace', letterSpacing: '0.04em' }}>SUPPORT</span>
      </button>

      {open && (
        <div style={{
          position: 'absolute', bottom: 'calc(100% + 8px)', right: 0, width: 230,
          background: '#0E0F12', border: '1px solid rgba(255,255,255,0.09)',
          borderRadius: 14, boxShadow: '0 20px 70px rgba(0,0,0,0.7)', overflow: 'hidden',
          animation: 'floatFadeIn 0.14s ease-out',
        }}>
          <style>{`@keyframes floatFadeIn { from { transform: translateY(4px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
          <div style={{ padding: '10px 13px 8px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>Catalog OS Support</div>
              <div style={{ fontFamily: 'monospace', fontSize: 8.5, color: 'rgba(255,255,255,0.2)', marginTop: 1 }}>{pageLabel.toUpperCase()}</div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', display: 'flex', padding: 2 }}><X size={12} /></button>
          </div>
          <div style={{ padding: '6px' }}>
            {[
              { label: 'FAQ',         sub: 'Common questions answered', color: '#06B6D4', icon: BookOpen, action: () => { setOpen(false); openFAQ(pageLabel); } },
              { label: 'Report Bug',  sub: 'Submit an issue report',    color: '#EF4444', icon: Bug,      action: () => { setOpen(false); openBugReport(pageLabel); } },
            ].map(item => (
              <button key={item.label} onClick={item.action}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 11px', borderRadius: 9, cursor: 'pointer', background: 'none', border: 'none', textAlign: 'left', transition: 'background 0.12s' }}
                onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = `${item.color}10`}
                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'none'}
              >
                <div style={{ width: 28, height: 28, borderRadius: 8, background: `${item.color}10`, border: `1px solid ${item.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <item.icon size={13} color={item.color} />
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#F9FAFB' }}>{item.label}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 1 }}>{item.sub}</div>
                </div>
              </button>
            ))}
          </div>
          <div style={{ padding: '6px 13px 9px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.14)', letterSpacing: '0.08em' }}>GMG CATALOG OS</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Admin sidebar — no CatalogClientProvider dependency ───────────────────────

function AdminSidebar() {
  const { catalogOSAuth, logoutCatalogOS } = useAuth();
  const ACCENT = '#10B981';
  const BASE = '/catalog/app';

  function NavItem({ item }: { item: NavItemDef }) {
    const path = `${BASE}/${item.slug}`;
    return (
      <NavLink to={path} end={item.end}
        className={({ isActive }) =>
          `flex items-center gap-2.5 px-4 py-2 text-[12px] transition-all relative group ${isActive ? 'text-white' : 'text-white/35 hover:text-white/70 hover:bg-white/[0.025]'}`
        }
        style={({ isActive }) => isActive ? { background: `${ACCENT}09` } : {}}
      >
        {({ isActive }) => (
          <>
            {isActive && <div className="absolute left-0 top-1 bottom-1 w-[2px] rounded-full" style={{ background: ACCENT }} />}
            <item.icon className="w-3.5 h-3.5 shrink-0" style={{ color: isActive ? ACCENT : undefined }} />
            <span className="truncate flex-1">{item.label}</span>
            {isActive && <ChevronRight className="w-3 h-3 shrink-0 opacity-40" style={{ color: ACCENT }} />}
          </>
        )}
      </NavLink>
    );
  }

  return (
    <aside className="w-[220px] shrink-0 flex flex-col border-r border-white/[0.06] bg-[#090A0D] overflow-y-auto">
      <div className="px-3 py-2.5 border-b border-white/[0.05] shrink-0">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${ACCENT}18`, border: `1px solid ${ACCENT}28` }}>
            <Library className="w-3.5 h-3.5" style={{ color: ACCENT }} />
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ color: ACCENT, background: `${ACCENT}0A`, border: `1px solid ${ACCENT}18` }}>
            CATALOG OS
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-1.5">
          <Shield className="w-2.5 h-2.5" style={{ color: ACCENT }} />
          <span className="text-[9px] font-mono text-white/25 uppercase tracking-widest">Admin</span>
        </div>
      </div>

      <nav className="flex-1 py-2 overflow-y-auto">
        <div className="px-4 pt-2 pb-1">
          <span className="text-[8px] font-mono text-white/15 uppercase tracking-[0.18em]">Admin</span>
        </div>
        {ADMIN_GROUP_A.map(item => <NavItem key={item.slug} item={item} />)}
      </nav>

      <div className="px-4 py-3 border-t border-white/[0.05] shrink-0">
        {catalogOSAuth.authenticated && (
          <button onClick={logoutCatalogOS}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-[11px] text-white/30 hover:text-white/65 hover:bg-white/[0.04] transition-all group"
          >
            <LogOut className="w-3 h-3 shrink-0 group-hover:text-white/50 transition-colors" />
            <span>Sign Out</span>
          </button>
        )}
      </div>
    </aside>
  );
}

// ── Client sidebar — lives inside CatalogClientProvider ───────────────────────

function ClientSidebar() {
  const { clientId } = useParams<{ clientId: string }>();
  const { activeClient } = useCatalogClient();
  const { catalogOSAuth, logoutCatalogOS } = useAuth();
  const ACCENT = activeClient?.accent_color ?? '#10B981';
  // All nav links are relative to the current client: /catalog/app/client/:clientId/<slug>
  const BASE = `/catalog/app/client/${clientId}`;

  function NavItem({ item }: { item: NavItemDef }) {
    const path = `${BASE}/${item.slug}`;
    return (
      <NavLink to={path} end={item.end}
        className={({ isActive }) =>
          `flex items-center gap-2.5 px-4 py-2 text-[12px] transition-all relative group ${isActive ? 'text-white' : 'text-white/35 hover:text-white/70 hover:bg-white/[0.025]'}`
        }
        style={({ isActive }) => isActive ? { background: `${ACCENT}09` } : {}}
      >
        {({ isActive }) => (
          <>
            {isActive && <div className="absolute left-0 top-1 bottom-1 w-[2px] rounded-full" style={{ background: ACCENT }} />}
            <item.icon className="w-3.5 h-3.5 shrink-0" style={{ color: isActive ? ACCENT : undefined }} />
            <span className="truncate flex-1">{item.label}</span>
            {isActive && <ChevronRight className="w-3 h-3 shrink-0 opacity-40" style={{ color: ACCENT }} />}
          </>
        )}
      </NavLink>
    );
  }

  return (
    <aside className="w-[220px] shrink-0 flex flex-col border-r border-white/[0.06] bg-[#090A0D] overflow-y-auto">
      <div className="px-3 py-2.5 border-b border-white/[0.05] shrink-0">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${ACCENT}18`, border: `1px solid ${ACCENT}28` }}>
            <Library className="w-3.5 h-3.5" style={{ color: ACCENT }} />
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ color: ACCENT, background: `${ACCENT}0A`, border: `1px solid ${ACCENT}18` }}>
            CATALOG OS
          </span>
        </div>
        {activeClient && (
          <div className="flex items-center gap-1.5 mt-1.5 min-w-0">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: ACCENT }} />
            <span className="text-[9px] font-mono text-white/40 truncate">{activeClient.name ?? clientId}</span>
          </div>
        )}
      </div>

      <div className="px-3 py-2 border-b border-white/[0.05] shrink-0">
        <NavLink to="/catalog/app/roster"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-[10px] text-white/35 hover:text-white/70 hover:bg-white/[0.04] transition-all w-full"
        >
          <ChevronRight className="w-3 h-3 shrink-0 rotate-180" />
          <span className="font-mono tracking-wide">Back to Catalog Clients</span>
        </NavLink>
      </div>

      <nav className="flex-1 py-2 overflow-y-auto">
        <div className="px-4 pt-2 pb-1">
          <span className="text-[8px] font-mono text-white/15 uppercase tracking-[0.18em]">Strategic</span>
        </div>
        {CLIENT_GROUP_A.map(item => <NavItem key={item.slug} item={item} />)}

        <div className="mx-4 my-2 h-[1px] bg-white/[0.05]" />

        <div className="px-4 pt-1 pb-1">
          <span className="text-[8px] font-mono text-white/15 uppercase tracking-[0.18em]">Operations</span>
        </div>
        {CLIENT_GROUP_B.map(item => <NavItem key={item.slug} item={item} />)}
      </nav>

      <div className="px-4 py-3 border-t border-white/[0.05] shrink-0 space-y-1">
        {catalogOSAuth.authenticated && (
          <button onClick={logoutCatalogOS}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-[11px] text-white/30 hover:text-white/65 hover:bg-white/[0.04] transition-all group"
          >
            <LogOut className="w-3 h-3 shrink-0 group-hover:text-white/50 transition-colors" />
            <span>Sign Out</span>
          </button>
        )}
      </div>
    </aside>
  );
}

// ── CatalogAdminLayout — no CatalogClientProvider, no client nav ──────────────

export function CatalogAdminLayout() {
  return (
    <div className="flex h-screen bg-[#07080A]">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
      <FloatingSupportButton />
    </div>
  );
}

// ── CatalogClientLayout — wraps CatalogClientProvider, client nav only ─────────

export function CatalogClientLayout() {
  return (
    <CatalogClientProvider>
      <div className="flex h-screen bg-[#07080A]">
        <ClientSidebar />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
        <FloatingSupportButton />
      </div>
    </CatalogClientProvider>
  );
}

// ── Default export (legacy alias — routes in App.tsx should use named exports) ─

export default CatalogAdminLayout;
