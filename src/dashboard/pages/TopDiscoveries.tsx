import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  List, TrendingUp, MapPin, Star, ChevronRight,
  Search, Filter, ArrowUpRight, Zap, Users, Clock
} from 'lucide-react';

interface Discovery {
  rank: number;
  artist: string;
  location: string;
  genre: string;
  status: 'Breaking' | 'Rising' | 'Sign' | 'Watch' | 'Early';
  recommendation: 'SIGN' | 'WATCH' | 'PASS';
  velocityScore: number;
  growthDelta: string;
  monthlyListeners: string;
  signalTags: string[];
  scout: string;
  delta30d: string;
}

const DISCOVERIES_BY_RANGE: Record<string, Discovery[]> = {
  '24H': [
    { rank: 1, artist: 'Lamb',         location: 'Venice Beach, CA',  genre: 'Jersey Club', status: 'Breaking', recommendation: 'SIGN',  velocityScore: 91, growthDelta: '+340%',   monthlyListeners: '100K+', signalTags: ['Co-signs', 'Pre-viral', 'Unsigned'], scout: 'Paragon', delta30d: '+90K' },
    { rank: 2, artist: 'Zaylevelten',  location: 'Lagos, Nigeria',    genre: 'Afro-fusion', status: 'Breaking', recommendation: 'SIGN',  velocityScore: 87, growthDelta: '+2,071%', monthlyListeners: '724K',  signalTags: ['Unsigned', 'Africa'],               scout: 'Paragon', delta30d: '+620K' },
    { rank: 3, artist: 'Mon Rovia',    location: 'USA / Liberia',     genre: 'Indie Folk',  status: 'Breaking', recommendation: 'SIGN',  velocityScore: 81, growthDelta: '+380%',   monthlyListeners: '2.4M',  signalTags: ['Viral', 'Touring'],                  scout: 'Paragon', delta30d: '+480K' },
    { rank: 4, artist: 'Ayra Jae',     location: 'Accra, Ghana',      genre: 'Afrobeats',   status: 'Rising',   recommendation: 'SIGN',  velocityScore: 76, growthDelta: '+1,100%', monthlyListeners: '540K',  signalTags: ['Diaspora', 'Unsigned'],              scout: 'Paragon', delta30d: '+120K' },
    { rank: 5, artist: 'Sung Holly',   location: 'Dallas, TX',        genre: 'Bedroom Pop', status: 'Watch',    recommendation: 'WATCH', velocityScore: 68, growthDelta: '+120%',   monthlyListeners: '48K',   signalTags: ['YouTube growth', 'Developing'],      scout: 'Paragon', delta30d: '+22K' },
  ],
  '72H': [
    { rank: 1, artist: 'Lamb',         location: 'Venice Beach, CA',  genre: 'Jersey Club', status: 'Breaking', recommendation: 'SIGN',  velocityScore: 91, growthDelta: '+440%',   monthlyListeners: '100K+', signalTags: ['Co-signs', 'Pre-viral', 'Unsigned'], scout: 'Paragon', delta30d: '+90K' },
    { rank: 2, artist: 'Zaylevelten',  location: 'Lagos, Nigeria',    genre: 'Afro-fusion', status: 'Breaking', recommendation: 'SIGN',  velocityScore: 87, growthDelta: '+2,071%', monthlyListeners: '724K',  signalTags: ['Unsigned', 'Africa', 'Fresh Finds'], scout: 'Paragon', delta30d: '+620K' },
    { rank: 3, artist: 'Mon Rovia',    location: 'USA / Liberia',     genre: 'Indie Folk',  status: 'Breaking', recommendation: 'SIGN',  velocityScore: 81, growthDelta: '+540%',   monthlyListeners: '2.4M',  signalTags: ['Viral', 'Touring'],                  scout: 'Paragon', delta30d: '+480K' },
    { rank: 4, artist: 'Ayra Jae',     location: 'Accra, Ghana',      genre: 'Afrobeats',   status: 'Rising',   recommendation: 'SIGN',  velocityScore: 76, growthDelta: '+1,100%', monthlyListeners: '540K',  signalTags: ['Diaspora', 'Unsigned'],              scout: 'Paragon', delta30d: '+120K' },
    { rank: 5, artist: 'Sung Holly',   location: 'Dallas, TX',        genre: 'Bedroom Pop', status: 'Rising',   recommendation: 'WATCH', velocityScore: 68, growthDelta: '+185%',   monthlyListeners: '48K',   signalTags: ['YouTube', 'Developing'],             scout: 'Paragon', delta30d: '+22K' },
    { rank: 6, artist: 'Makaio Huizar',location: 'Arizona',           genre: 'Pop',         status: 'Watch',    recommendation: 'WATCH', velocityScore: 61, growthDelta: '+140%',   monthlyListeners: '22K',   signalTags: ['Pre-EP', 'Unsigned'],                scout: 'Paragon', delta30d: '+14K' },
  ],
  '7D': [
    { rank: 1, artist: 'Lamb',         location: 'Venice Beach, CA',  genre: 'Jersey Club', status: 'Breaking', recommendation: 'SIGN',  velocityScore: 91, growthDelta: '+620%',   monthlyListeners: '100K+', signalTags: ['Co-signs', 'Pre-viral', 'Unsigned'], scout: 'Paragon', delta30d: '+90K' },
    { rank: 2, artist: 'Zaylevelten',  location: 'Lagos, Nigeria',    genre: 'Afro-fusion', status: 'Breaking', recommendation: 'SIGN',  velocityScore: 87, growthDelta: '+2,071%', monthlyListeners: '724K',  signalTags: ['Unsigned', 'Africa'],               scout: 'Paragon', delta30d: '+620K' },
    { rank: 3, artist: 'Mon Rovia',    location: 'USA / Liberia',     genre: 'Indie Folk',  status: 'Breaking', recommendation: 'SIGN',  velocityScore: 81, growthDelta: '+680%',   monthlyListeners: '2.4M',  signalTags: ['Viral', 'Touring'],                  scout: 'Paragon', delta30d: '+480K' },
    { rank: 4, artist: 'Ayra Jae',     location: 'Accra, Ghana',      genre: 'Afrobeats',   status: 'Rising',   recommendation: 'SIGN',  velocityScore: 76, growthDelta: '+1,100%', monthlyListeners: '540K',  signalTags: ['Diaspora', 'Unsigned'],              scout: 'Paragon', delta30d: '+120K' },
    { rank: 5, artist: 'Sung Holly',   location: 'Dallas, TX',        genre: 'Bedroom Pop', status: 'Rising',   recommendation: 'WATCH', velocityScore: 68, growthDelta: '+240%',   monthlyListeners: '48K',   signalTags: ['YouTube', 'Developing'],             scout: 'Paragon', delta30d: '+22K' },
    { rank: 6, artist: 'Makaio Huizar',location: 'Arizona',           genre: 'Pop',         status: 'Watch',    recommendation: 'WATCH', velocityScore: 61, growthDelta: '+180%',   monthlyListeners: '22K',   signalTags: ['Pre-EP', 'Unsigned'],                scout: 'Paragon', delta30d: '+14K' },
    { rank: 7, artist: 'Nessa Barrett',location: 'Los Angeles, CA',   genre: 'Pop / Alt',   status: 'Watch',    recommendation: 'WATCH', velocityScore: 57, growthDelta: '+160%',   monthlyListeners: '380K',  signalTags: ['Archetype', 'LA scene'],             scout: 'Paragon', delta30d: '+88K' },
    { rank: 8, artist: 'Chloe Tang',   location: 'Los Angeles, CA',   genre: 'Pop',         status: 'Watch',    recommendation: 'WATCH', velocityScore: 53, growthDelta: '+130%',   monthlyListeners: '95K',   signalTags: ['TikTok 2.8M', 'LA'],                scout: 'Paragon', delta30d: '+40K' },
    { rank: 9, artist: 'Lila Daye',    location: 'Houston, TX',       genre: 'Alt-R&B',     status: 'Early',    recommendation: 'WATCH', velocityScore: 49, growthDelta: '+640%',   monthlyListeners: '188K',  signalTags: ['Fresh Finds', 'Unsigned'],           scout: 'Paragon', delta30d: '+44K' },
    { rank: 10,artist: 'Cato Strand',  location: 'Oslo, Norway',      genre: 'Dark Folk',   status: 'Early',    recommendation: 'WATCH', velocityScore: 44, growthDelta: '+290%',   monthlyListeners: '312K',  signalTags: ['Nordic', 'EU Tastemaker'],           scout: 'Paragon', delta30d: '+55K' },
  ],
  '14D': [
    { rank: 1, artist: 'Lamb',         location: 'Venice Beach, CA',  genre: 'Jersey Club', status: 'Breaking', recommendation: 'SIGN',  velocityScore: 91, growthDelta: '+720%',   monthlyListeners: '100K+', signalTags: ['Co-signs', 'Pre-viral'],             scout: 'Paragon', delta30d: '+90K' },
    { rank: 2, artist: 'Zaylevelten',  location: 'Lagos, Nigeria',    genre: 'Afro-fusion', status: 'Breaking', recommendation: 'SIGN',  velocityScore: 87, growthDelta: '+2,071%', monthlyListeners: '724K',  signalTags: ['Unsigned', 'Africa'],               scout: 'Paragon', delta30d: '+620K' },
    { rank: 3, artist: 'Mon Rovia',    location: 'USA / Liberia',     genre: 'Indie Folk',  status: 'Breaking', recommendation: 'SIGN',  velocityScore: 81, growthDelta: '+820%',   monthlyListeners: '2.4M',  signalTags: ['Viral', 'Touring'],                  scout: 'Paragon', delta30d: '+480K' },
    { rank: 4, artist: 'Ayra Jae',     location: 'Accra, Ghana',      genre: 'Afrobeats',   status: 'Rising',   recommendation: 'SIGN',  velocityScore: 76, growthDelta: '+1,100%', monthlyListeners: '540K',  signalTags: ['Diaspora', 'Unsigned'],              scout: 'Paragon', delta30d: '+120K' },
    { rank: 5, artist: 'Sung Holly',   location: 'Dallas, TX',        genre: 'Bedroom Pop', status: 'Rising',   recommendation: 'WATCH', velocityScore: 68, growthDelta: '+290%',   monthlyListeners: '48K',   signalTags: ['YouTube', 'Developing'],             scout: 'Paragon', delta30d: '+22K' },
  ],
  '30D': [
    { rank: 1, artist: 'Lamb',         location: 'Venice Beach, CA',  genre: 'Jersey Club', status: 'Breaking', recommendation: 'SIGN',  velocityScore: 91, growthDelta: '+960%',   monthlyListeners: '100K+', signalTags: ['Co-signs', 'Unsigned', 'Top Pick'],  scout: 'Paragon', delta30d: '+90K' },
    { rank: 2, artist: 'Zaylevelten',  location: 'Lagos, Nigeria',    genre: 'Afro-fusion', status: 'Breaking', recommendation: 'SIGN',  velocityScore: 87, growthDelta: '+2,071%', monthlyListeners: '724K',  signalTags: ['Unsigned', 'Africa', 'Immediate'],  scout: 'Paragon', delta30d: '+620K' },
    { rank: 3, artist: 'Mon Rovia',    location: 'USA / Liberia',     genre: 'Indie Folk',  status: 'Breaking', recommendation: 'SIGN',  velocityScore: 81, growthDelta: '+1,100%', monthlyListeners: '2.4M',  signalTags: ['Viral', 'Touring'],                  scout: 'Paragon', delta30d: '+480K' },
    { rank: 4, artist: 'Ayra Jae',     location: 'Accra, Ghana',      genre: 'Afrobeats',   status: 'Rising',   recommendation: 'SIGN',  velocityScore: 76, growthDelta: '+1,100%', monthlyListeners: '540K',  signalTags: ['Diaspora', 'Unsigned'],              scout: 'Paragon', delta30d: '+120K' },
    { rank: 5, artist: 'Sung Holly',   location: 'Dallas, TX',        genre: 'Bedroom Pop', status: 'Rising',   recommendation: 'WATCH', velocityScore: 68, growthDelta: '+380%',   monthlyListeners: '48K',   signalTags: ['YouTube', 'Developing'],            scout: 'Paragon', delta30d: '+22K' },
    { rank: 6, artist: 'Makaio Huizar',location: 'Arizona',           genre: 'Pop',         status: 'Watch',    recommendation: 'WATCH', velocityScore: 61, growthDelta: '+260%',   monthlyListeners: '22K',   signalTags: ['Pre-EP', 'Unsigned'],               scout: 'Paragon', delta30d: '+14K' },
    { rank: 7, artist: 'Nessa Barrett',location: 'Los Angeles, CA',   genre: 'Pop / Alt',   status: 'Watch',    recommendation: 'WATCH', velocityScore: 57, growthDelta: '+210%',   monthlyListeners: '380K',  signalTags: ['Archetype', 'LA'],                  scout: 'Paragon', delta30d: '+88K' },
    { rank: 8, artist: 'Chloe Tang',   location: 'Los Angeles, CA',   genre: 'Pop',         status: 'Watch',    recommendation: 'WATCH', velocityScore: 53, growthDelta: '+160%',   monthlyListeners: '95K',   signalTags: ['TikTok 2.8M'],                      scout: 'Paragon', delta30d: '+40K' },
  ],
};

