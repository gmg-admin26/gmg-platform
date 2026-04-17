import { useNavigate } from 'react-router-dom';
import {
  CheckCircle, TrendingUp, MapPin, Activity, UserCheck,
  FileText, Calendar, ChevronRight, Star, Shield, Clock
} from 'lucide-react';
import { PIPELINE_OPPORTUNITIES } from '../data/pipelineData';

const SIGNED = PIPELINE_OPPORTUNITIES.filter(o => o.stage === 'Signed');

const HISTORICAL_SIGNINGS = [
  {
    id: 'HS-001',
    artistName: 'Gigi Perez',
    market: 'USA',
    genre: 'Sapphic Folk / Indie-Pop',
    scout: 'Paragon',
    humanAR: 'Randy Jackson',
    agreementType: 'Distribution + sync',
    signedDate: 'Mar 14, 2026',
    weekOf: 'Mar 10–14, 2026',
    aiScouts: ['Paragon', 'Nova', 'Rift'],
    monthlyListeners: 29400000,
  },
  {
    id: 'HS-002',
    artistName: '2hollis',
    market: 'Los Angeles, USA',
    genre: 'Experimental Pop / Hyperpop',
    scout: 'Nova',
    humanAR: 'Paula Moore',
    agreementType: 'Catalog licensing',
    signedDate: 'Mar 21, 2026',
    weekOf: 'Mar 17–21, 2026',
    aiScouts: ['Nova', 'Rift'],
    monthlyListeners: 4000000,
  },
  {
    id: 'HS-003',
    artistName: 'Fcukers',
    market: 'UK / Global',
    genre: 'Alt-Dance / Electronic Rock',
    scout: 'Rift',
    humanAR: 'Latie',
    agreementType: 'Standard distribution',
    signedDate: 'Mar 28, 2026',
    weekOf: 'Mar 24–28, 2026',
    aiScouts: ['Rift', 'Cipher', 'Drift'],
    monthlyListeners: 1200000,
  },
];

const THIS_WEEK_SIGNED = SIGNED.map(opp => ({
  id: opp.id,
  artistName: opp.artistName,
  market: opp.market,
  genre: opp.genre,
  scout: opp.assignedScout,
  humanAR: opp.assignedHuman,
  agreementType: opp.agreementType || 'Standard distribution',
  signedDate: opp.signedDate || 'Apr 8, 2026',
  weekOf: 'Apr 7–11, 2026',
  aiScouts: opp.aiScouts,
  monthlyListeners: opp.monthlyListeners,
}));

const ALL_SIGNINGS = [...THIS_WEEK_SIGNED, ...HISTORICAL_SIGNINGS];
const TOTAL_ALL_TIME = ALL_SIGNINGS.length + 47;

