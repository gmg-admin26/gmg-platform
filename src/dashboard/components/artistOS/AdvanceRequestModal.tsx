import { useState } from 'react';
import {
  X, Send, AlertTriangle, CheckCircle, DollarSign,
  TrendingUp, Clock, Info, ChevronDown
} from 'lucide-react';
import type { SignedArtist } from '../../data/artistRosterData';
import { createRequest } from '../../data/requestsService';

interface Props {
  artist: SignedArtist;
  submittedByEmail: string;
  submittedByRole: string;
  onClose: () => void;
}

function fmtMoney(n: number) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(2)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n}`;
}

const CAMPAIGN_PURPOSES = [
  'Ad spend — paid social campaigns',
  'Influencer seeding / creator push',
  'Playlist pitching / PR push',
  'Content production (video, photos)',
  'Tour / live performance support',
  'Merchandise / product development',
  'Release marketing — full campaign',
  'Other / general artist support',
];

const EXPECTED_OUTCOMES = [
  'Streaming growth (100K+ new streams)',
  'Audience growth (10K+ new followers)',
  'Release launch support',
  'Geographic market expansion',
  'Platform algorithmic push',
  'Tour ticket sales',
  'Merchandise revenue',
];

const PRIORITY_LEVELS = [
  { value: 'high', label: 'High — Time sensitive (48h)', color: '#EF4444' },
  { value: 'medium', label: 'Medium — This week', color: '#F59E0B' },
  { value: 'low', label: 'Low — Within 30 days', color: '#6B7280' },
];

export default function AdvanceRequestModal({ artist, submittedByEmail, submittedByRole, onClose }: Props) {
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [outcome, setOutcome] = useState('');
  const [priority, setPriority] = useState('medium');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const fin = artist.financials;
  const recoupPct = fin.allTimeRevenue > 0
    ? Math.min(Math.round((fin.allTimeRevenue / (fin.advance + fin.recoupableBalance + fin.allTimeRevenue)) * 100), 100)
    : 0;

  const amountNum = parseFloat(amount.replace(/[^0-9.]/g, '')) || 0;
  const projectedBalance = fin.recoupableBalance + amountNum;
  const monthlyRevenue = fin.last30Revenue;
  const projectedMonths = monthlyRevenue > 0 ? Math.ceil(projectedBalance / (monthlyRevenue * 0.7)) : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!amount || amountNum <= 0) { setError('Please enter a valid advance amount.'); return; }
    if (!purpose) { setError('Please select a campaign purpose.'); return; }
    if (!outcome) { setError('Please select an expected outcome.'); return; }
    setError('');
    setSubmitting(true);

    const description = [
      `ADVANCE REQUEST — Against Streaming Revenue`,
      `Requested Amount: $${amountNum.toLocaleString()}`,
      `Purpose: ${purpose}`,
      `Expected Outcome: ${outcome}`,
      additionalNotes ? `Notes: ${additionalNotes}` : '',
    ].filter(Boolean).join('\n');

    const { error: reqError } = await createRequest({
      request_type: 'Ad Spend',
      artist_id: artist.id,
      artist_name: artist.name,
      submitted_by_email: submittedByEmail,
      submitted_by_role: submittedByRole,
      priority: priority as 'high' | 'medium' | 'low',
      budget_range: `$${amountNum.toLocaleString()}`,
      description,
      desired_timeline: priority === 'high' ? 'ASAP (within 48 hours)' : priority === 'medium' ? 'This week' : 'Within 30 days',
    });

    setSubmitting(false);
    if (reqError) { setError('Failed to submit. Please try again.'); return; }
    setSuccess(true);
    setTimeout(onClose, 2200);
  }

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
        <div className="bg-[#0D0E11] border border-[#F59E0B]/30 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
          <div className="w-14 h-14 rounded-full bg-[#F59E0B]/14 border border-[#F59E0B]/30 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-7 h-7 text-[#F59E0B]" />
          </div>
          <p className="text-[16px] font-bold text-white mb-2">Advance Request Submitted</p>
          <p className="text-[12px] text-white/40 mb-3">
            Your advance request of {amount && `$${amountNum.toLocaleString()}`} is now In Review.
          </p>
          <div className="flex items-start gap-2 px-3 py-2 rounded-xl bg-[#F59E0B]/08 border border-[#F59E0B]/20">
            <Info className="w-3.5 h-3.5 text-[#F59E0B] shrink-0 mt-0.5" />
            <p className="text-[10px] text-[#F59E0B]/70 text-left leading-relaxed">
              This advance will be recouped from future streaming and revenue. GMG will contact you within 24–48 hours.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-[#0D0E11] border border-white/[0.10] rounded-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto shadow-2xl">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#F59E0B]/45 to-transparent rounded-t-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.07] sticky top-0 bg-[#0D0E11] z-10">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <DollarSign className="w-4 h-4 text-[#F59E0B]" />
              <h2 className="text-[15px] font-bold text-white">Request Advance</h2>
              <span className="text-[8px] font-mono px-1.5 py-0.5 rounded border text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/20">
                RECOUPABLE
              </span>
            </div>
            <p className="text-[10px] font-mono text-white/30">{artist.name} · Against Streaming Revenue</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/[0.05] hover:bg-white/[0.10] flex items-center justify-center transition-colors">
            <X className="w-4 h-4 text-white/50" />
          </button>
        </div>

        {/* Recoupment Warning Banner */}
        <div className="mx-6 mt-5 mb-4 flex items-start gap-3 px-4 py-3.5 rounded-xl bg-[#F59E0B]/07 border border-[#F59E0B]/22">
          <AlertTriangle className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
          <div>
            <p className="text-[11px] font-semibold text-[#F59E0B] mb-0.5">Advance Against Streaming Revenue</p>
            <p className="text-[10px] text-[#F59E0B]/70 leading-relaxed">
              This advance will be automatically flagged as recoupable and charged back against your future streaming, sync, and performance revenue.
              Current recoupment balance: {fmtMoney(fin.recoupableBalance)}
            </p>
          </div>
        </div>

        {/* Current Position */}
        <div className="mx-6 mb-4 bg-black/30 border border-white/[0.06] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-3 h-3 text-white/30" />
            <span className="text-[9px] font-mono text-white/25 uppercase tracking-wider">Your current financial position</span>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div>
              <p className="text-[8px] font-mono text-white/20 uppercase tracking-wider mb-1">YTD Revenue</p>
              <p className="text-[15px] font-bold text-[#10B981]">{fmtMoney(fin.ytdRevenue)}</p>
            </div>
            <div>
              <p className="text-[8px] font-mono text-white/20 uppercase tracking-wider mb-1">Recoup Balance</p>
              <p className="text-[15px] font-bold text-[#F59E0B]">{fmtMoney(fin.recoupableBalance)}</p>
            </div>
            <div>
              <p className="text-[8px] font-mono text-white/20 uppercase tracking-wider mb-1">Recouped</p>
              <p className="text-[15px] font-bold text-white/60">{recoupPct}%</p>
            </div>
          </div>
          <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
            <div className="h-full rounded-full"
              style={{ width: `${recoupPct}%`, background: recoupPct >= 80 ? '#10B981' : recoupPct >= 50 ? '#F59E0B' : '#EF4444' }} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-5">

          {/* Amount */}
          <div>
            <label className="block text-[10px] font-mono text-white/30 uppercase tracking-wider mb-2">
              Requested Amount <span className="text-[#EF4444]/60">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 text-[14px] font-bold">$</span>
              <input
                type="number"
                value={amount}
                onChange={e => { setAmount(e.target.value); setError(''); }}
                placeholder="0"
                min="0"
                required
                className="w-full pl-7 pr-4 py-3 rounded-xl bg-white/[0.025] border border-white/[0.07] text-[16px] font-bold text-white outline-none focus:border-[#F59E0B]/35 transition-colors"
              />
            </div>
            {amountNum > 0 && (
              <div className="mt-2 flex items-start gap-2 p-2.5 rounded-lg bg-black/20 border border-white/[0.05]">
                <TrendingUp className="w-3 h-3 text-[#10B981] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] text-white/40">
                    New recoupable balance: <span className="text-[#F59E0B]">{fmtMoney(projectedBalance)}</span>
                  </p>
                  {projectedMonths && (
                    <p className="text-[10px] text-white/30 mt-0.5 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      Est. recoupment timeline: <span className="text-white/50 ml-1">{projectedMonths} months</span> at current revenue pace
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Purpose */}
          <div>
            <label className="block text-[10px] font-mono text-white/30 uppercase tracking-wider mb-2">
              Campaign Purpose <span className="text-[#EF4444]/60">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CAMPAIGN_PURPOSES.map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPurpose(p)}
                  className={`text-left px-3 py-2.5 rounded-xl border text-[10px] font-medium transition-all ${
                    purpose === p
                      ? 'bg-[#F59E0B]/12 border-[#F59E0B]/30 text-[#F59E0B]'
                      : 'bg-white/[0.02] border-white/[0.06] text-white/40 hover:text-white/60 hover:border-white/[0.10]'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Expected Outcome */}
          <div>
            <label className="block text-[10px] font-mono text-white/30 uppercase tracking-wider mb-2">
              Expected Outcome <span className="text-[#EF4444]/60">*</span>
            </label>
            <div className="relative">
              <select
                value={outcome}
                onChange={e => setOutcome(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.025] border border-white/[0.07] text-[12px] text-white/65 outline-none appearance-none focus:border-[#F59E0B]/30 transition-colors"
              >
                <option value="">Select expected outcome...</option>
                {EXPECTED_OUTCOMES.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25 pointer-events-none" />
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-[10px] font-mono text-white/30 uppercase tracking-wider mb-2">Priority Level</label>
            <div className="space-y-2">
              {PRIORITY_LEVELS.map(p => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPriority(p.value)}
                  className={`w-full text-left flex items-center gap-3 px-3.5 py-2.5 rounded-xl border text-[11px] font-medium transition-all ${
                    priority === p.value
                      ? ''
                      : 'bg-white/[0.02] border-white/[0.06] text-white/40 hover:border-white/[0.10]'
                  }`}
                  style={priority === p.value ? { color: p.color, background: `${p.color}10`, borderColor: `${p.color}30` } : {}}
                >
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: priority === p.value ? p.color : 'rgba(255,255,255,0.15)' }} />
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-[10px] font-mono text-white/30 uppercase tracking-wider mb-2">
              Additional Notes <span className="text-white/20 normal-case font-normal">(optional)</span>
            </label>
            <textarea
              value={additionalNotes}
              onChange={e => setAdditionalNotes(e.target.value)}
              placeholder="Provide any additional context, timing requirements, or specific campaign details..."
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.025] border border-white/[0.07] text-[12px] text-white/75 placeholder-white/20 outline-none focus:border-[#F59E0B]/30 transition-colors resize-none leading-relaxed"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#EF4444]/08 border border-[#EF4444]/20">
              <AlertTriangle className="w-3.5 h-3.5 text-[#EF4444] shrink-0" />
              <p className="text-[11px] text-[#EF4444]/85">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-[13px] font-semibold transition-all border ${
              submitting
                ? 'bg-white/[0.04] border-white/[0.08] text-white/25 cursor-not-allowed'
                : 'bg-[#F59E0B]/16 border-[#F59E0B]/35 text-[#F59E0B] hover:bg-[#F59E0B]/24 cursor-pointer'
            }`}
          >
            <Send className="w-4 h-4" />
            {submitting ? 'Submitting...' : 'Submit Advance Request'}
          </button>

          <p className="text-[9px] font-mono text-white/20 text-center leading-relaxed">
            By submitting this request, you acknowledge this advance will be recouped from future streaming revenue.
            GMG team will review within 24–48 hours.
          </p>
        </form>
      </div>
    </div>
  );
}