const STATUS_CONFIG: Record<string, string> = {
  Breaking: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/25',
  Sign:     'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20',
  Rising:   'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
  Watch:    'bg-[#06B6D4]/10 text-[#06B6D4] border-[#06B6D4]/20',
  Early:    'bg-white/5 text-white/35 border-white/10',
};
const REC_CONFIG: Record<string, string> = {
  SIGN:  'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20',
  WATCH: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
  PASS:  'bg-white/5 text-white/30 border-white/10',
};

const TIME_TABS = ['24H', '72H', '7D', '14D', '30D'] as const;

export default function TopDiscoveries() {
  const navigate = useNavigate();
  const [timeTab, setTimeTab] = useState<typeof TIME_TABS[number]>('7D');
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState('All');
  const [genreFilter, setGenreFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const data = DISCOVERIES_BY_RANGE[timeTab] || [];
  const filtered = data.filter(d => {
    if (search) {
      const q = search.toLowerCase();
      if (!d.artist.toLowerCase().includes(q) && !d.location.toLowerCase().includes(q)) return false;
    }
    if (statusFilter !== 'All' && d.status !== statusFilter) return false;
    if (genreFilter !== 'All' && d.genre !== genreFilter) return false;
    return true;
  });

  const breakingNow = data.filter(d => d.status === 'Breaking').length;
  const rising = data.filter(d => d.status === 'Rising').length;
  const signCandidates = data.filter(d => d.recommendation === 'SIGN').length;
  const watchlist = data.filter(d => d.recommendation === 'WATCH').length;

  return (
    <div className="min-h-full bg-[#07080A]">
      <div className="relative bg-[#09090D] border-b border-[#EF4444]/10 px-6 py-5 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#EF4444]/20 to-transparent" />
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/20 flex items-center justify-center shrink-0">
              <List className="w-4 h-4 text-[#EF4444]" />
            </div>
            <div>
              <h1 className="text-[19px] font-bold text-white leading-tight">Top Discoveries</h1>
              <p className="text-[10.5px] text-white/25">Highest-ranked artists by signal velocity and scout confirmation · <span className="text-[#EF4444]/60">Source: Paragon</span></p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 ml-auto bg-white/[0.03] border border-white/[0.06] rounded-lg p-1">
            {TIME_TABS.map(t => (
              <button key={t} onClick={() => setTimeTab(t)}
                className={`px-3 py-1.5 rounded text-[10px] font-mono transition-all ${timeTab === t ? 'bg-[#EF4444]/12 text-[#EF4444] border border-[#EF4444]/25' : 'text-white/30 hover:text-white/60'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-3">
          {[
            { label: 'Breaking Now', value: breakingNow, color: '#EF4444', icon: TrendingUp },
            { label: 'Rising', value: rising, color: '#F59E0B', icon: Zap },
            { label: 'Sign Candidates', value: signCandidates, color: '#10B981', icon: Star },
            { label: 'Watchlist', value: watchlist, color: '#06B6D4', icon: Users },
            { label: 'Total Tracked', value: data.length, color: '#6B7280', icon: List },
          ].map(({ label, value, color, icon: Icon }) => (
            <div key={label} className="flex items-center gap-3 px-4 py-3 bg-[#0A0B0E] border border-white/[0.06] rounded-xl">
              <Icon className="w-4 h-4 shrink-0" style={{ color }} />
              <div>
                <p className="text-[8.5px] font-mono text-white/20 uppercase tracking-wider">{label}</p>
                <p className="text-[18px] font-bold leading-tight" style={{ color }}>{value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2.5 flex-wrap p-3.5 bg-[#0A0B0E] border border-white/[0.07] rounded-xl">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-white/20" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search artists..."
              className="pl-8 pr-3 py-1.5 bg-white/[0.04] border border-white/[0.07] rounded text-[11px] text-white/70 placeholder-white/20 focus:outline-none focus:border-[#EF4444]/40 w-40" />
          </div>
          <Filter className="w-3 h-3 text-white/15 shrink-0" />
          {[
            ['Status', ['All', 'Breaking', 'Sign', 'Rising', 'Watch', 'Early'], statusFilter, setStatusFilter],
            ['Genre', ['All', 'Afro-fusion', 'Pop', 'Indie Folk', 'Jersey Club', 'Bedroom Pop', 'Pop / Alt', 'Alternative'], genreFilter, setGenreFilter],
          ].map(([label, opts, val, setter]) => (
            <div key={String(label)} className="flex items-center gap-1.5">
              <span className="text-[9px] font-mono text-white/25">{String(label)}:</span>
              <select value={String(val)} onChange={e => (setter as (v: string) => void)(e.target.value)}
                className="px-2 py-1.5 bg-white/[0.04] border border-white/[0.07] rounded text-[11px] text-white/60 focus:outline-none">
                {(opts as string[]).map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>

        <div className="bg-[#0A0B0E] border border-white/[0.07] rounded-xl overflow-hidden">
          <div className="hidden xl:grid grid-cols-[32px_1fr_90px_80px_80px_60px_80px_90px_110px_70px_48px] gap-2 px-5 py-2.5 border-b border-white/[0.05]">
            {['#', 'Artist', 'Location', 'Genre', 'Status', 'Rec', 'Velocity', 'Growth', 'Signal Tags', 'Scout', ''].map(h => (
              <span key={h} className="text-[9px] font-mono text-white/15 uppercase tracking-widest truncate">{h}</span>
            ))}
          </div>
          <div className="divide-y divide-white/[0.03]">
            {filtered.map((d, i) => (
              <div key={d.artist}
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer xl:grid xl:grid-cols-[32px_1fr_90px_80px_80px_60px_80px_90px_110px_70px_48px]"
                onClick={() => navigate('/dashboard/rocksteady/hot-artists')}>
                <span className="text-[12px] font-bold font-mono" style={{ color: i === 0 ? '#EF4444' : i < 3 ? '#F59E0B' : 'rgba(255,255,255,0.2)' }}>
                  {d.rank}
                </span>
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/[0.08] flex items-center justify-center text-[10px] font-bold text-white/40 shrink-0">
                    {d.artist.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[13px] font-semibold text-white/85 truncate">{d.artist}</span>
                      {d.rank === 1 && <Star className="w-3 h-3 text-[#F59E0B] shrink-0" fill="currentColor" />}
                    </div>
                    <div className="text-[10px] text-white/25 xl:hidden flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-2.5 h-2.5 shrink-0" />{d.location} · {d.genre}
                    </div>
                  </div>
                </div>
                <div className="hidden xl:flex items-center gap-1 text-[10px] text-white/35">
                  <MapPin className="w-2.5 h-2.5 shrink-0" />
                  <span className="truncate">{d.location}</span>
                </div>
                <span className="hidden xl:block text-[10px] font-mono text-white/40 truncate">{d.genre}</span>
                <span className={`hidden xl:inline-flex text-[8.5px] font-mono px-1.5 py-0.5 rounded border ${STATUS_CONFIG[d.status]}`}>{d.status}</span>
                <span className={`hidden xl:inline-flex text-[8.5px] font-mono px-1.5 py-0.5 rounded border ${REC_CONFIG[d.recommendation]}`}>{d.recommendation}</span>
                <div className="hidden xl:flex items-center gap-1.5">
                  <div className="flex-1 h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${d.velocityScore}%`, background: d.velocityScore > 90 ? '#EF4444' : d.velocityScore > 75 ? '#F59E0B' : '#06B6D4' }} />
                  </div>
                  <span className="text-[11px] font-mono font-bold w-6 text-right" style={{ color: d.velocityScore > 90 ? '#EF4444' : d.velocityScore > 75 ? '#F59E0B' : '#06B6D4' }}>{d.velocityScore}</span>
                </div>
                <div className="hidden xl:block">
                  <p className="text-[11px] font-mono text-[#10B981]">{d.growthDelta}</p>
                  <p className="text-[9px] font-mono text-white/20">{d.monthlyListeners} monthly</p>
                </div>
                <div className="hidden xl:flex flex-wrap gap-1">
                  {d.signalTags.slice(0, 2).map(tag => (
                    <span key={tag} className="text-[7.5px] font-mono px-1 py-0.5 rounded bg-white/[0.04] text-white/30 border border-white/[0.06]">{tag}</span>
                  ))}
                </div>
                <span className="hidden xl:block text-[11px] text-white/40">{d.scout}</span>
                <button className="ml-auto xl:ml-0 flex items-center justify-center w-8 h-8 rounded-lg hover:bg-[#EF4444]/[0.08] transition-colors group shrink-0">
                  <ArrowUpRight className="w-3.5 h-3.5 text-white/20 group-hover:text-[#EF4444] transition-colors" />
                </button>
              </div>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <Clock className="w-8 h-8 text-white/10 mx-auto mb-3" />
              <p className="text-[13px] text-white/25">No discoveries match your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
