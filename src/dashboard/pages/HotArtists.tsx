import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Flame, TrendingUp, MapPin, Star, ChevronRight, Search,
  Filter, ArrowUpRight, Zap, Users, Clock
} from 'lucide-react';

interface HotArtist {
  rank: number;
  artist: string;
  location: string;
  genre: string;
  status: 'Breaking' | 'Sign' | 'Rising' | 'Watch' | 'Early';
  velocity: number;
  monthlyListeners: string;
  growth30d: string;
  keySignals: string[];
  scout: string;
  recommendation: 'SIGN' | 'WATCH' | 'PASS';
  urgency: 'Critical' | 'High' | 'Medium' | 'Low';
  signalCount: number;
}

const HOT_ARTISTS: HotArtist[] = [
  {
    rank: 1, artist: 'Zara Vex', location: 'Los Angeles, CA', genre: 'Alt-Pop',
    status: 'Breaking', velocity: 98, monthlyListeners: '2.4M', growth30d: '+1.2M',
    keySignals: ['TikTok viral', 'Streaming spike', 'Editorial adds', 'NMF Global'],
    scout: 'Nova', recommendation: 'SIGN', urgency: 'Critical', signalCount: 14,
  },
  {
    rank: 2, artist: 'DXTR', location: 'New York, NY', genre: 'Electronic',
    status: 'Breaking', velocity: 95, monthlyListeners: '890K', growth30d: '+340K',
    keySignals: ['Platform push', 'Editorial adds', 'Scout confirmed'],
    scout: 'Rift', recommendation: 'SIGN', urgency: 'Critical', signalCount: 11,
  },
  {
    rank: 3, artist: 'Mako Sol', location: 'Atlanta, GA', genre: 'R&B',
    status: 'Sign', velocity: 91, monthlyListeners: '680K', growth30d: '+210K',
    keySignals: ['New Music Friday', 'ATL scene', 'Cross-genre momentum'],
    scout: 'Flare', recommendation: 'SIGN', urgency: 'High', signalCount: 9,
  },
  {
    rank: 4, artist: 'Amara Blue', location: 'Lagos, Nigeria', genre: 'Afrobeats',
    status: 'Rising', velocity: 88, monthlyListeners: '1.1M', growth30d: '+420K',
    keySignals: ['Diaspora signal', 'UK crossover', 'Lagos scene'],
    scout: 'Prism', recommendation: 'SIGN', urgency: 'High', signalCount: 12,
  },
  {
    rank: 5, artist: 'Kael Torres', location: 'Miami, FL', genre: 'Latin Urban',
    status: 'Sign', velocity: 85, monthlyListeners: '720K', growth30d: '+250K',
    keySignals: ['Bilingual crossover', 'Latin charts', 'Miami scene'],
    scout: 'Vibe', recommendation: 'SIGN', urgency: 'High', signalCount: 7,
  },
  {
    rank: 6, artist: 'Echo Voss', location: 'Berlin, Germany', genre: 'Hyperpop',
    status: 'Rising', velocity: 78, monthlyListeners: '440K', growth30d: '+180K',
    keySignals: ['Berlin underground', 'Festival buzz', 'EU streaming'],
    scout: 'Drift', recommendation: 'WATCH', urgency: 'Medium', signalCount: 8,
  },
  {
    rank: 7, artist: 'Phoebe Strand', location: 'Nashville, TN', genre: 'Folk',
    status: 'Rising', velocity: 74, monthlyListeners: '340K', growth30d: '+110K',
    keySignals: ['Sync inquiries', 'Nashville buzz', 'Spotify DSP'],
    scout: 'Nexus', recommendation: 'WATCH', urgency: 'Medium', signalCount: 4,
  },
  {
    rank: 8, artist: 'Sora Minh', location: 'Seoul, Korea', genre: 'K-Pop Adjacent',
    status: 'Watch', velocity: 65, monthlyListeners: '290K', growth30d: '+85K',
    keySignals: ['TikTok KR', 'Asia streaming', 'Western crossover'],
    scout: 'Halo', recommendation: 'WATCH', urgency: 'Medium', signalCount: 5,
  },
  {
    rank: 9, artist: 'River Jay', location: 'Chicago, IL', genre: 'Drill',
    status: 'Watch', velocity: 62, monthlyListeners: '180K', growth30d: '+60K',
    keySignals: ['Chicago drill', 'SoundCloud buzz', 'Local venue sells'],
    scout: 'Blaze', recommendation: 'WATCH', urgency: 'Low', signalCount: 3,
  },
  {
    rank: 10, artist: 'Yael Crest', location: 'London, UK', genre: 'Neo-Soul',
    status: 'Early', velocity: 52, monthlyListeners: '120K', growth30d: '+35K',
    keySignals: ['BBC plays', 'UK R&B', 'Playlist adds'],
    scout: 'Cipher', recommendation: 'WATCH', urgency: 'Low', signalCount: 5,
  },
];

