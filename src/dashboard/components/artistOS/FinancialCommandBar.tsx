import { useState } from 'react';
import {
  TrendingUp, TrendingDown, Target, Zap, DollarSign,
  ChevronDown, ChevronUp, AlertTriangle, CheckCircle,
  AlertCircle, RefreshCcw, BarChart2, Radio, Mic2, Globe,
  Users, Layers, Info, Building2, ShieldCheck,
} from 'lucide-react';
import type { SignedArtist } from '../../data/artistRosterData';

const ARTIST_PAYOUT_BANK = {
  status: 'connected' as 'connected' | 'not_connected' | 'pending',
  institution: 'Bank of America Checking',
  last4: '4821',
  verified: true,
};

type TimeWindow = 'allTime' | 'ytd' | 'last30';

interface Props {
  artist: SignedArtist;
  timeWindow: TimeWindow;
  onRequestAdvance: () => void;
}

function fmtMoney(n: number) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(2)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n}`;
}

function getW<T extends { allTime: number; ytd: number; last30: number }>(obj: T, w: TimeWindow): number {
  return w === 'allTime' ? obj.allTime : w === 'ytd' ? obj.ytd : obj.last30;
}

export default function FinancialCommandBar({ artist, timeWindow, onRequestAdvance }: Props) {
  const [expanded, setExpanded] = useState(false);
  const fin = artist.financials;

  const revenue = timeWindow === 'allTime' ? fin.allTimeRevenue : timeWindow === 'ytd' ? fin.ytdRevenue : fin.last30Revenue;
  const recoupableSpend = getW(fin.totalRecoupableSpend, timeWindow);
  const nonRecoupableSpend = getW(fin.totalNonRecoupableSpend, timeWindow);

  const recoupPct = fin.allTimeRevenue > 0
    ? Math.min(Math.round((fin.allTimeRevenue / (fin.advance + fin.recoupableBalance + fin.allTimeRevenue)) * 100), 100)
    : 0;
  const isRecouped = recoupPct >= 100;
  const ytdRatio = fin.totalInvestment.ytd > 0 ? fin.ytdRevenue / fin.totalInvestment.ytd : 1;
  const highSpend = ytdRatio < 0.5 && fin.totalInvestment.ytd > 5000;

  const SPEND_BREAKDOWN = [
    { label: 'Artist Grant',        value: fin.artistGrant,                        recoupable: fin.artistGrantRecoupable, icon: DollarSign },
    { label: 'Ad Spend',            value: getW(fin.adSpend, timeWindow),           recoupable: true,  icon: Radio },
    { label: 'Marketing',           value: getW(fin.marketingSpend, timeWindow),    recoupable: true,  icon: BarChart2 },
    { label: 'Content Production',  value: getW(fin.contentProduction, timeWindow), recoupable: true,  icon: Mic2 },
    { label: 'Touring / Live',      value: getW(fin.touring, timeWindow) + getW(fin.liveShows, timeWindow), recoupable: false, icon: Globe },
    { label: 'A&R',                 value: getW(fin.arSpend, timeWindow),           recoupable: false, icon: Layers },
    { label: 'Operations / Team',   value: getW(fin.operationsPeople, timeWindow),  recoupable: false, icon: Users },
    { label: 'Other Recoupable',    value: getW(fin.otherRecoupable, timeWindow),   recoupable: true,  icon: Target },
    { label: 'Other Support',       value: getW(fin.otherNonRecoupable, timeWindow),recoupable: false, icon: Zap },
  ].filter(s => s.value > 0);

  const maxSpend = Math.max(...SPEND_BREAKDOWN.map(s => s.value), 1);

  return (
    <div className="bg-[#0A0B0E] border border-[#10B981]/20 rounded-2xl overflow-hidden relative">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#10B981]/50 to-transparent" />

      {/* ── TOP STATUS BAR ── */}
      <div className="flex items-center gap-2 px-5 py-2.5 border-b border-white/[0.04] bg-black/20">
        <div className={`w-2 h-2 rounded-full shrink-0 ${isRecouped ? 'bg-[#10B981]' : highSpend ? 'bg-[#EF4444] animate-pulse' : 'bg-[#F59E0B]'}`} />
        <span className={`text-[9px] font-mono uppercase tracking-wider ${isRecouped ? 'text-[#10B981]' : highSpend ? 'text-[#EF4444]' : 'text-[#F59E0B]'}`}>
          {isRecouped ? 'Profitable — All advances recouped' : highSpend ? 'Caution: High spend relative to revenue' : 'In Recoupment'}
        </span>
        {!isRecouped && (
          <span className="ml-auto text-[9px] font-mono text-white/25">{fmtMoney(fin.recoupableBalance)} remaining balance</span>
        )}
      </div>

      {/* ── MAIN METRICS ROW ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 divide-x divide-white/[0.04]">
        {[
          {
            label: 'YTD Revenue',
            value: fmtMoney(fin.ytdRevenue),
            color: '#10B981',
            icon: TrendingUp,
            sub: 'Year to date',
          },
          {
            label: 'Last 30 Days',
            value: fmtMoney(fin.last30Revenue),
            color: '#06B6D4',
            icon: BarChart2,
            sub: 'Rolling 30d',
          },
          {
            label: 'Recoupable Spend',
            value: fmtMoney(recoupableSpend),
            color: '#F59E0B',
            icon: Target,
            sub: timeWindow === 'last30' ? 'Last 30 days' : timeWindow === 'ytd' ? 'YTD' : 'All time',
          },
          {
            label: 'Non-Recoupable',
            value: fmtMoney(nonRecoupableSpend),
            color: '#10B981',
            icon: Zap,
            sub: 'GMG support',
          },
          {
            label: 'Advance Balance',
            value: fmtMoney(fin.recoupableBalance),
            color: isRecouped ? '#10B981' : '#EF4444',
            icon: RefreshCcw,
            sub: isRecouped ? 'Fully recouped' : 'Outstanding',
          },
          {
            label: 'Advance',
            value: fmtMoney(fin.advance),
            color: '#6B7280',
            icon: DollarSign,
            sub: 'Original signing',
          },
        ].map(m => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="px-4 py-4">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Icon className="w-3 h-3 shrink-0" style={{ color: m.color }} />
                <span className="text-[8.5px] font-mono text-white/25 uppercase tracking-wider truncate">{m.label}</span>
              </div>
              <p className="text-[18px] font-bold leading-none" style={{ color: m.color }}>{m.value}</p>
              <p className="text-[8px] font-mono text-white/18 mt-0.5">{m.sub}</p>
            </div>
          );
        })}
      </div>

      {/* ── RECOUPMENT PROGRESS ── */}
      <div className="px-5 py-3 border-t border-white/[0.04] bg-black/10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 shrink-0">
            {isRecouped
              ? <CheckCircle className="w-3 h-3 text-[#10B981]" />
              : <AlertCircle className="w-3 h-3 text-[#F59E0B]" />
            }
            <span className={`text-[9px] font-mono ${isRecouped ? 'text-[#10B981]' : 'text-[#F59E0B]'}`}>
              {isRecouped ? 'PROFITABLE' : 'IN RECOUPMENT'}
            </span>
          </div>
          <div className="flex-1 h-2 bg-white/[0.05] rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${recoupPct}%`,
                background: recoupPct >= 80 ? '#10B981' : recoupPct >= 50 ? '#F59E0B' : '#EF4444',
              }} />
          </div>
          <span className="text-[9px] font-mono text-white/30 shrink-0">{recoupPct}%</span>
          <button
            onClick={onRequestAdvance}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-mono text-[#F59E0B] bg-[#F59E0B]/10 border border-[#F59E0B]/20 hover:bg-[#F59E0B]/18 transition-all shrink-0"
          >
            <DollarSign className="w-3 h-3" />
            Request Advance
          </button>
          <button
            onClick={() => setExpanded(v => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-mono text-white/30 bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.07] transition-all shrink-0"
          >
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            {expanded ? 'Hide' : 'View'} Breakdown
          </button>

          {/* Payout bank status */}
          {ARTIST_PAYOUT_BANK.status === 'connected' ? (
            <div className="flex items-center gap-1.5 ml-auto px-2.5 py-1 rounded-lg border shrink-0"
              style={{ background: 'rgba(16,185,129,0.06)', borderColor: 'rgba(16,185,129,0.18)' }}>
              <Building2 className="w-2.5 h-2.5 shrink-0" style={{ color: '#10B981' }} />
              <span className="text-[9px] font-mono" style={{ color: 'rgba(16,185,129,0.7)' }}>
                {ARTIST_PAYOUT_BANK.institution} &bull;&bull;&bull;&bull; {ARTIST_PAYOUT_BANK.last4}
              </span>
              {ARTIST_PAYOUT_BANK.verified && <ShieldCheck className="w-2.5 h-2.5" style={{ color: '#10B981' }} />}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 ml-auto px-2.5 py-1 rounded-lg border shrink-0"
              style={{ background: 'rgba(239,68,68,0.06)', borderColor: 'rgba(239,68,68,0.2)' }}>
              <AlertCircle className="w-2.5 h-2.5 shrink-0" style={{ color: '#EF4444' }} />
              <span className="text-[9px] font-mono" style={{ color: 'rgba(239,68,68,0.7)' }}>
                {ARTIST_PAYOUT_BANK.status === 'pending' ? 'Bank verification pending' : 'No payout bank connected'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── EXPANDED SPEND BREAKDOWN ── */}
      {expanded && (
        <div className="border-t border-white/[0.04] px-5 py-4 bg-black/25">
          {highSpend && (
            <div className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl bg-[#F59E0B]/06 border border-[#F59E0B]/18 text-[11px] text-[#F59E0B]/80 mb-4">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#F59E0B]" />
              <span>YTD return is {Math.round(ytdRatio * 100)}¢ per $1 invested. Review campaign performance before approving new recoupable spend.</span>
            </div>
          )}
          {fin.recoupableBalance > fin.ytdRevenue * 2 && !highSpend && (
            <div className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl bg-[#06B6D4]/06 border border-[#06B6D4]/15 text-[11px] text-[#06B6D4]/70 mb-4">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>Recoupable balance is {(fin.recoupableBalance / Math.max(fin.ytdRevenue, 1)).toFixed(1)}x YTD revenue. Additional recoupable spend extends your timeline to profitability.</span>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SPEND_BREAKDOWN.map(s => {
              const Icon = s.icon;
              const barPct = (s.value / maxSpend) * 100;
              return (
                <div key={s.label} className="flex items-center gap-3">
                  <div className="w-4 shrink-0 flex items-center justify-center">
                    <Icon className="w-3 h-3 text-white/20" />
                  </div>
                  <span className="text-[10px] text-white/40 w-36 shrink-0 truncate">{s.label}</span>
                  <div className="flex-1 h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                    <div className="h-full rounded-full"
                      style={{ width: `${barPct}%`, background: s.recoupable ? 'rgba(245,158,11,0.55)' : 'rgba(16,185,129,0.50)' }} />
                  </div>
                  <span className="text-[10px] font-mono text-white/45 w-14 text-right shrink-0">{fmtMoney(s.value)}</span>
                  <span className={`text-[7px] font-mono px-1 py-0.5 rounded border shrink-0 ${s.recoupable ? 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/20' : 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20'}`}>
                    {s.recoupable ? 'RECOUP' : 'SUPPORT'}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-5 mt-4 pt-3 border-t border-white/[0.05]">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-[#F59E0B]/55" />
              <span className="text-[9px] font-mono text-white/25">Recoupable — charged against earnings</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-[#10B981]/50" />
              <span className="text-[9px] font-mono text-white/25">Non-recoupable — GMG support investment</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
