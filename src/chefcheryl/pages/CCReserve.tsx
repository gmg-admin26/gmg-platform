import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, CheckCircle, DollarSign, Clock, Users, Package, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { ENROLLMENT_OPEN, WEEKS, SESSIONS, PRICE_PER_WEEK } from '../config';

const S = {
  serif: 'Georgia, "Times New Roman", serif',
  sans: 'system-ui, -apple-system, sans-serif',
  green: '#5C7A4E',
  darkGreen: '#2A3D1F',
  cream: '#FAFAF7',
  ivory: '#F5F0E8',
  peach: '#E8A87C',
  tomato: '#C94A2A',
  sage: '#8A9E7A',
  muted: '#6B7B5A',
};

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontFamily: S.sans, fontSize: 13, fontWeight: 600, color: S.darkGreen, marginBottom: 6 }}>
        {label}
      </label>
      {children}
      {error && <p style={{ fontFamily: S.sans, fontSize: 12, color: S.tomato, marginTop: 4 }}>{error}</p>}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 16px', borderRadius: 12,
  border: '1.5px solid rgba(92,122,78,0.2)', background: '#FAFAF7',
  fontFamily: S.sans, fontSize: 15, color: S.darkGreen,
  outline: 'none', boxSizing: 'border-box',
  transition: 'border-color 0.2s',
};

