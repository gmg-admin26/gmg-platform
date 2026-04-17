import { useState, useEffect, useRef } from 'react';
import { X, CheckCircle, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Props {
  open: boolean;
  onClose: () => void;
}

const ROLES = [
  { value: 'artist',   label: 'Artist' },
  { value: 'manager',  label: 'Manager' },
  { value: 'label',    label: 'Label' },
  { value: 'investor', label: 'Investor' },
  { value: 'other',    label: 'Other' },
];

interface FormState {
  name: string;
  email: string;
  company: string;
  role: string;
  message: string;
}

const EMPTY: FormState = { name: '', email: '', company: '', role: '', message: '' };

export default function CatalogAccessRequestModal({ open, onClose }: Props) {
  const [form, setForm]         = useState<FormState>(EMPTY);
  const [phase, setPhase]       = useState<'form' | 'loading' | 'done'>('form');
  const [error, setError]       = useState('');
  const [visible, setVisible]   = useState(false);
  const overlayRef              = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setVisible(true);
      setForm(EMPTY);
      setPhase('form');
      setError('');
    } else {
      setVisible(false);
    }
  }, [open]);

  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === overlayRef.current) onClose();
  }

  function set(field: keyof FormState, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
    setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (phase !== 'form') return;
    if (!form.role) { setError('Please select your role.'); return; }
    setPhase('loading');
    try {
      const { error: dbError } = await supabase
        .from('catalog_access_requests')
        .insert({
          name:    form.name.trim(),
          email:   form.email.trim().toLowerCase(),
          company: form.company.trim(),
          role:    form.role,
          message: form.message.trim(),
        });
      if (dbError) throw dbError;
      setPhase('done');
    } catch {
      setError('Something went wrong. Please try again.');
      setPhase('form');
    }
  }

  if (!open && !visible) return null;

  const isLoading = phase === 'loading';
  const isDone    = phase === 'done';

  return (
    <>
      <style>{`
        @keyframes car-overlay-in  { from{opacity:0} to{opacity:1} }
        @keyframes car-modal-in    { from{opacity:0;transform:translateY(18px) scale(0.98)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes car-check-in    { from{opacity:0;transform:scale(0.7)} to{opacity:1;transform:scale(1)} }
        @keyframes car-spin        { to{transform:rotate(360deg)} }
        .car-field {
          width: 100%;
          padding: 11px 14px;
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 9px;
          color: rgba(255,255,255,0.88);
          font-size: 13px;
          font-family: inherit;
          box-sizing: border-box;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }
        .car-field:focus {
          outline: none;
          border-color: rgba(16,185,129,0.35);
          background: rgba(16,185,129,0.02);
          box-shadow: 0 0 0 3px rgba(16,185,129,0.07);
        }
        .car-field::placeholder { color: rgba(255,255,255,0.16); }
        .car-field:disabled { opacity: 0.45; cursor: not-allowed; }
        .car-select-wrap { position: relative; }
        .car-select-wrap select {
          appearance: none;
          -webkit-appearance: none;
        }
        .car-select-wrap .car-chevron {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
        }
        .car-submit {
          width: 100%;
          padding: 12px 20px;
          border-radius: 9px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          border: 1px solid rgba(16,185,129,0.28);
          background: linear-gradient(135deg, rgba(16,185,129,0.16), rgba(5,150,105,0.1));
          color: rgba(52,211,153,0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.22s ease;
          font-family: inherit;
          letter-spacing: 0.01em;
        }
        .car-submit:hover:not(:disabled) {
          background: linear-gradient(135deg, rgba(16,185,129,0.22), rgba(5,150,105,0.15));
          box-shadow: 0 0 40px rgba(16,185,129,0.16);
          transform: translateY(-1px);
        }
        .car-submit:active:not(:disabled) { transform: translateY(0); }
        .car-submit:disabled { opacity: 0.4; cursor: not-allowed; }
      `}</style>

      <div
        ref={overlayRef}
        onClick={handleOverlayClick}
        style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.72)',
          backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px',
          animation: 'car-overlay-in 0.2s ease forwards',
        }}
      >
        <div style={{
          width: '100%',
          maxWidth: 480,
          background: '#0B1610',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 18,
          overflow: 'hidden',
          animation: 'car-modal-in 0.3s cubic-bezier(0.16,1,0.3,1) forwards',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(16,185,129,0.04) 0%, transparent 60%)',
            pointerEvents: 'none',
          }} />

          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '22px 28px 18px',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            position: 'relative',
          }}>
            <div>
              <p style={{ fontFamily: 'monospace', fontSize: 8, letterSpacing: '0.22em', color: 'rgba(16,185,129,0.5)', textTransform: 'uppercase', marginBottom: 4 }}>
                Catalog OS
              </p>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: 'rgba(255,255,255,0.9)', letterSpacing: '-0.02em', margin: 0 }}>
                Request Access
              </h2>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 8, width: 32, height: 32, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'rgba(255,255,255,0.35)', transition: 'all 0.18s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.7)'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.07)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.35)'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)'; }}
            >
              <X size={14} />
            </button>
          </div>

          <div style={{ padding: '28px 28px 32px', position: 'relative' }}>
            {isDone ? (
              <div style={{
                textAlign: 'center', padding: '24px 16px 16px',
                animation: 'car-check-in 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
              }}>
                <div style={{
                  width: 52, height: 52,
                  borderRadius: '50%',
                  background: 'rgba(16,185,129,0.1)',
                  border: '1px solid rgba(16,185,129,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px',
                }}>
                  <CheckCircle size={22} color="rgba(16,185,129,0.85)" />
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: 'rgba(255,255,255,0.9)', letterSpacing: '-0.02em', marginBottom: 10 }}>
                  Request received.
                </h3>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.65, maxWidth: 300, margin: '0 auto 28px' }}>
                  Our team will review and follow up with you directly.
                </p>
                <button
                  onClick={onClose}
                  style={{
                    padding: '10px 28px',
                    borderRadius: 9,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.04)',
                    color: 'rgba(255,255,255,0.55)',
                    fontFamily: 'inherit',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.85)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.14)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.55)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.08)'; }}
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontFamily: 'monospace', fontSize: 8, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase', marginBottom: 7 }}>
                      Name
                    </label>
                    <input
                      className="car-field"
                      type="text"
                      value={form.name}
                      onChange={e => set('name', e.target.value)}
                      placeholder="Full name"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontFamily: 'monospace', fontSize: 8, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase', marginBottom: 7 }}>
                      Email
                    </label>
                    <input
                      className="car-field"
                      type="email"
                      value={form.email}
                      onChange={e => set('email', e.target.value)}
                      placeholder="you@example.com"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontFamily: 'monospace', fontSize: 8, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase', marginBottom: 7 }}>
                      Company
                    </label>
                    <input
                      className="car-field"
                      type="text"
                      value={form.company}
                      onChange={e => set('company', e.target.value)}
                      placeholder="Label, studio, co."
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontFamily: 'monospace', fontSize: 8, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase', marginBottom: 7 }}>
                      Role
                    </label>
                    <div className="car-select-wrap">
                      <select
                        className="car-field"
                        value={form.role}
                        onChange={e => set('role', e.target.value)}
                        disabled={isLoading}
                        style={{ paddingRight: 36, color: form.role ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.16)' }}
                      >
                        <option value="" disabled>Select role</option>
                        {ROLES.map(r => (
                          <option key={r.value} value={r.value} style={{ background: '#0B1610', color: 'rgba(255,255,255,0.88)' }}>
                            {r.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={13} color="rgba(255,255,255,0.22)" className="car-chevron" />
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontFamily: 'monospace', fontSize: 8, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase', marginBottom: 7 }}>
                    Message <span style={{ color: 'rgba(255,255,255,0.1)', fontWeight: 300 }}>(optional)</span>
                  </label>
                  <textarea
                    className="car-field"
                    value={form.message}
                    onChange={e => set('message', e.target.value)}
                    placeholder="Tell us about your catalog and what you're looking to accomplish."
                    disabled={isLoading}
                    rows={3}
                    style={{ resize: 'none', lineHeight: 1.55, paddingTop: 11, paddingBottom: 11 }}
                  />
                </div>

                {error && (
                  <p style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(239,68,68,0.8)', margin: 0, letterSpacing: '0.02em' }}>
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="car-submit"
                  disabled={isLoading}
                  style={{ marginTop: 4 }}
                >
                  {isLoading ? (
                    <>
                      <span style={{
                        width: 13, height: 13,
                        border: '2px solid rgba(16,185,129,0.2)',
                        borderTopColor: 'rgba(16,185,129,0.75)',
                        borderRadius: '50%',
                        animation: 'car-spin 0.7s linear infinite',
                        flexShrink: 0,
                      }} />
                      Submitting...
                    </>
                  ) : (
                    'Submit Request'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
