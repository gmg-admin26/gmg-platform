import { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Radio, Flame, FileText, Settings, Bell, Search, LogOut,
  ChevronDown, Zap, Activity, Shield, X, Cpu, Music, Library,
  AlertTriangle, List, Network, Map, ScanSearch, RotateCcw,
  GitMerge, CheckCircle, Users, Disc, Globe, DollarSign, BarChart2,
  RefreshCcw, Megaphone, UserCheck, TrendingUp, MessageSquare,
  Building2, TrendingDown, MessageCircle, Wallet, Send,
  CheckSquare, Calendar, Mic2, ShoppingBag, Video, Scale, Heart,
} from 'lucide-react';
import { useAuth, useSystemRole } from '../auth/AuthContext';
import { useRole } from '../auth/RoleContext';
import { ARTIST_OS_NAV, ROLE_META } from '../auth/roles';
import DemoRoleSwitcher from './components/catalog/DemoRoleSwitcher';
import { ADMIN_NAV } from './admin/adminNav';
import { getUpdatesForRole, getUnreadCount, PRIORITY_META } from './data/updatesData';
import { initDropState } from './data/dropArtistService';
import HelpLauncher from './components/help/HelpLauncher';
import FAQPanel from './components/help/FAQPanel';
import ReportBugModal from './components/help/ReportBugModal';
import SupportWidget from './components/help/SupportWidget';

const CORE_NAV = [
  { icon: LayoutDashboard, label: 'Command Center', path: '/dashboard', end: true },
];

const SYSTEM_NAV = [
  { icon: Cpu,     label: 'Admin OS',      path: '/dashboard/admin-os',  tag: 'EXEC' },
  { icon: Music,   label: 'Artist OS',     path: '/dashboard/artist-os', tag: 'EXEC' },
  { icon: Library, label: 'Catalog OS',    path: '/catalog/app',         tag: 'EXEC' },
  { icon: Radio,   label: 'Rocksteady A&R',path: '/dashboard/rocksteady',tag: null   },
];

const ROCKSTEADY_MODULES = [
  { icon: LayoutDashboard, label: 'Overview',          path: '/dashboard/rocksteady',              end: true  },
  { icon: AlertTriangle,   label: 'Alerts',            path: '/dashboard/rocksteady/alerts',       end: false },
  { icon: List,            label: 'Top Discoveries',   path: '/dashboard/rocksteady/discoveries',  end: false },
  { icon: GitMerge,        label: 'Deal Pipeline',     path: '/dashboard/rocksteady/pipeline',     end: false },
  { icon: CheckCircle,     label: 'Weekly Signings',   path: '/dashboard/rocksteady/signings',     end: false },
  { icon: Network,         label: 'Scout Network',     path: '/dashboard/rocksteady/scouts',       end: false },
  { icon: Map,             label: 'Heatmaps',          path: '/dashboard/rocksteady/heatmaps',     end: false },
  { icon: Zap,             label: 'Culture Map',       path: '/dashboard/rocksteady/culture',      end: false },
  { icon: ScanSearch,      label: 'Discovery Radar',   path: '/dashboard/rocksteady/radar',        end: false },
  { icon: Flame,           label: 'Hot Artists',       path: '/dashboard/rocksteady/hot-artists',  end: false },
  { icon: FileText,        label: 'Reports',           path: '/dashboard/rocksteady/reports',      end: false },
  { icon: Settings,        label: 'Settings',          path: '/dashboard/rocksteady/settings',     end: false },
];