export default function CCReserve() {
  const [form, setForm] = useState({
    parent_name: '',
    email: '',
    phone: '',
    child_name: '',
    child_age: '',
    preferred_session: 'either',
    num_children: '1',
    notes: '',
    consent: false,
  });
  const [weeksSelected, setWeeksSelected] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // PayPal state for enrollment-open mode
  const [enrollWeek, setEnrollWeek] = useState('');
  const [enrollSession, setEnrollSession] = useState('morning');
  const [enrollChildren, setEnrollChildren] = useState(1);

  function toggleWeek(id: string) {
    setWeeksSelected(prev => prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id]);
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.parent_name.trim()) e.parent_name = 'Parent name is required.';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'A valid email is required.';
    if (!form.child_name.trim()) e.child_name = 'Child name is required.';
    if (!form.child_age || isNaN(Number(form.child_age))) e.child_age = 'Child age is required.';
    if (weeksSelected.length === 0) e.weeks = 'Please select at least one week.';
    if (!form.consent) e.consent = 'Please agree to be contacted.';
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setStatus('loading');
    try {
      const { error } = await supabase.from('cc_reservations').insert({
        parent_name:       form.parent_name.trim(),
        email:             form.email.trim(),
        phone:             form.phone.trim(),
        child_name:        form.child_name.trim(),
        child_age:         Number(form.child_age),
        preferred_session: form.preferred_session,
        weeks_interested:  weeksSelected,
        num_children:      Number(form.num_children),
        notes:             form.notes.trim(),
        consent:           form.consent,
      });
      if (error) throw error;
      setStatus('success');
    } catch {
      setStatus('error');
      setErrorMsg('Something went wrong. Please try again or contact us directly.');
    }
  }

  const total = enrollChildren * PRICE_PER_WEEK;

  return (
    <div style={{ background: S.cream }}>

      {/* Header */}
      <section style={{ background: `linear-gradient(160deg, ${S.darkGreen} 0%, #3A5A2A 100%)`, padding: '80px 0 60px' }}>
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <p style={{ fontFamily: S.sans, fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: S.sage, fontWeight: 600, marginBottom: 14 }}>
            {ENROLLMENT_OPEN ? 'Enrollment is open' : 'Priority access'}
          </p>
          <h1 style={{ fontFamily: S.serif, fontSize: 'clamp(30px, 5vw, 56px)', fontWeight: 700, color: '#FEFDF8', marginBottom: 18, lineHeight: 1.1 }}>
            {ENROLLMENT_OPEN ? 'Enroll for Summer 2026' : 'Reserve Your Spot for Summer 2026'}
          </h1>
          <p style={{ fontFamily: S.sans, fontSize: 17, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, maxWidth: 560, margin: '0 auto' }}>
            {ENROLLMENT_OPEN
              ? 'Choose your week and session. Spots are first come, first served.'
              : 'Summer classes fill quickly. Reserve your spot now to join the priority list and receive early enrollment notification when registration opens on May 1.'
            }
          </p>
          {!ENROLLMENT_OPEN && (
            <p style={{ fontFamily: S.sans, fontSize: 14, color: 'rgba(255,255,255,0.4)', marginTop: 14 }}>
              No payment is due at this stage.
            </p>
          )}
        </div>
      </section>

      <section style={{ padding: '60px 0 100px' }}>
        <div className="max-w-3xl mx-auto px-5 sm:px-8">

          {ENROLLMENT_OPEN ? (
            /* ── ENROLLMENT OPEN: PayPal flow ── */
            <div style={{ background: '#FAFAF7', border: '1.5px solid rgba(92,122,78,0.12)', borderRadius: 28, padding: '40px', boxShadow: '0 8px 40px rgba(42,61,31,0.08)' }}>
              <h2 style={{ fontFamily: S.serif, fontSize: 26, fontWeight: 700, color: S.darkGreen, marginBottom: 8 }}>Enroll and Pay</h2>
              <p style={{ fontFamily: S.sans, fontSize: 15, color: S.muted, marginBottom: 32 }}>Choose your week, session, and number of children, then complete payment via PayPal.</p>

              <div className="space-y-6">
                <Field label="Select Week">
                  <select value={enrollWeek} onChange={e => setEnrollWeek(e.target.value)} style={inputStyle}>
                    <option value="">— Choose a week —</option>
                    {WEEKS.map(w => <option key={w.id} value={w.id}>{w.label} · {w.dates}</option>)}
                  </select>
                </Field>

                <Field label="Select Session">
                  <div className="grid grid-cols-2 gap-3">
                    {SESSIONS.map(s => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setEnrollSession(s.id)}
                        style={{
                          padding: '14px 16px', borderRadius: 14, textAlign: 'left',
                          border: `1.5px solid ${enrollSession === s.id ? S.green : 'rgba(92,122,78,0.15)'}`,
                          background: enrollSession === s.id ? `${S.green}0C` : '#FAFAF7',
                          cursor: 'pointer', transition: 'all 0.2s',
                        }}
                      >
                        <p style={{ fontFamily: S.sans, fontSize: 14, fontWeight: 600, color: S.darkGreen }}>{s.label}</p>
                        <p style={{ fontFamily: S.sans, fontSize: 12, color: S.muted }}>{s.time}</p>
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label="Number of Children">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <button type="button" onClick={() => setEnrollChildren(v => Math.max(1, v - 1))}
                      style={{ width: 40, height: 40, borderRadius: '50%', border: `1.5px solid rgba(92,122,78,0.2)`, background: '#fff', fontFamily: S.sans, fontSize: 20, color: S.darkGreen, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                    <span style={{ fontFamily: S.serif, fontSize: 22, fontWeight: 700, color: S.darkGreen, minWidth: 30, textAlign: 'center' }}>{enrollChildren}</span>
                    <button type="button" onClick={() => setEnrollChildren(v => v + 1)}
                      style={{ width: 40, height: 40, borderRadius: '50%', border: `1.5px solid rgba(92,122,78,0.2)`, background: '#fff', fontFamily: S.sans, fontSize: 20, color: S.darkGreen, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                  </div>
                </Field>

                {/* Order summary */}
                <div style={{ background: S.ivory, border: '1.5px solid rgba(92,122,78,0.1)', borderRadius: 18, padding: '24px' }}>
                  <p style={{ fontFamily: S.sans, fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: S.sage, fontWeight: 600, marginBottom: 14 }}>Order Summary</p>
                  {[
                    { label: 'Week',     value: enrollWeek ? WEEKS.find(w => w.id === enrollWeek)?.dates ?? '—' : '—' },
                    { label: 'Session',  value: SESSIONS.find(s => s.id === enrollSession)?.time ?? '—' },
                    { label: 'Children', value: `${enrollChildren}` },
                    { label: 'Rate',     value: `$${PRICE_PER_WEEK} per child / week` },
                  ].map(row => (
                    <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                      <span style={{ fontFamily: S.sans, fontSize: 14, color: S.muted }}>{row.label}</span>
                      <span style={{ fontFamily: S.sans, fontSize: 14, fontWeight: 600, color: S.darkGreen }}>{row.value}</span>
                    </div>
                  ))}
                  <div style={{ borderTop: '1.5px solid rgba(92,122,78,0.12)', paddingTop: 14, marginTop: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: S.serif, fontSize: 18, fontWeight: 700, color: S.darkGreen }}>Total Due</span>
                    <span style={{ fontFamily: S.serif, fontSize: 24, fontWeight: 700, color: S.green }}>${total}</span>
                  </div>
                </div>

                {/* PayPal placeholder */}
                <div style={{ background: `${S.peach}12`, border: `1.5px solid ${S.peach}30`, borderRadius: 18, padding: '28px', textAlign: 'center' }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: S.peach, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                    <DollarSign style={{ color: S.darkGreen, width: 28, height: 28 }} />
                  </div>
                  <p style={{ fontFamily: S.serif, fontSize: 18, fontWeight: 700, color: S.darkGreen, marginBottom: 8 }}>Pay with PayPal</p>
                  <p style={{ fontFamily: S.sans, fontSize: 13, color: S.muted, marginBottom: 20 }}>
                    Secure checkout powered by PayPal. Total: <strong style={{ color: S.darkGreen }}>${total}</strong>
                  </p>
                  {/* PayPal button placeholder — replace with live PayPal button SDK */}
                  <button
                    style={{
                      width: '100%', background: '#FFC439', color: '#003087',
                      fontFamily: S.sans, fontSize: 16, fontWeight: 700,
                      padding: '15px 24px', borderRadius: 50, border: 'none', cursor: 'pointer',
                      boxShadow: '0 6px 20px rgba(255,196,57,0.35)',
                    }}
                  >
                    Pay ${total} with PayPal
                  </button>
                  <p style={{ fontFamily: S.sans, fontSize: 11, color: S.sage, marginTop: 12 }}>
                    PayPal accepts all major credit cards. No PayPal account required.
                  </p>
                </div>

                <div style={{ background: `${S.sage}10`, border: `1px solid ${S.sage}20`, borderRadius: 14, padding: '16px 20px' }}>
                  <p style={{ fontFamily: S.sans, fontSize: 13, color: S.muted }}>
                    <strong style={{ color: S.darkGreen }}>Having trouble with online payment?</strong> Contact us directly and we'll help you complete registration.{' '}
                    <Link to="/chef-cheryl/contact" style={{ color: S.green, fontWeight: 600 }}>Get in touch →</Link>
                  </p>
                </div>
              </div>
            </div>

          ) : status === 'success' ? (
            /* ── Success state ── */
            <div style={{ background: '#FAFAF7', border: `1.5px solid ${S.green}25`, borderRadius: 28, padding: '60px 40px', textAlign: 'center', boxShadow: '0 8px 40px rgba(42,61,31,0.08)' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: `${S.green}14`, border: `2px solid ${S.green}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <CheckCircle style={{ color: S.green, width: 40, height: 40 }} />
              </div>
              <h2 style={{ fontFamily: S.serif, fontSize: 32, fontWeight: 700, color: S.darkGreen, marginBottom: 12 }}>You're on the list!</h2>
              <p style={{ fontFamily: S.sans, fontSize: 17, color: S.muted, lineHeight: 1.7, maxWidth: 420, margin: '0 auto 10px' }}>
                We'll notify you as soon as early enrollment opens on May 1, 2026.
              </p>
              <p style={{ fontFamily: S.sans, fontSize: 14, fontWeight: 700, color: S.green, marginBottom: 32 }}>No payment is due at this stage.</p>
              <Link to="/chef-cheryl/classes" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: S.green, color: '#fff',
                fontFamily: S.sans, fontSize: 15, fontWeight: 600,
                padding: '14px 28px', borderRadius: 50, textDecoration: 'none',
              }}>
                View Full Schedule
              </Link>
            </div>

          ) : (
            /* ── Reservation form ── */
            <form onSubmit={handleSubmit} style={{ background: '#FAFAF7', border: '1.5px solid rgba(92,122,78,0.12)', borderRadius: 28, padding: 'clamp(24px, 5vw, 48px)', boxShadow: '0 8px 40px rgba(42,61,31,0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: `${S.green}14`, border: `1.5px solid ${S.green}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Star style={{ color: S.green, width: 22, height: 22 }} />
                </div>
                <div>
                  <h2 style={{ fontFamily: S.serif, fontSize: 22, fontWeight: 700, color: S.darkGreen }}>Reserve My Spot</h2>
                  <p style={{ fontFamily: S.sans, fontSize: 13, color: S.sage }}>No payment due · Priority enrollment notification</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <Field label="Parent / Guardian Full Name *" error={errors.parent_name}>
                    <input
                      type="text" value={form.parent_name}
                      onChange={e => setForm(f => ({ ...f, parent_name: e.target.value }))}
                      placeholder="Your full name" style={inputStyle}
                    />
                  </Field>
                </div>

                <Field label="Email Address *" error={errors.email}>
                  <input
                    type="email" value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="your@email.com" style={inputStyle}
                  />
                </Field>

                <Field label="Phone Number">
                  <input
                    type="tel" value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="(optional)" style={inputStyle}
                  />
                </Field>

                <Field label="Child's Name *" error={errors.child_name}>
                  <input
                    type="text" value={form.child_name}
                    onChange={e => setForm(f => ({ ...f, child_name: e.target.value }))}
                    placeholder="First name" style={inputStyle}
                  />
                </Field>

                <Field label="Child's Age *" error={errors.child_age}>
                  <input
                    type="number" min={5} max={18} value={form.child_age}
                    onChange={e => setForm(f => ({ ...f, child_age: e.target.value }))}
                    placeholder="Age" style={inputStyle}
                  />
                </Field>

                <Field label="Number of Children">
                  <select value={form.num_children} onChange={e => setForm(f => ({ ...f, num_children: e.target.value }))} style={inputStyle}>
                    {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </Field>

                <Field label="Preferred Session">
                  <select value={form.preferred_session} onChange={e => setForm(f => ({ ...f, preferred_session: e.target.value }))} style={inputStyle}>
                    <option value="morning">Morning — 9:00 AM – 12:30 PM</option>
                    <option value="afternoon">Afternoon — 1:00 PM – 4:00 PM</option>
                    <option value="either">Either session works</option>
                  </select>
                </Field>

                <div className="sm:col-span-2">
                  <Field label="Interested Week(s) *" error={errors.weeks}>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1">
                      {WEEKS.map(w => (
                        <button
                          key={w.id} type="button"
                          onClick={() => toggleWeek(w.id)}
                          style={{
                            padding: '10px 10px', borderRadius: 12, textAlign: 'left',
                            border: `1.5px solid ${weeksSelected.includes(w.id) ? S.green : 'rgba(92,122,78,0.18)'}`,
                            background: weeksSelected.includes(w.id) ? `${S.green}0E` : '#FAFAF7',
                            cursor: 'pointer', transition: 'all 0.2s',
                          }}
                        >
                          <p style={{ fontFamily: S.sans, fontSize: 12, fontWeight: 700, color: S.darkGreen }}>{w.label}</p>
                          <p style={{ fontFamily: S.sans, fontSize: 10, color: S.muted, marginTop: 1 }}>{w.dates}</p>
                        </button>
                      ))}
                    </div>
                    {errors.weeks && <p style={{ fontFamily: S.sans, fontSize: 12, color: S.tomato, marginTop: 6 }}>{errors.weeks}</p>}
                  </Field>
                </div>

                <div className="sm:col-span-2">
                  <Field label="Notes / Dietary Considerations">
                    <textarea
                      value={form.notes}
                      onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                      placeholder="Allergies, dietary restrictions, or anything else we should know..."
                      rows={3} style={{ ...inputStyle, resize: 'vertical' as const }}
                    />
                  </Field>
                </div>

                <div className="sm:col-span-2">
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}>
                    <input
                      type="checkbox" checked={form.consent}
                      onChange={e => setForm(f => ({ ...f, consent: e.target.checked }))}
                      style={{ width: 18, height: 18, accentColor: S.green, marginTop: 2, flexShrink: 0 }}
                    />
                    <span style={{ fontFamily: S.sans, fontSize: 14, color: S.muted, lineHeight: 1.6 }}>
                      I agree to be contacted by Chef Cheryl regarding summer 2026 enrollment and class updates. *
                    </span>
                  </label>
                  {errors.consent && <p style={{ fontFamily: S.sans, fontSize: 12, color: S.tomato, marginTop: 4 }}>{errors.consent}</p>}
                </div>
              </div>

              {/* No payment note */}
              <div style={{ background: `${S.green}0A`, border: `1px solid ${S.green}20`, borderRadius: 14, padding: '14px 20px', marginTop: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                <CheckCircle style={{ color: S.green, width: 18, height: 18, flexShrink: 0 }} />
                <p style={{ fontFamily: S.sans, fontSize: 14, color: S.muted }}>
                  <strong style={{ color: S.darkGreen }}>No payment is due at this stage.</strong> You'll receive priority notification when enrollment opens May 1, 2026.
                </p>
              </div>

              {status === 'error' && (
                <div style={{ background: `${S.tomato}0A`, border: `1px solid ${S.tomato}25`, borderRadius: 14, padding: '14px 20px', marginTop: 16, display: 'flex', gap: 12 }}>
                  <AlertCircle style={{ color: S.tomato, width: 18, height: 18, flexShrink: 0 }} />
                  <p style={{ fontFamily: S.sans, fontSize: 14, color: S.tomato }}>{errorMsg}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                style={{
                  marginTop: 28, width: '100%',
                  background: status === 'loading' ? S.sage : S.green,
                  color: '#fff', fontFamily: S.sans, fontSize: 17, fontWeight: 700,
                  padding: '18px 24px', borderRadius: 50, border: 'none', cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                  boxShadow: '0 6px 24px rgba(92,122,78,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  transition: 'background 0.2s',
                }}
              >
                <Star style={{ width: 20, height: 20 }} />
                {status === 'loading' ? 'Submitting...' : 'Reserve My Spot'}
              </button>
            </form>
          )}

          {/* Info cards below form */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            {[
              { icon: DollarSign, title: '$300 / Week', body: 'Per child. All supplies included.',   color: S.green  },
              { icon: Clock,      title: 'Two Sessions', body: 'Morning 9AM–12:30PM or Afternoon 1–4PM.', color: S.peach },
              { icon: Users,      title: 'First Come, First Served', body: 'Reserve early to secure your spot.', color: S.tomato },
            ].map(item => (
              <div key={item.title} style={{ background: '#FAFAF7', border: '1.5px solid rgba(92,122,78,0.1)', borderRadius: 18, padding: '20px 18px', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: `${item.color}14`, border: `1px solid ${item.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <item.icon style={{ color: item.color, width: 20, height: 20 }} />
                </div>
                <div>
                  <p style={{ fontFamily: S.serif, fontSize: 15, fontWeight: 700, color: S.darkGreen }}>{item.title}</p>
                  <p style={{ fontFamily: S.sans, fontSize: 12, color: S.muted, marginTop: 3 }}>{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
