import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ChevronDown, ChevronUp, Search, SlidersHorizontal, ChevronRight } from 'lucide-react';
import StatusTag from '../components/StatusTag';
import AIInsightPanel from '../components/AIInsightPanel';
import { ARTISTS } from '../data/mockData';

type SortKey = 'name' | 'streams' | 'revenue' | 'velocity' | 'campaigns';
type SortDir = 'asc' | 'desc';

function parseNum(val: string) {
  return parseFloat(val.replace(/[^0-9.-]/g, ''));
}

export default function ArtistRoster() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('streams');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [statusFilter, setStatusFilter] = useState('All');
  const [expanded, setExpanded] = useState<string | null>(null);

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  }

  const statuses = ['All', ...Array.from(new Set(ARTISTS.map(a => a.status)))];

  const filtered = ARTISTS
    .filter(a => {
      const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) ||
                          a.genre.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'All' || a.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      let av: number, bv: number;
      if (sortKey === 'name') return sortDir === 'asc'
        ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      if (sortKey === 'streams') { av = parseNum(a.streams); bv = parseNum(b.streams); }
      else if (sortKey === 'revenue') { av = parseNum(a.revenue); bv = parseNum(b.revenue); }
      else if (sortKey === 'velocity') { av = parseNum(a.velocity); bv = parseNum(b.velocity); }
      else { av = a.campaigns; bv = b.campaigns; }
      return sortDir === 'asc' ? av - bv : bv - av;
    });

  function SortIcon({ k }: { k: SortKey }) {
    if (sortKey !== k) return <ChevronDown className="w-3 h-3 text-white/15" />;
    return sortDir === 'asc'
      ? <ChevronUp className="w-3 h-3 text-[#06B6D4]" />
      : <ChevronDown className="w-3 h-3 text-[#06B6D4]" />;
  }

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-[#10B981]" />
            <h1 className="text-[20px] font-bold text-white tracking-tight font-['Satoshi',sans-serif]">Artist Roster</h1>
          </div>
          <p className="text-[12px] text-white/30">{ARTISTS.length} total artists · {ARTISTS.filter(a => a.status === 'Scaling').length} scaling · {ARTISTS.filter(a => a.status === 'Blocked' || a.status === 'Risk').length} require attention</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-white/[0.08] bg-white/[0.03] text-[11px] text-white/50 hover:text-white/80 hover:border-white/[0.15] transition-all">
          <SlidersHorizontal className="w-3 h-3" />
          Export Roster
        </button>
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Scaling', count: ARTISTS.filter(a => a.status === 'Scaling').length, accent: '#06B6D4' },
          { label: 'Active', count: ARTISTS.filter(a => a.status === 'Active').length, accent: '#10B981' },
          { label: 'At Risk', count: ARTISTS.filter(a => a.status === 'Risk').length, accent: '#F59E0B' },
          { label: 'Blocked', count: ARTISTS.filter(a => a.status === 'Blocked').length, accent: '#EF4444' },
        ].map(s => (
          <div key={s.label} className="bg-[#0D0E11] border border-white/[0.06] rounded-lg p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[1px]"
              style={{ background: `linear-gradient(90deg, transparent, ${s.accent}55, transparent)` }} />
            <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-1">{s.label}</p>
            <p className="text-[28px] font-bold leading-none font-['Satoshi',sans-serif]" style={{ color: s.accent }}>{s.count}</p>
          </div>
        ))}
      </div>

      <AIInsightPanel />

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search artists..."
            className="pl-8 pr-4 py-1.5 bg-white/[0.04] border border-white/[0.07] rounded text-[12px] text-white/70 placeholder-white/20 focus:outline-none focus:border-[#06B6D4]/40 transition-colors w-48"
          />
        </div>
        <div className="flex items-center gap-1.5">
          {statuses.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-2.5 py-1 rounded text-[10px] font-mono tracking-wider transition-all ${
                statusFilter === s
                  ? 'bg-[#06B6D4]/15 text-[#06B6D4] border border-[#06B6D4]/30'
                  : 'text-white/30 border border-white/[0.06] hover:border-white/[0.15] hover:text-white/60'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <span className="ml-auto text-[11px] font-mono text-white/20">{filtered.length} artists</span>
      </div>

      {/* Table */}
      <div className="bg-[#0D0E11] border border-white/[0.06] rounded-lg overflow-hidden">
        <div className="grid grid-cols-12 gap-2 px-5 py-2.5 border-b border-white/[0.06]">
          {[
            { label: 'Artist', key: 'name' as SortKey, span: 3 },
            { label: 'Genre', key: null, span: 1 },
            { label: 'Status', key: null, span: 1 },
            { label: 'Velocity', key: 'velocity' as SortKey, span: 1 },
            { label: 'Streams (24h)', key: 'streams' as SortKey, span: 2 },
            { label: 'Revenue (MTD)', key: 'revenue' as SortKey, span: 2 },
            { label: 'Campaigns', key: 'campaigns' as SortKey, span: 1 },
            { label: 'Risk', key: null, span: 1 },
          ].map(col => (
            <div
              key={col.label}
              className={`col-span-${col.span} flex items-center gap-1 text-[10px] font-mono text-white/25 uppercase tracking-widest ${col.key ? 'cursor-pointer hover:text-white/50 select-none' : ''}`}
              onClick={() => col.key && handleSort(col.key)}
            >
              {col.label}
              {col.key && <SortIcon k={col.key} />}
            </div>
          ))}
        </div>

        <div className="divide-y divide-white/[0.04]">
          {filtered.map(artist => (
            <div key={artist.id}>
              <div
                className="grid grid-cols-12 gap-2 px-5 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer items-center"
                onClick={() => setExpanded(expanded === artist.id ? null : artist.id)}
              >
                <div className="col-span-3 flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                    artist.status === 'Scaling' ? 'bg-[#06B6D4]/10 text-[#06B6D4] border border-[#06B6D4]/20' :
                    artist.status === 'Blocked' || artist.status === 'Risk' ? 'bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20' :
                    'bg-white/[0.04] text-white/50 border border-white/[0.08]'
                  }`}>
                    {artist.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-white">{artist.name}</p>
                    <p className="text-[10px] font-mono text-white/25">{artist.id}</p>
                  </div>
                </div>
                <div className="col-span-1">
                  <span className="text-[11px] text-white/40">{artist.genre}</span>
                </div>
                <div className="col-span-1">
                  <StatusTag status={artist.status} pulse />
                </div>
                <div className="col-span-1">
                  <span className={`text-[12px] font-mono font-semibold ${
                    artist.velocity.startsWith('+') ? 'text-[#10B981]' :
                    artist.velocity === '0%' ? 'text-white/20' : 'text-[#EF4444]'
                  }`}>{artist.velocity}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[12px] text-white/70">{artist.streams}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[12px] text-white/70">{artist.revenue}</span>
                </div>
                <div className="col-span-1">
                  <span className="text-[12px] font-mono text-white/50">{artist.campaigns}</span>
                </div>
                <div className="col-span-1 flex items-center justify-between">
                  <StatusTag status={artist.risk} />
                  <ChevronRight className={`w-3.5 h-3.5 text-white/15 transition-transform ${expanded === artist.id ? 'rotate-90' : ''}`} />
                </div>
              </div>

              {expanded === artist.id && (
                <div className="px-5 pb-4 bg-white/[0.015] border-t border-white/[0.04]">
                  <div className="grid grid-cols-4 gap-4 mt-3">
                    <div>
                      <p className="text-[10px] font-mono text-white/25 uppercase mb-1">Manager</p>
                      <p className="text-[12px] text-white/70">{artist.manager}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-white/25 uppercase mb-1">Active Campaigns</p>
                      <p className="text-[12px] text-white/70">{artist.campaigns}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-white/25 uppercase mb-1">Revenue MTD</p>
                      <p className="text-[12px] text-white/70">{artist.revenue}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-white/25 uppercase mb-1">Risk Level</p>
                      <StatusTag status={artist.risk} size="md" />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => navigate('/dashboard/artist-os/artists')}
                      className="px-3 py-1.5 rounded bg-[#06B6D4]/10 border border-[#06B6D4]/20 text-[11px] text-[#06B6D4] hover:bg-[#06B6D4]/20 transition-colors"
                    >
                      View Full Profile
                    </button>
                    <button className="px-3 py-1.5 rounded border border-white/[0.08] text-[11px] text-white/40 hover:text-white/70 hover:border-white/[0.15] transition-colors">
                      View Campaigns
                    </button>
                    {(artist.status === 'Blocked' || artist.status === 'Risk') && (
                      <button className="px-3 py-1.5 rounded border border-[#EF4444]/20 bg-[#EF4444]/5 text-[11px] text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors">
                        Escalate Issue
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