const ARTIST_OS_MODULES = [
  { icon: LayoutDashboard, label: 'Overview',         path: '/dashboard/artist-os',                    end: true  },
  { icon: Users,           label: 'Roster',           path: '/dashboard/artist-os/roster',             end: false },
  { icon: Disc,            label: 'Releases',         path: '/dashboard/artist-os/releases',           end: false },
  { icon: Globe,           label: 'Audience',         path: '/dashboard/artist-os/audience',           end: false },
  { icon: Heart,           label: 'Fan OS',           path: '/dashboard/artist-os/fan-os',             end: false },
  { icon: DollarSign,      label: 'Revenue',          path: '/dashboard/artist-os/revenue',            end: false },
  { icon: BarChart2,       label: 'Spending',         path: '/dashboard/artist-os/spending',           end: false },
  { icon: RefreshCcw,      label: 'Recoupment',       path: '/dashboard/artist-os/recoupment',         end: false },
  { icon: Megaphone,       label: 'Campaign Center',  path: '/dashboard/artist-os/campaign-center',    end: false },
  { icon: Megaphone,       label: 'Campaign OS',      path: '/dashboard/artist-os/campaigns',          end: false },
  { icon: UserCheck,       label: 'Team',             path: '/dashboard/artist-os/team',               end: false },
  { icon: Settings,        label: 'Settings',         path: '/dashboard/artist-os/settings',           end: false },
];

const CATALOG_OS_MODULES = [
  { icon: Library,     label: 'Overview',          path: '/dashboard/catalog-os',              end: true  },
  { icon: TrendingUp,  label: 'Catalog Value',      path: '/dashboard/catalog-os/value',        end: false },
  { icon: DollarSign,  label: 'Revenue',            path: '/dashboard/catalog-os/revenue',      end: false },
  { icon: CheckSquare, label: 'Tasks',              path: '/dashboard/catalog-os/tasks',        end: false },
  { icon: Calendar,    label: '12-Month Plan',      path: '/dashboard/catalog-os/timeline',     end: false },
  { icon: Megaphone,   label: 'Campaigns',          path: '/dashboard/catalog-os/campaigns',    end: false },
  { icon: Users,       label: 'Fan Intelligence',   path: '/dashboard/catalog-os/fans',         end: false },
  { icon: Heart,       label: 'Fan OS',             path: '/dashboard/catalog-os/fan-os',       end: false },
  { icon: Mic2,        label: 'Touring',            path: '/dashboard/catalog-os/touring',      end: false },
  { icon: BarChart2,   label: 'Brand Health',       path: '/dashboard/catalog-os/brand',        end: false },
  { icon: ShoppingBag, label: 'Inventory + Merch',  path: '/dashboard/catalog-os/inventory',    end: false },
  { icon: Scale,       label: 'Rights + Contracts', path: '/dashboard/catalog-os/rights',       end: false },
  { icon: Video,       label: 'Meetings + Reports', path: '/dashboard/catalog-os/meetings',     end: false },
  { icon: Globe,       label: 'Business Entities',  path: '/dashboard/catalog-os/entities',     end: false },
];

const LABEL_NAV_ICONS: Record<string, React.ElementType> = {
  'Overview':     LayoutDashboard,
  'Artists':      Users,
  'Releases':     Disc,
  'Campaigns':    Megaphone,
  'Revenue':      DollarSign,
  'Investments':  Wallet,
  'Requests':     Send,
  'Team Updates': MessageCircle,
  'Settings':     Settings,
};

const LABEL_IDENTITY = {
  name: 'SPIN Records',
  type: 'Brand Imprint',
  color: '#F59E0B',
};

const MOCK_ALERTS = [
  { id: 1, level: 'critical', text: 'ZARA VEX — Streaming velocity +847% in 6h', time: '2m ago' },
  { id: 2, level: 'warning',  text: 'Campaign #C-0041 CTR below threshold — 0.8%', time: '11m ago' },
  { id: 3, level: 'info',     text: 'Catalog sync complete — 1,204 assets indexed', time: '1h ago' },
  { id: 4, level: 'success',  text: 'ARIA CROSS Q2 merch drop — $42K in 3h', time: '3h ago' },
];

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="px-5 pt-4 pb-1.5">
      <span className="text-[9px] font-mono text-white/[0.18] tracking-[0.18em] uppercase">{label}</span>
    </div>
  );
}

