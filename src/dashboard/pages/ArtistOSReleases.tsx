import { useMemo, useState } from 'react';
import {
  Disc, Calendar, Clock, Music, CheckCircle, Circle, Zap, BarChart2,
  Radio, Plus, AlertTriangle, ChevronRight, Star, Shield,
  TrendingUp, FileText, Users, Target, ChevronDown, Send, Megaphone,
  Activity, Link2, Globe, Instagram, Youtube,
} from 'lucide-react';
import NewReleasePlanWizard from '../components/releases/NewReleasePlanWizard';
import ReleaseDetailDrawer from '../components/releases/ReleaseDetailDrawer';
import AIRepsPanel from '../components/artistOS/AIRepsPanel';
import { generateAvailableDates, getPlanningYear } from '../utils/releaseDateEngine';
import { useActiveArtist } from '../hooks/useActiveArtist';

const LABEL_NAME = 'SPIN Records';

type ReleaseStatus = 'active' | 'upcoming' | 'scheduled' | 'in_production' | 'planning' | 'released';
type ReleaseType = 'Single' | 'EP' | 'Album' | 'Deluxe';

interface Release {
  id: string;
  title: string;
  type: ReleaseType;
  status: ReleaseStatus;
  releaseDate: string;
  submissionDeadline?: string;
  streams?: number;
  daysUntil?: number;
  readiness: { metadata: number; content: number; artwork: number; marketing: number; distribution: number; campaign: number; };
  campaignName?: string;
  campaignStatus?: 'Active' | 'Scheduled' | 'Complete' | 'Paused';
  leadSingle: boolean;
  notes: string;
  rep?: string;
}

interface AvailableDate {
  date: string;
  label: string;
  recommended: boolean;
  warning?: string;
  note: string;
  submissionDeadline: string;
  type: 'optimal' | 'standard' | 'caution' | 'reserved';
  conflictNote?: string;
}


const RELEASES: Release[] = [
  {
    id: 'R-AAR-001',
    title: 'Flagpole Sitta',
    type: 'Single',
    status: 'active',
    releaseDate: 'Feb 13, 2026',
    streams: 4200000,
    readiness: { metadata: 100, content: 100, artwork: 100, marketing: 95, distribution: 100, campaign: 90 },
    campaignName: 'Nostalgia Cycle Push',
    campaignStatus: 'Active',
    leadSingle: true,
    notes: 'Re-release driving nostalgia cycle. TikTok performing well above baseline. Brazil streaming up significantly. Nostalgia playlist placement active on Spotify.',
    rep: 'Randy Jackson',
  },
  {
    id: 'R-AAR-002',
    title: 'Move Along (Deluxe Edition)',
    type: 'Deluxe',
    status: 'upcoming',
    releaseDate: 'Jun 12, 2026',
    submissionDeadline: 'May 29, 2026',
    daysUntil: 60,
    readiness: { metadata: 90, content: 80, artwork: 70, marketing: 55, distribution: 60, campaign: 45 },
    campaignName: 'Deluxe Pre-Save Campaign',
    campaignStatus: 'Active',
    leadSingle: false,
    notes: 'Deluxe with 4 bonus tracks. Pre-save campaign live across Spotify and Apple Music. Artwork needs final approval. Editorial pitch submitted.',
    rep: 'Paula Moore',
  },
  {
    id: 'R-AAR-003',
    title: 'Untitled Summer Single',
    type: 'Single',
    status: 'in_production',
    releaseDate: 'Aug 2026',
    daysUntil: 120,
    readiness: { metadata: 40, content: 30, artwork: 10, marketing: 0, distribution: 0, campaign: 0 },
    leadSingle: true,
    notes: 'New original material. Content strategy TBD. Targeting summer streaming peak. Metadata intake not yet submitted.',
    rep: 'Randy Jackson',
  },
  {
    id: 'R-AAR-004',
    title: 'Fall EP',
    type: 'EP',
    status: 'planning',
    releaseDate: 'Q4 2026',
    readiness: { metadata: 10, content: 5, artwork: 0, marketing: 0, distribution: 0, campaign: 0 },
    leadSingle: false,
    notes: 'Conceptual phase. 5-track EP planned for fall release window. Title and tracklist TBD.',
    rep: 'Paula Moore',
  },
];

