import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, ExternalLink, CreditCard as Edit2, Save, X, Music, Camera, Video, Globe, TrendingUp, DollarSign, Zap, Users, CheckCircle, AlertTriangle, Clock, Star, Activity, ChevronDown, ChevronUp, Copy, Check, Loader, MessageSquare, Send, Crown, Calendar, Cpu, Settings, Compass, BarChart2, Megaphone, Disc as DiscIcon, Lock, UserMinus, ShieldOff } from 'lucide-react';
import { SIGNED_ARTISTS, type SignedArtist, type ArtistAction } from '../data/artistRosterData';
import { normalizeArtist, type NormalizedArtist, type SocialPlatform, PLATFORM_META } from '../data/rosterIngestionService';
import { ROLE_PERMISSIONS, type ArtistOSRole } from '../../auth/roles';
import { useRole } from '../../auth/RoleContext';
import { GMG_TEAM_MEMBERS } from '../data/rosterReadiness';
import UpdateInfoModal from '../components/artistOS/UpdateInfoModal';
import {
  fetchAssignmentsByArtist as fetchLabelAssignments,
  type ArtistLabelAssignment,
} from '../data/labelService';
import { getLabelById } from '../data/labelsData';
import LabelAssignDropdown from '../components/labels/LabelAssignDropdown';
import { saveArtistOverrides, loadOverridesForArtist } from '../data/artistOverrideService';
import { getLocalLifecycleState, fetchLifecycleEventForArtist, type ArtistLifecycleEvent } from '../data/dropArtistService';
import {
  fetchAgents, fetchAssignmentsByArtist as fetchAgentAssignments,
  assignAgentToArtist, removeAgentFromArtist, buildAgentStats,
  AGENT_LEVEL_META,
  type AIAgentWithStats, type AIAgentAssignment as AgentAssignment,
} from '../data/aiAgentService';

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}
function fmtMoney(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

const SOCIAL_ICONS: Record<SocialPlatform, React.ElementType> = {
  spotify:   Music,
  instagram: Camera,
  tiktok:    Video,
  youtube:   Video,
  facebook:  Globe,
};

const STATUS_COLORS: Record<string, string> = {
  Priority:      '#EF4444',
  Active:        '#10B981',
  Recouping:     '#F59E0B',
  'On Hold':     '#6B7280',
  Inactive:      '#374151',
  'New Signing': '#06B6D4',
  'Pending Sync': '#8B5CF6',
};

const TIER_COLORS: Record<string, string> = {
  Priority:       '#EF4444',
  'Growth Roster': '#06B6D4',
  'Base Roster':   '#F59E0B',
  'Label Roster':  '#10B981',
};

const PRIORITY_COLORS: Record<string, string> = {
  urgent: '#EF4444',
  high:   '#F59E0B',
  normal: '#10B981',
};

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }
  return (
    <button
      onClick={copy}
      title={`Copy ${label}`}
      style={{
        background: 'transparent', border: 'none', cursor: 'pointer',
        padding: '2px 4px', borderRadius: 4, color: 'rgba(255,255,255,0.35)',
        display: 'flex', alignItems: 'center', gap: 3, transition: 'color 0.15s',
      }}
      onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
      onMouseLeave={e => (e.currentTarget.style.color = copied ? '#10B981' : 'rgba(255,255,255,0.35)')}
    >
      {copied ? <Check size={11} color="#10B981" /> : <Copy size={11} />}
    </button>
  );
}

