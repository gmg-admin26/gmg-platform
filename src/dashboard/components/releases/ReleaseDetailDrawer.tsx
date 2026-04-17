import { useState } from 'react';
import {
  X, Music, Calendar, AlertTriangle, CheckCircle, Users, Zap, FileText,
  BarChart2, Clock, Star, Radio, Circle, Shield, Send, Megaphone,
  Activity, Tag, Link2,
} from 'lucide-react';
import { copyrightYear } from '../../utils/releaseDateEngine';

const LABEL_NAME = 'SPIN Records';

type ReleaseStatus = 'active' | 'upcoming' | 'scheduled' | 'in_production' | 'planning' | 'released';
type ReleaseType = 'Single' | 'EP' | 'Album' | 'Deluxe' | 'Re-release';
type ReadinessStatus = 'complete' | 'needs_review' | 'blocked' | 'missing';

interface ReadinessItem {
  category: string;
  pct: number;
  status: ReadinessStatus;
  note?: string;
  color: string;
}

interface ActivityEntry {
  time: string;
  action: string;
  by: string;
}

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

const STATUS_META: Record<ReleaseStatus, { label: string; color: string; Icon: React.ElementType }> = {
  active:        { label: 'Active Now',    color: '#10B981', Icon: Radio },
  upcoming:      { label: 'Upcoming',      color: '#06B6D4', Icon: Zap },
  scheduled:     { label: 'Scheduled',     color: '#3B82F6', Icon: Calendar },
  in_production: { label: 'In Production', color: '#F59E0B', Icon: Clock },
  planning:      { label: 'Planning',      color: '#6B7280', Icon: Circle },
  released:      { label: 'Released',      color: '#10B981', Icon: CheckCircle },
};

const TYPE_COLORS: Record<string, string> = {
  Single: '#06B6D4', EP: '#10B981', Album: '#EF4444', Deluxe: '#F59E0B', 'Re-release': '#8B5CF6',
};

const READINESS_STATUS_META: Record<ReadinessStatus, { label: string; color: string }> = {
  complete:     { label: 'Complete',     color: '#10B981' },
  needs_review: { label: 'Needs Review', color: '#F59E0B' },
  blocked:      { label: 'Blocked',      color: '#EF4444' },
  missing:      { label: 'Missing',      color: '#6B7280' },
};

