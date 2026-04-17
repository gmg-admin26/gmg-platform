import { Link } from 'react-router-dom';
import { Lock, ChevronRight, Briefcase, ShieldCheck, Users as Users2 } from 'lucide-react';
import { useIndustryOS } from '../auth/IndustryOSContext';
import IndustryProjectOS from './industryOS/IndustryProjectOS';
import IndustryProjectOSAdmin from './industryOS/IndustryProjectOSAdmin';

// ── ADMIN BADGE TYPES ────────────────────────────────────────────────────────

const ADMIN_BADGE_TYPES = new Set(['admin', 'ops', 'finance', 'legal', 'gmg_ops', 'gmg_team']);

function isAdminMember(badgeType: string): boolean {
  return ADMIN_BADGE_TYPES.has(badgeType.toLowerCase().trim());
}

// ── LOCKED STATE ─────────────────────────────────────────────────────────────

function LockedState() {
  return (
    <div className="min-h-screen bg-[#07080A] flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto bg-white/[0.04] border border-white/[0.08]">
          <Lock className="w-6 h-6 text-white/25" />
        </div>

        <div className="space-y-2">
          <p className="text-[9px] font-mono text-white/20 uppercase tracking-[0.2em]">Project OS</p>
          <h1 className="text-[26px] font-bold text-white/75">Access Restricted</h1>
          <p className="text-[13px] text-white/35 leading-relaxed">
            Access requires an active GMG project assignment.
          </p>
          <p className="text-[11px] text-white/20 leading-relaxed">
            This environment is reserved for operators working inside live GMG systems.
          </p>
        </div>

        <div className="bg-[#0B0D10] border border-white/[0.06] rounded-2xl p-5 text-left space-y-3">
          <p className="text-[9.5px] font-mono text-white/20 uppercase tracking-wide">Requirements</p>
          {[
            'Active Industry OS membership',
            'Approved GMG project assignment',
            'Executed project agreement on file',
          ].map(req => (
            <div key={req} className="flex items-center gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-white/15 shrink-0" />
              <span className="text-[11px] text-white/35">{req}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2.5">
          <Link to="/industry-os/app"
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-white/[0.09] text-[11.5px] text-white/40 hover:text-white/65 transition-colors">
            Return to Industry OS
          </Link>
          <a href="mailto:projects@greatermusic.com"
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[11.5px] font-semibold text-white transition-all"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
            Apply for Project Access <ChevronRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

// ── ADMIN PROJECT OS ──────────────────────────────────────────────────────────

function AdminProjectOS() {
  const { iosAuth, logoutIndustryOS } = useIndustryOS();
  const member = iosAuth.member!;

  return (
    <div className="min-h-screen bg-[#07080A]">
      <header className="border-b border-white/[0.05] bg-[#07080A]/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-4 h-14">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-[#F59E0B]/15 border border-[#F59E0B]/25">
              <ShieldCheck className="w-3 h-3 text-[#F59E0B]" />
            </div>
            <span className="text-[11px] font-mono text-white/40 uppercase tracking-[0.18em]">Project OS · Admin</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#F59E0B]/[0.08] border border-[#F59E0B]/20 rounded-lg px-2.5 py-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse" />
            <span className="text-[8.5px] font-mono text-[#F59E0B]/70">Admin Access</span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-[10px] font-mono text-white/18 hidden sm:block">{member.full_name}</span>
            <Link to="/industry-os/app" className="text-[10px] font-mono text-white/20 hover:text-white/45 transition-colors">
              Industry OS
            </Link>
            <button onClick={logoutIndustryOS}
              className="text-[10px] font-mono text-white/15 hover:text-white/35 transition-colors">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-4">
        <div>
          <p className="text-[9px] font-mono text-[#F59E0B]/50 uppercase tracking-[0.2em] mb-1">Worker Payments Admin</p>
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-[26px] font-bold text-white/88">Project Command</h1>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-white/25">
              <Users2 className="w-3.5 h-3.5" />
              All Workers
            </div>
          </div>
          <p className="text-[11.5px] text-white/28 mt-1">
            Manage worker readiness, approve project starts, initiate payments, and delay payouts with documented reasons across all active assignments.
          </p>
        </div>
        <IndustryProjectOSAdmin system="industry_os" adminName={member.full_name} />
      </div>
    </div>
  );
}

// ── WORKER PROJECT OS ─────────────────────────────────────────────────────────

function WorkerProjectOS() {
  const { iosAuth, logoutIndustryOS } = useIndustryOS();
  const member = iosAuth.member!;

  return (
    <div className="min-h-screen bg-[#07080A]">
      <header className="border-b border-white/[0.05] bg-[#07080A]/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-4 h-14">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-[#10B981]/15 border border-[#10B981]/25">
              <Briefcase className="w-3 h-3 text-[#10B981]" />
            </div>
            <span className="text-[11px] font-mono text-white/40 uppercase tracking-[0.18em]">Project OS</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#10B981]/[0.08] border border-[#10B981]/20 rounded-lg px-2.5 py-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-[8.5px] font-mono text-[#10B981]/70">Active Assignment</span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-[10px] font-mono text-white/18 hidden sm:block">{member.full_name}</span>
            <Link to="/industry-os/app" className="text-[10px] font-mono text-white/20 hover:text-white/45 transition-colors">
              Industry OS
            </Link>
            <button onClick={logoutIndustryOS}
              className="text-[10px] font-mono text-white/15 hover:text-white/35 transition-colors">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <IndustryProjectOS system="industry_os" />
      </div>
    </div>
  );
}

// ── ROOT COMPONENT ────────────────────────────────────────────────────────────

export default function ProjectOS() {
  const { iosAuth } = useIndustryOS();
  const member = iosAuth.member;

  if (!member) {
    return <LockedState />;
  }

  if (isAdminMember(member.badge_type)) {
    return <AdminProjectOS />;
  }

  return <WorkerProjectOS />;
}
