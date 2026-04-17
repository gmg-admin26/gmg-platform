import { Instagram, Linkedin, MapPin, Briefcase, Globe, Clock, CheckCircle, Users, Folder, BookOpen } from 'lucide-react';
import { useIndustryOS } from '../../auth/IndustryOSContext';

const ACCENT = '#10B981';

const STATUS_COLOR: Record<string, string> = {
  approved:   '#10B981',
  pending:    '#F59E0B',
  waitlisted: '#6B7280',
};
const STATUS_LABEL: Record<string, string> = {
  approved:   'Approved',
  pending:    'Pending Review',
  waitlisted: 'Waitlisted',
};

const BADGE_META: Record<string, { color: string; label: string }> = {
  Artist:              { color: '#10B981', label: 'Artist' },
  Producer:            { color: '#06B6D4', label: 'Producer' },
  Songwriter:          { color: '#F59E0B', label: 'Songwriter' },
  Manager:             { color: '#3B82F6', label: 'Manager' },
  Marketer:            { color: '#10B981', label: 'Marketer' },
  'A&R':               { color: '#EF4444', label: 'A&R' },
  'Creative Director': { color: '#F59E0B', label: 'Creative Director' },
  Videographer:        { color: '#06B6D4', label: 'Videographer' },
  Engineer:            { color: '#6B7280', label: 'Engineer' },
  Student:             { color: '#10B981', label: 'Student' },
  Other:               { color: '#6B7280', label: 'Other' },
};

