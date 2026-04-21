import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Library, TrendingUp, TrendingDown, AlertCircle, Clock, ChevronRight, Zap, DollarSign, FileText, CheckSquare, Building2, Users, Mic2, MapPin, Mail, Send, MessageSquare, Bot, User, Flag, ArrowUpRight, Calendar, Megaphone, ShoppingBag, Music, Scale, Star, Target, Activity, RefreshCw, ExternalLink, Video, Globe, BarChart2, Heart, Shield, Rocket, Database, Search, BarChart, PieChart, Headphones, Settings, Lock, UserMinus, ArrowLeft } from 'lucide-react';
import { isClientDropped, fetchLifecycleEventForClient, initCatalogDropState, type CatalogLifecycleEvent } from '../../data/catalogDropService';
import { useAuth } from '../../../auth/AuthContext';
import OperatorTeamGrid from '../../components/artistOS/OperatorTeamGrid';
import { getClientProfile } from '../../data/catalogClientProfiles';
import { useTasks } from '../../context/TaskContext';
import TaskWidget from '../../components/tasks/TaskWidget';
import { useCatalogClient } from '../../context/CatalogClientContext';
import { CLIENT_TYPE_META, ARTIST_ROLE_META, isRosterView, isPortfolioView } from '../../data/catalogClientService';

const URGENCY: Record<string, { color: string; label: string }> = {
  critical: { color: '#EF4444', label: 'CRITICAL' },
  high:     { color: '#F59E0B', label: 'HIGH'     },
  medium:   { color: '#06B6D4', label: 'MEDIUM'   },
  low:      { color: '#6B7280', label: 'LOW'       },
};

const STATUS_DIM: Record<string, { color: string; label: string }> = {
  active:         { color: '#10B981', label: 'Active'          },
  in_progress:    { color: '#F59E0B', label: 'In Progress'     },
  in_development: { color: '#06B6D4', label: 'In Development'  },
  planned:        { color: '#3B82F6', label: 'Planned'         },
  holding:        { color: '#6B7280', label: 'Holding'         },
  open:           { color: '#6B7280', label: 'Open'            },
  pending:        { color: '#F59E0B', label: 'Pending'         },
};

const TASK_PRIORITY: Record<string, { color: string }> = {
  critical: { color: '#EF4444' },
  high:     { color: '#F59E0B' },
  medium:   { color: '#06B6D4' },
  low:      { color: '#6B7280' },
};

const TIMELINE_TYPE_META: Record<string, { icon: typeof Calendar }> = {
  campaign: { icon: Megaphone   },
  release:  { icon: Music       },
  merch:    { icon: ShoppingBag },
  brand:    { icon: Star        },
  tour:     { icon: Mic2        },
  press:    { icon: FileText    },
  legal:    { icon: Scale       },
};

const ENTITY_ICON_MAP: Record<string, typeof Library> = {
  library:   Library,
  mic:       Mic2,
  users:     Users,
  'map-pin': MapPin,
  building:  Building2,
};

function SectionDivider({ label, index, accent = '#10B981' }: { label: string; index: string; accent?: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-[9px] font-mono shrink-0" style={{ color: `${accent}50` }}>{index}</span>
      <div className="h-[1px] w-3" style={{ background: `${accent}30` }} />
      <span className="text-[10px] font-mono tracking-[0.16em] uppercase font-semibold shrink-0" style={{ color: `${accent}70` }}>{label}</span>
      <div className="flex-1 h-[1px]" style={{ background: 'rgba(255,255,255,0.04)' }} />
    </div>
  );
}

function MetricTile({ m }: { m: { label: string; value: string; delta: string; dir: string; color: string; sub: string } }) {
  return (
    <div className="bg-[#0B0D10] border border-white/[0.06] rounded-xl p-4 relative overflow-hidden min-w-0">
      <div className="absolute top-0 left-0 right-0 h-[1px]"
        style={{ background: `linear-gradient(90deg, transparent, ${m.color}35, transparent)` }} />
      <p className="text-[9px] font-mono text-white/25 uppercase tracking-widest mb-1.5 truncate">{m.label}</p>
      <p className="text-[20px] font-bold leading-none truncate" style={{ color: m.color }}>{m.value}</p>
      <div className="flex items-center gap-1 mt-1.5">
        {m.dir === 'up' && <TrendingUp className="w-3 h-3 text-[#10B981] shrink-0" />}
        {m.dir === 'down' && <TrendingDown className="w-3 h-3 text-[#EF4444] shrink-0" />}
        <span className="text-[9.5px] text-white/30 truncate">{m.delta}</span>
      </div>
      <p className="text-[8.5px] text-white/15 mt-0.5 font-mono truncate">{m.sub}</p>
    </div>
  );
}

function AccountingRow({ label, data }: { label: string; data: { revenue: string; expenses: string; net: string; dir: string } }) {
  return (
    <div className="grid grid-cols-[130px_1fr_1fr_1fr] items-center gap-4 py-3 border-b border-white/[0.04]">
      <span className="text-[10px] font-mono text-white/30 uppercase tracking-wider">{label}</span>
      <div>
        <p className="text-[9px] text-white/20 mb-0.5">Revenue</p>
        <p className="text-[13px] font-bold text-[#10B981]">{data.revenue}</p>
      </div>
      <div>
        <p className="text-[9px] text-white/20 mb-0.5">Expenses</p>
        <p className="text-[13px] font-bold text-[#EF4444]">{data.expenses}</p>
      </div>
      <div>
        <p className="text-[9px] text-white/20 mb-0.5">Net</p>
        <div className="flex items-center gap-1">
          {data.dir === 'up'
            ? <TrendingUp className="w-3 h-3 text-[#10B981]" />
            : <TrendingDown className="w-3 h-3 text-[#EF4444]" />
          }
          <p className="text-[13px] font-bold" style={{ color: data.dir === 'up' ? '#10B981' : '#EF4444' }}>{data.net}</p>
        </div>
      </div>
    </div>
  );
}