const STATUS_CONFIG: Record<string, { pill: string; dot: string }> = {
  Breaking: { pill: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/25',  dot: 'bg-[#EF4444] animate-pulse' },
  Sign:     { pill: 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20',  dot: 'bg-[#10B981] animate-pulse' },
  Rising:   { pill: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',  dot: 'bg-[#F59E0B]'              },
  Watch:    { pill: 'bg-[#06B6D4]/10 text-[#06B6D4] border-[#06B6D4]/20',  dot: 'bg-[#06B6D4]'              },
  Early:    { pill: 'bg-white/5 text-white/35 border-white/10',              dot: 'bg-white/30'               },
};
const REC_CONFIG: Record<string, string> = {
  SIGN:  'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20',
  WATCH: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
  PASS:  'bg-white/5 text-white/30 border-white/10',
};
const URG_CONFIG: Record<string, string> = {
  Critical: 'text-[#EF4444]',
  High:     'text-[#F59E0B]',
  Medium:   'text-[#06B6D4]',
  Low:      'text-white/30',
};

const STATUS_FILTERS = ['All', 'Breaking', 'Sign', 'Rising', 'Watch', 'Early'];
const SCOUTS_FILTER = ['All', 'Nova', 'Rift', 'Flare', 'Drift', 'Vibe', 'Prism', 'Nexus', 'Cipher', 'Halo', 'Blaze'];

export default function HotArtists() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('All');
  const [scoutFilter, setScoutFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = HOT_ARTISTS.filter(a => {
    if (statusFilter !== 'All' && a.status !== statusFilter) return false;
    if (scoutFilter !== 'All' && a.scout !== scoutFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!a.artist.toLowerCase().includes(q) && !a.location.toLowerCase().includes(q) && !a.genre.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const breakingNow = HOT_ARTISTS.filter(a => a.status === 'Breaking').length;
  const signReady = HOT_ARTISTS.filter(a => a.status === 'Sign').length;
  const scoutConfirmed = HOT_ARTISTS.filter(a => a.recommendation === 'SIGN').length;
  const rising = HOT_ARTISTS.filter(a => a.status === 'Rising').length;
  const watchlist = HOT_ARTISTS.filter(a => a.status === 'Watch' || a.status === 'Early').length;

  return (
    <div className="min-h-full bg-[#07080A]">
      <div className="relative bg-[#09090D] border-b border-[#EF4444]/10 px-6 py-5 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#EF4444]/20 to-transparent" />
        <div className="absolute -top-8 left-1/3 w-48 h-20 rounded-full opacity-[0.04] blur-3xl bg-[#EF4444]" />

        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/20 flex items-center justify-center shrink-0">
              <Flame className="w-4 h-4 text-[#EF4444]" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-[19px] font-bold text-white leading-tight">Hot Artists</h1>
                <span className="flex items-center gap-1 text-[9px] font-mono px-2 py-0.5 rounded bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] animate-pulse" /> LIVE
                </span>
              </div>
              <p className="text-[10.5px] text-white/25">Current highest-priority artists tracked by Rocksteady</p>
            </div>
          </div>

          <div className="flex gap-3 ml-auto flex-wrap">
            {[
              { label: 'Breaking Now', value: breakingNow, color: '#EF4444', icon: Flame },
              { label: 'Sign-Ready', value: signReady, color: '#10B981', icon: Star },
              { label: 'Scout-Confirmed', value: scoutConfirmed, color: '#06B6D4', icon: Users },
              { label: 'Rising', value: rising, color: '#F59E0B', icon: TrendingUp },
              { label: 'Watchlist', value: watchlist, color: '#6B7280', icon: Clock },
            ].map(({ label, value, color, icon: Icon }) => (
              <div key={label} className="flex items-center gap-2 px-3 py-2 bg-white/[0.025] border border-white/[0.05] rounded-xl">
                <Icon className="w-3.5 h-3.5 shrink-0" style={{ color }} />
                <div>
                  <p className="text-[8px] font-mono text-white/20 uppercase tracking-wider">{label}</p>
                  <p className="text-[14px] font-bold leading-tight" style={{ color }}>{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div className="flex items-center gap-3 flex-wrap p-3.5 bg-[#0A0B0E] border border-white/[0.07] rounded-xl">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-white/20" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search artists..."
              className="pl-8 pr-3 py-1.5 bg-white/[0.04] border border-white/[0.07] rounded text-[11px] text-white/70 placeholder-white/20 focus:outline-none focus:border-[#EF4444]/40 w-40" />
          </div>
          <Filter className="w-3 h-3 text-white/15 shrink-0" />
          <div className="flex items-center gap-1.5 bg-white/[0.03] border border-white/[0.06] rounded-lg p-1">
            {STATUS_FILTERS.map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-2.5 py-1 rounded text-[10px] font-mono transition-all ${statusFilter === s
                  ? s === 'Breaking' ? 'bg-[#EF4444]/12 text-[#EF4444] border border-[#EF4444]/25'
                  : s === 'Sign' ? 'bg-[#10B981]/12 text-[#10B981] border border-[#10B981]/25'
                  : s === 'Rising' ? 'bg-[#F59E0B]/12 text-[#F59E0B] border border-[#F59E0B]/25'
                  : s === 'Watch' ? 'bg-[#06B6D4]/12 text-[#06B6D4] border border-[#06B6D4]/25'
                  : 'bg-white/[0.06] text-white/60 border border-white/15'
                  : 'text-white/30 hover:text-white/60'}`}>
                {s}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-mono text-white/25">Scout:</span>
            <select value={scoutFilter} onChange={e => setScoutFilter(e.target.value)}
              className="px-2 py-1.5 bg-white/[0.04] border border-white/[0.07] rounded text-[11px] text-white/60 focus:outline-none">
              {SCOUTS_FILTER.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="bg-[#0A0B0E] border border-white/[0.07] rounded-xl overflow-hidden">
          <div className="hidden xl:grid grid-cols-[32px_1fr_100px_80px_80px_60px_80px_90px_120px_70px_60px_48px] gap-2 px-5 py-2.5 border-b border-white/[0.05]">
            {['#', 'Artist', 'Location', 'Genre', 'Status', 'Rec', 'Velocity', '30D Growth', 'Key Signals', 'Scout', 'Urgency', ''].map(h => (
              <span key={h} className="text-[9px] font-mono text-white/15 uppercase tracking-widest truncate">{h}</span>
            ))}
          </div>
          <div className="divide-y divide-white/[0.03]">
            {filtered.map((artist, i) => {
              const sc = STATUS_CONFIG[artist.status];
              return (
                <div key={artist.artist}
                  className="flex items-center gap-3 px-5 py-4 hover:bg-white/[0.02] transition-colors cursor-pointer xl:grid xl:grid-cols-[32px_1fr_100px_80px_80px_60px_80px_90px_120px_70px_60px_48px]"
                  onClick={() => navigate('/dashboard/rocksteady/discoveries')}>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-[12px] font-bold font-mono" style={{ color: i === 0 ? '#EF4444' : i < 3 ? '#F59E0B' : 'rgba(255,255,255,0.2)' }}>
                      {artist.rank}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="relative shrink-0">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/[0.08] flex items-center justify-center text-[11px] font-bold text-white/50">
                        {artist.artist.charAt(0)}
                      </div>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-[#07080A] ${sc.dot}`} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[13px] font-semibold text-white/85 truncate">{artist.artist}</span>
                        {artist.rank <= 3 && <Star className="w-3 h-3 text-[#F59E0B] shrink-0" fill="currentColor" />}
                      </div>
                      <div className="xl:hidden text-[9.5px] text-white/25 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-2.5 h-2.5" />{artist.location} · {artist.scout}
                      </div>
                    </div>
                  </div>

                  <div className="hidden xl:flex items-center gap-1 text-[10px] text-white/35">
                    <MapPin className="w-2.5 h-2.5 shrink-0" />
                    <span className="truncate">{artist.location}</span>
                  </div>
                  <span className="hidden xl:block text-[10px] font-mono text-white/40 truncate">{artist.genre}</span>
                  <span className={`hidden xl:inline-flex text-[8.5px] font-mono px-1.5 py-0.5 rounded border ${sc.pill}`}>{artist.status}</span>
                  <span className={`hidden xl:inline-flex text-[8.5px] font-mono px-1.5 py-0.5 rounded border ${REC_CONFIG[artist.recommendation]}`}>{artist.recommendation}</span>

                  <div className="hidden xl:flex items-center gap-1.5">
                    <div className="flex-1 h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${artist.velocity}%`, background: artist.velocity > 90 ? '#EF4444' : artist.velocity > 75 ? '#F59E0B' : '#06B6D4' }} />
                    </div>
                    <span className="text-[11px] font-mono font-bold w-6 text-right" style={{ color: artist.velocity > 90 ? '#EF4444' : artist.velocity > 75 ? '#F59E0B' : '#06B6D4' }}>{artist.velocity}</span>
                  </div>

                  <div className="hidden xl:block">
                    <p className="text-[12px] font-mono text-[#10B981] font-bold">{artist.growth30d}</p>
                    <p className="text-[9px] font-mono text-white/20">{artist.monthlyListeners} mo.</p>
                  </div>

                  <div className="hidden xl:flex flex-wrap gap-1">
                    {artist.keySignals.slice(0, 2).map(sig => (
                      <span key={sig} className="text-[7.5px] font-mono px-1 py-0.5 rounded bg-white/[0.04] text-white/30 border border-white/[0.06] truncate max-w-[56px]">{sig}</span>
                    ))}
                  </div>

                  <span className="hidden xl:block text-[11px] text-white/40">{artist.scout}</span>
                  <span className={`hidden xl:block text-[10px] font-mono font-semibold ${URG_CONFIG[artist.urgency]}`}>{artist.urgency}</span>

                  <button className="ml-auto xl:ml-0 flex items-center justify-center w-8 h-8 rounded-lg hover:bg-[#EF4444]/[0.08] transition-colors group shrink-0">
                    <ArrowUpRight className="w-3.5 h-3.5 text-white/20 group-hover:text-[#EF4444] transition-colors" />
                  </button>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <Flame className="w-8 h-8 text-white/10 mx-auto mb-3" />
              <p className="text-[13px] text-white/25">No artists match your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
