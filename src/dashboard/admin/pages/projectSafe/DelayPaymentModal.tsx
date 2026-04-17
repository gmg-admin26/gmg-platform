import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import type { DelayCategory } from '../../../data/workerPaymentService';
import { CATEGORY_LABEL } from './safeHelpers';

export interface DelayPayload {
  title: string;
  description: string;
  category: DelayCategory;
  requires_worker_action: boolean;
}

export default function DelayPaymentModal({
  workerName,
  onClose,
  onSubmit,
}: {
  workerName: string;
  onClose: () => void;
  onSubmit: (payload: DelayPayload) => void;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<DelayCategory>('other');
  const [requiresWorker, setRequiresWorker] = useState(true);

  const canSubmit = title.trim().length > 2 && description.trim().length > 5;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div
        className="w-full max-w-xl rounded-xl border border-[#EF4444]/30 bg-[#0B0C0F] overflow-hidden"
        style={{ boxShadow: '0 0 80px #EF444420, inset 0 0 0 1px rgba(255,255,255,0.03)' }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: '#EF444414', border: '1px solid #EF444430' }}>
              <AlertTriangle className="w-3.5 h-3.5 text-[#EF4444]" />
            </div>
            <div>
              <div className="text-[9px] font-mono uppercase tracking-widest text-[#EF4444]">Delay Payment</div>
              <div className="text-[13px] text-white/85 font-medium">{workerName}</div>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-white/[0.05] text-white/40 hover:text-white/80">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <Field label="Delay Title">
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Upstream settlement pending from partner"
              className="w-full bg-[#0E0F12] border border-white/[0.08] rounded-md px-3 py-2 text-[13px] text-white/85 placeholder:text-white/25 focus:outline-none focus:border-[#EF4444]/40"
            />
          </Field>

          <Field label="Category">
            <div className="grid grid-cols-2 gap-1.5">
              {(Object.keys(CATEGORY_LABEL) as DelayCategory[]).map(k => (
                <button
                  key={k}
                  onClick={() => setCategory(k)}
                  className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-1.5 rounded border transition-all text-left ${
                    category === k
                      ? 'text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/40'
                      : 'text-white/45 bg-white/[0.02] border-white/[0.06] hover:text-white/75'
                  }`}
                >
                  {CATEGORY_LABEL[k]}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Description">
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={4}
              placeholder="What is blocking this release? What needs to happen to clear it?"
              className="w-full bg-[#0E0F12] border border-white/[0.08] rounded-md px-3 py-2 text-[12.5px] text-white/85 placeholder:text-white/25 focus:outline-none focus:border-[#EF4444]/40 resize-none"
            />
          </Field>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => setRequiresWorker(!requiresWorker)}
              className={`w-9 h-5 rounded-full relative transition-colors ${requiresWorker ? 'bg-[#EF4444]' : 'bg-white/10'}`}
            >
              <span
                className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform"
                style={{ transform: requiresWorker ? 'translateX(18px)' : 'translateX(2px)' }}
              />
            </button>
            <span className="text-[12px] text-white/75">Requires worker action</span>
            <span className="text-[10px] text-white/35 ml-auto font-mono">
              {requiresWorker ? 'Worker will see this on Project OS' : 'Internal only — not shown to worker'}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-3.5 border-t border-white/[0.06] bg-black/20">
          <button onClick={onClose} className="px-3.5 py-1.5 text-[11px] font-mono tracking-wider uppercase text-white/50 hover:text-white/85">
            Cancel
          </button>
          <button
            disabled={!canSubmit}
            onClick={() => onSubmit({ title: title.trim(), description: description.trim(), category, requires_worker_action: requiresWorker })}
            className="px-3.5 py-1.5 text-[11px] font-mono tracking-wider uppercase rounded border transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ color: '#EF4444', background: '#EF444414', borderColor: '#EF444440' }}
          >
            Delay Payment
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
