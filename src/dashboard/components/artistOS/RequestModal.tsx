import { useState } from 'react';
import { X, Send, AlertCircle, CheckCircle, DollarSign, TrendingUp, TrendingDown, Info, ChevronDown } from 'lucide-react';
import type { SignedArtist } from '../../data/artistRosterData';
import { createRequest, type RequestType, type RequestPriority } from '../../data/requestsService';

interface Props {
  artist: SignedArtist;
  submittedByEmail: string;
  submittedByRole: string;
  labelId?: string;
  onClose: () => void;
  onSuccess?: () => void;
}

const REQUEST_TYPES: RequestType[] = [
  'Marketing Campaign', 'Ad Spend', 'Content Production',
  'Release Support', 'Strategy Support', 'Other',
];

const TIMELINE_OPTIONS = [
  'ASAP (within 48 hours)',
  'This week',
  'Within 2 weeks',
  'Within 30 days',
  'Flexible',
];

const BUDGET_RANGES = [
  'Under $500', '$500 – $1,000', '$1,000 – $2,500',
  '$2,500 – $5,000', '$5,000 – $10,000', '$10,000+', 'No budget specified',
];

function fmtMoney(n: number) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(2)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n}`;
}

export default function RequestModal({ artist, submittedByEmail, submittedByRole, labelId, onClose, onSuccess }: Props) {
  const [requestType, setRequestType] = useState<RequestType>('Marketing Campaign');
  const [priority, setPriority] = useState<RequestPriority>('medium');
  const [budgetRange, setBudgetRange] = useState('');
  const [description, setDescription] = useState('');
  const [timeline, setTimeline] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const fin = artist.financials;
  const ytdRevenue = fin.ytdRevenue;
  const ytdInvestment = fin.totalInvestment.ytd;
  const recoupPct = fin.allTimeRevenue > 0
    ? Math.min(Math.round((fin.allTimeRevenue / (fin.advance + fin.recoupableBalance + fin.allTimeRevenue)) * 100), 100)
    : 0;
  const isRecouped = recoupPct >= 100;
  const spendRatio = ytdInvestment > 0 ? ytdRevenue / ytdInvestment : 1;
  const highSpendWarning = spendRatio < 0.5 && ytdInvestment > 5000;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!description.trim()) { setError('Please provide a description.'); return; }
    if (!timeline) { setError('Please select a desired timeline.'); return; }
    setError('');
    setSubmitting(true);

    const { error: reqError } = await createRequest({
      request_type: requestType,
      artist_id: artist.id,
      artist_name: artist.name,
      label_id: labelId,
      submitted_by_email: submittedByEmail,
      submitted_by_role: submittedByRole,
      priority,
      budget_range: budgetRange || undefined,
      description: description.trim(),
      desired_timeline: timeline,
    });

    setSubmitting(false);
    if (reqError) {
      setError('Failed to submit request. Please try again.');
      return;
    }
    setSuccess(true);
    setTimeout(() => {
      onSuccess?.();
      onClose();
    }, 1800);
  }

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <div className="bg-[#0D0E11] border border-[#10B981]/30 rounded-2xl p-8 max-w-sm w-full text-center">
          <div className="w-14 h-14 rounded-full bg-[#10B981]/14 border border-[#10B981]/30 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-7 h-7 text-[#10B981]" />
          </div>
          <p className="text-[16px] font-bold text-white mb-2">Request Submitted</p>
          <p className="text-[12px] text-white/45">Your {requestType} request for {artist.name} has been logged and is now In Review.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-[#0D0E11] border border-white/[0.10] rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#06B6D4]/40 to-transparent rounded-t-2xl" style={{ position: 'sticky', top: 0 }} />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.07] sticky top-0 bg-[#0D0E11] z-10">
          <div>
            <h2 className="text-[15px] font-bold text-white">Submit Request</h2>
            <p className="text-[10px] font-mono text-white/30 mt-0.5">{artist.name} · Artist OS</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/[0.05] hover:bg-white/[0.10] flex items-center justify-center transition-colors">
            <X className="w-4 h-4 text-white/50" />
          </button>
        </div>

        {/* Economics snapshot — BEFORE FORM */}
        <div className="mx-6 mt-5 mb-4 bg-black/30 border border-white/[0.07] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-3.5 h-3.5 text-[#06B6D4]/70" />
            <span className="text-[9.5px] font-mono text-[#06B6D4]/60 uppercase tracking-wider">Review your position before submitting new spend requests</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <p className="text-[8px] font-mono text-white/20 uppercase tracking-wider mb-1">YTD Revenue</p>
              <p className="text-[15px] font-bold text-[#10B981]">{fmtMoney(ytdRevenue)}</p>
            </div>
            <div>
              <p className="text-[8px] font-mono text-white/20 uppercase tracking-wider mb-1">YTD Investment</p>
              <p className="text-[15px] font-bold text-[#EF4444]">{fmtMoney(ytdInvestment)}</p>
            </div>
            <div>
              <p className="text-[8px] font-mono text-white/20 uppercase tracking-wider mb-1">Recoupment</p>
              <p className={`text-[15px] font-bold ${isRecouped ? 'text-[#10B981]' : 'text-[#F59E0B]'}`}>{recoupPct}%</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-white/[0.05]">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[9px] font-mono text-white/25 uppercase tracking-wider">Recoupment progress</span>
              <span className={`text-[9px] font-mono ml-auto ${isRecouped ? 'text-[#10B981]' : 'text-[#F59E0B]'}`}>
                {isRecouped ? 'Profitable' : `${fmtMoney(fin.recoupableBalance)} remaining`}
              </span>
            </div>
            <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${recoupPct}%`, background: recoupPct >= 80 ? '#10B981' : recoupPct >= 50 ? '#F59E0B' : '#EF4444' }} />
            </div>
          </div>
          {highSpendWarning && (
            <div className="mt-3 flex items-start gap-2 p-2.5 rounded-lg bg-[#F59E0B]/08 border border-[#F59E0B]/20">
              <AlertCircle className="w-3.5 h-3.5 text-[#F59E0B] shrink-0 mt-0.5" />
              <p className="text-[10px] text-[#F59E0B]/80 leading-snug">
                YTD return is {Math.round(spendRatio * 100)}¢ per $1 invested. Consider reviewing current campaigns before adding new spend.
              </p>
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">

          {/* Request Type */}
          <div>
            <label className="block text-[10px] font-mono text-white/30 uppercase tracking-wider mb-2">Request Type</label>
            <div className="grid grid-cols-2 gap-2">
              {REQUEST_TYPES.map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setRequestType(t)}
                  className={`text-left px-3 py-2.5 rounded-xl border text-[11px] font-medium transition-all ${
                    requestType === t
                      ? 'bg-[#06B6D4]/14 border-[#06B6D4]/35 text-[#06B6D4]'
                      : 'bg-white/[0.025] border-white/[0.07] text-white/45 hover:text-white/65 hover:border-white/[0.12]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Artist (read-only) */}
          <div>
            <label className="block text-[10px] font-mono text-white/30 uppercase tracking-wider mb-2">Artist</label>
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-white/[0.025] border border-white/[0.07]">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center border"
                style={{ background: `${artist.avatarColor}20`, borderColor: `${artist.avatarColor}35` }}>
                <span className="text-[8px] font-bold" style={{ color: artist.avatarColor }}>{artist.avatarInitials}</span>
              </div>
              <span className="text-[12px] text-white/70">{artist.name}</span>
              <span className="text-[9px] font-mono text-white/25 ml-1">{artist.genre.split(' · ')[0]}</span>
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-[10px] font-mono text-white/30 uppercase tracking-wider mb-2">Priority Level</label>
            <div className="flex items-center gap-2">
              {([
                { v: 'high', label: 'High', color: '#EF4444' },
                { v: 'medium', label: 'Medium', color: '#F59E0B' },
                { v: 'low', label: 'Low', color: '#6B7280' },
              ] as const).map(p => (
                <button
                  key={p.v}
                  type="button"
                  onClick={() => setPriority(p.v)}
                  className={`flex-1 py-2.5 rounded-xl border text-[11px] font-semibold transition-all ${
                    priority === p.v
                      ? 'border-opacity-40'
                      : 'bg-white/[0.025] border-white/[0.07] text-white/35 hover:text-white/55'
                  }`}
                  style={priority === p.v ? { color: p.color, background: `${p.color}12`, borderColor: `${p.color}35` } : {}}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Budget Range */}
          <div>
            <label className="block text-[10px] font-mono text-white/30 uppercase tracking-wider mb-2">Budget Range <span className="text-white/20 normal-case font-normal">(optional but encouraged)</span></label>
            <div className="relative">
              <select
                value={budgetRange}
                onChange={e => setBudgetRange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.025] border border-white/[0.07] text-[12px] text-white/65 outline-none appearance-none focus:border-[#06B6D4]/35 transition-colors"
              >
                <option value="">Select a range...</option>
                {BUDGET_RANGES.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25 pointer-events-none" />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[10px] font-mono text-white/30 uppercase tracking-wider mb-2">Description <span className="text-[#EF4444]/60">*</span></label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe what you need, why it matters, and any specific details or requirements..."
              rows={4}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.025] border border-white/[0.07] text-[12px] text-white/75 placeholder-white/20 outline-none focus:border-[#06B6D4]/35 transition-colors resize-none leading-relaxed"
            />
          </div>

          {/* Timeline */}
          <div>
            <label className="block text-[10px] font-mono text-white/30 uppercase tracking-wider mb-2">Desired Timeline <span className="text-[#EF4444]/60">*</span></label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {TIMELINE_OPTIONS.map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTimeline(t)}
                  className={`text-left px-3 py-2 rounded-xl border text-[10px] transition-all ${
                    timeline === t
                      ? 'bg-[#06B6D4]/12 border-[#06B6D4]/30 text-[#06B6D4]'
                      : 'bg-white/[0.02] border-white/[0.06] text-white/35 hover:text-white/55 hover:border-white/[0.10]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#EF4444]/08 border border-[#EF4444]/20">
              <AlertCircle className="w-3.5 h-3.5 text-[#EF4444] shrink-0" />
              <p className="text-[11px] text-[#EF4444]/85">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-semibold transition-all border ${
              submitting
                ? 'bg-white/[0.04] border-white/[0.08] text-white/25 cursor-not-allowed'
                : 'bg-[#06B6D4]/16 border-[#06B6D4]/35 text-[#06B6D4] hover:bg-[#06B6D4]/24 cursor-pointer'
            }`}
          >
            <Send className="w-4 h-4" />
            {submitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </div>
    </div>
  );
}