const STATUS_META: Record<ReleaseStatus, { label: string; color: string; Icon: React.ElementType }> = {
  active:        { label: 'Active Now',     color: '#10B981', Icon: Radio },
  upcoming:      { label: 'Upcoming',       color: '#06B6D4', Icon: Zap },
  scheduled:     { label: 'Scheduled',      color: '#3B82F6', Icon: Calendar },
  in_production: { label: 'In Production',  color: '#F59E0B', Icon: Clock },
  planning:      { label: 'Planning',       color: '#6B7280', Icon: Circle },
  released:      { label: 'Released',       color: '#10B981', Icon: CheckCircle },
};

const TYPE_COLORS: Record<ReleaseType, string> = {
  Single: '#06B6D4', EP: '#10B981', Album: '#EF4444', Deluxe: '#F59E0B',
};

const STATUS_ORDER: ReleaseStatus[] = ['active', 'upcoming', 'scheduled', 'in_production', 'planning', 'released'];

const RELEASE_CONFLICTS = [
  { month: 6, day: 12, label: 'Move Along (Deluxe Edition)' },
];

function buildAvailableDates(): AvailableDate[] {
  const year = getPlanningYear();
  const startFrom = new Date(year, 3, 1);
  const raw = generateAvailableDates({ conflicts: RELEASE_CONFLICTS, startFromDate: startFrom, count: 10 });
  return raw.map(d => ({
    date: d.display,
    label: d.label,
    recommended: d.recommended,
    note: d.note,
    submissionDeadline: d.submissionDeadlineDisplay,
    type: d.type,
    conflictNote: d.conflictNote,
    warning: d.warning,
  }));
}


const READINESS_FIELDS = [
  { key: 'metadata' as const, label: 'Metadata', color: '#06B6D4' },
  { key: 'content' as const, label: 'Audio', color: '#10B981' },
  { key: 'artwork' as const, label: 'Artwork', color: '#F59E0B' },
  { key: 'distribution' as const, label: 'Distribution', color: '#EF4444' },
  { key: 'campaign' as const, label: 'Campaign', color: '#EC4899' },
  { key: 'marketing' as const, label: 'Approvals', color: '#3B82F6' },
];

