import { useState, useEffect } from 'react';
import { Instagram, Linkedin, MapPin, Briefcase, Users, RefreshCw, ChevronRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { IndustryOSMember } from '../../auth/IndustryOSContext';

const ACCENT = '#10B981';

const BADGE_COLOR: Record<string, string> = {
  Artist:              '#10B981',
  Producer:            '#06B6D4',
  Songwriter:          '#F59E0B',
  Manager:             '#3B82F6',
  Marketer:            '#10B981',
  'A&R':               '#EF4444',
  'Creative Director': '#F59E0B',
  Videographer:        '#06B6D4',
  Engineer:            '#6B7280',
  Student:             '#10B981',
  Other:               '#6B7280',
};

const SUGGESTED = [
  { name: 'Devon Clarke', role: 'Producer', location: 'Atlanta, GA', focus: 'Beat placement + sync licensing', color: '#06B6D4', initials: 'DC', open: true },
  { name: 'Yasmine Park', role: 'Marketer', location: 'Los Angeles, CA', focus: 'Rollout strategy + DSP growth', color: '#10B981', initials: 'YP', open: true },
  { name: 'Terrell Moss', role: 'Artist', location: 'Houston, TX', focus: 'Independent artist building fanbase', color: '#F59E0B', initials: 'TM', open: false },
];

const FILTER_OPTIONS = ['All', 'Artist', 'Producer', 'Songwriter', 'Manager', 'Marketer', 'A&R', 'Creative Director', 'Videographer'];

function MemberCard({ member }: { member: IndustryOSMember }) {
  const badgeColor = BADGE_COLOR[member.primary_industry] ?? '#6B7280';
  const initials = member.full_name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="bg-[#0B0D10] border border-white/[0.06] rounded-2xl p-4 hover:border-white/[0.11] transition-all space-y-3"
      style={{ transition: 'all 0.2s ease' }}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-[13px]"
          style={{ background: `${badgeColor}12`, border: `1px solid ${badgeColor}20`, color: badgeColor }}>
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-white/80 truncate">{member.full_name}</p>
          {member.member_current_role && (
            <p className="text-[10px] text-white/30 truncate mt-0.5">{member.member_current_role}</p>
          )}
        </div>
        <span className="text-[8px] font-mono px-1.5 py-0.5 rounded uppercase shrink-0 tracking-wide"
          style={{ color: badgeColor, background: `${badgeColor}12`, border: `1px solid ${badgeColor}20` }}>
          {member.primary_industry}
        </span>
      </div>

      {member.location && (
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3 h-3 text-white/15 shrink-0" />
          <span className="text-[10px] text-white/30">{member.location}</span>
        </div>
      )}

      {member.desired_role && (
        <div className="flex items-center gap-1.5">
          <Briefcase className="w-3 h-3 text-white/15 shrink-0" />
          <span className="text-[10px] text-white/25 italic">Focus: {member.desired_role}</span>
        </div>
      )}

      {member.interests && member.interests.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[8.5px] font-mono px-2 py-0.5 rounded-md"
            style={{ color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            Open to collaborate
          </span>
        </div>
      )}

      {(member.instagram || member.linkedin) && (
        <div className="flex items-center gap-2 pt-1">
          {member.instagram && (
            <a href={`https://instagram.com/${member.instagram.replace('@', '')}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[9px] font-mono text-white/25 hover:text-white/50 transition-colors bg-white/[0.03] px-2.5 py-1 rounded-lg">
              <Instagram className="w-2.5 h-2.5" />
              @{member.instagram.replace('@', '')}
            </a>
          )}
          {member.linkedin && (
            <a href={member.linkedin.startsWith('http') ? member.linkedin : `https://${member.linkedin}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[9px] font-mono text-white/25 hover:text-white/50 transition-colors bg-white/[0.03] px-2.5 py-1 rounded-lg">
              <Linkedin className="w-2.5 h-2.5" />
              LinkedIn
            </a>
          )}
        </div>
      )}
    </div>
  );
}

function SuggestedCard({ member }: { member: typeof SUGGESTED[0] }) {
  return (
    <div className="bg-[#0B0D10] border border-white/[0.06] rounded-2xl p-4 hover:border-white/[0.10] transition-all"
      style={{ transition: 'all 0.2s ease' }}>
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-bold shrink-0"
          style={{ background: `${member.color}12`, border: `1px solid ${member.color}20`, color: member.color }}>
          {member.initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-[12.5px] font-semibold text-white/80">{member.name}</p>
            <span className="text-[7.5px] font-mono px-1.5 py-0.5 rounded uppercase tracking-wide shrink-0"
              style={{ color: member.color, background: `${member.color}10`, border: `1px solid ${member.color}20` }}>
              {member.role}
            </span>
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <MapPin className="w-2.5 h-2.5 text-white/15 shrink-0" />
            <span className="text-[9.5px] text-white/25">{member.location}</span>
          </div>
          <p className="text-[10px] text-white/28 mt-1.5 leading-snug italic">"{member.focus}"</p>
        </div>
      </div>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.04]">
        {member.open && (
          <span className="text-[8px] font-mono px-1.5 py-0.5 rounded"
            style={{ color: ACCENT, background: `${ACCENT}08`, border: `1px solid ${ACCENT}18` }}>
            Open to collaborate
          </span>
        )}
        {!member.open && <span className="text-[9px] text-white/15">Not accepting requests</span>}
        <button className="flex items-center gap-1 text-[9.5px] font-semibold transition-colors"
          style={{ color: member.color }}>
          Connect <ChevronRight className="w-2.5 h-2.5" />
        </button>
      </div>
    </div>
  );
}

export default function IndustryOSNetwork() {
  const [members, setMembers] = useState<IndustryOSMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('industry_os_members')
      .select('id,full_name,location,primary_industry,member_current_role,desired_role,instagram,linkedin,badge_type,membership_status,interests,created_at')
      .eq('membership_status', 'approved')
      .order('created_at', { ascending: false });
    setMembers((data ?? []) as IndustryOSMember[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const dynamicFilters = Array.from(new Set(members.map(m => m.primary_industry))).sort();
  const filters = ['All', ...FILTER_OPTIONS.slice(1).filter(f => dynamicFilters.includes(f) || members.length === 0)];
  const filtered = filter === 'All' ? members : members.filter(m => m.primary_industry === filter);

  return (
    <div className="space-y-7">
      <style>{`
        @keyframes ios-fade-up { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .ios-fade-up { animation: ios-fade-up 0.4s ease both; }
      `}</style>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 ios-fade-up">
        <div>
          <p className="text-[8.5px] font-mono text-white/20 uppercase tracking-[0.18em] mb-0.5">Industry OS</p>
          <h1 className="text-[26px] font-bold text-white/90">Network</h1>
          <p className="text-[12px] text-white/30 mt-1">
            Curated creative ecosystem — {members.length} approved member{members.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button onClick={load}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/[0.07] text-[10px] text-white/25 hover:text-white/50 transition-colors mt-1">
          <RefreshCw className="w-3 h-3" /> Refresh
        </button>
      </div>

      {/* Suggested for you */}
      <div className="space-y-3 ios-fade-up" style={{ animationDelay: '0.05s' }}>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: ACCENT }} />
          <p className="text-[9px] font-mono text-white/30 uppercase tracking-[0.18em]">Suggested for you</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SUGGESTED.map(m => <SuggestedCard key={m.name} member={m} />)}
        </div>
      </div>

      {/* Filter chips */}
      <div className="ios-fade-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center gap-1.5 flex-wrap">
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-lg text-[10.5px] font-medium transition-all whitespace-nowrap"
              style={filter === f ? {
                background: `${ACCENT}12`,
                color: ACCENT,
                border: `1px solid ${ACCENT}25`,
              } : {
                color: 'rgba(255,255,255,0.25)',
                border: '1px solid transparent',
              }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Member grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="w-5 h-5 text-white/20 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/[0.03] border border-white/[0.06]">
            <Users className="w-5 h-5 text-white/15" />
          </div>
          <p className="text-[12px] text-white/25">No approved members yet</p>
          <p className="text-[10.5px] text-white/15">The network grows as applications are reviewed</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ios-fade-up" style={{ animationDelay: '0.15s' }}>
          {filtered.map(m => <MemberCard key={m.id} member={m} />)}
        </div>
      )}

      {/* Network footer */}
      <div className="bg-[#0B0D10] border border-white/[0.05] rounded-xl p-4">
        <p className="text-[9.5px] text-white/20 leading-relaxed">
          Only approved members appear in the network. Collaboration matching and direct messaging are coming soon.
          Membership is not publicly advertised.
        </p>
      </div>
    </div>
  );
}