function SectionCard({ title, icon: Icon, color = '#06B6D4', children, defaultOpen = true }: {
  title: string;
  icon: React.ElementType;
  color?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ background: '#0D0E11', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 18px', background: 'transparent', border: 'none', cursor: 'pointer',
          borderBottom: open ? '1px solid rgba(255,255,255,0.05)' : 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: `${color}18`, border: `1px solid ${color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={12} color={color} />
          </div>
          <span style={{ fontWeight: 700, fontSize: 13, color: '#fff', letterSpacing: '-0.01em' }}>{title}</span>
        </div>
        {open ? <ChevronUp size={13} color="rgba(255,255,255,0.25)" /> : <ChevronDown size={13} color="rgba(255,255,255,0.25)" />}
      </button>
      {open && <div style={{ padding: '16px 18px' }}>{children}</div>}
    </div>
  );
}

function LockedModule({ reason, children }: { reason: string; children: React.ReactNode }) {
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ opacity: 0.28, pointerEvents: 'none', userSelect: 'none', filter: 'grayscale(0.6)' }}>
        {children}
      </div>
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 14,
        background: 'rgba(8,9,11,0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(1px)',
        border: '1px solid rgba(239,68,68,0.12)',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Lock size={14} color="#EF4444" />
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: 8.5, fontWeight: 800, color: '#EF4444', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center' }}>
            Access Locked
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.3)', textAlign: 'center', maxWidth: 200, lineHeight: 1.5 }}>
            {reason}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatTile({ label, value, sub, color = '#fff' }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div style={{ background: `${color}07`, border: `1px solid ${color}15`, borderRadius: 10, padding: '12px 14px' }}>
      <div style={{ fontWeight: 800, fontSize: 18, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: 5 }}>{label}</div>
      {sub && <div style={{ fontFamily: 'monospace', fontSize: 9, color: `${color}90`, marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

function EditPanel({ artist, onClose, onSave }: {
  artist: SignedArtist;
  onClose: () => void;
  onSave: (updates: Partial<SignedArtist>) => Promise<void>;
}) {
  const [form, setForm] = useState<Partial<SignedArtist>>({
    name: artist.name, genre: artist.genre, subgenre: artist.subgenre,
    city: artist.city, market: artist.market, signingDate: artist.signingDate,
    primaryEmail: artist.primaryEmail, artistPhone: artist.artistPhone,
    manager: artist.manager, managementContact: artist.managementContact, managerPhone: artist.managerPhone,
    spotifyLink: artist.spotifyLink, instagramLink: artist.instagramLink,
    instagramHandle: artist.instagramHandle, tiktokLink: artist.tiktokLink,
    youtubeLink: artist.youtubeLink, facebookLink: artist.facebookLink,
    arRep: artist.arRep, pointPerson: artist.pointPerson,
    rosterNotes: artist.rosterNotes, internalNotes: artist.internalNotes,
  });
  const [tab, setTab] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const TABS = [
    { label: 'Identity', fields: [
      { key: 'name', label: 'Artist Name', type: 'text' },
      { key: 'genre', label: 'Genre', type: 'text' },
      { key: 'subgenre', label: 'Subgenre', type: 'text' },
      { key: 'city', label: 'City', type: 'text' },
      { key: 'market', label: 'Market', type: 'text' },
      { key: 'signingDate', label: 'Signing Date', type: 'text' },
    ]},
    { label: 'Contact', fields: [
      { key: 'primaryEmail', label: 'Primary Email', type: 'email' },
      { key: 'artistPhone', label: 'Artist Phone', type: 'tel' },
      { key: 'manager', label: 'Manager Name', type: 'text' },
      { key: 'managementContact', label: 'Manager Email', type: 'email' },
      { key: 'managerPhone', label: 'Manager Phone', type: 'tel' },
    ]},
    { label: 'Social', fields: [
      { key: 'spotifyLink', label: 'Spotify', type: 'url' },
      { key: 'instagramLink', label: 'Instagram', type: 'url' },
      { key: 'tiktokLink', label: 'TikTok', type: 'url' },
      { key: 'youtubeLink', label: 'YouTube', type: 'url' },
      { key: 'facebookLink', label: 'Facebook', type: 'url' },
      { key: 'instagramHandle', label: 'IG Handle', type: 'text' },
    ]},
    { label: 'Internal', fields: [
      { key: 'arRep', label: 'A&R Rep', type: 'team' },
      { key: 'pointPerson', label: 'Point Person', type: 'team' },
      { key: 'rosterNotes', label: 'Roster Notes', type: 'textarea' },
      { key: 'internalNotes', label: 'Internal Notes', type: 'textarea' },
    ]},
  ];

  function set(key: string, val: string) {
    setForm(f => ({ ...f, [key]: val }));
  }

  async function handleSave() {
    setSaving(true);
    await onSave(form);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const currentTab = TABS[tab];

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{
        width: '100%', maxWidth: 620,
        background: '#0E0F13', border: '1px solid rgba(255,255,255,0.09)',
        borderRadius: 18, overflow: 'hidden',
        boxShadow: '0 40px 100px rgba(0,0,0,0.7)',
      }}>
        <div style={{
          position: 'relative', padding: '18px 22px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(255,255,255,0.015)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(16,185,129,0.5),transparent)' }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#F9FAFB' }}>Edit Artist Profile</div>
            <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#6B7280', marginTop: 2 }}>{artist.name} · {artist.id}</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', padding: 4 }}>
            <X size={16} color="#6B7280" />
          </button>
        </div>

        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 22px' }}>
          {TABS.map((t, i) => (
            <button key={t.label} onClick={() => setTab(i)} style={{
              padding: '10px 14px', background: 'none', border: 'none',
              borderBottom: tab === i ? '2px solid #10B981' : '2px solid transparent',
              color: tab === i ? '#10B981' : '#6B7280',
              fontSize: 12, fontWeight: 600, cursor: 'pointer', marginBottom: -1, transition: 'all 0.15s',
            }}>
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ padding: '20px 22px', maxHeight: 400, overflowY: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {currentTab.fields.map(field => {
              const val = (form as Record<string, unknown>)[field.key] as string ?? '';
              const span = field.type === 'textarea' ? 'span 2' : 'span 1';
              return (
                <div key={field.key} style={{ gridColumn: span }}>
                  <label style={{ display: 'block', fontSize: 10, color: '#9CA3AF', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 5 }}>
                    {field.label}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea value={val} onChange={e => set(field.key, e.target.value)} rows={3} style={{
                      width: '100%', padding: '8px 10px', boxSizing: 'border-box',
                      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
                      borderRadius: 8, color: '#F9FAFB', fontSize: 12, outline: 'none', resize: 'vertical', fontFamily: 'system-ui',
                    }} />
                  ) : field.type === 'team' ? (
                    <select value={val} onChange={e => set(field.key, e.target.value)} style={{
                      width: '100%', padding: '8px 10px', boxSizing: 'border-box',
                      background: '#0E0F13', border: '1px solid rgba(255,255,255,0.09)',
                      borderRadius: 8, color: '#F9FAFB', fontSize: 12, outline: 'none',
                    }}>
                      <option value="">— Unassigned —</option>
                      {GMG_TEAM_MEMBERS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  ) : (
                    <input type={field.type} value={val} onChange={e => set(field.key, e.target.value)} style={{
                      width: '100%', padding: '8px 10px', boxSizing: 'border-box',
                      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
                      borderRadius: 8, color: '#F9FAFB', fontSize: 12, outline: 'none',
                    }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{
          display: 'flex', justifyContent: 'flex-end', gap: 10,
          padding: '14px 22px', borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.2)',
        }}>
          <button onClick={onClose} style={{
            padding: '8px 18px', borderRadius: 9,
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)',
            color: '#9CA3AF', fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}>Cancel</button>
          <button onClick={handleSave} disabled={saving} style={{
            padding: '8px 18px', borderRadius: 9,
            background: saved ? 'rgba(16,185,129,0.2)' : 'rgba(16,185,129,0.15)',
            border: `1px solid ${saved ? '#10B981' : 'rgba(16,185,129,0.3)'}`,
            color: '#10B981', fontSize: 12, fontWeight: 700, cursor: saving ? 'wait' : 'pointer',
            display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s',
          }}>
            {saving ? <Loader size={12} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={12} color="#10B981" />}
            {saved ? 'Saved!' : saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ArtistProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { roleState } = useRole();
  const [artist, setArtist] = useState<NormalizedArtist | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [artistAssignments, setArtistAssignments] = useState<ArtistLabelAssignment[]>([]);
  const [allAgents, setAllAgents] = useState<AIAgentWithStats[]>([]);
  const [agentAssignments, setAgentAssignments] = useState<AgentAssignment[]>([]);
  const [agentAssignLoading, setAgentAssignLoading] = useState<string | null>(null);
  const [lifecycleEvent, setLifecycleEvent] = useState<ArtistLifecycleEvent | null>(null);

  const currentRole = (roleState.role ?? 'artist_manager') as ArtistOSRole;
  const perms = ROLE_PERMISSIONS[currentRole];
  const lifecycleState = id ? getLocalLifecycleState(id) : 'active';
  const isDropped = lifecycleState === 'dropped_pending' || lifecycleState === 'dropped_complete';
  const LOCK_REASON = 'Artist in exit workflow — operational access suspended pending final payout and metadata transfer.';

  useEffect(() => {
    const raw = SIGNED_ARTISTS.find(a => a.id === id);
    if (!raw) return;
    loadOverridesForArtist(raw.id).then(() => {
      setArtist(normalizeArtist(raw));
    });
  }, [id]);

  useEffect(() => {
    if (!id || !isDropped) return;
    fetchLifecycleEventForArtist(id).then(ev => {
      if (ev) setLifecycleEvent(ev);
    });
  }, [id, isDropped]);

  useEffect(() => {
    if (!id) return;
    fetchLabelAssignments(id)
      .then(assignments => {
        setArtistAssignments(assignments ?? []);
      })
      .catch(() => {
        setArtistAssignments([]);
      });
    Promise.all([fetchAgents(), fetchAgentAssignments(id)])
      .then(([rawAgents, rawAssignments]) => {
        const stats = buildAgentStats(rawAgents ?? [], rawAssignments ?? [], []);
        setAllAgents(stats);
        setAgentAssignments(rawAssignments ?? []);
      })
      .catch(() => {
        setAllAgents([]);
        setAgentAssignments([]);
      });
  }, [id]);

  async function toggleAgentAssignment(agentId: string) {
    if (!artist) return;
    setAgentAssignLoading(agentId);
    const existing = agentAssignments.find(a => a.agent_id === agentId);
    if (existing) {
      await removeAgentFromArtist(agentId, artist.id);
      setAgentAssignments(prev => prev.filter(a => a.agent_id !== agentId));
    } else {
      const { error } = await assignAgentToArtist(agentId, artist.id, 'admin');
      if (!error) {
        setAgentAssignments(prev => [...prev, { id: `tmp-${Date.now()}`, agent_id: agentId, artist_id: artist.id, assigned_at: new Date().toISOString(), assigned_by: 'admin', active: true }]);
      }
    }
    setAgentAssignLoading(null);
  }

  async function handleSave(updates: Partial<SignedArtist>) {
    if (!artist) return;
    await saveArtistOverrides(
      artist.id,
      updates,
      roleState.user?.email ?? 'admin',
    );
    const raw = SIGNED_ARTISTS.find(a => a.id === artist.id) ?? (artist as SignedArtist);
    setArtist(normalizeArtist(raw));
  }

  if (!artist) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100%', background: '#08090B' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 12, color: 'rgba(255,255,255,0.25)', marginBottom: 16 }}>Artist not found</div>
          <button onClick={() => navigate(-1)} style={{
            padding: '8px 18px', borderRadius: 8,
            background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.25)',
            color: '#06B6D4', fontSize: 12, cursor: 'pointer',
          }}>Go Back</button>
        </div>
      </div>
    );
  }

  const statusColor = STATUS_COLORS[artist.status] ?? '#6B7280';
  const tierColor   = TIER_COLORS[artist.tier] ?? '#6B7280';
  const healthColor = artist.healthScore >= 80 ? '#10B981' : artist.healthScore >= 60 ? '#F59E0B' : '#EF4444';

  return (
    <div style={{ background: '#08090B', minHeight: '100%', padding: '20px 24px', maxWidth: 1100, margin: '0 auto' }}>

      <button
        onClick={() => navigate(-1)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6, marginBottom: isDropped ? 14 : 20,
          background: 'transparent', border: 'none', cursor: 'pointer',
          color: 'rgba(255,255,255,0.35)', fontSize: 11, fontFamily: 'monospace',
          transition: 'color 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
      >
        <ArrowLeft size={13} />
        Back to Roster
      </button>

      {isDropped && (
        <div style={{ marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>

          <div style={{
            borderRadius: 13, overflow: 'hidden',
            border: '1px solid rgba(239,68,68,0.35)',
            boxShadow: '0 0 48px rgba(239,68,68,0.07)',
          }}>
            <div style={{ height: 3, background: 'linear-gradient(90deg, transparent, #EF4444, rgba(239,68,68,0.5), transparent)' }} />
            <div style={{ background: 'rgba(239,68,68,0.08)', padding: '16px 22px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 11, background: 'rgba(239,68,68,0.14)', border: '1px solid rgba(239,68,68,0.32)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    <UserMinus size={18} color="#EF4444" />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 900, color: '#EF4444', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                        Dropped — Pending Exit Process
                      </span>
                      <span style={{ fontFamily: 'monospace', fontSize: 8, color: lifecycleState === 'dropped_complete' ? '#10B981' : 'rgba(239,68,68,0.65)', background: lifecycleState === 'dropped_complete' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${lifecycleState === 'dropped_complete' ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.22)'}`, borderRadius: 5, padding: '2px 9px', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 700 }}>
                        {lifecycleState === 'dropped_complete' ? 'Exit Complete' : 'Processing'}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.52)', lineHeight: 1.7, maxWidth: 640 }}>
                      Campaign, release, and growth systems are locked while payout and metadata transfer are completed.
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginTop: 11 }}>
                      {[
                        { icon: ShieldOff,    color: '#EF4444', label: 'Campaigns locked' },
                        { icon: Lock,         color: '#F59E0B', label: 'Release OS locked' },
                        { icon: CheckCircle,  color: '#10B981', label: 'Payout & Safe active' },
                        { icon: DollarSign,   color: '#10B981', label: 'Revenue visible' },
                      ].map(item => {
                        const Icon = item.icon;
                        return (
                          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <Icon size={10} color={item.color} />
                            <span style={{ fontFamily: 'monospace', fontSize: 9, color: `${item.color}95` }}>{item.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/dashboard/artist-os/dropped-queue')}
                  style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: 9, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.28)', color: '#EF4444', fontFamily: 'monospace', fontSize: 9, fontWeight: 800, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.18)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.1)')}
                >
                  <UserMinus size={11} color="#EF4444" />
                  View in Dropped Queue
                </button>
              </div>
            </div>
          </div>

          <div style={{
            background: '#0D0E11', border: '1px solid rgba(239,68,68,0.18)',
            borderRadius: 13, padding: '16px 20px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <div style={{ width: 24, height: 24, borderRadius: 7, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={11} color="#EF4444" />
              </div>
              <span style={{ fontFamily: 'monospace', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Exit Workflow</span>
              <span style={{ marginLeft: 'auto', fontFamily: 'monospace', fontSize: 8, color: 'rgba(239,68,68,0.5)', background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 5, padding: '2px 8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {lifecycleState === 'dropped_complete' ? 'Complete' : 'In Progress'}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
              {[
                {
                  label: 'Drop Date',
                  value: lifecycleEvent?.initiated_at
                    ? new Date(lifecycleEvent.initiated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : '—',
                  icon: Calendar,
                  color: '#EF4444',
                },
                {
                  label: 'Metadata Transfer',
                  value: lifecycleState === 'dropped_complete' ? 'Complete' : 'Pending',
                  icon: DiscIcon,
                  color: lifecycleState === 'dropped_complete' ? '#10B981' : '#F59E0B',
                },
                {
                  label: 'Final Payment',
                  value: lifecycleState === 'dropped_complete' ? 'Processed' : 'Pending',
                  icon: DollarSign,
                  color: lifecycleState === 'dropped_complete' ? '#10B981' : '#F59E0B',
                },
                {
                  label: 'Exit Owner',
                  value: lifecycleEvent?.initiated_by
                    ? lifecycleEvent.initiated_by.split('@')[0]
                    : 'Unassigned',
                  icon: Users,
                  color: '#06B6D4',
                },
                {
                  label: 'Est. Completion',
                  value: lifecycleState === 'dropped_complete'
                    ? 'Done'
                    : lifecycleEvent?.initiated_at
                      ? (() => {
                          const d = new Date(lifecycleEvent.initiated_at);
                          d.setDate(d.getDate() + 14);
                          return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                        })()
                      : '~14 days',
                  icon: Clock,
                  color: lifecycleState === 'dropped_complete' ? '#10B981' : 'rgba(255,255,255,0.5)',
                },
              ].map(field => {
                const Icon = field.icon;
                return (
                  <div key={field.label} style={{ background: `${field.color}07`, border: `1px solid ${field.color}14`, borderRadius: 10, padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 7 }}>
                      <Icon size={10} color={field.color} />
                      <span style={{ fontFamily: 'monospace', fontSize: 7.5, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{field.label}</span>
                    </div>
                    <div style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: field.color, lineHeight: 1 }}>{field.value}</div>
                  </div>
                );
              })}
            </div>
            {lifecycleEvent?.notes && (
              <div style={{ marginTop: 12, padding: '10px 13px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 9 }}>
                <div style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>Exit Notes</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>{lifecycleEvent.notes}</div>
              </div>
            )}
          </div>

        </div>
      )}

      <div style={{
        background: '#0D0E11', border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 16, overflow: 'hidden', marginBottom: 18, position: 'relative',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${artist.avatarColor}60, transparent)` }} />
        <div style={{ padding: '22px 24px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: `${artist.avatarColor}22`, border: `2px solid ${artist.avatarColor}45`,
              boxShadow: `0 0 24px ${artist.avatarColor}25`,
            }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: artist.avatarColor }}>{artist.avatarInitials}</span>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <h1 style={{ fontWeight: 800, fontSize: 22, color: '#fff', letterSpacing: '-0.02em', margin: 0 }}>{artist.name}</h1>
                <span style={{
                  fontFamily: 'monospace', fontSize: 9, padding: '2px 8px', borderRadius: 20,
                  background: `${tierColor}12`, border: `1px solid ${tierColor}30`, color: tierColor,
                }}>{artist.tier}</span>
                <span style={{
                  fontFamily: 'monospace', fontSize: 9, padding: '2px 8px', borderRadius: 20,
                  background: `${statusColor}12`, border: `1px solid ${statusColor}30`, color: statusColor,
                }}>{artist.status}</span>
                {isDropped && (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    fontFamily: 'monospace', fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 20,
                    background: 'rgba(239,68,68,0.14)', border: '1px solid rgba(239,68,68,0.4)', color: '#EF4444',
                    textTransform: 'uppercase', letterSpacing: '0.07em',
                  }}>
                    <UserMinus size={9} color="#EF4444" />
                    Dropped
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                {artist.genre !== 'Needs Info' && (
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{artist.genre}</span>
                )}
                {artist.market && artist.market !== 'Needs Info' && (
                  <>
                    <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: 11 }}>•</span>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)' }}>{artist.market}</span>
                  </>
                )}
                <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: 11 }}>•</span>
                <span style={{ fontFamily: 'monospace', fontSize: 10, fontWeight: 700, color: '#06B6D4', letterSpacing: '0.04em' }}>
                  {artist.label_id ? (getLabelById(artist.label_id)?.name ?? artist.labelImprint) : (artist.labelImprint || 'Independent')}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.12)', margin: '0 4px', fontSize: 10 }}>·</span>
                <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.22)' }}>{artist.id}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Activity size={11} color={healthColor} />
                  <span style={{ fontFamily: 'monospace', fontSize: 11, color: healthColor, fontWeight: 700 }}>
                    {artist.healthScore} Health
                  </span>
                </div>
                {artist.arRep && artist.arRep !== 'Needs Info' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Star size={10} color="rgba(255,255,255,0.2)" />
                    <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>A&R: {artist.arRep}</span>
                  </div>
                )}
                {artist.pointPerson && artist.pointPerson !== 'Needs Info' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Users size={10} color="rgba(255,255,255,0.2)" />
                    <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>Point: {artist.pointPerson}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 9, flexShrink: 0 }}>
            {isDropped ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 10, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.18)' }}>
                <Lock size={12} color="rgba(239,68,68,0.6)" />
                <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(239,68,68,0.6)', fontWeight: 700 }}>Actions Locked — Dropped</span>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setUpdateOpen(true)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 7,
                    padding: '9px 18px', borderRadius: 10,
                    background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.25)',
                    color: '#06B6D4', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    transition: 'all 0.18s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(6,182,212,0.18)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(6,182,212,0.1)'; }}
                >
                  <Send size={13} color="#06B6D4" />
                  Update Info
                </button>
                {perms.canEditArtists && (
                  <button
                    onClick={() => setEditOpen(true)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 7,
                      padding: '9px 18px', borderRadius: 10,
                      background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)',
                      color: '#10B981', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                      transition: 'all 0.18s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(16,185,129,0.18)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(16,185,129,0.1)'; }}
                  >
                    <Edit2 size={13} color="#10B981" />
                    Edit Profile
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 16 }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <SectionCard title="Contact" icon={Mail} color="#06B6D4">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

              <div>
                <div style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>Email</div>
                {artist._email_valid ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CheckCircle size={12} color="#10B981" />
                    <a href={`mailto:${artist._email_clean}`} style={{ fontFamily: 'monospace', fontSize: 11, color: '#10B981', textDecoration: 'none' }}>
                      {artist._email_clean}
                    </a>
                    <CopyButton value={artist._email_clean} label="email" />
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <AlertTriangle size={12} color="#EF4444" />
                    <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(239,68,68,0.7)' }}>
                      {artist._email_raw && artist._email_raw.trim() !== '' ? `"${artist._email_raw}"` : 'Missing'}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <div style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>Artist Phone</div>
                {artist._phone_valid ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Phone size={12} color="#06B6D4" />
                    <a href={`tel:${artist._phone_clean}`} style={{ fontFamily: 'monospace', fontSize: 11, color: '#06B6D4', textDecoration: 'none' }}>
                      {artist._phone_clean}
                    </a>
                    <CopyButton value={artist._phone_clean} label="phone" />
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Phone size={12} color="rgba(255,255,255,0.2)" />
                    <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>No phone on file</span>
                  </div>
                )}
              </div>

              <div>
                <div style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>Management</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {artist.manager && artist.manager !== 'Needs Info' && (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.22)', width: 54, flexShrink: 0 }}>Manager</span>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)' }}>{artist.manager}</span>
                    </div>
                  )}
                  {artist.managementContact && artist.managementContact !== 'Needs Info' && artist.managementContact !== '' && (
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.22)', width: 54, flexShrink: 0 }}>Mgmt Email</span>
                      <a href={`mailto:${artist.managementContact}`} style={{ fontSize: 10, color: '#06B6D4', textDecoration: 'none', fontFamily: 'monospace' }}>
                        {artist.managementContact}
                      </a>
                      <CopyButton value={artist.managementContact} label="mgmt email" />
                    </div>
                  )}
                  {artist.managerPhone && artist.managerPhone !== '' && (
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.22)', width: 54, flexShrink: 0 }}>Mgmt Phone</span>
                      <a href={`tel:${artist.managerPhone}`} style={{ fontSize: 10, color: '#06B6D4', textDecoration: 'none', fontFamily: 'monospace' }}>
                        {artist.managerPhone}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Social Links" icon={ExternalLink} color="#F59E0B">
            {artist._social_links.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {artist._social_links.map(link => {
                  const meta = PLATFORM_META[link.platform];
                  const Icon = SOCIAL_ICONS[link.platform];
                  return (
                    <div key={link.platform} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 26, height: 26, borderRadius: 7, background: meta.bg, border: `1px solid ${meta.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Icon size={12} color={meta.color} />
                        </div>
                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{meta.label}</span>
                      </div>
                      {link.valid ? (
                        <a href={link.url} target="_blank" rel="noopener noreferrer" style={{
                          display: 'flex', alignItems: 'center', gap: 4,
                          padding: '4px 10px', borderRadius: 7,
                          background: meta.bg, border: `1px solid ${meta.color}20`,
                          color: meta.color, fontSize: 10, fontFamily: 'monospace', textDecoration: 'none',
                          transition: 'filter 0.15s',
                        }}
                          onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.3)')}
                          onMouseLeave={e => (e.currentTarget.style.filter = 'brightness(1)')}>
                          Open <ExternalLink size={9} color={meta.color} />
                        </a>
                      ) : (
                        <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(239,68,68,0.6)' }}>Invalid URL</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(255,255,255,0.2)', textAlign: 'center', padding: '12px 0' }}>
                No social links on file
              </div>
            )}
          </SectionCard>

          {isDropped ? (
            <LockedModule reason={LOCK_REASON}>
              <SectionCard title="Team Assignment" icon={Users} color="#10B981">
                <div style={{ height: 80 }} />
              </SectionCard>
            </LockedModule>
          ) : (
          <SectionCard title="Team Assignment" icon={Users} color="#10B981">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'A&R Rep', value: artist.arRep },
                { label: 'Point Person', value: artist.pointPerson },
                { label: 'Signing Date', value: artist.signingDate },
              ].map(f => (
                <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{f.label}</span>
                  <span style={{ fontSize: 11, color: f.value && f.value !== 'Needs Info' ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.2)' }}>
                    {f.value && f.value !== 'Needs Info' ? f.value : '—'}
                  </span>
                </div>
              ))}

              <div style={{ paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 2 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Label</span>
                  {perms.canEditLabels && (
                    <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.2)' }}>Admin — click to reassign</span>
                  )}
                </div>

                {perms.canEditLabels ? (
                  <LabelAssignDropdown
                    artistId={artist.id}
                    currentLabelId={artist.label_id}
                    assignments={artistAssignments}
                    assignedBy={roleState.user?.email ?? 'admin'}
                    onAssigned={(newLabelId, updatedAssignments) => {
                      setArtistAssignments(updatedAssignments);
                      if (artist) {
                        setArtist({ ...artist, label_id: newLabelId });
                      }
                    }}
                  />
                ) : (
                  (() => {
                    const activeLabelId = artistAssignments.find(a => a.active)?.label_id ?? artist.label_id;
                    const lbl = activeLabelId ? getLabelById(activeLabelId) : null;
                    return lbl ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: lbl.color }} />
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>{lbl.name}</span>
                        <span style={{ fontFamily: 'monospace', fontSize: 7.5, padding: '1px 5px', borderRadius: 4, background: `${lbl.color}18`, color: lbl.color, border: `1px solid ${lbl.color}28` }}>{lbl.type}</span>
                      </div>
                    ) : (
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>Independent</span>
                    );
                  })()
                )}
              </div>
            </div>
          </SectionCard>
          )}

          {isDropped ? (
            <LockedModule reason={LOCK_REASON}>
              <SectionCard title="AI Agent Team" icon={Cpu} color="#F59E0B">
                <div style={{ height: 80 }} />
              </SectionCard>
            </LockedModule>
          ) : (
          <SectionCard title="AI Agent Team" icon={Cpu} color="#F59E0B">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {agentAssignments.length > 0 && (
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 6 }}>
                  {agentAssignments.map(assignment => {
                    const agent = allAgents.find(a => a.id === assignment.agent_id);
                    if (!agent) return null;
                    return (
                      <div key={assignment.id} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 8px', borderRadius: 8, background: `${agent.color}12`, border: `1px solid ${agent.color}25` }}>
                        <span style={{ fontFamily: 'monospace', fontSize: 8, color: agent.color, fontWeight: 700 }}>{agent.name}</span>
                        <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)' }}>{agent.role.split(',')[0]}</span>
                      </div>
                    );
                  })}
                </div>
              )}
              {agentAssignments.length === 0 && (
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', marginBottom: 6 }}>No AI agents assigned</div>
              )}
              {perms.canManageSystem && allAgents.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {allAgents.map(agent => {
                    const isAssigned = agentAssignments.some(a => a.agent_id === agent.id);
                    const levelMeta = AGENT_LEVEL_META[agent.level] ?? AGENT_LEVEL_META['Junior'];
                    const isSaving = agentAssignLoading === agent.id;
                    const AGENT_ICONS: Record<string, React.ElementType> = {
                      crown: Crown, calendar: Calendar, users: Users, zap: Zap, settings: Settings,
                      megaphone: Megaphone, disc: DiscIcon, 'bar-chart': BarChart2, compass: Compass,
                    };
                    const AgIcon = AGENT_ICONS[agent.icon_key] ?? Cpu;
                    return (
                      <div
                        key={agent.id}
                        onClick={() => !isSaving && toggleAgentAssignment(agent.id)}
                        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', borderRadius: 8, cursor: 'pointer', background: isAssigned ? `${agent.color}08` : 'rgba(255,255,255,0.02)', border: `1px solid ${isAssigned ? `${agent.color}22` : 'rgba(255,255,255,0.05)'}`, transition: 'all 0.15s' }}
                      >
                        <div style={{ width: 20, height: 20, borderRadius: 6, background: `${agent.color}18`, border: `1px solid ${agent.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {isAssigned ? <CheckCircle size={11} style={{ color: agent.color }} /> : <AgIcon size={10} color={agent.color} />}
                        </div>
                        <span style={{ fontSize: 11, color: isAssigned ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.4)', flex: 1, fontWeight: isAssigned ? 600 : 400 }}>{agent.name}</span>
                        <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', flex: 1 }}>{agent.role.split(',')[0]}</span>
                        <span style={{ fontFamily: 'monospace', fontSize: 8, padding: '1px 5px', borderRadius: 20, background: levelMeta.bg, color: levelMeta.color }}>{levelMeta.label}</span>
                        {isSaving && <Loader size={9} color={agent.color} style={{ animation: 'spin 1s linear infinite' }} />}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </SectionCard>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <SectionCard title="Performance" icon={TrendingUp} color="#10B981">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 12 }}>
              <StatTile label="Monthly Listeners" value={fmt(artist.monthlyListeners)} color="#10B981" />
              <StatTile label="Total Streams" value={fmt(artist.totalStreams)} color="#06B6D4" />
              <StatTile label="Followers" value={fmt(artist.followers)} color="#F59E0B" />
              <StatTile label="Spotify Followers" value={fmt(artist.spotifyFollowers)} color="#1DB954" />
              <StatTile label="IG Followers" value={fmt(artist.instagramFollowers)} color="#E1306C" />
              <StatTile label="YouTube Subs" value={fmt(artist.youtubeFollowers)} color="#EF4444" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '10px 12px' }}>
                <div style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.22)', marginBottom: 4 }}>STREAMING DELTA</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>{artist.streamingDelta || '—'}</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '10px 12px' }}>
                <div style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.22)', marginBottom: 4 }}>FOLLOWER DELTA</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>{artist.followerDelta || '—'}</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '10px 12px' }}>
                <div style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.22)', marginBottom: 4 }}>TOP PLATFORM</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>{artist.topPlatform || '—'}</div>
              </div>
            </div>
          </SectionCard>

          {(perms.canSeeInternalNotes || currentRole !== 'artist_manager') && (
            <SectionCard title="Revenue & Recoupment" icon={DollarSign} color="#F59E0B">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 12 }}>
                <StatTile label="YTD Revenue" value={fmtMoney(artist.financials.ytdRevenue)} color="#10B981" />
                <StatTile label="All-Time Revenue" value={fmtMoney(artist.financials.allTimeRevenue)} color="#10B981" />
                <StatTile label="Total Investment" value={fmtMoney(artist.financials.totalInvestment.allTime)} color="#F59E0B" />
                <StatTile label="Recoup Balance" value={fmtMoney(artist.financials.recoupableBalance)} color="#EF4444" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {[
                  { label: 'Advance', v: artist.financials.advance },
                  { label: 'Ad Spend (YTD)', v: artist.financials.adSpend.ytd },
                  { label: 'Marketing (YTD)', v: artist.financials.marketingSpend.ytd },
                  { label: 'Live Shows (YTD)', v: artist.financials.liveShows.ytd },
                  { label: 'Content Prod (YTD)', v: artist.financials.contentProduction.ytd },
                  { label: 'A&R Spend (YTD)', v: artist.financials.arSpend.ytd },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 10px', background: 'rgba(255,255,255,0.02)', borderRadius: 8 }}>
                    <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>{row.label}</span>
                    <span style={{ fontFamily: 'monospace', fontSize: 10, color: row.v > 0 ? '#F59E0B' : 'rgba(255,255,255,0.2)' }}>{fmtMoney(row.v)}</span>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          {isDropped ? (
            <LockedModule reason="Release OS locked — no new releases or campaign workflows during exit process.">
              <SectionCard title="Releases" icon={Music} color="#06B6D4">
                <div style={{ height: 80 }} />
              </SectionCard>
            </LockedModule>
          ) : (
            <SectionCard title="Releases" icon={Music} color="#06B6D4">
              {artist.releases.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {artist.releases.map(release => {
                    const stColor = release.status === 'Released' ? '#10B981' : release.status === 'Scheduled' ? '#06B6D4' : release.status === 'In Production' ? '#F59E0B' : release.status === 'Blocked' ? '#EF4444' : 'rgba(255,255,255,0.3)';
                    return (
                      <div key={release.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '12px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontWeight: 600, fontSize: 13, color: '#fff' }}>{release.title}</span>
                            <span style={{ fontFamily: 'monospace', fontSize: 8, padding: '1px 6px', borderRadius: 4, background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)', color: '#06B6D4' }}>{release.type}</span>
                          </div>
                          <span style={{ fontFamily: 'monospace', fontSize: 9, padding: '2px 7px', borderRadius: 20, background: `${stColor}12`, border: `1px solid ${stColor}25`, color: stColor }}>{release.status}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 16 }}>
                          <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>Release: {release.releaseDate}</span>
                          <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>Campaign: {release.campaignStage}</span>
                          {release.streams && <span style={{ fontFamily: 'monospace', fontSize: 9, color: '#10B981' }}>{fmt(release.streams)} streams</span>}
                        </div>
                        {release.coverNote && <div style={{ marginTop: 6, fontSize: 10, color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>{release.coverNote}</div>}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(255,255,255,0.2)', textAlign: 'center', padding: '12px 0' }}>No releases on file</div>
              )}
            </SectionCard>
          )}

          {isDropped ? (
            <LockedModule reason="Task and request execution locked during exit workflow.">
              <SectionCard title="Tasks & Action Queue" icon={Zap} color="#EF4444">
                <div style={{ height: 80 }} />
              </SectionCard>
            </LockedModule>
          ) : (
            <SectionCard title="Tasks & Action Queue" icon={Zap} color="#EF4444">
              {artist.actionQueue.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {artist.actionQueue.map((action: ArtistAction) => {
                    const pc = PRIORITY_COLORS[action.priority] ?? '#6B7280';
                    return (
                      <div key={action.id} style={{
                        display: 'flex', alignItems: 'flex-start', gap: 10,
                        padding: '10px 12px', borderRadius: 10,
                        background: `${pc}08`, border: `1px solid ${pc}20`,
                      }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: pc, flexShrink: 0, marginTop: 4 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: 500, marginBottom: 4 }}>{action.label}</div>
                          <div style={{ display: 'flex', gap: 10 }}>
                            <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.3)' }}>Owner: {action.owner}</span>
                            <span style={{ fontFamily: 'monospace', fontSize: 8, color: `${pc}90`, textTransform: 'uppercase' }}>{action.priority}</span>
                            <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.3)' }}>{action.category}</span>
                            {action.due && <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.3)' }}>Due: {action.due}</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(255,255,255,0.2)', textAlign: 'center', padding: '12px 0' }}>No active tasks</div>
              )}
            </SectionCard>
          )}

          {!isDropped && artist.recentSupport.length > 0 && (
            <SectionCard title="Recent Support Activity" icon={Clock} color="#8B5CF6" defaultOpen={false}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {artist.recentSupport.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(139,92,246,0.6)', flexShrink: 0, marginTop: 4 }} />
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{item}</span>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          {(perms.canSeeInternalNotes && (artist.rosterNotes || artist.internalNotes)) && (
            <SectionCard title="Notes" icon={MessageSquare} color="#06B6D4" defaultOpen={false}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {artist.rosterNotes && (
                  <div>
                    <div style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>Roster Notes</div>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, margin: 0 }}>{artist.rosterNotes}</p>
                  </div>
                )}
                {artist.internalNotes && (
                  <div>
                    <div style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>Internal Notes</div>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, margin: 0 }}>{artist.internalNotes}</p>
                  </div>
                )}
              </div>
            </SectionCard>
          )}
        </div>
      </div>

      {editOpen && (
        <EditPanel
          artist={artist as SignedArtist}
          onClose={() => setEditOpen(false)}
          onSave={handleSave}
        />
      )}

      {updateOpen && (
        <UpdateInfoModal
          artist={artist}
          submitterEmail={roleState.user?.email ?? 'unknown@gmg.ai'}
          submitterName={roleState.user?.displayName ?? currentRole}
          submitterRole={currentRole}
          onClose={() => setUpdateOpen(false)}
          onSubmitted={() => setUpdateOpen(false)}
        />
      )}
    </div>
  );
}