function fmt(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

function avgReadiness(r: Release['readiness']): number {
  const vals = Object.values(r);
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}

function getReadinessStatus(pct: number): { label: string; color: string } {
  if (pct >= 100) return { label: 'Complete', color: '#10B981' };
  if (pct >= 70) return { label: 'Needs Review', color: '#F59E0B' };
  if (pct > 0) return { label: 'In Progress', color: '#06B6D4' };
  return { label: 'Missing', color: '#6B7280' };
}

function ReadinessBar({ score, color }: { score: number; color: string }) {
  return (
    <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${score}%`, background: color, borderRadius: 2, transition: 'width 0.6s cubic-bezier(0.16,1,0.3,1)' }} />
    </div>
  );
}

function ReleaseCard({ release, expanded, onToggle, onOpen }: { release: Release; expanded: boolean; onToggle: () => void; onOpen: () => void; }) {
  const sm = STATUS_META[release.status];
  const typeColor = TYPE_COLORS[release.type];
  const avg = avgReadiness(release.readiness);

  return (
    <div style={{ background: '#0D0E11', border: `1px solid ${release.status === 'active' ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 16, overflow: 'hidden' }}>
      <div onClick={onToggle} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, padding: '18px 20px', cursor: 'pointer' }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: `${typeColor}15`, border: `1px solid ${typeColor}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Music size={18} color={typeColor} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>{release.title}</span>
            <span style={{ fontSize: 8, fontFamily: 'monospace', padding: '2px 7px', borderRadius: 20, color: typeColor, background: `${typeColor}12`, border: `1px solid ${typeColor}25` }}>{release.type}</span>
            {release.leadSingle && <span style={{ fontSize: 8, fontFamily: 'monospace', padding: '2px 7px', borderRadius: 20, color: '#F59E0B', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}><Star size={7} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 3 }} />LEAD</span>}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 9, fontFamily: 'monospace', padding: '2px 8px', borderRadius: 20, color: sm.color, background: `${sm.color}10`, border: `1px solid ${sm.color}20` }}>
              {release.status === 'active' && <span style={{ width: 5, height: 5, borderRadius: '50%', background: sm.color, display: 'inline-block', boxShadow: `0 0 6px ${sm.color}` }} />}
              <sm.Icon size={9} />&nbsp;{sm.label}
            </span>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace' }}>{release.releaseDate}</span>
            {release.daysUntil !== undefined && <span style={{ fontSize: 9, color: '#06B6D4', fontFamily: 'monospace' }}>{release.daysUntil}d out</span>}
            {release.streams !== undefined && <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', fontFamily: 'monospace' }}>{fmt(release.streams)} streams</span>}
            {release.rep && <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', fontFamily: 'monospace' }}>Rep: {release.rep}</span>}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: avg >= 80 ? '#10B981' : avg >= 50 ? '#F59E0B' : 'rgba(255,255,255,0.3)', lineHeight: 1 }}>{avg}%</div>
            <div style={{ fontSize: 8, fontFamily: 'monospace', color: 'rgba(255,255,255,0.2)' }}>ready</div>
          </div>
          <ChevronDown size={14} color="rgba(255,255,255,0.25)" style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </div>
      </div>

      {expanded && (
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {release.notes && (
            <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.04)' }}>{release.notes}</p>
          )}
          {release.submissionDeadline && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 10 }}>
              <AlertTriangle size={12} color="#F59E0B" />
              <span style={{ fontSize: 11, color: '#F59E0B' }}>Submission deadline: <strong>{release.submissionDeadline}</strong></span>
            </div>
          )}
          {/* Readiness rows */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 12, padding: '12px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Readiness — {avg}%</span>
              <span style={{ fontSize: 9, fontFamily: 'monospace', padding: '2px 8px', borderRadius: 20, background: avg >= 80 ? 'rgba(16,185,129,0.1)' : avg < 50 ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)', color: avg >= 80 ? '#10B981' : avg < 50 ? '#EF4444' : '#F59E0B', border: `1px solid ${avg >= 80 ? 'rgba(16,185,129,0.2)' : avg < 50 ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)'}` }}>
                {avg >= 80 ? 'Virgin Ready' : avg >= 50 ? 'In Progress' : 'Blocked'}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {READINESS_FIELDS.map(f => {
                const pct = release.readiness[f.key];
                const status = getReadinessStatus(pct);
                return (
                  <div key={f.key} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', width: 74, flexShrink: 0 }}>{f.label}</span>
                    <ReadinessBar score={pct} color={f.color} />
                    <span style={{ fontSize: 10, fontFamily: 'monospace', color: pct >= 80 ? f.color : 'rgba(255,255,255,0.3)', width: 28, textAlign: 'right', flexShrink: 0 }}>{pct}%</span>
                    <span style={{ fontSize: 8, fontFamily: 'monospace', width: 74, color: status.color, flexShrink: 0 }}>{status.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
          {release.campaignName && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'rgba(6,182,212,0.04)', border: '1px solid rgba(6,182,212,0.12)', borderRadius: 10 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: release.campaignStatus === 'Active' ? '#10B981' : '#6B7280' }} />
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>Campaign: <span style={{ color: '#06B6D4', fontWeight: 600 }}>{release.campaignName}</span></span>
              <span style={{ marginLeft: 'auto', fontSize: 9, fontFamily: 'monospace', padding: '2px 7px', borderRadius: 20, color: '#10B981', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>{release.campaignStatus}</span>
            </div>
          )}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button onClick={e => { e.stopPropagation(); onOpen(); }} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, padding: '7px 14px', borderRadius: 8, cursor: 'pointer', background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)', color: '#06B6D4', fontWeight: 600 }}>
              <Activity size={10} /> Open Release Detail
            </button>
            {!release.campaignName && (
              <button style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, padding: '7px 14px', borderRadius: 8, cursor: 'pointer', background: 'rgba(236,72,153,0.06)', border: '1px solid rgba(236,72,153,0.15)', color: '#EC4899', fontWeight: 600 }}>
                <Megaphone size={10} /> Build Campaign
              </button>
            )}
            <button style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, padding: '7px 14px', borderRadius: 8, cursor: 'pointer', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', color: '#10B981', fontWeight: 600 }}>
              <Send size={10} /> Generate Pre-Save Brief
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ArtistOSReleases() {
  const artist = useActiveArtist();

  if (!artist) {
    return (
      <div style={{ background: '#08090B', minHeight: '100%', padding: '22px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13, fontFamily: 'monospace' }}>No artist context active.</p>
      </div>
    );
  }
  const [expandedId, setExpandedId] = useState<string | null>('R-AAR-001');
  const [showWizard, setShowWizard] = useState(false);
  const [showDates, setShowDates] = useState(true);
  const [showNext, setShowNext] = useState(false);
  const [showConnections, setShowConnections] = useState(false);
  const [showReps, setShowReps] = useState(false);
  const [drawerRelease, setDrawerRelease] = useState<Release | null>(null);

  const availableDates = useMemo(() => buildAvailableDates(), []);

  const statCounts = STATUS_ORDER.reduce((acc, s) => {
    acc[s] = RELEASES.filter(r => r.status === s).length;
    return acc;
  }, {} as Record<ReleaseStatus, number>);

  const activeRelease = RELEASES.find(r => r.status === 'active');
  const upcomingRelease = RELEASES.find(r => r.status === 'upcoming');
  const inProductionCount = RELEASES.filter(r => r.status === 'in_production').length;
  const virginReadyCount = RELEASES.filter(r => avgReadiness(r.readiness) >= 80).length;
  const openBlockers = RELEASES.filter(r => avgReadiness(r.readiness) < 50 && r.status !== 'released').length;
  const nextDeadline = upcomingRelease?.submissionDeadline;

  const statCards = [
    { label: 'Active Now', value: statCounts.active, color: '#10B981', Icon: Radio },
    { label: 'Upcoming', value: statCounts.upcoming, color: '#06B6D4', Icon: Zap },
    { label: 'Scheduled', value: statCounts.scheduled, color: '#3B82F6', Icon: Calendar },
    { label: 'In Production', value: statCounts.in_production + inProductionCount, color: '#F59E0B', Icon: Clock },
    { label: 'Planning', value: statCounts.planning, color: '#6B7280', Icon: Circle },
    { label: 'Released', value: statCounts.released, color: '#10B981', Icon: CheckCircle },
  ];

  return (
    <div style={{ background: '#08090B', minHeight: '100%', padding: '22px 24px' }}>
      {showWizard && <NewReleasePlanWizard onClose={() => setShowWizard(false)} />}
      {drawerRelease && <ReleaseDetailDrawer release={drawerRelease} onClose={() => setDrawerRelease(null)} />}

      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Disc size={18} color="#06B6D4" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.2 }}>Release OS</h1>
            <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{artist.name} · {LABEL_NAME} · Release Command Center</p>
          </div>
        </div>
        <button onClick={() => setShowWizard(true)} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, padding: '10px 20px', borderRadius: 10, cursor: 'pointer', background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.3)', color: '#06B6D4', fontWeight: 700 }}>
          <Plus size={13} /> Start New Release Plan
        </button>
      </div>

      {/* SECTION 1 — Dashboard Header Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10, marginBottom: 14 }}>
        {statCards.map(s => (
          <div key={s.label} style={{ background: '#0D0E11', border: `1px solid ${s.value > 0 ? `${s.color}20` : 'rgba(255,255,255,0.06)'}`, borderRadius: 12, padding: '13px 14px' }}>
            <p style={{ margin: '0 0 3px', fontSize: 22, fontWeight: 800, color: s.value > 0 ? s.color : '#374151', lineHeight: 1 }}>{s.value}</p>
            <p style={{ margin: 0, fontSize: 8, fontFamily: 'monospace', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Key indicators */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 14 }}>
        {[
          { label: 'Next Submission Deadline', value: nextDeadline || 'None set', color: nextDeadline ? '#F59E0B' : '#6B7280', Icon: AlertTriangle },
          { label: 'Next Recommended Date', value: 'Jun 5, 2026', color: '#10B981', Icon: Calendar },
          { label: 'Open Blockers', value: openBlockers.toString(), color: openBlockers > 0 ? '#EF4444' : '#10B981', Icon: Shield },
          { label: 'Virgin Ready', value: virginReadyCount.toString(), color: virginReadyCount > 0 ? '#10B981' : '#6B7280', Icon: CheckCircle },
        ].map(card => (
          <div key={card.label} style={{ background: '#0D0E11', border: `1px solid ${card.color}15`, borderRadius: 12, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: `${card.color}12`, border: `1px solid ${card.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <card.Icon size={12} color={card.color} />
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ margin: '0 0 2px', fontSize: 13, fontWeight: 800, color: card.color, lineHeight: 1 }}>{card.value}</p>
              <p style={{ margin: 0, fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: 'rgba(6,182,212,0.04)', border: '1px solid rgba(6,182,212,0.1)', borderRadius: 10, padding: '10px 16px', marginBottom: 16 }}>
        <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
          Release OS guides metadata, assets, dates, delivery, and launch readiness — from intake through Virgin-ready handoff.
        </p>
      </div>

      {/* Active + Upcoming command cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <div style={{ background: '#0D0E11', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 16, padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981' }} />
            <span style={{ fontSize: 9, fontFamily: 'monospace', color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Active Release</span>
          </div>
          {activeRelease ? (
            <>
              <p style={{ margin: '0 0 5px', fontSize: 17, fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>{activeRelease.title}</p>
              <p style={{ margin: '0 0 12px', fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{activeRelease.type} · {activeRelease.releaseDate}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 22, fontWeight: 800, color: '#10B981' }}>{activeRelease.streams ? fmt(activeRelease.streams) : '—'}</span>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>streams</span>
              </div>
              <button onClick={() => setDrawerRelease(activeRelease)} style={{ fontSize: 10, padding: '6px 14px', borderRadius: 8, cursor: 'pointer', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: '#10B981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                <Activity size={10} /> View Release Detail
              </button>
            </>
          ) : (
            <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>No active release</p>
          )}
        </div>

        <div style={{ background: '#0D0E11', border: '1px solid rgba(6,182,212,0.15)', borderRadius: 16, padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
            <Zap size={11} color="#06B6D4" />
            <span style={{ fontSize: 9, fontFamily: 'monospace', color: '#06B6D4', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Next Scheduled</span>
          </div>
          {upcomingRelease ? (
            <>
              <p style={{ margin: '0 0 5px', fontSize: 17, fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>{upcomingRelease.title}</p>
              <p style={{ margin: '0 0 12px', fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{upcomingRelease.type} · {upcomingRelease.releaseDate}</p>
              {nextDeadline && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <AlertTriangle size={10} color="#F59E0B" />
                  <span style={{ fontSize: 10, color: '#F59E0B' }}>Submission deadline: <strong>{nextDeadline}</strong></span>
                </div>
              )}
              {upcomingRelease.daysUntil !== undefined && (
                <div style={{ marginBottom: 10 }}>
                  <span style={{ fontSize: 22, fontWeight: 800, color: '#06B6D4' }}>{upcomingRelease.daysUntil}</span>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginLeft: 6 }}>days out</span>
                </div>
              )}
              <button onClick={() => setDrawerRelease(upcomingRelease)} style={{ fontSize: 10, padding: '6px 14px', borderRadius: 8, cursor: 'pointer', background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)', color: '#06B6D4', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                <Activity size={10} /> View Release Detail
              </button>
            </>
          ) : (
            <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>No upcoming releases</p>
          )}
        </div>
      </div>

      {/* SECTION 2 — Release Pipeline */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <BarChart2 size={13} color="rgba(255,255,255,0.3)" />
          <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Release Pipeline</span>
          <span style={{ fontSize: 9, fontFamily: 'monospace', padding: '2px 8px', borderRadius: 20, background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.15)', color: '#06B6D4' }}>{RELEASES.length} releases</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[...RELEASES].sort((a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status)).map(r => (
            <ReleaseCard
              key={r.id}
              release={r}
              expanded={expandedId === r.id}
              onToggle={() => setExpandedId(expandedId === r.id ? null : r.id)}
              onOpen={() => setDrawerRelease(r)}
            />
          ))}
        </div>
      </div>

      {/* SECTION 4 — Available Release Dates */}
      <div style={{ background: '#0D0E11', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden', marginBottom: 14 }}>
        <div onClick={() => setShowDates(v => !v)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', cursor: 'pointer', borderBottom: showDates ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 26, height: 26, borderRadius: 8, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={13} color="#F59E0B" />
            </div>
            <div>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Available Release Dates</span>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginLeft: 10 }}>AI-Scored Schedule Intelligence</span>
            </div>
          </div>
          <ChevronDown size={14} color="rgba(255,255,255,0.25)" style={{ transform: showDates ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </div>
        {showDates && (
          <div style={{ padding: '0 20px 16px' }}>
            {availableDates.map((d, i) => {
              const dotColor = d.type === 'optimal' ? '#10B981' : d.type === 'caution' ? '#F59E0B' : d.type === 'reserved' ? '#EF4444' : '#6B7280';
              const labelColor = d.type === 'optimal' ? '#10B981' : d.type === 'caution' ? '#F59E0B' : d.type === 'reserved' ? '#EF4444' : '#6B7280';
              return (
                <div key={d.date} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 0', borderBottom: i < availableDates.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: dotColor, flexShrink: 0, marginTop: 4, boxShadow: d.type === 'optimal' ? `0 0 8px ${dotColor}60` : 'none' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: d.type === 'reserved' ? 'rgba(255,255,255,0.4)' : '#fff' }}>{d.date}</span>
                      <span style={{ fontSize: 8, fontFamily: 'monospace', padding: '2px 7px', borderRadius: 20, color: labelColor, background: `${labelColor}12`, border: `1px solid ${labelColor}25` }}>{d.label}</span>
                      {d.recommended && <span style={{ fontSize: 8, fontFamily: 'monospace', padding: '2px 7px', borderRadius: 20, color: '#10B981', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)' }}><Star size={7} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 3 }} />AI PICK</span>}
                    </div>
                    <p style={{ margin: '0 0 4px', fontSize: 11, color: d.type === 'reserved' ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>{d.note}</p>
                    {d.conflictNote && <p style={{ margin: '0 0 4px', fontSize: 10, color: '#EF4444', fontFamily: 'monospace' }}>Conflict: {d.conflictNote}</p>}
                    {d.warning && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <AlertTriangle size={9} color="#F59E0B" />
                        <span style={{ fontSize: 10, color: '#F59E0B' }}>{d.warning}</span>
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p style={{ margin: 0, fontSize: 9, color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace' }}>Submit by</p>
                    <p style={{ margin: 0, fontSize: 11, color: d.type === 'reserved' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.5)', fontFamily: 'monospace', fontWeight: 600 }}>{d.submissionDeadline}</p>
                    {d.type !== 'reserved' && (
                      <button onClick={() => setShowWizard(true)} style={{ marginTop: 6, fontSize: 9, padding: '3px 10px', borderRadius: 7, cursor: 'pointer', background: `${dotColor}10`, border: `1px solid ${dotColor}20`, color: dotColor, fontWeight: 600 }}>Select Date</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION 5 — Your AI Team */}
      <div style={{ marginBottom: 14 }}>
        <AIRepsPanel artist={artist} />
      </div>

      {/* SECTION 6 — What Happens After You Submit */}
      <div style={{ background: '#0D0E11', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden', marginBottom: 14 }}>
        <div onClick={() => setShowNext(v => !v)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', cursor: 'pointer', borderBottom: showNext ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 26, height: 26, borderRadius: 8, background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={13} color="#06B6D4" />
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>What Happens After You Submit</span>
          </div>
          <ChevronDown size={14} color="rgba(255,255,255,0.25)" style={{ transform: showNext ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </div>
        {showNext && (
          <div style={{ padding: '18px 24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {[
                { step: '01', title: 'Artist Services Reviews Submission', desc: 'GMG Artist Services reviews metadata completeness, asset quality, and release timing.', color: '#06B6D4' },
                { step: '02', title: 'Metadata Enters Catalog Sheet', desc: 'Product and track metadata is entered into the GMG Catalog Metadata Sheet by the operations team.', color: '#10B981' },
                { step: '03', title: 'Distribution Office Assignment', desc: 'Release is added to the Distribution Office to claim the catalog number and confirm product structure.', color: '#F59E0B' },
                { step: '04', title: 'Internal Ingest to Virgin Central', desc: 'After operator review, metadata and assets are ingested to Virgin Central for DSP delivery.', color: '#EC4899' },
                { step: '05', title: 'Pre-save + Streaming Links Created', desc: 'After approval, feature.fm pre-save pages and streaming links are created for campaign launch.', color: '#EF4444' },
                { step: '06', title: 'Release Setup Complete — Launch Sequence Begins', desc: 'All systems confirmed. Release is locked and ready. Launch sequence activates per campaign schedule.', color: '#3B82F6' },
              ].map((item, i, arr) => (
                <div key={item.step} style={{ display: 'flex', gap: 16, position: 'relative' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: `${item.color}15`, border: `1px solid ${item.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: 9, fontFamily: 'monospace', fontWeight: 800, color: item.color }}>{item.step}</span>
                    </div>
                    {i < arr.length - 1 && <div style={{ width: 1, flex: 1, background: 'rgba(255,255,255,0.05)', minHeight: 20, marginTop: 4 }} />}
                  </div>
                  <div style={{ paddingBottom: i < arr.length - 1 ? 20 : 0, paddingTop: 4 }}>
                    <p style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 700, color: '#fff' }}>{item.title}</p>
                    <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.35)', lineHeight: 1.6 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SECTION 9 — Connections */}
      <div style={{ background: '#0D0E11', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden', marginBottom: 14 }}>
        <div onClick={() => setShowConnections(v => !v)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', cursor: 'pointer', borderBottom: showConnections ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 26, height: 26, borderRadius: 8, background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Link2 size={13} color="#EC4899" />
            </div>
            <div>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Platform Connections</span>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginLeft: 10 }}>Connect accounts to unlock automated release triggers</span>
            </div>
          </div>
          <ChevronDown size={14} color="rgba(255,255,255,0.25)" style={{ transform: showConnections ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </div>
        {showConnections && (
          <div style={{ padding: '16px 20px' }}>
            <p style={{ margin: '0 0 14px', fontSize: 11, color: 'rgba(255,255,255,0.35)', lineHeight: 1.7 }}>Connected accounts unlock automated campaign triggers, reporting, rep recommendations, and faster release execution.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {[
                { name: 'Spotify for Artists', status: 'connected', color: '#10B981', Icon: Music },
                { name: 'Apple Music for Artists', status: 'not_connected', color: '#6B7280', Icon: Music },
                { name: 'TikTok Artist Account', status: 'connected', color: '#10B981', Icon: Activity },
                { name: 'Instagram / Meta', status: 'connected', color: '#10B981', Icon: Instagram },
                { name: 'YouTube Official Artist', status: 'not_connected', color: '#6B7280', Icon: Youtube },
                { name: 'GMG Store', status: 'connected', color: '#10B981', Icon: Globe },
                { name: 'DISCO', status: 'not_connected', color: '#6B7280', Icon: Disc },
                { name: 'Dropbox / Drive', status: 'connected', color: '#10B981', Icon: Link2 },
                { name: 'Shopify Store', status: 'not_connected', color: '#6B7280', Icon: Target },
              ].map(conn => (
                <div key={conn.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: `1px solid ${conn.status === 'connected' ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.05)'}` }}>
                  <div style={{ width: 26, height: 26, borderRadius: 8, background: `${conn.color}12`, border: `1px solid ${conn.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <conn.Icon size={11} color={conn.color} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 10, fontWeight: 600, color: conn.status === 'connected' ? '#fff' : 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{conn.name}</p>
                    <p style={{ margin: 0, fontSize: 8, fontFamily: 'monospace', color: conn.color }}>{conn.status === 'connected' ? 'Connected' : 'Not connected'}</p>
                  </div>
                  {conn.status !== 'connected' && (
                    <button style={{ fontSize: 8, padding: '3px 8px', borderRadius: 6, cursor: 'pointer', background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)', color: '#06B6D4', fontWeight: 600, whiteSpace: 'nowrap' }}>Connect</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Action Bar */}
      <div style={{ background: '#0D0E11', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '14px 20px' }}>
        <p style={{ margin: '0 0 12px', fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Release Command Actions</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            { Icon: Plus, label: 'Start New Release Plan', color: '#06B6D4', onClick: () => setShowWizard(true) },
            { Icon: Megaphone, label: 'Build Campaign From Release', color: '#EC4899', onClick: undefined },
            { Icon: Send, label: 'Generate Pre-Save Brief', color: '#10B981', onClick: undefined },
            { Icon: TrendingUp, label: 'Streaming Analytics', color: '#F59E0B', onClick: undefined },
            { Icon: FileText, label: 'Generate Release Week Plan', color: '#3B82F6', onClick: undefined },
            { Icon: Users, label: 'Request Rep Support', color: '#EF4444', onClick: () => setShowReps(true) },
            { Icon: ChevronRight, label: 'Send to Campaign OS', color: '#6B7280', onClick: undefined },
          ].map(action => (
            <button key={action.label} onClick={action.onClick} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, padding: '7px 14px', borderRadius: 9, cursor: 'pointer', background: `${action.color}08`, border: `1px solid ${action.color}20`, color: action.color, fontWeight: 600, whiteSpace: 'nowrap' }}>
              <action.Icon size={11} />
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