function NavItem({ icon: Icon, label, path, end = false, indent = false, tag }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
  end?: boolean;
  indent?: boolean;
  tag?: string | null;
}) {
  return (
    <NavLink
      to={path}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-3 py-2 text-[12.5px] transition-all group relative
        ${indent ? 'pl-8 pr-4' : 'px-5'}
        ${isActive
          ? indent
            ? 'text-white/90 before:absolute before:left-[26px] before:top-2 before:bottom-2 before:w-[2px] before:bg-[#EF4444] before:rounded-full'
            : 'text-white bg-white/[0.05] before:absolute before:left-0 before:top-1 before:bottom-1 before:w-[2px] before:bg-[#06B6D4] before:rounded-full'
          : indent
            ? 'text-white/30 hover:text-white/60'
            : 'text-white/40 hover:text-white/75 hover:bg-white/[0.025]'
        }`
      }
    >
      <Icon className={`w-3.5 h-3.5 shrink-0 ${indent ? 'text-current' : ''}`} />
      <span className="truncate flex-1">{label}</span>
      {tag === 'EXEC' && (
        <span className="ml-auto text-[8px] font-mono px-1 py-0.5 rounded bg-[#06B6D4]/10 text-[#06B6D4] border border-[#06B6D4]/20 tracking-wider shrink-0">
          EXEC
        </span>
      )}
    </NavLink>
  );
}

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, logoutRocksteady, clearSession, auth, rocksteadyAuth } = useAuth();
  const { roleState, isDemoMode, clearRole } = useRole();
  const { systemRole, access } = useSystemRole();
  const [alertOpen, setAlertOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [clock, setClock] = useState(new Date());
  const [searchVal, setSearchVal] = useState('');
  const profileRef = useRef<HTMLDivElement>(null);

  const isRocksteadyActive = location.pathname.startsWith('/dashboard/rocksteady');
  const isArtistOSActive = location.pathname.startsWith('/dashboard/artist-os');

  const isInternalSession = rocksteadyAuth.authenticated;
  const currentRole = roleState.role ?? 'artist_manager';
  const isAdminRole = currentRole === 'admin_team';

  const isCatalogOSActive = location.pathname.startsWith('/dashboard/catalog-os') || location.pathname.startsWith('/catalog/app');
  const isAdminOSActive = location.pathname.startsWith('/dashboard/admin-os');

  const visibleSystemNav = SYSTEM_NAV.filter(item => {
    if (item.path === '/dashboard/admin-os')  return access.canAccessAdminOS;
    if (item.path === '/dashboard/artist-os') return access.canAccessArtistOS;
    if (item.path === '/catalog/app')         return access.canAccessCatalogOS;
    if (item.path === '/dashboard/rocksteady')return access.canAccessRocksteady;
    return false;
  });
  const roleAwareNav = ARTIST_OS_NAV[currentRole];
  const roleMeta = ROLE_META[currentRole];

  const activeEmail = isArtistOSActive
    ? (auth.email || rocksteadyAuth.email || '')
    : (rocksteadyAuth.email || auth.email || '');

  const displayInitials = activeEmail
    ? activeEmail.split('@')[0].slice(0, 2).toUpperCase()
    : 'GM';

  useEffect(() => { initDropState(); }, []);

  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    if (profileOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileOpen]);

  function handleLogout() {
    if (isArtistOSActive) {
      logout();
      clearRole();
      navigate('/login/artist-os', { replace: true });
    } else {
      logoutRocksteady();
      navigate('/login/rocksteady', { replace: true });
    }
  }

  function handleResetDemo() {
    clearSession();
    clearRole();
    if (systemRole === 'ADMIN' || systemRole === 'INTERNAL_OPERATOR') {
      navigate('/login/rocksteady', { replace: true });
    } else {
      navigate('/login/artist-os', { replace: true });
    }
  }

  const unreadUpdates = getUpdatesForRole(currentRole, roleState.user?.artistIds)
    .filter(u => {
      const inApp = u.deliveries?.find(d => d.channel === 'in_app');
      return !inApp || inApp.status !== 'read';
    })
    .slice(0, 5);
  const unreadCount = getUnreadCount(currentRole, roleState.user?.artistIds);
  const criticalCount = unreadCount;

  return (
    <div className="flex h-screen bg-[#08090B] text-white overflow-hidden font-['Inter',sans-serif]">

      <aside className="w-[224px] shrink-0 flex flex-col border-r border-white/[0.06] bg-[#0A0B0E] overflow-y-auto">
        <div className="px-5 py-4 border-b border-white/[0.06] shrink-0">
          <button onClick={() => navigate('/system-hub')} className="flex items-center gap-2 w-full text-left hover:opacity-80 transition-opacity">
            <Zap className="w-4.5 h-4.5 text-[#06B6D4]" />
            <span className="text-[13px] font-semibold tracking-[0.12em] uppercase text-white/80">GMG</span>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#06B6D4]/10 text-[#06B6D4] border border-[#06B6D4]/20 ml-auto">LIVE</span>
          </button>
          <p className="text-[9.5px] text-white/25 mt-0.5 tracking-wider uppercase">Intelligence Platform</p>
        </div>

        {/* ── LABEL WORKSPACE IDENTITY (label_partner only) ── */}
        {isArtistOSActive && currentRole === 'label_partner' && (
          <div className="shrink-0" style={{ position: 'relative' }}>
            {/* Ambient top accent */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${LABEL_IDENTITY.color}50,transparent)` }} />

            <div className="px-4 pt-4 pb-3">
              <div className="flex items-center gap-3">
                {/* Logo slot */}
                <div className="shrink-0 relative" style={{ width: 44, height: 44 }}>
                  <div className="w-full h-full rounded-xl overflow-hidden flex items-center justify-center"
                    style={{ background: '#000', border: `1px solid ${LABEL_IDENTITY.color}28`, boxShadow: `0 0 12px ${LABEL_IDENTITY.color}14` }}>
                    <img
                      src="/spin-records-logo.png"
                      alt="SPIN Records"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Active dot */}
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#0A0B0E]"
                    style={{ background: '#10B981', boxShadow: '0 0 5px #10B981' }} />
                </div>

                {/* Label info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[13px] font-bold text-white leading-none truncate">{LABEL_IDENTITY.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[8px] font-mono px-1.5 py-0.5 rounded"
                      style={{ color: LABEL_IDENTITY.color, background: `${LABEL_IDENTITY.color}12`, border: `1px solid ${LABEL_IDENTITY.color}22`, letterSpacing: '0.06em' }}>
                      {LABEL_IDENTITY.type}
                    </span>
                    <span className="text-[7px] font-mono flex items-center gap-1"
                      style={{ color: '#10B981' }}>
                      <span className="w-1 h-1 rounded-full bg-[#10B981] inline-block" style={{ boxShadow: '0 0 3px #10B981' }} />
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="mx-4 flex items-center gap-2 pb-2">
              <div className="h-[1px] flex-1" style={{ background: `${LABEL_IDENTITY.color}15` }} />
              <span className="text-[7px] font-mono tracking-[0.18em] uppercase shrink-0"
                style={{ color: `${LABEL_IDENTITY.color}40` }}>Workspace</span>
              <div className="h-[1px] flex-1" style={{ background: `${LABEL_IDENTITY.color}15` }} />
            </div>
          </div>
        )}

        <nav className="flex-1 py-2">
          {(systemRole === 'ADMIN' || systemRole === 'INTERNAL_OPERATOR') && (
            <>
              <SectionLabel label="Core" />
              {CORE_NAV.map(item => (
                <NavItem key={item.path} {...item} />
              ))}
              <div className="mx-5 my-3 h-[1px] bg-white/[0.05]" />
            </>
          )}

          <SectionLabel label="Systems" />
          {visibleSystemNav.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/dashboard/rocksteady' ? !isRocksteadyActive : item.path === '/dashboard/artist-os' ? !isArtistOSActive : false}
              className={({ isActive }) => {
                const rocksteadyItemActive = item.path === '/dashboard/rocksteady' && isRocksteadyActive;
                const artistOSItemActive = item.path === '/dashboard/artist-os' && isArtistOSActive;
                const catalogOSItemActive = item.path === '/catalog/app' && isCatalogOSActive;
                const active = isActive || rocksteadyItemActive || artistOSItemActive || catalogOSItemActive;
                return `flex items-center gap-3 px-5 py-2 text-[12.5px] transition-all group relative
                  ${active
                    ? item.tag === 'EXEC'
                      ? 'text-white bg-[#06B6D4]/[0.07] before:absolute before:left-0 before:top-1 before:bottom-1 before:w-[2px] before:bg-[#06B6D4] before:rounded-full'
                      : item.path === '/dashboard/rocksteady'
                        ? 'text-[#EF4444] bg-[#EF4444]/[0.06] before:absolute before:left-0 before:top-1 before:bottom-1 before:w-[2px] before:bg-[#EF4444] before:rounded-full'
                        : 'text-white bg-white/[0.05] before:absolute before:left-0 before:top-1 before:bottom-1 before:w-[2px] before:bg-[#06B6D4] before:rounded-full'
                    : item.tag === 'EXEC'
                      ? 'text-[#06B6D4]/55 hover:text-[#06B6D4] hover:bg-[#06B6D4]/[0.04]'
                      : 'text-white/40 hover:text-white/75 hover:bg-white/[0.025]'
                  }`;
              }}
            >
              <item.icon className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate flex-1">{item.label}</span>
              {item.tag === 'EXEC' && (
                <span className="ml-auto text-[8px] font-mono px-1 py-0.5 rounded bg-[#06B6D4]/10 text-[#06B6D4] border border-[#06B6D4]/20 tracking-wider shrink-0">EXEC</span>
              )}
              {item.path === '/dashboard/rocksteady' && isRocksteadyActive && (
                <ChevronDown className="w-3 h-3 text-[#EF4444]/60 shrink-0" />
              )}
              {item.path === '/dashboard/artist-os' && isArtistOSActive && (
                <ChevronDown className="w-3 h-3 text-[#06B6D4]/60 shrink-0" />
              )}
            </NavLink>
          ))}


          {isRocksteadyActive && (
            <>
              <div className="mx-5 mt-2 mb-1">
                <div className="flex items-center gap-2">
                  <div className="h-[1px] flex-1 bg-[#EF4444]/15" />
                  <span className="text-[8px] font-mono text-[#EF4444]/40 tracking-[0.16em] uppercase shrink-0">Rocksteady Modules</span>
                  <div className="h-[1px] flex-1 bg-[#EF4444]/15" />
                </div>
              </div>
              <div className="pb-1">
                {ROCKSTEADY_MODULES.map(item => (
                  <NavItem key={item.path} {...item} indent />
                ))}
              </div>
            </>
          )}

          {isAdminOSActive && (
            <>
              <div className="mx-5 mt-2 mb-1">
                <div className="flex items-center gap-2">
                  <div className="h-[1px] flex-1 bg-[#F59E0B]/15" />
                  <span className="text-[8px] font-mono text-[#F59E0B]/40 tracking-[0.16em] uppercase shrink-0">Admin OS</span>
                  <div className="h-[1px] flex-1 bg-[#F59E0B]/15" />
                </div>
              </div>
              <div className="pb-1">
                {ADMIN_NAV.map(section => {
                  const SectionIcon = section.icon;
                  const sectionActive = section.items.some(it => {
                    if (it.path === location.pathname) return true;
                    if (it.path === '/dashboard/admin-os') return false;
                    return location.pathname.startsWith(it.path);
                  });
                  return (
                    <div key={section.key} className="pt-1.5">
                      <div className="px-5 py-1 flex items-center gap-2">
                        <SectionIcon className="w-3 h-3" style={{ color: section.color, opacity: sectionActive ? 1 : 0.55 }} />
                        <span
                          className="text-[9.5px] font-mono uppercase tracking-[0.14em]"
                          style={{ color: section.color, opacity: sectionActive ? 0.9 : 0.45 }}
                        >
                          {section.label}
                        </span>
                      </div>
                      <div>
                        {section.items.map(item => (
                          <NavLink
                            key={item.path + item.label}
                            to={item.path}
                            end={item.path === '/dashboard/admin-os'}
                            className={({ isActive }) =>
                              `flex items-center gap-2.5 pl-8 pr-4 py-1.5 text-[11.5px] transition-all group relative
                              ${isActive
                                ? 'text-white/95 bg-white/[0.03]'
                                : 'text-white/35 hover:text-white/70 hover:bg-white/[0.02]'
                              }`
                            }
                          >
                            {({ isActive }) => (
                              <>
                                <div className="w-[2px] absolute left-5 top-1.5 bottom-1.5 rounded-full transition-all" style={{ background: isActive ? section.color : 'transparent' }} />
                                {item.icon && <item.icon className="w-3 h-3 shrink-0" />}
                                <span className="truncate flex-1">{item.label}</span>
                              </>
                            )}
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {isCatalogOSActive && (
            <>
              <div className="mx-5 mt-2 mb-1">
                <div className="flex items-center gap-2">
                  <div className="h-[1px] flex-1 bg-[#10B981]/15" />
                  <span className="text-[8px] font-mono text-[#10B981]/40 tracking-[0.16em] uppercase shrink-0">Catalog OS</span>
                  <div className="h-[1px] flex-1 bg-[#10B981]/15" />
                </div>
              </div>
              <div className="pb-1">
                {CATALOG_OS_MODULES.map(item => (
                  <NavItem key={item.path} {...item} indent />
                ))}
              </div>
            </>
          )}

          {isArtistOSActive && currentRole !== 'label_partner' && (
            <>
              <div className="mx-5 mt-2 mb-1">
                <div className="flex items-center gap-2">
                  <div className="h-[1px] flex-1 bg-[#06B6D4]/15" />
                  <span className="text-[8px] font-mono text-[#06B6D4]/40 tracking-[0.16em] uppercase shrink-0">Artist OS</span>
                  <div className="h-[1px] flex-1 bg-[#06B6D4]/15" />
                </div>
              </div>
              <div className="pb-1">
                {roleAwareNav.map(item => (
                  <NavLink
                    key={item.path + item.label}
                    to={item.path}
                    end={item.end ?? false}
                    className={({ isActive }) =>
                      `flex items-center gap-3 pl-8 pr-4 py-2 text-[12.5px] transition-all group relative
                      ${isActive
                        ? 'text-white/90 before:absolute before:left-[26px] before:top-2 before:bottom-2 before:w-[2px] before:bg-[#06B6D4] before:rounded-full'
                        : 'text-white/30 hover:text-white/60'
                      }`
                    }
                  >
                    <span className="truncate flex-1">{item.label}</span>
                  </NavLink>
                ))}
              </div>
            </>
          )}

          {isArtistOSActive && currentRole === 'label_partner' && (
            <>
              {/* Imprint Nav label */}
              <div className="mx-5 mt-3 mb-1">
                <div className="flex items-center gap-2">
                  <div className="h-[1px] flex-1" style={{ background: `${LABEL_IDENTITY.color}18` }} />
                  <span className="text-[8px] font-mono tracking-[0.16em] uppercase shrink-0"
                    style={{ color: `${LABEL_IDENTITY.color}50` }}>Imprint Nav</span>
                  <div className="h-[1px] flex-1" style={{ background: `${LABEL_IDENTITY.color}18` }} />
                </div>
              </div>

              {/* Label nav items with icons */}
              <div className="pb-1">
                {roleAwareNav.map(item => {
                  const IconComponent = LABEL_NAV_ICONS[item.label] ?? LayoutDashboard;
                  return (
                    <NavLink
                      key={item.path + item.label}
                      to={item.path}
                      end={item.end ?? false}
                      className={({ isActive }) =>
                        `flex items-center gap-3 pl-5 pr-4 py-2 text-[12.5px] transition-all group relative
                        ${isActive
                          ? 'text-white/90 before:absolute before:left-0 before:top-1 before:bottom-1 before:w-[2px] before:rounded-full'
                          : 'text-white/35 hover:text-white/65 hover:bg-white/[0.025]'
                        }`
                      }
                      style={({ isActive }) => isActive ? {
                        '--tw-before-bg': LABEL_IDENTITY.color,
                        background: `${LABEL_IDENTITY.color}08`,
                      } as React.CSSProperties : {}}
                    >
                      {({ isActive }) => (
                        <>
                          <div className="w-[2px] absolute left-0 top-1 bottom-1 rounded-full transition-all"
                            style={{ background: isActive ? LABEL_IDENTITY.color : 'transparent' }} />
                          <IconComponent className="w-3.5 h-3.5 shrink-0 transition-colors"
                            style={{ color: isActive ? LABEL_IDENTITY.color : undefined } as React.CSSProperties} />
                          <span className="truncate flex-1">{item.label}</span>
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </>
          )}
        </nav>

        <div className="px-5 py-3 border-t border-white/[0.06] shrink-0">
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
              style={{ background: isArtistOSActive ? `linear-gradient(135deg, ${roleMeta.color}CC, ${roleMeta.color}66)` : 'linear-gradient(135deg, #06B6D4CC, #3B82F666)' }}
            >
              {displayInitials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-medium truncate text-white/85">{activeEmail || 'admin@gmg.ai'}</p>
              <p className="text-[10px] text-white/30 truncate">
                {isArtistOSActive ? roleMeta.shortLabel : 'Executive'}
              </p>
            </div>
            <button onClick={handleLogout} title="Log out" className="text-white/20 hover:text-white/60 transition-colors">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-[52px] shrink-0 flex items-center px-5 gap-4 border-b border-white/[0.06] bg-[#0A0B0E]/90 backdrop-blur-sm relative z-[60]">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
            <input
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              placeholder="Search artists, catalogs, campaigns..."
              className="w-full pl-8 pr-4 py-1.5 bg-white/[0.04] border border-white/[0.07] rounded text-[12px] text-white/70 placeholder-white/20 focus:outline-none focus:border-[#06B6D4]/40 transition-colors"
            />
          </div>

          <div className="ml-auto flex items-center gap-3">
            {isRocksteadyActive && (
              <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded border border-[#EF4444]/20 bg-[#EF4444]/[0.06]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] animate-pulse" />
                <span className="text-[10px] text-[#EF4444] font-mono tracking-wider">ROCKSTEADY LIVE</span>
              </div>
            )}
            {isArtistOSActive && (
              <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded border border-[#06B6D4]/20 bg-[#06B6D4]/[0.06]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] animate-pulse" />
                <span className="text-[10px] text-[#06B6D4] font-mono tracking-wider">ARTIST OS</span>
              </div>
            )}
            {isCatalogOSActive && (
              <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded border border-[#10B981]/20 bg-[#10B981]/[0.06]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                <span className="text-[10px] text-[#10B981] font-mono tracking-wider">CATALOG OS</span>
              </div>
            )}
            {isAdminOSActive && (
              <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded border border-[#F59E0B]/20 bg-[#F59E0B]/[0.06]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse" />
                <span className="text-[10px] text-[#F59E0B] font-mono tracking-wider">ADMIN OS</span>
              </div>
            )}
            {isArtistOSActive && (systemRole === 'ADMIN' || systemRole === 'INTERNAL_OPERATOR') && (
              <DemoRoleSwitcher visible={isDemoMode} />
            )}

            <div className="hidden md:flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-[#10B981] animate-pulse" />
              <span className="text-[11px] font-mono text-white/30">
                {clock.toLocaleTimeString('en-US', { hour12: false })} UTC
              </span>
            </div>

            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded border border-[#10B981]/20 bg-[#10B981]/5">
              <Shield className="w-3 h-3 text-[#10B981]" />
              <span className="text-[10px] text-[#10B981] font-medium tracking-wider">ALL SYSTEMS OP</span>
            </div>

            <HelpLauncher />

            <div className="relative">
              <button
                onClick={() => setAlertOpen(p => !p)}
                className="relative p-1.5 rounded hover:bg-white/[0.05] transition-colors"
              >
                <Bell className="w-4 h-4 text-white/50 hover:text-white/80 transition-colors" />
                {criticalCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#EF4444] text-[9px] flex items-center justify-center font-bold">
                    {criticalCount}
                  </span>
                )}
              </button>

              {alertOpen && (
                <div className="absolute right-0 top-8 w-84 bg-[#0E0F12] border border-white/[0.08] rounded-lg shadow-2xl z-[100]" style={{ width: '340px' }}>
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-semibold tracking-wider uppercase text-white/60">Updates</span>
                      {unreadCount > 0 && (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-[#EF4444] text-white font-bold">{unreadCount}</span>
                      )}
                    </div>
                    <button onClick={() => setAlertOpen(false)}><X className="w-3.5 h-3.5 text-white/30 hover:text-white/60" /></button>
                  </div>
                  <div className="divide-y divide-white/[0.05] max-h-72 overflow-y-auto">
                    {unreadUpdates.length === 0 ? (
                      <div className="px-4 py-5 text-center">
                        <Bell className="w-5 h-5 text-white/10 mx-auto mb-1.5" />
                        <p className="text-[11px] text-white/25">All caught up</p>
                      </div>
                    ) : unreadUpdates.map(u => {
                      const pm = PRIORITY_META[u.priority];
                      return (
                        <div key={u.id}
                          onClick={() => { setAlertOpen(false); navigate('/dashboard/artist-os/updates'); }}
                          className="px-4 py-3 hover:bg-white/[0.02] transition-colors cursor-pointer">
                          <div className="flex items-start gap-2.5">
                            <span className="mt-1 w-1.5 h-1.5 rounded-full shrink-0 animate-pulse" style={{ background: pm.color }} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <span className="text-[7px] font-mono px-1 py-0.5 rounded" style={{ color: pm.color, background: `${pm.color}15` }}>{pm.label}</span>
                              </div>
                              <p className="text-[12px] text-white/75 leading-snug truncate">{u.title}</p>
                              <p className="text-[10px] text-white/25 mt-0.5 line-clamp-1">{u.body}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="px-4 py-2.5 border-t border-white/[0.04] flex items-center justify-between">
                    <button onClick={() => { setAlertOpen(false); navigate('/dashboard/artist-os/updates'); }}
                      className="text-[11px] text-[#06B6D4]/70 hover:text-[#06B6D4] transition-colors font-mono">
                      View All Updates →
                    </button>
                    {unreadCount > 0 && (
                      <span className="text-[9px] font-mono text-white/20">{unreadCount} unread</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(p => !p)}
                className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/[0.05] transition-colors"
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                  style={{ background: isArtistOSActive ? `linear-gradient(135deg, ${roleMeta.color}CC, ${roleMeta.color}66)` : 'linear-gradient(135deg, #06B6D4CC, #3B82F666)' }}
                >
                  {displayInitials}
                </div>
                <ChevronDown className={`w-3 h-3 text-white/30 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-9 w-60 bg-[#0E0F12] border border-white/[0.08] rounded-lg shadow-2xl z-[100] py-1 overflow-hidden">
                  <div className="px-3 py-2.5 border-b border-white/[0.05]">
                    <p className="text-[12px] font-medium text-white/80 truncate">{activeEmail || 'admin@gmg.ai'}</p>
                    {isArtistOSActive && (
                      <span
                        className="inline-flex items-center gap-1 mt-1 text-[9px] font-mono px-1.5 py-0.5 rounded tracking-wider"
                        style={{ color: roleMeta.color, background: `${roleMeta.color}14`, border: `1px solid ${roleMeta.color}28` }}
                      >
                        {roleMeta.label}
                      </span>
                    )}
                    {!isArtistOSActive && (
                      <p className="text-[10px] text-white/25">Executive Access</p>
                    )}
                  </div>

                  <button
                    onClick={() => { setProfileOpen(false); handleLogout(); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-white/[0.04] transition-colors group"
                  >
                    <LogOut className="w-3.5 h-3.5 text-white/30 group-hover:text-white/60 transition-colors" />
                    <span className="text-[12px] text-white/50 group-hover:text-white/80 transition-colors">Log Out</span>
                  </button>

                  {import.meta.env.DEV && (
                    <>
                      <div className="mx-3 my-1 h-[1px] bg-white/[0.04]" />
                      <button
                        onClick={() => { setProfileOpen(false); handleResetDemo(); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-white/[0.04] transition-colors group"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-white/20 group-hover:text-white/50 transition-colors" />
                        <span className="text-[11px] font-mono text-white/25 group-hover:text-white/55 transition-colors tracking-wide">Reset Session</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      <FAQPanel />
      <ReportBugModal />
      <SupportWidget />
    </div>
  );
}