export default function IndustryOSProfile() {
  const { iosAuth } = useIndustryOS();
  const member = iosAuth.member;

  if (!member) return null;

  const statusColor = STATUS_COLOR[member.membership_status] ?? '#6B7280';
  const statusLabel = STATUS_LABEL[member.membership_status] ?? member.membership_status;
  const badge = BADGE_META[member.primary_industry] ?? { color: '#6B7280', label: member.primary_industry };
  const initials = member.full_name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const openTo = member.interests?.length > 0 ? member.interests : [];

  return (
    <div className="space-y-6 max-w-2xl">
      <style>{`
        @keyframes ios-fade-up { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .ios-fade-up { animation: ios-fade-up 0.4s ease both; }
      `}</style>

      {/* Header */}
      <div className="ios-fade-up">
        <p className="text-[8.5px] font-mono text-white/20 uppercase tracking-[0.18em] mb-0.5">Industry OS</p>
        <h1 className="text-[26px] font-bold text-white/90">Profile</h1>
      </div>

      {/* Identity card */}
      <div className="relative bg-[#0A0C10] border border-white/[0.07] rounded-2xl p-6 overflow-hidden ios-fade-up"
        style={{ animationDelay: '0.05s' }}>
        <div className="absolute top-0 left-0 right-0 h-[1px]"
          style={{ background: `linear-gradient(90deg, transparent, ${statusColor}25, transparent)` }} />
        <div className="absolute bottom-0 right-0 w-40 h-28 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 100% 100%, ${badge.color}05 0%, transparent 70%)` }} />

        <div className="relative flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-[18px] font-bold shrink-0"
            style={{ background: `${badge.color}10`, border: `1px solid ${badge.color}20`, color: badge.color }}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap mb-1">
              <p className="text-[18px] font-bold text-white/90">{member.full_name}</p>
              <span className="text-[8px] font-mono px-1.5 py-0.5 rounded uppercase tracking-wide"
                style={{ color: statusColor, background: `${statusColor}12`, border: `1px solid ${statusColor}20` }}>
                {statusLabel}
              </span>
              <span className="text-[8px] font-mono px-1.5 py-0.5 rounded uppercase tracking-wide"
                style={{ color: badge.color, background: `${badge.color}10`, border: `1px solid ${badge.color}20` }}>
                {badge.label}
              </span>
            </div>
            <p className="text-[11px] text-white/35">
              {member.primary_industry}{member.primary_industry_other ? ` — ${member.primary_industry_other}` : ''}
            </p>
            {member.location && (
              <div className="flex items-center gap-1.5 mt-1.5">
                <MapPin className="w-3 h-3 text-white/20" />
                <span className="text-[10.5px] text-white/30">{member.location}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Open to */}
      {openTo.length > 0 && (
        <div className="bg-[#0B0D10] border border-white/[0.06] rounded-2xl p-4 space-y-3 ios-fade-up" style={{ animationDelay: '0.1s' }}>
          <p className="text-[8.5px] font-mono text-white/20 uppercase tracking-[0.15em]">Open to</p>
          <div className="flex flex-wrap gap-1.5">
            {openTo.map(interest => (
              <span key={interest}
                className="flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-1 rounded-lg"
                style={{ color: 'rgba(255,255,255,0.50)', background: `${ACCENT}07`, border: `1px solid ${ACCENT}15` }}>
                <CheckCircle className="w-2.5 h-2.5" style={{ color: ACCENT }} />
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Details */}
      <div className="bg-[#0B0D10] border border-white/[0.06] rounded-2xl divide-y divide-white/[0.04] ios-fade-up" style={{ animationDelay: '0.12s' }}>
        {[
          { icon: Briefcase, label: 'Current Role', value: member.member_current_role },
          { icon: Briefcase, label: 'Desired Role', value: member.desired_role },
          { icon: Instagram, label: 'Instagram', value: member.instagram ? `@${member.instagram.replace('@', '')}` : null, href: member.instagram ? `https://instagram.com/${member.instagram.replace('@', '')}` : undefined },
          { icon: Linkedin, label: 'LinkedIn', value: member.linkedin ?? null, href: member.linkedin ? (member.linkedin.startsWith('http') ? member.linkedin : `https://${member.linkedin}`) : undefined },
          { icon: Globe, label: 'Website', value: member.website ?? null, href: member.website },
        ].filter(row => row.value).map(row => {
          const RowIcon = row.icon;
          return (
            <div key={row.label} className="flex items-center gap-3 px-4 py-3">
              <RowIcon className="w-3.5 h-3.5 text-white/20 shrink-0" />
              <span className="text-[9.5px] font-mono text-white/25 uppercase w-24 shrink-0">{row.label}</span>
              {row.href ? (
                <a href={row.href} target="_blank" rel="noopener noreferrer"
                  className="text-[11.5px] hover:opacity-70 transition-opacity" style={{ color: ACCENT }}>
                  {row.value}
                </a>
              ) : (
                <span className="text-[11.5px] text-white/55">{row.value}</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Activity placeholder */}
      <div className="bg-[#0B0D10] border border-white/[0.06] rounded-2xl p-5 ios-fade-up" style={{ animationDelay: '0.15s' }}>
        <p className="text-[8.5px] font-mono text-white/20 uppercase tracking-[0.15em] mb-4">Activity</p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Folder, label: 'Projects', value: '0', color: ACCENT },
            { icon: Users, label: 'Connections', value: '0', color: '#06B6D4' },
            { icon: BookOpen, label: 'Training', value: '0', color: '#F59E0B' },
          ].map(stat => (
            <div key={stat.label} className="bg-white/[0.025] border border-white/[0.05] rounded-xl p-3 text-center">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center mx-auto mb-2"
                style={{ background: `${stat.color}10`, border: `1px solid ${stat.color}18` }}>
                <stat.icon className="w-3.5 h-3.5" style={{ color: stat.color }} />
              </div>
              <p className="text-[18px] font-bold leading-none" style={{ color: stat.color }}>{stat.value}</p>
              <p className="text-[9px] font-mono text-white/20 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-white/20 leading-relaxed mt-4 text-center">
          Projects, collaborations, and signals will appear here
        </p>
      </div>

      {/* Membership status */}
      <div className="bg-[#0B0D10] border border-white/[0.06] rounded-2xl p-4 space-y-2 ios-fade-up" style={{ animationDelay: '0.2s' }}>
        <p className="text-[8.5px] font-mono text-white/20 uppercase tracking-widest">Membership</p>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full"
            style={{ background: statusColor, boxShadow: `0 0 5px ${statusColor}60` }} />
          <span className="text-[12px] font-semibold" style={{ color: statusColor }}>{statusLabel}</span>
        </div>
        {member.membership_status === 'pending' && (
          <p className="text-[10px] text-white/25 leading-relaxed">
            Your application is under review by the GMG team. You have access to the network and AI coworkers while pending. Project OS access requires approval and an active project assignment.
          </p>
        )}
        {member.membership_status === 'approved' && (
          <p className="text-[10px] text-white/25 leading-relaxed">
            Your membership is active. Project OS access requires a separate project assignment from GMG.
          </p>
        )}
      </div>

      {/* Member since */}
      <div className="flex items-center gap-2 text-[9.5px] font-mono text-white/15 ios-fade-up" style={{ animationDelay: '0.22s' }}>
        <Clock className="w-3 h-3" />
        Member since {new Date(member.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
      </div>
    </div>
  );
}
