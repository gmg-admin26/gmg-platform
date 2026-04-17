import { useState } from 'react';
import { X, Send } from 'lucide-react';
import type { WorkerWithRelations, ReleaseType } from '../../../data/workerPaymentService';
import { RELEASE_TYPE_LABEL } from './safeHelpers';

export interface InitiatePayload {
  worker_id: string;
  amount: number;
  release_type: ReleaseType;
  notes: string;
}

export default function InitiatePaymentModal({
  workers,
  defaultWorkerId,
  onClose,
  onSubmit,
}: {
  workers: WorkerWithRelations[];
  defaultWorkerId?: string;
  onClose: () => void;
  onSubmit: (payload: InitiatePayload) => void;
}) {
  const [workerId, setWorkerId] = useState<string>(defaultWorkerId ?? workers[0]?.id ?? '');
  const [amount, setAmount] = useState<string>('');
  const [releaseType, setReleaseType] = useState<ReleaseType>('partial');
  const [notes, setNotes] = useState('');

  const worker = workers.find(w => w.id === workerId);
  const parsed = parseFloat(amount);
  const canSubmit = !!worker && !isNaN(parsed) && parsed > 0;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div
        className="w-full max-w-xl rounded-xl border border-[#10B981]/30 bg-[#0B0C0F] overflow-hidden"
        style={{ boxShadow: '0 0 80px #10B98122, inset 0 0 0 1px rgba(255,255,255,0.03)' }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: '#10B98114', border: '1px solid #10B98130' }}>
              <Send className="w-3.5 h-3.5 text-[#10B981]" />
            </div>
            <div>
              <div className="text-[9px] font-mono uppercase tracking-widest text-[#10B981]">Initiate Payment</div>
              <div className="text-[13px] text-white/85 font-medium">Release funds from Project Safe</div>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-white/[0.05] text-white/40 hover:text-white/80">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <Field label="Worker">
            <select
              value={workerId}
              onChange={e => setWorkerId(e.target.value)}
              className="w-full bg-[#0E0F12] border border-white/[0.08] rounded-md px-3 py-2 text-[13px] text-white/85 focus:outline-none focus:border-[#10B981]/40"
            >
              {workers.map(w => (
                <option key={w.id} value={w.id} className="bg-[#0E0F12]">
                  {w.name} — {w.role}
                </option>
              ))}
            </select>
          </Field>

          {worker && (
            <Field label="Project">
              <div className="px-3 py-2 text-[12.5px] text-white/65 bg-[#0E0F12] border border-white/[0.06] rounded-md font-mono">
                {worker.project || '—'}
              </div>
            </Field>
          )}

          <Field label="Amount (USD)">
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-[#0E0F12] border border-white/[0.08] rounded-md px-3 py-2 text-[13px] text-white/85 placeholder:text-white/25 focus:outline-none focus:border-[#10B981]/40 font-mono"
            />
          </Field>

          <Field label="Release Type">
            <div className="grid grid-cols-2 gap-1.5">
              {(Object.keys(RELEASE_TYPE_LABEL) as ReleaseType[]).map(k => (
                <button
                  key={k}
                  onClick={() => setReleaseType(k)}
                  className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-1.5 rounded border transition-all ${
                    releaseType === k
                      ? 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/40'
                      : 'text-white/45 bg-white/[0.02] border-white/[0.06] hover:text-white/75'
                  }`}
                >
                  {RELEASE_TYPE_LABEL[k]}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Internal Notes">
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              placeholder="Context for finance — referenced invoice, milestone, or memo line"
              className="w-full bg-[#0E0F12] border border-white/[0.08] rounded-md px-3 py-2 text-[12.5px] text-white/85 placeholder:text-white/25 focus:outline-none focus:border-[#10B981]/40 resize-none"
            />
          </Field>
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-3.5 border-t border-white/[0.06] bg-black/20">
          <button onClick={onClose} className="px-3.5 py-1.5 text-[11px] font-mono tracking-wider uppercase text-white/50 hover:text-white/85">
            Cancel
          </button>
          <button
            disabled={!canSubmit}
            onClick={() => onSubmit({ worker_id: workerId, amount: parsed, release_type: releaseType, notes: notes.trim() })}
            className="px-3.5 py-1.5 text-[11px] font-mono tracking-wider uppercase rounded border transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ color: '#10B981', background: '#10B98114', borderColor: '#10B98140' }}
          >
            Initiate Release
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[9px] font-mono uppercase tracking-widest text-white/35 mb-1.5">{label}</div>
      {children}
    </div>
  );
}