function SigningCard({ signing, isThisWeek }: {
  signing: typeof ALL_SIGNINGS[0];
  isThisWeek: boolean;
}) {
  const navigate = useNavigate();
  return (
    <div
      className={`bg-[#0C0D10] border rounded-xl overflow-hidden transition-all hover:border-[#10B981]/20 cursor-pointer ${
        isThisWeek ? 'border-[#10B981]/20' : 'border-white/[0.07]'
      }`}
      onClick={() => navigate('/dashboard/rocksteady/pipeline')}
    >
      <div className="px-4 py-3 flex items-center gap-3">
        <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${
          isThisWeek ? 'bg-[#10B981]/12 border-[#10B981]/25' : 'bg-white/[0.05] border-white/[0.1]'
        }`}>
          <span className={`text-[13px] font-bold ${isThisWeek ? 'text-[#10B981]' : 'text-white/50'}`}>
            {signing.artistName.charAt(0)}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-bold text-white/90">{signing.artistName}</span>
            <CheckCircle className={`w-3.5 h-3.5 shrink-0 ${isThisWeek ? 'text-[#10B981]' : 'text-[#10B981]/40'}`} />
            {isThisWeek && (
              <span className="text-[7.5px] font-mono px-1.5 py-0.5 rounded bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20">
                THIS WEEK
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-[9.5px] text-white/32">
            <MapPin className="w-2.5 h-2.5 shrink-0" />
            <span>{signing.market}</span>
            <span className="text-white/15">·</span>
            <span className="font-mono text-white/25">{signing.genre}</span>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[10px] font-semibold text-white/55">{signing.signedDate}</p>
          <p className="text-[8.5px] font-mono text-white/25">{signing.agreementType}</p>
        </div>
      </div>

      <div className="px-4 pb-3 pt-0 space-y-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-[9.5px] font-mono">
            <Activity className="w-2.5 h-2.5 text-[#EF4444]/60" />
            <span className="text-white/42">{signing.scout}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[9.5px] font-mono">
            <UserCheck className="w-2.5 h-2.5 text-[#10B981]/60" />
            <span className="text-white/42">{signing.humanAR}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[9.5px] font-mono ml-auto">
            <span className="text-white/25">
              {(signing.monthlyListeners / 1000000).toFixed(1)}M listeners
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Shield className="w-2.5 h-2.5 text-[#EF4444]/45 shrink-0" />
          <div className="flex flex-wrap gap-1">
            {signing.aiScouts.map(s => (
              <span key={s} className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-[#EF4444]/[0.06] text-[#EF4444]/55 border border-[#EF4444]/12">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WeeklySignings() {
  const navigate = useNavigate();

  return (
    <div className="min-h-full bg-[#07080A]">
      <div className="bg-[#09090D] border-b border-[#10B981]/10 px-6 py-5">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#10B981]/20 to-[#34D399]/10 border border-[#10B981]/20 flex items-center justify-center shrink-0">
              <CheckCircle className="w-5 h-5 text-[#10B981]" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-[20px] font-bold text-white">Weekly Signings</h1>
                <span className="text-[8.5px] font-mono px-2 py-0.5 rounded bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20">
                  AUTO-UPDATED
                </span>
              </div>
              <p className="text-[11px] text-white/42">Signed deals auto-populate from pipeline completion</p>
            </div>
          </div>

          <div className="flex gap-2.5 ml-auto flex-wrap items-center">
            {[
              { label: 'This Week', value: THIS_WEEK_SIGNED.length, color: '#10B981' },
              { label: 'This Month', value: THIS_WEEK_SIGNED.length + HISTORICAL_SIGNINGS.length, color: '#06B6D4' },
              { label: 'All Time', value: TOTAL_ALL_TIME, color: '#F59E0B' },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex items-center gap-2 px-3 py-2 bg-white/[0.025] border border-white/[0.05] rounded-xl">
                <div>
                  <p className="text-[8px] font-mono text-white/30 uppercase tracking-wider">{label}</p>
                  <p className="text-[18px] font-bold leading-tight" style={{ color }}>{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-5 space-y-6">

        <div className="bg-[#0A0C0F] border border-[#10B981]/15 rounded-xl overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.06] bg-[#08090C]">
            <div className="w-[3px] h-4 rounded-full bg-[#10B981]" />
            <span className="text-[13px] font-bold text-white/90">This Week</span>
            <span className="text-[9px] font-mono text-white/28">Apr 7–11, 2026</span>
            <span className="ml-2 text-[8px] font-mono px-1.5 py-0.5 rounded bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20">
              {THIS_WEEK_SIGNED.length} signed
            </span>
            <button onClick={() => navigate('/dashboard/rocksteady/pipeline')}
              className="ml-auto flex items-center gap-1 text-[10px] font-mono text-[#10B981]/60 hover:text-[#10B981] transition-colors">
              View Pipeline <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          {THIS_WEEK_SIGNED.length > 0 ? (
            <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-3">
              {THIS_WEEK_SIGNED.map(signing => (
                <SigningCard key={signing.id} signing={signing} isThisWeek={true} />
              ))}
            </div>
          ) : (
            <div className="px-5 py-8 text-center">
              <p className="text-[12px] text-white/25 font-mono">No signings this week yet.</p>
              <p className="text-[10.5px] text-white/18 mt-1">Mark opportunities as Signed in the pipeline to auto-populate here.</p>
            </div>
          )}
        </div>

        <div className="bg-[#0A0C0F] border border-white/[0.07] rounded-xl overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.06] bg-[#08090C]">
            <div className="w-[3px] h-4 rounded-full bg-[#06B6D4]" />
            <span className="text-[13px] font-bold text-white/88">Recent Signings</span>
            <span className="text-[9px] font-mono text-white/28">March 2026</span>
          </div>
          <div className="p-4 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
            {HISTORICAL_SIGNINGS.map(signing => (
              <SigningCard key={signing.id} signing={signing} isThisWeek={false} />
            ))}
          </div>
        </div>

        <div className="bg-[#0A0C0F] border border-white/[0.07] rounded-xl overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.06] bg-[#08090C]">
            <div className="w-[3px] h-4 rounded-full bg-[#F59E0B]" />
            <span className="text-[13px] font-bold text-white/88">All-Time Summary</span>
          </div>
          <div className="px-5 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Signed Artists', value: `${TOTAL_ALL_TIME}`, color: '#F59E0B' },
              { label: 'Avg Time to Sign', value: '18 days', color: '#06B6D4' },
              { label: 'AI-Initiated Deals', value: '94%', color: '#EF4444' },
              { label: 'Human Escalation Rate', value: '62%', color: '#10B981' },
            ].map(m => (
              <div key={m.label} className="p-3 rounded-xl bg-white/[0.025] border border-white/[0.05]">
                <p className="text-[8.5px] font-mono text-white/28 uppercase tracking-widest mb-1">{m.label}</p>
                <p className="text-[18px] font-bold" style={{ color: m.color }}>{m.value}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
