import { useState } from 'react';
import {
  Users, Music, DollarSign, TrendingUp, BarChart2, Star,
  ArrowUpRight, Activity, Globe, Calendar, AlertCircle, CheckCircle,
} from 'lucide-react';
import CatalogPageHeader from './CatalogPageHeader';
import { useCatalogClient } from '../../context/CatalogClientContext';
import {
  CatalogClientArtist, ARTIST_ROLE_META, CLIENT_TYPE_META, ArtistStatus,
} from '../../data/catalogClientService';

const STATUS_META: Record<ArtistStatus, { label: string; color: string }> = {
  active:   { label: 'Active',   color: '#10B981' },
  inactive: { label: 'Inactive', color: '#6B7280' },
  on_hold:  { label: 'On Hold',  color: '#F59E0B' },
  exit:     { label: 'Exited',   color: '#EF4444' },
};

function fmt(n?: number | null) {
  if (!n) return '—';
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

function PillBadge({ label, color }: { label: string; color: string }) {
  return (
    <span className="text-[8.5px] font-mono px-1.5 py-0.5 rounded uppercase"
      style={{ color, background: `${color}14`, border: `1px solid ${color}22` }}>
      {label}
    </span>
  );
}

function ArtistCard({ artist, rank, accent }: { artist: CatalogClientArtist; rank: number; accent: string }) {
  const sm = STATUS_META[artist.status];
  const rm = ARTIST_ROLE_META[artist.artist_role];
  const pct = artist.catalog_value_est && artist.monthly_revenue_est
    ? ((artist.monthly_revenue_est * 12) / artist.catalog_value_est * 100).toFixed(1)
    : null;

  return (
    <div className="bg-[#0B0D10] border border-white/[0.06] rounded-2xl p-4 hover:border-white/[0.10] hover:bg-[#0D0F14] transition-all group">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold text-[13px]"
          style={{ background: `${accent}14`, border: `1px solid ${accent}22`, color: accent }}>
          {rank}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-[13px] font-bold text-white/80 truncate group-hover:text-white/95 transition-colors">
              {artist.artist_name}
            </p>
            {artist.is_primary && <Star className="w-3 h-3 text-[#F59E0B] shrink-0 fill-current" />}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {artist.genre && (
              <span className="text-[9.5px] text-white/25">{artist.genre}</span>
            )}
            <PillBadge label={rm.label} color={rm.color} />
            <PillBadge label={sm.label} color={sm.color} />
          </div>
        </div>
        <ArrowUpRight className="w-3.5 h-3.5 text-white/15 group-hover:text-white/40 shrink-0 transition-colors mt-0.5" />
      </div>

      <div className="grid grid-cols-3 gap-2 mt-3">
        <div className="bg-white/[0.025] rounded-xl px-2.5 py-2">
          <p className="text-[8px] font-mono text-white/20 uppercase mb-0.5">Catalog Value</p>
          <p className="text-[13px] font-bold" style={{ color: accent }}>{fmt(artist.catalog_value_est)}</p>
        </div>
        <div className="bg-white/[0.025] rounded-xl px-2.5 py-2">
          <p className="text-[8px] font-mono text-white/20 uppercase mb-0.5">Monthly Rev</p>
          <p className="text-[13px] font-bold text-white/65">{fmt(artist.monthly_revenue_est)}</p>
        </div>
        <div className="bg-white/[0.025] rounded-xl px-2.5 py-2">
          <p className="text-[8px] font-mono text-white/20 uppercase mb-0.5">Annual Yield</p>
          <p className="text-[13px] font-bold text-[#A3E635]">{pct ? `${pct}%` : '—'}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-3 pt-2.5 border-t border-white/[0.04]">
        {artist.total_releases !== undefined && artist.total_releases > 0 && (
          <span className="flex items-center gap-1 text-[9.5px] font-mono text-white/20">
            <Music className="w-3 h-3" /> {artist.total_releases} releases
          </span>
        )}
        {artist.total_streams_alltime && (
          <span className="flex items-center gap-1 text-[9.5px] font-mono text-white/20">
            <Activity className="w-3 h-3" /> {artist.total_streams_alltime} streams
          </span>
        )}
        {artist.signed_date && (
          <span className="flex items-center gap-1 text-[9.5px] font-mono text-white/20">
            <Calendar className="w-3 h-3" /> Since {artist.signed_date}
          </span>
        )}
      </div>
    </div>
  );
}

function PortfolioTable({ artists, accent }: { artists: CatalogClientArtist[]; accent: string }) {
  const totalValue = artists.reduce((s, a) => s + (a.catalog_value_est ?? 0), 0);
  const totalRevenue = artists.reduce((s, a) => s + (a.monthly_revenue_est ?? 0), 0);

  return (
    <div className="bg-[#0B0D10] border border-white/[0.06] rounded-2xl overflow-hidden">
      <div className="grid grid-cols-7 px-5 py-2.5 border-b border-white/[0.05] text-[8.5px] font-mono text-white/20 uppercase tracking-widest">
        <span className="col-span-2">Artist / Catalog</span>
        <span>Genre</span>
        <span>Role</span>
        <span className="text-right">Catalog Value</span>
        <span className="text-right">Monthly Rev</span>
        <span className="text-right">Status</span>
      </div>
      {artists.map((a, i) => {
        const sm = STATUS_META[a.status];
        const rm = ARTIST_ROLE_META[a.artist_role];
        return (
          <div key={a.id}
            className="grid grid-cols-7 items-center px-5 py-3 border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02] transition-colors">
            <div className="col-span-2 flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0"
                style={{ background: `${accent}10`, color: accent }}>
                {i + 1}
              </div>
              <div>
                <p className="text-[11.5px] font-semibold text-white/65">{a.artist_name}</p>
                {a.is_primary && (
                  <span className="text-[8px] font-mono" style={{ color: accent }}>Primary</span>
                )}
              </div>
            </div>
            <span className="text-[10.5px] text-white/30 truncate">{a.genre ?? '—'}</span>
            <span>
              <PillBadge label={rm.label} color={rm.color} />
            </span>
            <span className="text-right text-[11.5px] font-bold" style={{ color: accent }}>{fmt(a.catalog_value_est)}</span>
            <span className="text-right text-[11.5px] text-white/50">{fmt(a.monthly_revenue_est)}</span>
            <span className="text-right">
              <PillBadge label={sm.label} color={sm.color} />
            </span>
          </div>
        );
      })}
      <div className="grid grid-cols-7 items-center px-5 py-3 bg-white/[0.02] border-t border-white/[0.05]">
        <div className="col-span-3">
          <p className="text-[9.5px] font-mono text-white/20 uppercase">Portfolio Total</p>
        </div>
        <span />
        <span className="text-right text-[13px] font-bold" style={{ color: accent }}>{fmt(totalValue)}</span>
        <span className="text-right text-[13px] font-bold text-white/50">{fmt(totalRevenue)}</span>
        <span />
      </div>
    </div>
  );
}

export default function COSRoster() {
  const { activeClient, loading } = useCatalogClient();
  const [view, setView] = useState<'cards' | 'table'>('cards');

  if (loading || !activeClient) {
    return (
      <div className="min-h-full bg-[#07080A] flex items-center justify-center">
        <p className="text-[11px] text-white/20">Loading roster...</p>
      </div>
    );
  }

  const typeMeta = CLIENT_TYPE_META[activeClient.type];
  const accent = activeClient.accent_color;
  const artists = activeClient.artists ?? [];
  const active = artists.filter(a => a.status === 'active');
  const onHold = artists.filter(a => a.status === 'on_hold');
  const totalValue = artists.reduce((s, a) => s + (a.catalog_value_est ?? 0), 0);
  const totalRevenue = artists.reduce((s, a) => s + (a.monthly_revenue_est ?? 0), 0);
  const annualYield = totalValue > 0 ? ((totalRevenue * 12) / totalValue * 100).toFixed(1) : '—';

  return (
    <div className="min-h-full bg-[#07080A]">
      <CatalogPageHeader
        icon={Users}
        title={`${activeClient.name} — Roster`}
        subtitle={`${typeMeta.label} · ${artists.length} artist${artists.length !== 1 ? 's' : ''} · ${activeClient.territory ?? 'Worldwide'}`}
        accentColor={accent}
        badge={typeMeta.label}
        actions={
          <div className="flex items-center gap-1.5 bg-white/[0.04] border border-white/[0.07] rounded-xl p-1">
            {(['cards', 'table'] as const).map(v => (
              <button key={v} onClick={() => setView(v)}
                className="px-3 py-1.5 rounded-lg text-[10.5px] font-medium capitalize transition-all"
                style={view === v ? { background: `${accent}18`, color: accent, border: `1px solid ${accent}28` }
                  : { color: 'rgba(255,255,255,0.3)', border: '1px solid transparent' }}>
                {v}
              </button>
            ))}
          </div>
        }
      />

      <div className="px-5 py-4 space-y-5">
        {/* Summary KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {[
            { label: 'Total Artists',     value: artists.length.toString(),                    color: accent,     icon: Users },
            { label: 'Active',            value: active.length.toString(),                      color: '#10B981',  icon: CheckCircle },
            { label: 'Portfolio Value',   value: fmt(totalValue),                               color: accent,     icon: DollarSign },
            { label: 'Monthly Revenue',   value: fmt(totalRevenue),                             color: '#06B6D4',  icon: TrendingUp },
            { label: 'Annual Yield',      value: `${annualYield}%`,                             color: '#A3E635',  icon: BarChart2 },
          ].map(({ label, value, color, icon: Icon }) => (
            <div key={label} className="bg-[#0B0D10] border border-white/[0.06] rounded-xl p-3.5">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Icon className="w-3 h-3" style={{ color }} />
                <p className="text-[8.5px] font-mono text-white/20 uppercase tracking-wide">{label}</p>
              </div>
              <p className="text-[18px] font-bold" style={{ color }}>{value}</p>
            </div>
          ))}
        </div>

        {onHold.length > 0 && (
          <div className="flex items-start gap-2.5 bg-[#F59E0B]/[0.05] border border-[#F59E0B]/20 rounded-xl px-4 py-3">
            <AlertCircle className="w-3.5 h-3.5 text-[#F59E0B] shrink-0 mt-0.5" />
            <p className="text-[10.5px] text-[#F59E0B]/70">
              {onHold.length} artist{onHold.length > 1 ? 's' : ''} currently on hold: {onHold.map(a => a.artist_name).join(', ')}
            </p>
          </div>
        )}

        {/* Territory / scope bar */}
        <div className="flex items-center gap-4 bg-white/[0.02] border border-white/[0.05] rounded-xl px-4 py-3">
          <Globe className="w-3.5 h-3.5 text-white/20 shrink-0" />
          <div className="flex items-center gap-6 flex-wrap">
            <div>
              <p className="text-[8px] font-mono text-white/15 uppercase">Territory</p>
              <p className="text-[10.5px] text-white/40">{activeClient.territory ?? 'Worldwide'}</p>
            </div>
            <div>
              <p className="text-[8px] font-mono text-white/15 uppercase">Client Since</p>
              <p className="text-[10.5px] text-white/40">{activeClient.client_since ?? '—'}</p>
            </div>
            <div>
              <p className="text-[8px] font-mono text-white/15 uppercase">Catalog Rep</p>
              <p className="text-[10.5px] text-white/40">{activeClient.catalog_rep ?? 'GMG Catalog Team'}</p>
            </div>
            {activeClient.total_releases && (
              <div>
                <p className="text-[8px] font-mono text-white/15 uppercase">Total Releases</p>
                <p className="text-[10.5px] text-white/40">{activeClient.total_releases}</p>
              </div>
            )}
          </div>
        </div>

        {/* Roster body */}
        {view === 'cards' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {artists.map((a, i) => (
              <ArtistCard key={a.id} artist={a} rank={i + 1} accent={accent} />
            ))}
          </div>
        ) : (
          <PortfolioTable artists={artists} accent={accent} />
        )}
      </div>
    </div>
  );
}
