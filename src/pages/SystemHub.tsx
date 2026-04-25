import { useNavigate } from 'react-router-dom';
import { useSystemRole } from '../auth/AuthContext';
import { ROUTES } from '../lib/routes';
import {
  Radio,
  User,
  Archive,
  Briefcase,
  Globe,
  Settings,
  ArrowRight,
  Activity,
  Layers,
  Shield,
} from 'lucide-react';

interface SystemCard {
  key: string;
  label: string;
  sub: string;
  path: string;
  icon: React.ElementType;
  color: string;
  border: string;
  badge?: string;
}

const SYSTEMS: SystemCard[] = [
  {
    key: 'rocksteady',
    label: 'Rocksteady',
    sub: 'A&R Intelligence',
    path: ROUTES.ROCKSTEADY_DASH,
    icon: Radio,
    color: '#06B6D4',
    border: 'border-[#06B6D4]/30',
    badge: 'A&R',
  },
  {
    key: 'artist-os',
    label: 'Artist OS',
    sub: 'Artist Operations Platform',
    path: ROUTES.ARTIST_OS,
    icon: User,
    color: '#10B981',
    border: 'border-[#10B981]/30',
  },
  {
    key: 'catalog-os',
    label: 'Catalog OS',
    sub: 'Catalog Management',
    path: ROUTES.CATALOG_APP,
    icon: Archive,
    color: '#F59E0B',
    border: 'border-[#F59E0B]/30',
  },
  {
    key: 'industry-os',
    label: 'Industry OS',
    sub: 'Industry Partner Hub',
    path: ROUTES.INDUSTRY_OS_APP,
    icon: Globe,
    color: '#3B82F6',
    border: 'border-[#3B82F6]/30',
  },
  {
    key: 'project-os',
    label: 'Project OS',
    sub: 'Worker & Project Hub',
    path: ROUTES.INDUSTRY_OS_PROJECT,
    icon: Briefcase,
    color: '#8B5CF6',
    border: 'border-[#8B5CF6]/30',
    badge: 'WORKER',
  },
  {
    key: 'admin-os',
    label: 'Admin OS',
    sub: 'Command Center',
    path: ROUTES.ADMIN_OS,
    icon: Shield,
    color: '#EF4444',
    border: 'border-[#EF4444]/30',
    badge: 'ADMIN',
  },
];

const NAV_ITEMS = [
  { icon: Activity, label: 'Overview', path: ROUTES.SYSTEM_HUB },
  { icon: Radio, label: 'Rocksteady', path: ROUTES.ROCKSTEADY_DASH },
  { icon: User, label: 'Artist OS', path: ROUTES.ARTIST_OS },
  { icon: Archive, label: 'Catalog OS', path: ROUTES.CATALOG_APP },
  { icon: Globe, label: 'Industry OS', path: ROUTES.INDUSTRY_OS_APP },
  { icon: Layers, label: 'Admin OS', path: ROUTES.ADMIN_OS },
  { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
];

const QUICK_LINKS = [
  { label: 'Command Center',  path: ROUTES.ADMIN_OS },
  { label: 'Scout Network',   path: ROUTES.ROCKSTEADY_SCOUTS },
  { label: 'Deal Pipeline',   path: ROUTES.ROCKSTEADY_PIPELINE },
  { label: 'Artist Roster',   path: ROUTES.ARTIST_OS_ROSTER },
  { label: 'Project Safes',   path: ROUTES.ADMIN_OS_SAFES },
  { label: 'Agent Workspace', path: ROUTES.ADMIN_OS_AGENTS },
  { label: 'Finance',         path: ROUTES.ADMIN_OS_FINANCE },
  { label: 'Legal',           path: ROUTES.ADMIN_OS_LEGAL },
];

export default function SystemHub() {
  const navigate = useNavigate();
  const { systemRole } = useSystemRole();

  return (
    <div className="min-h-screen bg-[#080A0F] flex">
      <div className="w-14 flex-shrink-0 flex flex-col items-center py-4 bg-[#0D1117] border-r border-white/[0.06]">
        <button
          onClick={() => navigate(ROUTES.SYSTEM_HUB)}
          className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/15 flex items-center justify-center mb-5 transition-colors"
          title="System Hub"
        >
          <span className="text-white font-bold text-sm leading-none">G</span>
        </button>

        <div className="w-5 h-px bg-white/10 mb-4" />

        <div className="flex flex-col gap-1 flex-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                title={item.label}
                className="w-9 h-9 rounded-lg hover:bg-white/8 flex items-center justify-center transition-colors group relative"
              >
                <Icon size={16} className="text-white/40 group-hover:text-white/80 transition-colors" />
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-auto">
        <div className="border-b border-white/[0.06] px-8 py-4 flex items-center justify-between bg-[#0D1117]/60">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white/50 text-xs tracking-widest uppercase font-medium">GMG Platform</span>
            <span className="text-white/20 text-xs">·</span>
            <span className="text-white/30 text-xs">System Hub</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/20 text-xs">Role:</span>
            <span className="text-white/50 text-xs font-mono">{systemRole ?? '—'}</span>
          </div>
        </div>

        <div className="flex-1 px-8 py-10 max-w-5xl">
          <div className="mb-10">
            <h1 className="text-2xl font-semibold text-white tracking-tight mb-1">System Hub</h1>
            <p className="text-white/40 text-sm">All GMG operating systems in one place.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {SYSTEMS.map((sys) => {
              const Icon = sys.icon;
              return (
                <button
                  key={sys.key}
                  onClick={() => navigate(sys.path)}
                  className={`group relative text-left bg-[#0D1117] border ${sys.border} rounded-xl p-5 hover:bg-white/[0.04] transition-all duration-200 hover:border-opacity-60 hover:shadow-lg`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${sys.color}18` }}
                    >
                      <Icon size={16} style={{ color: sys.color }} />
                    </div>
                    {sys.badge && (
                      <span
                        className="text-[10px] font-bold tracking-widest px-1.5 py-0.5 rounded"
                        style={{ color: sys.color, backgroundColor: `${sys.color}15` }}
                      >
                        {sys.badge}
                      </span>
                    )}
                  </div>

                  <div className="mb-3">
                    <div className="text-white font-medium text-sm mb-0.5">{sys.label}</div>
                    <div className="text-white/40 text-xs">{sys.sub}</div>
                  </div>

                  <div
                    className="flex items-center gap-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: sys.color }}
                  >
                    <span>Open</span>
                    <ArrowRight size={11} />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="border-t border-white/[0.06] pt-8">
            <div className="text-white/20 text-xs mb-4 tracking-widest uppercase">Quick Access</div>
            <div className="flex flex-wrap gap-2">
              {QUICK_LINKS.map((link) => (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className="text-xs text-white/40 hover:text-white/80 bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.06] hover:border-white/[0.12] rounded-lg px-3 py-1.5 transition-all"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
