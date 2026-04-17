import { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2, Users, TrendingUp, Music, Activity, Plus, ChevronRight,
} from 'lucide-react';
import {
  LABEL_TYPE_COLORS, LABEL_CATEGORIES, LABEL_CATEGORY_META,
  syncLabelFromSupabase, type LabelCategory,
} from '../data/labelsData';
import { buildLabelMetrics, type LabelMetrics } from '../utils/labelUtils';
import { useRole } from '../../auth/RoleContext';
import { ROLE_PERMISSIONS } from '../../auth/roles';
import LabelFormModal from '../components/labels/LabelFormModal';
import { fetchAllAssignments, fetchLabels, type ArtistLabelAssignment, type Label } from '../data/labelService';

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

type CategoryFilter = LabelCategory | 'all';

export default function LabelsPage() {
  const navigate = useNavigate();
  const { roleState } = useRole();
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [showCreate, setShowCreate] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [dbAssignments, setDbAssignments] = useState<ArtistLabelAssignment[]>([]);

  const currentRole = roleState.role ?? 'artist_manager';
  const perms = ROLE_PERMISSIONS[currentRole as keyof typeof ROLE_PERMISSIONS];

  useEffect(() => {
    async function load() {
      const [supaLabels, rows] = await Promise.all([fetchLabels(), fetchAllAssignments()]);
      const uuidToSlug: Record<string, string> = {};
      for (const l of supaLabels) {
        syncLabelFromSupabase(l);
        uuidToSlug[l.id] = l.slug;
      }
      const normalized = rows.map(a => ({ ...a, label_id: uuidToSlug[a.label_id] ?? a.label_id }));
      setDbAssignments(normalized);
    }
    load();
  }, [refreshKey]);

  const allMetrics: LabelMetrics[] = useMemo(
    () => buildLabelMetrics(undefined, undefined, dbAssignments.length > 0 ? dbAssignments : undefined),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [refreshKey, dbAssignments]
  );

  const filtered = useMemo(() => {
    if (categoryFilter === 'all') return allMetrics;
    return allMetrics.filter(l => l.labelCategory === categoryFilter);
  }, [allMetrics, categoryFilter]);

  const totalArtists   = allMetrics.reduce((s, l) => s + l.artist_count, 0);
  const totalListeners = allMetrics.reduce((s, l) => s + l.total_listeners, 0);
  const activeLabels   = allMetrics.filter(l => l.status === 'Active').length;

  const handleSaved = useCallback((newLabel?: Label) => {
    setRefreshKey(k => k + 1);
    if (newLabel?.slug) {
      setTimeout(() => navigate(`/dashboard/artist-os/labels/${newLabel.slug}`), 50);
    }
  }, [navigate]);

  return (
    <div style={{ background: '#08090B', minHeight: '100%', padding: '22px 24px' }}>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={16} color="#10B981" />
            </div>
            <h1 style={{ fontWeight: 800, fontSize: 22, color: '#fff', letterSpacing: '-0.02em', margin: 0 }}>Labels</h1>
          </div>
          <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.35)', marginLeft: 44 }}>Label partners, rosters, and performance</p>
        </div>

        {perms.canEditLabels && (
          <button
            onClick={() => setShowCreate(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '9px 18px', borderRadius: 10,
              background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)',
              color: '#10B981', fontSize: 12, fontWeight: 700, cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(16,185,129,0.16)';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(16,185,129,0.4)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(16,185,129,0.1)';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(16,185,129,0.25)';
            }}
          >
            <Plus size={13} />
            Create Label
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 22 }}>
        {[
          { label: 'Active Labels',   value: activeLabels.toString(),  icon: Building2, color: '#10B981' },
          { label: 'Total Artists',   value: totalArtists.toString(),  icon: Users,     color: '#06B6D4' },
          { label: 'Total Listeners', value: fmt(totalListeners),      icon: Music,     color: '#F59E0B' },
        ].map(s => (
          <div key={s.label} style={{ background: '#0D0E11', border: `1px solid ${s.color}18`, borderRadius: 14, padding: '16px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
              <div style={{ width: 24, height: 24, borderRadius: 7, background: `${s.color}14`, border: `1px solid ${s.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <s.icon size={12} color={s.color} />
              </div>
              <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</span>
            </div>
            <div style={{ fontWeight: 800, fontSize: 26, color: s.color, lineHeight: 1 }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 7, marginBottom: 20, flexWrap: 'wrap' }}>
        <button
          onClick={() => setCategoryFilter('all')}
          style={{
            padding: '7px 16px', borderRadius: 9, fontSize: 11, fontWeight: 600, cursor: 'pointer',
            background: categoryFilter === 'all' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
            border: `1px solid ${categoryFilter === 'all' ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.07)'}`,
            color: categoryFilter === 'all' ? 'rgba(255,255,255,0.75)' : '#6B7280',
          }}
        >
          All Labels
        </button>
        {LABEL_CATEGORIES.map(cat => {
          const m = LABEL_CATEGORY_META[cat];
          const isActive = categoryFilter === cat;
          return (
            <button
              key={cat}
              onClick={() => setCategoryFilter(isActive ? 'all' : cat)}
              style={{
                padding: '7px 16px', borderRadius: 9, fontSize: 11, fontWeight: 600, cursor: 'pointer',
                background: isActive ? m.bg : 'rgba(255,255,255,0.03)',
                border: `1px solid ${isActive ? m.border : 'rgba(255,255,255,0.07)'}`,
                color: isActive ? m.color : '#6B7280',
                transition: 'all 0.13s',
              }}
              onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = m.color; }}
              onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = '#6B7280'; }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '60px 24px', gap: 12,
        }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Building2 size={20} color="rgba(16,185,129,0.5)" />
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', textAlign: 'center' }}>
            No labels match this filter.
          </div>
          {perms.canEditLabels && (
            <button
              onClick={() => setShowCreate(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 9, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: '#10B981', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
            >
              <Plus size={11} />
              Create a Label
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 14 }}>
          {filtered.map(label => {
            const typeMeta = LABEL_TYPE_COLORS[label.type];
            return (
              <LabelCard
                key={label.id}
                label={label}
                typeMeta={typeMeta}
                onClick={() => navigate(`/dashboard/artist-os/labels/${label.id}`)}
                onArtistClick={artistId => navigate(`/dashboard/artist-os/roster/${artistId}`)}
              />
            );
          })}
        </div>
      )}

      {showCreate && (
        <LabelFormModal
          onClose={() => setShowCreate(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}

function LabelCard({ label, typeMeta, onClick, onArtistClick }: {
  label: LabelMetrics;
  typeMeta: { color: string; bg: string };
  onClick: () => void;
  onArtistClick: (artistId: string) => void;
}) {
  const catMeta = label.labelCategory ? LABEL_CATEGORY_META[label.labelCategory] : null;

  return (
    <div
      onClick={onClick}
      style={{
        background: '#0D0E11',
        border: `1px solid ${label.color}18`,
        borderRadius: 16, overflow: 'hidden', cursor: 'pointer',
        transition: 'all 0.18s', position: 'relative',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.border = `1px solid ${label.color}38`;
        el.style.transform = 'translateY(-1px)';
        el.style.boxShadow = `0 12px 40px ${label.color}10`;
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.border = `1px solid ${label.color}18`;
        el.style.transform = 'none';
        el.style.boxShadow = 'none';
      }}
    >
      <div style={{ height: 3, background: `linear-gradient(90deg, transparent, ${label.color}60, transparent)` }} />

      <div style={{ padding: '16px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: label.description ? 10 : 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 11,
              background: `${label.color}15`, border: `1px solid ${label.color}28`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Building2 size={18} style={{ color: label.color }} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#fff', lineHeight: 1.3, marginBottom: 5 }}>{label.name}</div>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                {catMeta && (
                  <span style={{
                    fontFamily: 'monospace', fontSize: 8, fontWeight: 800,
                    padding: '2px 8px', borderRadius: 20,
                    background: catMeta.bg, color: catMeta.color,
                    border: `1px solid ${catMeta.border}`,
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                  }}>
                    {label.labelCategory}
                  </span>
                )}
                <span style={{
                  fontFamily: 'monospace', fontSize: 8, padding: '2px 7px', borderRadius: 20,
                  background: typeMeta.bg, color: typeMeta.color,
                }}>
                  {label.type}
                </span>
                <span style={{
                  fontFamily: 'monospace', fontSize: 8, padding: '2px 7px', borderRadius: 20,
                  background: label.status === 'Active' ? 'rgba(16,185,129,0.1)' : 'rgba(107,114,128,0.1)',
                  color: label.status === 'Active' ? '#10B981' : '#6B7280',
                }}>
                  {label.status}
                </span>
              </div>
            </div>
          </div>
          <ChevronRight size={14} color="rgba(255,255,255,0.2)" style={{ flexShrink: 0, marginTop: 2 }} />
        </div>

        {label.description && (
          <p style={{
            margin: '0 0 12px', fontSize: 11, lineHeight: 1.55,
            color: 'rgba(255,255,255,0.38)',
            overflow: 'hidden',
            display: '-webkit-box',
          }}>
            {label.description}
          </p>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 14 }}>
          {[
            { label: 'Artists',   value: label.artist_count.toString(), icon: Users,      color: label.color },
            { label: 'Listeners', value: fmt(label.total_listeners),    icon: TrendingUp, color: '#06B6D4'   },
            { label: 'Health',    value: `${label.avg_health}`,         icon: Activity,   color: '#10B981'   },
          ].map(stat => (
            <div key={stat.label} style={{
              padding: '10px', borderRadius: 10,
              background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)',
              textAlign: 'center',
            }}>
              <stat.icon size={12} color={stat.color} style={{ marginBottom: 5 }} />
              <div style={{ fontWeight: 700, fontSize: 15, color: stat.color, lineHeight: 1 }}>{stat.value}</div>
              <div style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.25)', marginTop: 3 }}>
                {stat.label.toUpperCase()}
              </div>
            </div>
          ))}
        </div>

        {label.assigned_artists.length > 0 ? (
          <div>
            <div style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.2)', marginBottom: 7 }}>ROSTER</div>
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
              {label.assigned_artists.slice(0, 6).map(a => (
                <div
                  key={a.id}
                  title={a.name}
                  onClick={e => { e.stopPropagation(); onArtistClick(a.id); }}
                  style={{
                    width: 26, height: 26, borderRadius: 7,
                    background: `${a.avatarColor}20`, border: `1px solid ${a.avatarColor}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'transform 0.12s, border-color 0.12s',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.15)';
                    (e.currentTarget as HTMLDivElement).style.borderColor = `${a.avatarColor}70`;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)';
                    (e.currentTarget as HTMLDivElement).style.borderColor = `${a.avatarColor}30`;
                  }}
                >
                  <span style={{ fontSize: 8, fontWeight: 700, color: a.avatarColor }}>{a.avatarInitials}</span>
                </div>
              ))}
              {label.assigned_artists.length > 6 && (
                <div style={{
                  width: 26, height: 26, borderRadius: 7,
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.3)' }}>+{label.assigned_artists.length - 6}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.18)', padding: '6px 0' }}>
            No artists assigned
          </div>
        )}
      </div>
    </div>
  );
}
