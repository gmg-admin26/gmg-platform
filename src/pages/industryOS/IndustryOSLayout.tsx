import { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { LayoutGrid, Users, Bot, FolderKanban, User, LogOut, ChevronRight, Menu, X, BookOpen } from 'lucide-react';
import { useIndustryOS } from '../../auth/IndustryOSContext';

const ACCENT = '#10B981';

interface NavItemDef {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  end?: boolean;
  locked?: boolean;
}

function SidebarNav({ onClose }: { onClose?: () => void }) {
  const { iosAuth, logoutIndustryOS } = useIndustryOS();
  const navigate = useNavigate();
  const member = iosAuth.member;
  const approved = member?.membership_status === 'approved';
  const hasProject = member?.has_project_assignment ?? false;

  const NAV: NavItemDef[] = [
    { label: 'Overview',     path: '/industry-os/app',              icon: LayoutGrid, end: true },
    { label: 'Network',      path: '/industry-os/app/network',      icon: Users },
    { label: 'AI Coworkers', path: '/industry-os/app/ai-coworkers', icon: Bot },
    { label: 'Boutique',     path: '/industry-os/app/boutique',     icon: BookOpen },
    { label: 'Project OS',   path: '/industry-os/app/project',      icon: FolderKanban, locked: !hasProject },
    { label: 'Profile',      path: '/industry-os/app/profile',      icon: User },
  ];

  const handleLogout = () => {
    logoutIndustryOS();
    navigate('/industry-os/login');
  };

  const initials = member?.full_name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() ?? 'M';

  return (
    <div className="flex flex-col h-full bg-[#090A0D] border-r border-white/[0.05]" style={{ width: 220 }}>
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-4 border-b border-white/[0.05]">
        <Link to="/system-hub" className="flex items-center gap-2.5 flex-1 min-w-0" onClick={onClose}>
          <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: `${ACCENT}18`, border: `1px solid ${ACCENT}28` }}>
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: ACCENT }} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-mono text-white/55 uppercase tracking-[0.18em] leading-none">Industry OS</p>
            <p className="text-[8px] font-mono text-white/20 uppercase tracking-wider mt-0.5">Greater Music Group</p>
          </div>
        </Link>
        {onClose && (
          <button onClick={onClose} className="text-white/20 hover:text-white/50 transition-colors shrink-0">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Member identity */}
      {member && (
        <div className="px-4 py-3 border-b border-white/[0.04]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0"
              style={{ background: `${ACCENT}12`, border: `1px solid ${ACCENT}20`, color: ACCENT }}>
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold text-white/70 truncate leading-none">{member.full_name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1 h-1 rounded-full"
                  style={{
                    background: approved ? ACCENT : '#F59E0B',
                    boxShadow: `0 0 4px ${approved ? ACCENT : '#F59E0B'}80`,
                  }} />
                <span className="text-[8.5px] font-mono text-white/25 uppercase tracking-wide">
                  {approved ? 'Approved Member' : 'Pending Review'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        <p className="text-[8px] font-mono text-white/[0.18] uppercase tracking-[0.18em] px-2 pb-1.5">Industry OS</p>
        {NAV.map(item => {
          const ItemIcon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `relative flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] transition-all w-full mb-0.5 ${
                  isActive
                    ? 'text-white'
                    : 'text-white/35 hover:text-white/70 hover:bg-white/[0.025]'
                }`
              }
              style={({ isActive }) => isActive ? { background: `${ACCENT}09` } : {}}>
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1 bottom-1 w-[2px] rounded-full"
                      style={{ background: ACCENT }} />
                  )}
                  <ItemIcon className="w-3.5 h-3.5 shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {item.locked && !({ isActive } && false) && (
                    <span className="text-[7.5px] font-mono px-1.5 py-0.5 rounded uppercase tracking-wide"
                      style={{ color: '#F59E0B', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.18)' }}>
                      Gated
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3 h-3 shrink-0 opacity-40" />}
                </>
              )}
            </NavLink>
          );
        })}

        <div className="mx-2 my-3 h-[1px] bg-white/[0.05]" />
        <p className="text-[8px] font-mono text-white/[0.18] uppercase tracking-[0.18em] px-2 pb-1.5">Account</p>

        <button onClick={handleLogout}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] text-white/25 hover:text-white/50 hover:bg-white/[0.025] transition-all w-full">
          <LogOut className="w-3.5 h-3.5 shrink-0" />
          Sign Out
        </button>
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-white/[0.04]">
        <p className="text-[8px] font-mono text-white/[0.12] uppercase tracking-widest">Not publicly distributed</p>
      </div>
    </div>
  );
}

export default function IndustryOSLayout() {
  const navigate = useNavigate();
  const { iosAuth } = useIndustryOS();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!iosAuth.authenticated) navigate('/industry-os/login');
  }, [iosAuth.authenticated, navigate]);

  const member = iosAuth.member;

  return (
    <div className="min-h-screen bg-[#07080A] flex">
      <style>{`
        @keyframes ios-slide-in { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }
        .ios-slide { animation: ios-slide-in 0.25s ease both; }
      `}</style>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col sticky top-0 h-screen shrink-0">
        <SidebarNav />
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative z-10 ios-slide">
            <SidebarNav onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center gap-3 px-4 h-12 border-b border-white/[0.05] bg-[#07080A] sticky top-0 z-40">
          <button onClick={() => setMobileOpen(true)}
            className="w-8 h-8 rounded-lg flex items-center justify-center border border-white/[0.07] text-white/30 hover:text-white/60 transition-colors">
            <Menu className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md flex items-center justify-center"
              style={{ background: `${ACCENT}18`, border: `1px solid ${ACCENT}28` }}>
              <div className="w-2 h-2 rounded-sm" style={{ background: ACCENT }} />
            </div>
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.18em]">Industry OS</span>
          </div>
        </header>

        {/* Membership status banner */}
        {member && member.membership_status !== 'approved' && (
          <div className="bg-[#F59E0B]/[0.07] border-b border-[#F59E0B]/15 px-4 sm:px-6 py-2.5">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse shrink-0" />
              <p className="text-[10.5px] text-[#F59E0B]/65">
                {member.membership_status === 'pending'
                  ? 'Your application is under review. You have limited access while pending approval.'
                  : 'Your application is on the waitlist. You will be notified when access is granted.'}
              </p>
            </div>
          </div>
        )}

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 max-w-5xl w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