function ClientContextBanner() {
  const { activeClient, loading } = useCatalogClient();
  if (loading || !activeClient) return null;
  const isMulti = isRosterView(activeClient) || isPortfolioView(activeClient);
  if (!isMulti) return null;

  const accent = activeClient.accent_color;
  const typeMeta = CLIENT_TYPE_META[activeClient.type];
  const artists = activeClient.artists ?? [];
  const totalValue = artists.reduce((s, a) => s + (a.catalog_value_est ?? 0), 0);
  const totalRev = artists.reduce((s, a) => s + (a.monthly_revenue_est ?? 0), 0);
  const fmt = (n: number) => n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `$${(n / 1_000).toFixed(0)}K` : `$${n}`;

  return (
    <div className="mx-6 mt-6 mb-0 rounded-2xl overflow-hidden border"
      style={{ borderColor: `${accent}25`, background: `${accent}07` }}>
      <div className="flex items-center gap-3 px-5 py-3 border-b"
        style={{ borderColor: `${accent}15` }}>
        <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${accent}14`, border: `1px solid ${accent}22` }}>
          <Users className="w-3.5 h-3.5" style={{ color: accent }} />
        </div>
        <div className="flex-1">
          <p className="text-[13px] font-bold text-white/80">{activeClient.name}</p>
          <p className="text-[9.5px] font-mono" style={{ color: accent }}>
            {typeMeta.label} · {artists.length} artist{artists.length !== 1 ? 's' : ''} · {activeClient.territory ?? 'Worldwide'}
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-4">
          {[
            { label: 'Portfolio Value', value: fmt(totalValue),  color: accent },
            { label: 'Monthly Revenue', value: fmt(totalRev),    color: '#06B6D4' },
          ].map(m => (
            <div key={m.label} className="text-right">
              <p className="text-[8px] font-mono text-white/15 uppercase">{m.label}</p>
              <p className="text-[14px] font-bold" style={{ color: m.color }}>{m.value}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="px-5 py-3 flex items-center gap-2 overflow-x-auto">
        {artists.slice(0, 8).map(a => {
          const rm = ARTIST_ROLE_META[a.artist_role];
          return (
            <div key={a.id} className="flex items-center gap-1.5 bg-white/[0.04] border border-white/[0.06] rounded-xl px-3 py-1.5 shrink-0">
              {a.is_primary && <Star className="w-3 h-3 text-[#F59E0B] fill-current shrink-0" />}
              <span className="text-[10px] font-semibold text-white/50">{a.artist_name}</span>
              <span className="text-[8px] font-mono px-1 py-0.5 rounded"
                style={{ color: rm.color, background: `${rm.color}12` }}>{rm.label}</span>
            </div>
          );
        })}
        {artists.length > 8 && (
          <span className="text-[9.5px] font-mono text-white/20 shrink-0 pl-1">+{artists.length - 8} more</span>
        )}
      </div>
    </div>
  );
}

export default function COSOverview({ forceClientId }: { forceClientId?: string } = {}) {
  const [now, setNow] = useState(new Date());
  const { openSubmit } = useTasks();
  const navigate = useNavigate();
  const { activeClient, switchClient } = useCatalogClient();
  const { catalogOSAuth } = useAuth();
  const isAdmin = catalogOSAuth.role === 'catalog_admin' || !catalogOSAuth.clientId;

  // When a specific client is requested via URL param, switch to it
  const targetId = forceClientId ?? (!isAdmin ? catalogOSAuth.clientId : undefined);
  useEffect(() => {
    if (targetId && activeClient?.id !== targetId) {
      switchClient(targetId);
    }
  }, [targetId, activeClient?.id, switchClient]);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const [dropRecord, setDropRecord] = useState<CatalogLifecycleEvent | null>(null);
  useEffect(() => {
    initCatalogDropState();
    if (activeClient) {
      fetchLifecycleEventForClient(activeClient.id).then(setDropRecord);
    } else {
      setDropRecord(null);
    }
  }, [activeClient?.id]);

  // Admin guard — all hooks above this line
  if (isAdmin) return <Navigate to="/catalog/app/roster" replace />;

  const profile = getClientProfile(activeClient?.id);
  const { META, METRICS, METRICS_LIST, CURRENT_STATUS, ENTITIES, WEEKLY_SNAPSHOT, TASKS, EXPECTED_ANNUAL_OUTCOMES, AI_RECOMMENDATIONS, ACCOUNTING, COMMS } = profile;
  const ACCENT = activeClient?.accent_color ?? META.status_color;

  const openTasks = TASKS.filter(t => t.status !== 'completed');
  const flaggedTasks = TASKS.filter(t => t.flagged);

  const clientDropped = activeClient ? isClientDropped(activeClient.id) : false;

  if (clientDropped && activeClient) {
    return (
      <div className="min-h-full bg-[#07080A]">
        {isAdmin && (
          <div style={{ padding: '12px 18px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <button
              onClick={() => navigate('/catalog/app/roster')}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 12px', borderRadius: 8, cursor: 'pointer',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.45)', fontSize: 11, fontWeight: 600,
                transition: 'all 0.12s',
              }}
              onMouseEnter={e => { const b = e.currentTarget; b.style.background = 'rgba(255,255,255,0.07)'; b.style.color = 'rgba(255,255,255,0.7)'; }}
              onMouseLeave={e => { const b = e.currentTarget; b.style.background = 'rgba(255,255,255,0.04)'; b.style.color = 'rgba(255,255,255,0.45)'; }}
            >
              <ArrowLeft size={12} /> Back to Catalog Clients
            </button>
          </div>
        )}

        {/* Lock banner */}
        <div style={{
          background: 'rgba(239,68,68,0.06)',
          borderBottom: '2px solid rgba(239,68,68,0.25)',
          padding: '0',
        }}>
          <div style={{ height: 2, background: 'linear-gradient(90deg,transparent,rgba(239,68,68,0.5),transparent)' }} />
        </div>

        <div style={{ padding: '48px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', textAlign: 'center' }}>
          {/* Lock icon */}
          <div style={{
            width: 64, height: 64, borderRadius: 18,
            background: 'rgba(239,68,68,0.08)', border: '2px solid rgba(239,68,68,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 20,
          }}>
            <Lock size={26} color="#EF4444" />
          </div>

          {/* Status badge */}
          <div style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <UserMinus size={13} color="#EF4444" />
            <span style={{ fontFamily: 'monospace', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#EF4444' }}>
              Client Dropped · Read-Only
            </span>
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'rgba(255,255,255,0.7)', marginBottom: 6 }}>
            {activeClient.name}
          </h2>

          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', lineHeight: 1.7, maxWidth: 420, marginBottom: 20 }}>
            This client has been moved to the Dropped Queue. Their profile is locked for active management
            but remains viewable by admin for historical reference and investor review.
          </p>

          {dropRecord?.notes && (
            <div style={{
              marginBottom: 20, padding: '10px 16px', borderRadius: 10,
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
              maxWidth: 400,
            }}>
              <span style={{ fontSize: 9.5, fontFamily: 'monospace', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Exit Reason: </span>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{dropRecord.notes}</span>
            </div>
          )}

          {/* Locked snapshot */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, maxWidth: 480, marginBottom: 28,
          }}>
            {[
              { label: 'Catalog Value', value: '$—', sub: 'Locked' },
              { label: 'Monthly Rev',   value: '$—', sub: 'Locked' },
              { label: 'Client Since',  value: activeClient.client_since ?? '—', sub: 'Historical' },
            ].map(m => (
              <div key={m.label} style={{
                padding: '10px 14px', borderRadius: 10,
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
              }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>{m.value}</div>
                <div style={{ fontSize: 8.5, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 3 }}>{m.label}</div>
                <div style={{ fontSize: 8, color: 'rgba(239,68,68,0.5)', fontFamily: 'monospace', marginTop: 1 }}>{m.sub}</div>
              </div>
            ))}
          </div>

          {isAdmin && (
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => navigate('/catalog/app/dropped-queue')}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '9px 16px', borderRadius: 10, cursor: 'pointer',
                  background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)',
                  color: '#10B981', fontSize: 12, fontWeight: 700,
                }}
              >
                <RefreshCw size={12} /> Reinstate from Dropped Queue
              </button>
              <button
                onClick={() => navigate('/catalog/app/roster')}
                style={{
                  padding: '9px 14px', borderRadius: 10, cursor: 'pointer',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)',
                  color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 600,
                }}
              >
                Back to Roster
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#07080A]">
      {isAdmin && (
        <div className="px-5 pt-3 pb-0">
          <button
            onClick={() => navigate('/catalog/app/roster')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all"
            style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.45)',
            }}
            onMouseEnter={e => { const b = e.currentTarget; b.style.background = 'rgba(255,255,255,0.07)'; b.style.color = 'rgba(255,255,255,0.7)'; }}
            onMouseLeave={e => { const b = e.currentTarget; b.style.background = 'rgba(255,255,255,0.04)'; b.style.color = 'rgba(255,255,255,0.45)'; }}
          >
            <ArrowLeft className="w-3 h-3" /> Back to Catalog Clients
          </button>
        </div>
      )}

      <ClientContextBanner />

      {/* ──────────────────────────────────────────────
          01. HEADER / HERO
      ─────────────────────────────────────────────── */}
      <div className="relative bg-[#090B0E] border-b border-white/[0.06] overflow-hidden">
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full opacity-[0.06] blur-3xl pointer-events-none"
          style={{ background: '#10B981' }} />
        <div className="absolute -top-24 right-48 w-60 h-60 rounded-full opacity-[0.04] blur-3xl pointer-events-none"
          style={{ background: '#06B6D4' }} />
        <div className="absolute top-0 left-0 right-0 h-[1px]"
          style={{ background: 'linear-gradient(90deg, transparent, #10B98140, #06B6D430, transparent)' }} />

        <div className="px-6 pt-6 pb-6">
          <div className="flex items-start gap-5 flex-wrap">
            {META.logo_url ? (
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${ACCENT}18, ${ACCENT}0E)`, border: `1px solid ${ACCENT}20` }}>
                <img
                  src={META.logo_url}
                  alt={META.artist_name}
                  className="w-full h-full object-contain p-2"
                  onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: `linear-gradient(135deg, ${ACCENT}22, ${ACCENT}14)`, border: `1px solid ${ACCENT}20` }}>
                <Library className="w-7 h-7" style={{ color: ACCENT }} />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <h1 className="text-[22px] font-bold text-white tracking-tight leading-none">{META.catalog_name}</h1>
                <span className="text-[9px] font-mono px-2.5 py-0.5 rounded-full tracking-widest border"
                  style={{ color: META.status_color, background: `${META.status_color}14`, borderColor: `${META.status_color}28` }}>
                  {META.status_label.toUpperCase()}
                </span>
              </div>
              <p className="text-[13px] text-white/50 mb-2.5">{META.company_name}</p>

              <div className="flex items-center gap-4 flex-wrap text-[10.5px] text-white/30">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3 h-3 text-white/20" />
                  <span className="text-white/50">{META.catalog_rep}</span>
                </span>
                <span className="text-white/15">·</span>
                <span className="flex items-center gap-1.5">
                  <Scale className="w-3 h-3 text-white/20" />
                  {META.attorney}
                </span>
                <span className="text-white/15">·</span>
                <span className="flex items-center gap-1.5">
                  <RefreshCw className="w-3 h-3 text-white/20" />
                  Updated {META.last_updated}
                </span>
                <span className="text-white/15">·</span>
                <span>{META.years_active}</span>
              </div>
            </div>

            <div className="shrink-0 hidden lg:flex items-center gap-2 px-3 py-2 rounded-lg border border-white/[0.07] bg-white/[0.02]">
              <Activity className="w-3 h-3 text-[#10B981] animate-pulse" />
              <span className="text-[10.5px] font-mono text-white/35">
                {now.toLocaleTimeString('en-US', { hour12: false })} UTC
              </span>
            </div>
          </div>

          <div className="mt-4 max-w-4xl">
            <p className="text-[12px] text-white/40 leading-relaxed">{META.description}</p>
            <p className="text-[11px] font-mono mt-2" style={{ color: `${ACCENT}88` }}>{META.strategic_focus}</p>
          </div>

          <div className="flex items-center gap-2.5 mt-5 flex-wrap">
            <button
              onClick={() => navigate('value')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-[11.5px] font-semibold border transition-all hover:bg-[#06B6D4]/[0.08]"
              style={{ borderColor: '#06B6D430', color: '#06B6D4', background: '#06B6D408' }}>
              <ArrowUpRight className="w-3.5 h-3.5" />
              Open Sale Room
            </button>
            <button
              onClick={() => openSubmit('catalog_os', META.catalog_name)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-[11.5px] font-semibold border border-white/[0.09] text-white/55 hover:text-white/80 hover:bg-white/[0.04] transition-all">
              <CheckSquare className="w-3.5 h-3.5" />
              Submit Task / Request
            </button>
            <button
              onClick={() => navigate('meetings')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-[11.5px] font-semibold border border-white/[0.09] text-white/55 hover:text-white/80 hover:bg-white/[0.04] transition-all">
              <FileText className="w-3.5 h-3.5" />
              Weekly Report
            </button>
            <div className="ml-auto flex items-center gap-2 text-[9.5px]">
              <span className="font-mono text-white/20 uppercase tracking-wider">Client since</span>
              <span className="font-mono text-white/40">{META.client_since}</span>
              <span className="font-mono text-white/20">·</span>
              <span className="font-mono text-white/20">{META.total_releases} releases</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-8">

        {/* ──────────────────────────────────────────────
            02. TOP METRICS ROW
        ─────────────────────────────────────────────── */}
        <section>
          <SectionDivider label="Top Metrics" index="02" accent="#10B981" />
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-9 gap-2.5">
            {METRICS_LIST.map(key => (
              <MetricTile key={key} m={METRICS[key]} />
            ))}
          </div>
        </section>

        {/* ──────────────────────────────────────────────
            03-A. TASK WIDGET
        ─────────────────────────────────────────────── */}
        <section>
          <TaskWidget system="catalog_os" entityName={META.catalog_name} accent={ACCENT} />
        </section>

        {/* ──────────────────────────────────────────────
            03. CURRENT STATUS / WHAT'S HAPPENING
        ─────────────────────────────────────────────── */}
        <section>
          <SectionDivider label="Current Status — What's Happening Now" index="03" accent="#F59E0B" />
          <div className="relative bg-[#0B0D10] border border-[#F59E0B]/15 rounded-2xl overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[1px]"
              style={{ background: 'linear-gradient(90deg, transparent, #F59E0B30, transparent)' }} />

            <div className="p-5">
              <div className="flex items-start gap-4 mb-5">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: '#F59E0B18', border: '1px solid #F59E0B25' }}>
                  <Target className="w-4 h-4 text-[#F59E0B]" />
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-white/90">{CURRENT_STATUS.headline}</h3>
                  <p className="text-[12px] text-white/45 leading-relaxed mt-1.5 max-w-3xl">{CURRENT_STATUS.summary}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 mb-5">
                {CURRENT_STATUS.dimensions.map(d => {
                  const sm = STATUS_DIM[d.status] ?? STATUS_DIM.active;
                  return (
                    <div key={d.label} className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.05]">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full animate-pulse shrink-0" style={{ background: d.color }} />
                        <span className="text-[11px] font-semibold text-white/75 flex-1 truncate">{d.label}</span>
                        <span className="text-[8px] font-mono px-1.5 py-0.5 rounded shrink-0"
                          style={{ color: sm.color, background: `${sm.color}14` }}>{sm.label}</span>
                      </div>
                      <p className="text-[10.5px] text-white/40 leading-relaxed">{d.detail}</p>
                    </div>
                  );
                })}
              </div>

              <div>
                <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Zap className="w-3 h-3 text-[#F59E0B]" /> Key Opportunities In Motion
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {CURRENT_STATUS.key_opportunities.map((op, i) => {
                    const um = URGENCY[op.urgency] ?? URGENCY.medium;
                    return (
                      <div key={i} className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border"
                        style={{ borderColor: `${um.color}22`, background: `${um.color}08` }}>
                        <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: um.color }} />
                        <div>
                          <p className="text-[11.5px] font-medium text-white/75">{op.label}</p>
                          <p className="text-[10px] mt-0.5 font-mono" style={{ color: um.color }}>{op.impact}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────
            04. BUSINESS ENTITY STACK
        ─────────────────────────────────────────────── */}
        <section>
          <SectionDivider label="Business Entity Stack" index="04" accent="#06B6D4" />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {ENTITIES.map(entity => {
              const EIcon = ENTITY_ICON_MAP[entity.icon] ?? Building2;
              const sm = STATUS_DIM[entity.status] ?? STATUS_DIM.active;
              const netPositive = !entity.net_monthly.startsWith('-');
              return (
                <div key={entity.id}
                  className="bg-[#0B0D10] border border-white/[0.06] rounded-2xl p-5 relative overflow-hidden hover:border-white/[0.11] transition-all group flex flex-col">
                  <div className="absolute top-0 left-0 right-0 h-[1px]"
                    style={{ background: `linear-gradient(90deg, transparent, ${entity.color}28, transparent)` }} />

                  <div className="flex items-start gap-3 mb-3.5">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: `${entity.color}14`, border: `1px solid ${entity.color}22` }}>
                      <EIcon className="w-[18px] h-[18px]" style={{ color: entity.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-[13px] font-bold text-white/90">{entity.name}</p>
                        <span className="text-[7.5px] font-mono px-1.5 py-0.5 rounded"
                          style={{ color: sm.color, background: `${sm.color}14` }}>{sm.label.toUpperCase()}</span>
                      </div>
                      <p className="text-[9.5px] text-white/30 mt-0.5">{entity.type}</p>
                    </div>
                  </div>

                  <p className="text-[10.5px] text-white/40 leading-relaxed mb-4 flex-1">{entity.description}</p>

                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {[
                      { label: 'Revenue',  value: entity.monthly_revenue,  color: '#10B981' },
                      { label: 'Expenses', value: entity.monthly_expenses, color: '#EF4444' },
                      { label: 'Net',      value: entity.net_monthly,       color: netPositive ? '#10B981' : '#EF4444' },
                    ].map(kpi => (
                      <div key={kpi.label} className="text-center px-1 py-2 rounded-lg bg-white/[0.03]">
                        <p className="text-[8px] text-white/20 mb-0.5 font-mono">{kpi.label}</p>
                        <p className="text-[11px] font-bold leading-tight" style={{ color: kpi.color }}>{kpi.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[9.5px] font-mono text-white/20">{entity.active_projects} active</span>
                    <div className="flex-1 h-[1px] bg-white/[0.04]" />
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {entity.services.map(svc => (
                      <span key={svc} className="text-[8.5px] font-mono px-1.5 py-0.5 rounded bg-white/[0.05] text-white/25 border border-white/[0.05]">
                        {svc}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => navigate('entities')}
                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10.5px] font-medium border transition-all"
                    style={{ borderColor: `${entity.color}25`, color: entity.color, background: `${entity.color}08` }}>
                    <ExternalLink className="w-3 h-3" />
                    Open {entity.name.split(' ')[0]}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* ──────────────────────────────────────────────
            05. WEEKLY SNAPSHOT
        ─────────────────────────────────────────────── */}
        <section>
          <SectionDivider label="Weekly Snapshot" index="05" accent="#8B5CF6" />
          <div className="bg-[#0B0D10] border border-[#8B5CF6]/12 rounded-2xl overflow-hidden">

            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: '#8B5CF618', border: '1px solid #8B5CF625' }}>
                  <BarChart2 className="w-3.5 h-3.5 text-[#8B5CF6]" />
                </div>
                <div>
                  <p className="text-[12.5px] font-semibold text-white/80">{WEEKLY_SNAPSHOT.week_of}</p>
                  <p className="text-[9.5px] text-white/20 font-mono">Generated {WEEKLY_SNAPSHOT.generated} · {META.last_updated_by}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#10B981]/20 bg-[#10B981]/[0.06]">
                <TrendingUp className="w-3 h-3 text-[#10B981]" />
                <span className="text-[10px] text-[#10B981] font-mono">{WEEKLY_SNAPSHOT.revenue_movement.vs_prior_week} WoW</span>
              </div>
            </div>

            <div className="p-5 grid grid-cols-1 xl:grid-cols-[1fr_1fr_300px] gap-5">
              <div>
                <p className="text-[9px] font-mono text-[#10B981]/60 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <CheckSquare className="w-3 h-3 text-[#10B981]" /> Key Wins
                </p>
                <div className="space-y-2">
                  {WEEKLY_SNAPSHOT.wins.map((win, i) => (
                    <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#10B981]/[0.05] border border-[#10B981]/[0.1]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] shrink-0 mt-1.5" />
                      <p className="text-[11px] text-white/60 leading-relaxed">{win}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[9px] font-mono text-[#EF4444]/60 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <AlertCircle className="w-3 h-3 text-[#EF4444]" /> Issues to Address
                </p>
                <div className="space-y-2">
                  {WEEKLY_SNAPSHOT.issues.map((issue, i) => (
                    <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#EF4444]/[0.05] border border-[#EF4444]/[0.1]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#EF4444] shrink-0 mt-1.5" />
                      <p className="text-[11px] text-white/60 leading-relaxed">{issue}</p>
                    </div>
                  ))}
                </div>
                <p className="text-[9px] font-mono text-[#F59E0B]/60 uppercase tracking-widest mb-3 mt-4 flex items-center gap-2">
                  <Zap className="w-3 h-3 text-[#F59E0B]" /> New Opportunities
                </p>
                <div className="space-y-2">
                  {WEEKLY_SNAPSHOT.new_opportunities.map((op, i) => (
                    <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#F59E0B]/[0.05] border border-[#F59E0B]/[0.1]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] shrink-0 mt-1.5" />
                      <p className="text-[11px] text-white/60 leading-relaxed">{op}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.05]">
                  <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest mb-2">Revenue Movement</p>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-[#10B981]" />
                    <span className="text-[20px] font-bold text-[#10B981]">{WEEKLY_SNAPSHOT.revenue_movement.vs_prior_week}</span>
                  </div>
                  <p className="text-[10px] text-white/35 mb-1">Top mover: <span className="text-white/60">{WEEKLY_SNAPSHOT.revenue_movement.top_mover}</span></p>
                  <p className="text-[10px] text-[#10B981]/70">{WEEKLY_SNAPSHOT.revenue_movement.surprise}</p>
                </div>

                <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.05]">
                  <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest mb-2">Progress Summary</p>
                  <p className="text-[10.5px] text-white/45 leading-relaxed">{WEEKLY_SNAPSHOT.progress_summary}</p>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                  <Video className="w-4 h-4 text-white/20" />
                  <span className="text-[10.5px] text-white/25">No all-hands video this week</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────
            06. ACTIVE TASKS + TEAM WORKFLOW
        ─────────────────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[1px] w-3 bg-[#06B6D4]/30" />
            <span className="text-[10px] font-mono tracking-[0.16em] uppercase font-semibold text-[#06B6D4]/70">06 · Active Tasks + Team Workflow</span>
            <div className="flex-1 h-[1px] bg-white/[0.04]" />
            {flaggedTasks.length > 0 && (
              <span className="text-[8.5px] font-mono px-2 py-0.5 rounded bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20">
                {flaggedTasks.length} FLAGGED
              </span>
            )}
            <button className="flex items-center gap-1 text-[10px] text-[#06B6D4]/50 hover:text-[#06B6D4] transition-colors font-mono">
              View All <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="bg-[#0B0D10] border border-white/[0.06] rounded-2xl overflow-hidden">
            <div className="grid grid-cols-[14px_1fr_130px_90px_110px_100px_28px] items-center gap-3 px-4 py-2.5 border-b border-white/[0.05]">
              {['', 'Task', 'Assignee', 'Category', 'Due', 'Status', ''].map((h, i) => (
                <span key={i} className="text-[8px] font-mono text-white/20 uppercase tracking-wider">{h}</span>
              ))}
            </div>

            {openTasks.map((task, i) => {
              const pm = TASK_PRIORITY[task.priority] ?? TASK_PRIORITY.medium;
              const sm = STATUS_DIM[task.status] ?? STATUS_DIM.open;
              return (
                <div key={task.id}
                  className={`grid grid-cols-[14px_1fr_130px_90px_110px_100px_28px] items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-all
                  ${i < openTasks.length - 1 ? 'border-b border-white/[0.04]' : ''}
                  ${task.flagged ? 'bg-[#EF4444]/[0.03]' : ''}`}>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: pm.color }} />

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-[11.5px] text-white/80 truncate">{task.title}</p>
                      {task.flagged && <Flag className="w-3 h-3 text-[#EF4444] shrink-0" />}
                    </div>
                    {task.notes > 0 && (
                      <span className="text-[8.5px] text-white/22 flex items-center gap-1 mt-0.5">
                        <MessageSquare className="w-2.5 h-2.5" /> {task.notes} note{task.notes > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 min-w-0">
                    {task.ai
                      ? <Bot className="w-3 h-3 text-[#06B6D4] shrink-0" />
                      : <User className="w-3 h-3 text-white/20 shrink-0" />
                    }
                    <span className="text-[9.5px] text-white/40 truncate">{task.assignee}</span>
                  </div>

                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/[0.05] text-white/30 truncate">{task.category}</span>

                  <span className="text-[9.5px] font-mono text-white/30 flex items-center gap-1">
                    <Clock className="w-3 h-3 shrink-0 text-white/20" />
                    <span className="truncate">{task.due.replace(', 2026', '')}</span>
                  </span>

                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded whitespace-nowrap"
                    style={{ color: sm.color, background: `${sm.color}12` }}>{sm.label}</span>

                  <ChevronRight className="w-3.5 h-3.5 text-white/15 justify-self-end" />
                </div>
              );
            })}
          </div>
        </section>

        {/* ──────────────────────────────────────────────
            07. 12-MONTH OPERATING PLAN PREVIEW
        ─────────────────────────────────────────────── */}
        <section>
          <SectionDivider label="12-Month Operating Plan" index="07" accent="#A3E635" />

          {/* Outcome targets strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
            {EXPECTED_ANNUAL_OUTCOMES.map(o => (
              <div key={o.label} className="bg-[#0B0D10] border border-white/[0.06] rounded-xl p-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[1px]"
                  style={{ background: `linear-gradient(90deg, transparent, ${o.color}30, transparent)` }} />
                <p className="text-[9px] font-mono text-white/20 uppercase tracking-wider mb-1.5">{o.label}</p>
                <p className="text-[19px] font-bold" style={{ color: o.color }}>{o.value}</p>
              </div>
            ))}
          </div>

          {/* Premium roadmap widget */}
          <div className="bg-[#0B0D10] border border-[#A3E635]/15 rounded-2xl overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[1px]"
              style={{ background: 'linear-gradient(90deg, transparent, #A3E63525, transparent)' }} />

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: '#A3E63514', border: '1px solid #A3E63522' }}>
                  <Calendar className="w-3.5 h-3.5" style={{ color: '#A3E635' }} />
                </div>
                <div>
                  <p className="text-[12.5px] font-semibold text-white/80">Strategic Operating Roadmap</p>
                  <p className="text-[10px] text-white/30">Apr 2026 – Mar 2027 · 12 months · 30 initiatives</p>
                </div>
              </div>
              <a href="/catalog/app/timeline"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10.5px] font-semibold transition-all hover:opacity-85"
                style={{ background: '#A3E63515', color: '#A3E635', border: '1px solid #A3E63525' }}>
                View Full Plan <ChevronRight className="w-3 h-3" />
              </a>
            </div>

            {/* Quarter swimlanes */}
            <div className="p-4 space-y-4">
              {[
                {
                  q: 'Q1 2026', color: '#6B7280', past: true,
                  items: [
                    { icon: Scale,      label: 'GMG Engagement + Onboarding',    rev: 'Completed',  status: 'completed' },
                    { icon: Library,    label: 'Full Catalog Audit + Data Ingest',rev: 'Completed', status: 'completed' },
                    { icon: Megaphone,  label: 'Streaming Health Baseline',      rev: 'Completed',  status: 'completed' },
                    { icon: Heart,      label: 'ZFM Platform Assessment',        rev: 'Completed',  status: 'completed' },
                    { icon: Zap,        label: 'Sync Pipeline Review + Setup',   rev: 'Completed',  status: 'completed' },
                  ],
                },
                {
                  q: 'Q2 2026', color: '#10B981', past: false,
                  items: [
                    { icon: Zap,        label: '"Butterfly" Netflix Sync',      rev: '$80K–$220K', status: 'in_progress' },
                    { icon: Megaphone,  label: 'Spotify Marquee Campaign',       rev: '+$35K/mo',   status: 'in_progress' },
                    { icon: Heart,      label: 'ZFM Vault Drop Vol. 2',          rev: '$40K–$80K',  status: 'in_progress' },
                    { icon: Heart,      label: 'ZFM Subscription Tier Launch',   rev: '+$22K/mo',   status: 'planned'     },
                    { icon: Scale,      label: 'Sub-Publishing Renewal',         rev: '+$8K–$14K',  status: 'planned'     },
                  ],
                },
                {
                  q: 'Q3 2026', color: '#06B6D4',
                  items: [
                    { icon: Music,      label: 'ZFM Vault Drop Vol. 3 — EP',     rev: '$60K–$120K', status: 'planned' },
                    { icon: Zap,        label: 'Gaming Sync — AAA Titles',        rev: '$80K–$320K', status: 'planned' },
                    { icon: Music,      label: 'New EP — Production Window',      rev: '$200K–$600K',status: 'planned' },
                    { icon: ShoppingBag,label: 'Fall Merch Collection Design',    rev: '$80K–$140K', status: 'planned' },
                  ],
                },
                {
                  q: 'Q4 2026', color: '#F59E0B',
                  items: [
                    { icon: Zap,        label: 'Holiday Sync Pitch — Film + TV',  rev: '$60K–$180K', status: 'planned' },
                    { icon: Mic2,       label: 'Touring Reactivation Planning',   rev: '$180K–$480K',status: 'planned' },
                    { icon: Megaphone,  label: 'Holiday Catalog Campaign',        rev: '$380K–$440K',status: 'planned' },
                    { icon: ShoppingBag,label: 'Holiday Merch Drop',              rev: '$90K–$140K', status: 'planned' },
                    { icon: Shield,     label: 'Brand Rehab Phase 3 Milestone',   rev: undefined,    status: 'planned' },
                  ],
                },
                {
                  q: 'Q1 2027', color: '#3B82F6',
                  items: [
                    { icon: Mic2,       label: 'Touring Announcement — Public',   rev: '$250K–$600K',status: 'planned' },
                    { icon: Rocket,     label: 'Brand Partnership Expansion',     rev: '$60K–$180K', status: 'planned' },
                    { icon: Scale,      label: 'Voltage Sessions Co-Pub Renewal', rev: '+$4K–$8K/mo',status: 'planned' },
                  ],
                },
              ].map(q => {
                const isPast = (q as { past?: boolean }).past === true;
                return (
                  <div key={q.q} className={`space-y-1.5 ${isPast ? 'opacity-50' : ''}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-[1px] w-4" style={{ background: q.color }} />
                      <span className="text-[9px] font-mono tracking-[0.14em] uppercase font-bold" style={{ color: q.color }}>{q.q}</span>
                      {isPast && (
                        <span className="text-[7.5px] font-mono px-1.5 py-0.5 rounded bg-white/[0.04] text-white/25 tracking-wider">COMPLETED</span>
                      )}
                      <div className="flex-1 h-[1px] bg-white/[0.04]" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5">
                      {q.items.map((item, i) => {
                        const ItemIcon = item.icon;
                        const isActive = item.status === 'in_progress';
                        const isDone = item.status === 'completed';
                        return (
                          <div key={i} className="flex items-center gap-2.5 px-3 py-2 rounded-lg border transition-all"
                            style={{
                              background: isActive ? `${q.color}08` : isDone ? 'rgba(255,255,255,0.015)' : 'rgba(255,255,255,0.02)',
                              borderColor: isActive ? `${q.color}20` : isDone ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.05)',
                            }}>
                            <ItemIcon className="w-3 h-3 shrink-0" style={{ color: isActive ? q.color : `${q.color}50` }} />
                            <div className="flex-1 min-w-0">
                              <p className={`text-[10.5px] truncate ${isDone ? 'text-white/30 line-through' : 'text-white/60'}`}>{item.label}</p>
                              {item.rev && (
                                <p className="text-[8.5px] font-mono" style={{ color: isDone ? `rgba(255,255,255,0.2)` : `${q.color}90` }}>{item.rev}</p>
                              )}
                            </div>
                            {isActive && (
                              <div className="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse" style={{ background: q.color }} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer summary */}
            <div className="px-5 py-3.5 border-t border-white/[0.05] flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-4">
                {[
                  { label: 'Total 12-Mo Opportunity', value: '$2.8M–$4.2M', color: '#10B981' },
                  { label: 'Catalog Value Target',    value: '$7.2M–$9.4M', color: '#06B6D4' },
                ].map(item => (
                  <div key={item.label}>
                    <p className="text-[8.5px] font-mono text-white/20 uppercase">{item.label}</p>
                    <p className="text-[13px] font-bold" style={{ color: item.color }}>{item.value}</p>
                  </div>
                ))}
              </div>
              <a href="/catalog/app/timeline"
                className="flex items-center gap-1.5 text-[10px] text-white/30 hover:text-[#A3E635] transition-colors">
                Full operating plan <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────
            08. AI RECOMMENDATIONS PANEL
        ─────────────────────────────────────────────── */}
        <section>
          <SectionDivider label="AI Recommendations" index="08" accent="#EC4899" />
          <div className="space-y-3">
            {AI_RECOMMENDATIONS.map((rec, i) => {
              const um = URGENCY[rec.urgency] ?? URGENCY.medium;
              return (
                <div key={i}
                  className="bg-[#0B0D10] border border-white/[0.06] rounded-2xl p-5 relative overflow-hidden hover:border-white/[0.1] transition-all">
                  <div className="absolute top-0 left-0 right-0 h-[1px]"
                    style={{ background: `linear-gradient(90deg, transparent, ${um.color}25, transparent)` }} />

                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: `${um.color}14`, border: `1px solid ${um.color}22` }}>
                      <Bot className="w-[18px] h-[18px]" style={{ color: um.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap mb-2">
                        <span className="text-[8.5px] font-mono px-2 py-0.5 rounded-full font-bold tracking-wider"
                          style={{ color: um.color, background: `${um.color}15`, border: `1px solid ${um.color}25` }}>
                          {rec.verdict}
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/[0.05] text-white/30">{rec.category.toUpperCase()}</span>
                        <h3 className="text-[13px] font-semibold text-white/85">{rec.title}</h3>
                      </div>
                      <p className="text-[11.5px] text-white/45 leading-relaxed mb-3">{rec.body}</p>
                      <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg"
                        style={{ background: `${um.color}08`, border: `1px solid ${um.color}15` }}>
                        <ArrowUpRight className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: um.color }} />
                        <p className="text-[11px] text-white/65 leading-relaxed">{rec.action}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ──────────────────────────────────────────────
            09. CATALOG OPERATOR TEAM
        ─────────────────────────────────────────────── */}
        <section>
          <SectionDivider label="Catalog Operator Team" index="09" accent="#10B981" />
          <div className="bg-[#0B0D10] border border-[#10B981]/10 rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[1px]"
              style={{ background: 'linear-gradient(90deg, transparent, #10B98130, transparent)' }} />
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: '#10B98114', border: '1px solid #10B98122' }}>
                  <Users className="w-3.5 h-3.5 text-[#10B981]" />
                </div>
                <div>
                  <h3 className="text-[13px] font-bold text-white/85 leading-none">AI Operator Team</h3>
                  <p className="text-[9.5px] text-white/30 mt-0.5">Catalog operations, growth, rights, fan, and reporting coverage</p>
                </div>
              </div>
              <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#10B981]/20 bg-[#10B981]/[0.07]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                <span className="text-[8px] font-mono text-[#10B981] tracking-wider">ALL SYSTEMS ACTIVE</span>
              </div>
            </div>
            <OperatorTeamGrid variant="label" compact labelContext="Catalog OS" />
          </div>
        </section>

        {/* ──────────────────────────────────────────────
            10. ACCOUNTING / TRANSPARENCY PREVIEW
        ─────────────────────────────────────────────── */}
        <section>
          <SectionDivider label="Accounting + Transparency" index="10" accent="#3B82F6" />
          <div className="bg-[#0B0D10] border border-white/[0.06] rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-white/[0.05] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <DollarSign className="w-4 h-4 text-[#3B82F6]" />
                <span className="text-[12.5px] font-semibold text-white/70">Financial Snapshot — Consolidated (All Entities)</span>
              </div>
              <span className="text-[9.5px] font-mono text-white/20">As of {META.last_updated}</span>
            </div>

            <div className="px-5 pt-3 pb-0">
              <div className="grid grid-cols-[130px_1fr_1fr_1fr] gap-4 py-2 border-b border-white/[0.04] mb-0">
                {['Period', 'Revenue', 'Expenses', 'Net'].map(h => (
                  <span key={h} className="text-[8.5px] font-mono text-white/15 uppercase tracking-wider">{h}</span>
                ))}
              </div>
              <AccountingRow label="This Week"    data={ACCOUNTING.this_week}         />
              <AccountingRow label="Month to Date" data={ACCOUNTING.month_to_date}    />
              <AccountingRow label="Quarter to Date" data={ACCOUNTING.quarter_to_date} />
              <AccountingRow label="Year to Date"  data={ACCOUNTING.year_to_date}     />
            </div>

            <div className="px-5 py-4 border-t border-white/[0.05] flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-[9px] font-mono text-white/20 mb-1 uppercase tracking-wider">Top Expense This Month</p>
                <p className="text-[11.5px] text-white/55">{ACCOUNTING.top_expense_this_month}</p>
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                {ACCOUNTING.revenue_sources.map(src => (
                  <div key={src.label} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: src.color }} />
                    <span className="text-[9.5px] text-white/35">{src.label}</span>
                    <span className="text-[9.5px] font-bold" style={{ color: src.color }}>{src.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────
            11. CONNECTED COMMUNICATIONS
        ─────────────────────────────────────────────── */}
        <section>
          <SectionDivider label="Connected Communications" index="11" accent="#06B6D4" />
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-4">

            <div className="bg-[#0B0D10] border border-[#06B6D4]/15 rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[1px]"
                style={{ background: 'linear-gradient(90deg, transparent, #06B6D435, transparent)' }} />

              <div className="flex items-start gap-4 mb-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: '#06B6D418', border: '1px solid #06B6D425' }}>
                  <Mail className="w-5 h-5 text-[#06B6D4]" />
                </div>
                <div>
                  <div className="flex items-center gap-2.5 mb-1">
                    <h3 className="text-[14px] font-bold text-white/90">Dedicated Catalog Email</h3>
                    <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-[#10B981]/20 bg-[#10B981]/[0.07]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                      <span className="text-[8px] font-mono text-[#10B981] tracking-wider">AI OPERATOR ACTIVE</span>
                    </div>
                  </div>
                  <p className="text-[15px] font-mono font-bold text-[#06B6D4]">{COMMS.email}</p>
                </div>
              </div>

              <p className="text-[12px] text-white/40 leading-relaxed mb-4">{COMMS.description}</p>

              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] mb-5">
                <Bot className="w-4 h-4 text-[#06B6D4] shrink-0" />
                <p className="text-[11px] text-white/45">
                  <span className="text-white/65 font-medium">SLA:</span> {COMMS.response_sla}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[11.5px] font-semibold transition-all hover:opacity-90"
                  style={{ background: '#06B6D4', color: '#000' }}>
                  <Send className="w-3.5 h-3.5" />
                  Submit Task / Request
                </button>
                <a href={`mailto:${COMMS.email}`}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[11.5px] font-medium border border-[#06B6D4]/25 text-[#06B6D4] hover:bg-[#06B6D4]/[0.08] transition-all">
                  <Mail className="w-3.5 h-3.5" />
                  Open Email
                </a>
              </div>
            </div>

            <div className="bg-[#0B0D10] border border-white/[0.06] rounded-2xl overflow-hidden flex flex-col">
              <div className="px-4 py-3.5 border-b border-white/[0.05] flex items-center justify-between shrink-0">
                <span className="text-[11.5px] font-semibold text-white/55">Recent Threads</span>
                <span className="text-[8.5px] font-mono px-2 py-0.5 rounded bg-[#06B6D4]/10 text-[#06B6D4] border border-[#06B6D4]/20">INBOX</span>
              </div>
              <div className="flex-1 divide-y divide-white/[0.04]">
                {COMMS.recent_threads.map((thread, i) => (
                  <div key={i}
                    className={`px-4 py-3.5 hover:bg-white/[0.02] transition-all cursor-pointer ${thread.unread ? 'bg-[#06B6D4]/[0.025]' : ''}`}>
                    <div className="flex items-start gap-2.5">
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 mt-1.5 ${thread.unread ? 'bg-[#06B6D4]' : 'bg-transparent'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10.5px] font-medium text-white/65 truncate">{thread.from}</p>
                        <p className="text-[10.5px] text-white/35 truncate mt-0.5">{thread.subject}</p>
                      </div>
                      <span className="text-[9px] font-mono text-white/20 shrink-0 ml-2">{thread.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 border-t border-white/[0.04] shrink-0">
                <button className="w-full text-center text-[10.5px] font-mono text-[#06B6D4]/55 hover:text-[#06B6D4] transition-colors">
                  View Full Inbox →
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="h-6" />
      </div>
    </div>
  );
}