function fmt(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

function buildReadinessItems(r: Release['readiness']): ReadinessItem[] {
  function getStatus(pct: number): ReadinessStatus {
    if (pct >= 100) return 'complete';
    if (pct >= 70) return 'needs_review';
    if (pct > 0) return 'needs_review';
    return 'missing';
  }
  return [
    { category: 'Metadata',     pct: r.metadata,     status: getStatus(r.metadata),     color: '#06B6D4', note: r.metadata < 100 ? 'Product and track metadata requires completion' : undefined },
    { category: 'Content',      pct: r.content,       status: getStatus(r.content),       color: '#10B981', note: r.content < 100 ? 'Audio masters not yet confirmed received' : undefined },
    { category: 'Artwork',      pct: r.artwork,       status: getStatus(r.artwork),       color: '#F59E0B', note: r.artwork < 100 ? 'Cover art not yet approved at 3000×3000px' : undefined },
    { category: 'Distribution', pct: r.distribution, status: getStatus(r.distribution), color: '#EF4444', note: r.distribution < 100 ? 'Distribution ingestion pending Virgin handoff' : undefined },
    { category: 'Campaign',     pct: r.campaign,      status: getStatus(r.campaign),      color: '#EC4899', note: r.campaign < 100 ? 'Campaign plan not fully submitted' : undefined },
    { category: 'Approvals',    pct: r.marketing,     status: getStatus(r.marketing),     color: '#3B82F6', note: r.marketing < 100 ? 'Final approvals from label not yet received' : undefined },
  ];
}

function buildActivity(release: Release): ActivityEntry[] {
  const items: ActivityEntry[] = [
    { time: '2 days ago', action: 'Release plan created', by: 'Randy Jackson' },
    { time: '1 day ago', action: 'Rep assigned: ' + (release.rep || 'TBD'), by: 'Artist OS' },
  ];
  if (release.readiness.metadata > 50) items.push({ time: '18 hours ago', action: 'Metadata partially updated', by: 'Paula Moore' });
  if (release.campaignName) items.push({ time: '12 hours ago', action: `Campaign created: ${release.campaignName}`, by: 'Growth Team' });
  if (release.readiness.artwork > 0) items.push({ time: '6 hours ago', action: 'Artwork submitted for review', by: 'A&R Operations' });
  if (release.status === 'active') items.push({ time: 'Today', action: 'Release marked Active Now', by: 'Distribution' });
  return items.reverse();
}

type DrawerTab = 'overview' | 'metadata' | 'tracks' | 'assets' | 'dates' | 'pitch' | 'reps' | 'activity';

const TABS: { key: DrawerTab; label: string; Icon: React.ElementType }[] = [
  { key: 'overview',  label: 'Overview',      Icon: BarChart2 },
  { key: 'metadata',  label: 'Metadata',      Icon: Tag },
  { key: 'tracks',    label: 'Tracks',        Icon: Music },
  { key: 'assets',    label: 'Assets',        Icon: Link2 },
  { key: 'dates',     label: 'Release Dates', Icon: Calendar },
  { key: 'pitch',     label: 'Pitch + Marketing', Icon: Megaphone },
  { key: 'reps',      label: 'Rep Support',   Icon: Shield },
  { key: 'activity',  label: 'Activity Log',  Icon: Activity },
];

interface Props { release: Release; onClose: () => void; }

export default function ReleaseDetailDrawer({ release, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<DrawerTab>('overview');
  const sm = STATUS_META[release.status];
  const typeColor = TYPE_COLORS[release.type] || '#6B7280';
  const readinessItems = buildReadinessItems(release.readiness);
  const activity = buildActivity(release);
  const overallPct = Math.round(Object.values(release.readiness).reduce((a, b) => a + b, 0) / 6);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9998, display: 'flex' }}>
      <div onClick={onClose} style={{ flex: 1, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} />
      <div style={{ width: 680, maxWidth: '95vw', height: '100vh', overflowY: 'auto', background: '#0D0E11', borderLeft: '1px solid rgba(255,255,255,0.09)', display: 'flex', flexDirection: 'column' }}>

        {/* Drawer Header */}
        <div style={{ padding: '22px 26px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 46, height: 46, borderRadius: 13, background: `${typeColor}15`, border: `1px solid ${typeColor}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Music size={20} color={typeColor} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                  <h2 style={{ margin: 0, fontSize: 19, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>{release.title}</h2>
                  <span style={{ fontSize: 8, fontFamily: 'monospace', padding: '2px 8px', borderRadius: 20, color: typeColor, background: `${typeColor}12`, border: `1px solid ${typeColor}25` }}>{release.type}</span>
                  {release.leadSingle && <span style={{ fontSize: 8, fontFamily: 'monospace', padding: '2px 8px', borderRadius: 20, color: '#F59E0B', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}><Star size={7} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 3 }} />LEAD</span>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 9, fontFamily: 'monospace', padding: '2px 9px', borderRadius: 20, color: sm.color, background: `${sm.color}10`, border: `1px solid ${sm.color}20` }}>
                    {release.status === 'active' && <span style={{ width: 5, height: 5, borderRadius: '50%', background: sm.color, display: 'inline-block', boxShadow: `0 0 6px ${sm.color}` }} />}
                    <sm.Icon size={9} />{sm.label}
                  </span>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace' }}>{release.releaseDate}</span>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', fontFamily: 'monospace' }}>{LABEL_NAME}</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', flexShrink: 0 }}>
              <X size={14} />
            </button>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 2, overflowX: 'auto', paddingBottom: 0 }}>
            {TABS.map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, fontFamily: 'monospace', padding: '9px 13px', borderRadius: '8px 8px 0 0', cursor: 'pointer', whiteSpace: 'nowrap', background: activeTab === tab.key ? 'rgba(6,182,212,0.08)' : 'transparent', border: `1px solid ${activeTab === tab.key ? 'rgba(6,182,212,0.2)' : 'transparent'}`, borderBottom: activeTab === tab.key ? '1px solid #0D0E11' : '1px solid transparent', color: activeTab === tab.key ? '#06B6D4' : 'rgba(255,255,255,0.35)', transition: 'all 0.15s', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                <tab.Icon size={9} />{tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div style={{ flex: 1, padding: '22px 26px', overflow: 'auto' }}>

          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Stats row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '14px 16px', textAlign: 'center' }}>
                  <p style={{ margin: '0 0 3px', fontSize: 22, fontWeight: 800, color: overallPct >= 80 ? '#10B981' : overallPct >= 50 ? '#F59E0B' : '#EF4444', lineHeight: 1 }}>{overallPct}%</p>
                  <p style={{ margin: 0, fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' }}>Readiness</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '14px 16px', textAlign: 'center' }}>
                  <p style={{ margin: '0 0 3px', fontSize: 22, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{release.streams ? fmt(release.streams) : '—'}</p>
                  <p style={{ margin: 0, fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' }}>Streams</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '14px 16px', textAlign: 'center' }}>
                  <p style={{ margin: '0 0 3px', fontSize: 22, fontWeight: 800, color: '#06B6D4', lineHeight: 1 }}>{release.daysUntil ?? '—'}</p>
                  <p style={{ margin: 0, fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' }}>Days Out</p>
                </div>
              </div>
              {release.notes && (
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: '14px 16px' }}>
                  <p style={{ margin: '0 0 6px', fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Release Notes</p>
                  <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>{release.notes}</p>
                </div>
              )}
              {release.submissionDeadline && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.18)', borderRadius: 12 }}>
                  <AlertTriangle size={14} color="#F59E0B" />
                  <div>
                    <p style={{ margin: 0, fontSize: 12, color: '#F59E0B', fontWeight: 700 }}>Submission Deadline: {release.submissionDeadline}</p>
                    <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>All assets and metadata must be complete before this date</p>
                  </div>
                </div>
              )}
              {/* Readiness breakdown */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '16px 18px' }}>
                <p style={{ margin: '0 0 14px', fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Readiness Breakdown</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {readinessItems.map(item => {
                    const statusMeta = READINESS_STATUS_META[item.status];
                    return (
                      <div key={item.category}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
                          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', width: 88, flexShrink: 0 }}>{item.category}</span>
                          <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${item.pct}%`, background: item.color, borderRadius: 2, transition: 'width 0.5s' }} />
                          </div>
                          <span style={{ fontSize: 10, fontFamily: 'monospace', color: item.pct >= 80 ? item.color : 'rgba(255,255,255,0.3)', width: 30, textAlign: 'right', flexShrink: 0 }}>{item.pct}%</span>
                          <span style={{ fontSize: 8, fontFamily: 'monospace', padding: '2px 7px', borderRadius: 20, color: statusMeta.color, background: `${statusMeta.color}12`, border: `1px solid ${statusMeta.color}25`, flexShrink: 0, width: 80, textAlign: 'center' }}>{statusMeta.label}</span>
                        </div>
                        {item.note && <p style={{ margin: '0 0 4px 98px', fontSize: 10, color: 'rgba(255,255,255,0.25)', lineHeight: 1.4 }}>{item.note}</p>}
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* Campaign + Campaign actions */}
              {release.campaignName && (
                <div style={{ background: 'rgba(6,182,212,0.04)', border: '1px solid rgba(6,182,212,0.12)', borderRadius: 12, padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <p style={{ margin: 0, fontSize: 9, fontFamily: 'monospace', color: '#06B6D4', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Attached Campaign</p>
                    <span style={{ fontSize: 8, fontFamily: 'monospace', padding: '2px 8px', borderRadius: 20, color: '#10B981', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>{release.campaignStatus}</span>
                  </div>
                  <p style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 700, color: '#fff' }}>{release.campaignName}</p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {['Build Campaign From Release', 'Send to Campaign OS', 'Generate Pre-Save Brief', 'Generate Release Week Plan'].map(btn => (
                      <button key={btn} style={{ fontSize: 10, padding: '6px 12px', borderRadius: 8, cursor: 'pointer', background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)', color: '#06B6D4', fontWeight: 600 }}>{btn}</button>
                    ))}
                  </div>
                </div>
              )}
              {!release.campaignName && (
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px', textAlign: 'center' }}>
                  <p style={{ margin: '0 0 10px', fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>No campaign attached</p>
                  <button style={{ fontSize: 11, padding: '8px 16px', borderRadius: 9, cursor: 'pointer', background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)', color: '#06B6D4', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <Megaphone size={11} /> Build Campaign From Release
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'metadata' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <p style={{ margin: 0, fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Product Metadata</p>
              {[
                { label: 'Product Title', value: release.title },
                { label: 'Release Type', value: release.type },
                { label: 'Primary Artist', value: 'All American Rejects' },
                { label: 'Label', value: LABEL_NAME },
                { label: 'Release Date', value: release.releaseDate },
                { label: 'Submission Deadline', value: release.submissionDeadline || 'Not set' },
                { label: 'Status', value: STATUS_META[release.status].label },
                { label: 'Lead Single', value: release.leadSingle ? 'Yes' : 'No' },
                { label: 'UPC', value: 'To be assigned' },
                { label: 'Catalog Number', value: `GMG-${release.id}` },
                { label: 'C Line', value: `℗ 2026 ${LABEL_NAME}` },
                { label: 'P Line', value: `© 2026 ${LABEL_NAME}` },
                { label: 'Genre', value: 'Pop / Rock' },
                { label: 'Price Tier', value: release.type === 'Single' ? 'T3' : 'Front Line' },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 9, border: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{row.label}</span>
                  <span style={{ fontSize: 11, color: '#fff', fontWeight: 600 }}>{row.value}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'tracks' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <p style={{ margin: 0, fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Track Metadata</p>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 13, padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 9, background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Music size={13} color="#06B6D4" />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#fff' }}>{release.title}</p>
                    <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace' }}>All American Rejects · ISRC: To be assigned</p>
                  </div>
                </div>
                {[
                  { label: 'Explicit', value: 'Clean' }, { label: 'Language', value: 'English' },
                  { label: 'Price Tier', value: 'T3' }, { label: 'Genre', value: 'Pop / Rock' },
                  { label: 'C Line', value: `℗ ${copyrightYear(release.releaseDate)} ${LABEL_NAME}` },
                  { label: 'P Line', value: `© ${copyrightYear(release.releaseDate)} ${LABEL_NAME}` },
                  { label: 'GMG Artist Fund Split', value: '80%' },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{row.label}</span>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'assets' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <p style={{ margin: 0, fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Asset Delivery State</p>
              {[
                { label: 'Cover Art', state: release.readiness.artwork >= 100 ? 'Asset Accepted' : release.readiness.artwork > 0 ? 'Needs Review' : 'Missing', color: release.readiness.artwork >= 100 ? '#10B981' : release.readiness.artwork > 0 ? '#F59E0B' : '#6B7280', note: 'JPG/TIFF · 3000×3000px recommended · RGB' },
                { label: 'Audio Masters', state: release.readiness.content >= 100 ? 'Asset Accepted' : release.readiness.content > 0 ? 'Needs Review' : 'Missing', color: release.readiness.content >= 100 ? '#10B981' : release.readiness.content > 0 ? '#F59E0B' : '#6B7280', note: 'WAV / AIFF / FLAC · 24-bit preferred' },
                { label: 'Motion Art', state: 'Optional', color: '#6B7280', note: 'Animated cover or visualizer — optional' },
                { label: 'Press Photos', state: release.status === 'active' ? 'Asset Accepted' : 'Not Submitted', color: release.status === 'active' ? '#10B981' : '#6B7280', note: 'High-res artist photos for DSPs' },
                { label: 'PDF Booklet', state: release.type === 'Album' || release.type === 'EP' || release.type === 'Deluxe' ? 'Not Submitted' : 'N/A', color: '#6B7280', note: 'Digital booklet for album/EP/deluxe' },
                { label: 'Music Video', state: release.campaignName ? 'Link Provided' : 'Not Submitted', color: release.campaignName ? '#10B981' : '#6B7280', note: 'YouTube / Vimeo / Drive link' },
                { label: 'DISCO Upload', state: release.readiness.distribution > 0 ? 'Uploaded' : 'Pending', color: release.readiness.distribution > 0 ? '#10B981' : '#6B7280', note: 'GMG DISCO playlist or upload link' },
                { label: 'Dropbox Folder', state: release.readiness.distribution > 50 ? 'Linked' : 'Not Linked', color: release.readiness.distribution > 50 ? '#10B981' : '#6B7280', note: 'Primary asset delivery folder' },
              ].map(asset => (
                <div key={asset.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: asset.color, flexShrink: 0, marginTop: 3 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>{asset.label}</span>
                      <span style={{ fontSize: 8, fontFamily: 'monospace', padding: '2px 8px', borderRadius: 20, color: asset.color, background: `${asset.color}12`, border: `1px solid ${asset.color}25` }}>{asset.state}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.3)', lineHeight: 1.4 }}>{asset.note}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'dates' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <p style={{ margin: 0, fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Release Date Timeline</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Release Date', value: release.releaseDate, color: '#10B981', Icon: Calendar },
                  { label: 'Submission Deadline', value: release.submissionDeadline || 'Not set', color: '#F59E0B', Icon: AlertTriangle },
                  { label: 'Internal Review Due', value: 'Rolling', color: '#06B6D4', Icon: FileText },
                  { label: 'Pre-save Campaign Launch', value: release.campaignName ? 'Per campaign schedule' : 'Not set', color: '#EC4899', Icon: Zap },
                  { label: 'Virgin Handoff', value: release.readiness.distribution >= 80 ? 'In queue' : 'Pending readiness', color: release.readiness.distribution >= 80 ? '#10B981' : '#6B7280', Icon: Send },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: `1px solid ${item.color}15` }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: `${item.color}12`, border: `1px solid ${item.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <item.Icon size={12} color={item.color} />
                    </div>
                    <span style={{ flex: 1, fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{item.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'pitch' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <p style={{ margin: 0, fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Playlist + DSP Pitch Status</p>
              <div style={{ background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.12)', borderRadius: 12, padding: '13px 16px' }}>
                <p style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 700, color: '#F59E0B' }}>Pitch intake not yet submitted</p>
                <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.35)', lineHeight: 1.6 }}>Complete the pitch intake form in the new release flow to enable editorial pitching on Spotify, Apple Music, and Tidal.</p>
              </div>
              {[
                { label: 'Spotify Editorial Pitch', status: release.readiness.campaign >= 70 ? 'Submitted' : 'Pending', color: release.readiness.campaign >= 70 ? '#10B981' : '#6B7280' },
                { label: 'Apple Music Editorial', status: release.readiness.campaign >= 70 ? 'Submitted' : 'Pending', color: release.readiness.campaign >= 70 ? '#10B981' : '#6B7280' },
                { label: 'Tidal Pitch', status: 'Pending', color: '#6B7280' },
                { label: 'Press Coverage', status: 'Pending', color: '#6B7280' },
                { label: 'Radio Submission', status: 'Pending', color: '#6B7280' },
                { label: 'DSP Feature Photos', status: release.status === 'active' ? 'Submitted' : 'Pending', color: release.status === 'active' ? '#10B981' : '#6B7280' },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 9, border: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{row.label}</span>
                  <span style={{ fontSize: 8, fontFamily: 'monospace', padding: '2px 9px', borderRadius: 20, color: row.color, background: `${row.color}12`, border: `1px solid ${row.color}25` }}>{row.status}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reps' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <p style={{ margin: 0, fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Artist OS Reps — Release Support</p>
              {[
                { name: 'Randy Jackson', role: 'Release Strategy', initials: 'RJ', color: '#06B6D4', status: 'available', help: 'Release planning, timing strategy, campaign sequencing', assigned: release.rep === 'Randy Jackson' },
                { name: 'Paula Moore', role: 'Catalog & Content', initials: 'PM', color: '#10B981', status: 'on_task', help: 'Content readiness, catalog alignment, deluxe strategy', assigned: release.rep === 'Paula Moore' },
                { name: 'A&R Operations', role: 'Artist Operations', initials: 'AO', color: '#F59E0B', status: 'available', help: 'Workflow execution, deadline tracking, team coordination', assigned: false },
                { name: 'Growth Team', role: 'Audience Growth', initials: 'GT', color: '#EC4899', status: 'available', help: 'Fan signals, geo expansion, streaming velocity', assigned: false },
                { name: 'Perf Analytics', role: 'Performance', initials: 'PA', color: '#EF4444', status: 'on_task', help: 'Stream tracking, campaign lift, release scoring', assigned: false },
                { name: 'Career Intel', role: 'Career Direction', initials: 'CI', color: '#3B82F6', status: 'available', help: 'Label strategy, artist positioning, long-range planning', assigned: false },
              ].map(rep => (
                <div key={rep.name} style={{ background: rep.assigned ? `${rep.color}08` : 'rgba(255,255,255,0.02)', border: `1px solid ${rep.assigned ? `${rep.color}25` : 'rgba(255,255,255,0.06)'}`, borderRadius: 13, padding: '15px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: `${rep.color}15`, border: `1px solid ${rep.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: 11, fontWeight: 800, color: rep.color }}>{rep.initials}</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#fff' }}>{rep.name}</p>
                        {rep.assigned && <span style={{ fontSize: 8, fontFamily: 'monospace', padding: '2px 7px', borderRadius: 20, color: rep.color, background: `${rep.color}15`, border: `1px solid ${rep.color}30` }}>ASSIGNED</span>}
                      </div>
                      <p style={{ margin: 0, fontSize: 9, fontFamily: 'monospace', color: rep.color }}>{rep.role}</p>
                    </div>
                    <span style={{ fontSize: 8, fontFamily: 'monospace', padding: '2px 8px', borderRadius: 20, color: rep.status === 'available' ? '#10B981' : '#F59E0B', background: rep.status === 'available' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', border: `1px solid ${rep.status === 'available' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}` }}>
                      {rep.status === 'available' ? 'AVAILABLE' : 'ON TASK'}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 10px', fontSize: 10, color: 'rgba(255,255,255,0.3)', lineHeight: 1.5 }}>{rep.help}</p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button style={{ fontSize: 10, padding: '6px 12px', borderRadius: 8, cursor: 'pointer', background: `${rep.color}08`, border: `1px solid ${rep.color}20`, color: rep.color, fontWeight: 600 }}>Request Support</button>
                    {!rep.assigned && <button style={{ fontSize: 10, padding: '6px 12px', borderRadius: 8, cursor: 'pointer', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}>Assign to Release</button>}
                    <button style={{ fontSize: 10, padding: '6px 12px', borderRadius: 8, cursor: 'pointer', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}>Ask a Question</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'activity' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <p style={{ margin: 0, fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Activity Log</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {activity.map((entry, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '11px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#06B6D4', flexShrink: 0, marginTop: 4 }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{entry.action}</p>
                      <p style={{ margin: 0, fontSize: 9, color: 'rgba(255,255,255,0.25)', fontFamily: 'monospace' }}>{entry.by} · {entry.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
