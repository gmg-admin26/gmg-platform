import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, Star, CheckCircle, AlertCircle, ChevronRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';

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

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 16px', borderRadius: 12,
  border: '1.5px solid rgba(92,122,78,0.2)', background: '#FAFAF7',
  fontFamily: S.sans, fontSize: 15, color: S.darkGreen,
  outline: 'none', boxSizing: 'border-box',
};

function Field({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
  return (
    <div>
      <label style={{ display: 'block', fontFamily: S.sans, fontSize: 13, fontWeight: 600, color: S.darkGreen, marginBottom: 6 }}>{label}</label>
      {children}
      {error && <p style={{ fontFamily: S.sans, fontSize: 12, color: S.tomato, marginTop: 4 }}>{error}</p>}
    </div>
  );
}

export default function CCContact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Your name is required.';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'A valid email is required.';
    if (!form.message.trim()) e.message = 'A message is required.';
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setStatus('loading');
    // Contact form: store in reservations table with a note indicating it's a contact message.
    // In production, connect to email provider or CRM via edge function.
    try {
      const { error } = await supabase.from('cc_reservations').insert({
        parent_name: form.name.trim(),
        email: form.email.trim(),
        child_name: 'Contact Inquiry',
        child_age: 0,
        preferred_session: 'either',
        weeks_interested: [],
        num_children: 0,
        notes: `SUBJECT: ${form.subject}\n\nMESSAGE: ${form.message.trim()}`,
        consent: true,
      });
      if (error) throw error;
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  return (
    <div style={{ background: S.cream }}>

      {/* Header */}
      <section style={{ background: `linear-gradient(160deg, ${S.darkGreen} 0%, #3A5A2A 100%)`, padding: '80px 0 60px' }}>
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <p style={{ fontFamily: S.sans, fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: S.sage, fontWeight: 600, marginBottom: 14 }}>Get in touch</p>
          <h1 style={{ fontFamily: S.serif, fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 700, color: '#FEFDF8', marginBottom: 18, lineHeight: 1.1 }}>
            Questions? We'd Love to Help.
          </h1>
          <p style={{ fontFamily: S.sans, fontSize: 17, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, maxWidth: 520, margin: '0 auto' }}>
            Reach out with questions about schedule, enrollment, age fit, or anything else. We're happy to help you find the right class for your young chef.
          </p>
        </div>
      </section>

      <section style={{ padding: '60px 0 100px' }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Contact info */}
          <div className="space-y-5">
            <h2 style={{ fontFamily: S.serif, fontSize: 24, fontWeight: 700, color: S.darkGreen }}>Contact Chef Cheryl</h2>
            <p style={{ fontFamily: S.sans, fontSize: 15, color: S.muted, lineHeight: 1.7 }}>
              Have a question about the program, enrollment, or whether your child is a good fit? We'd love to hear from you.
            </p>
            {[
              { icon: Mail,  label: 'Email',         value: 'hello@chefcherylcooking.com', href: 'mailto:hello@chefcherylcooking.com' },
              { icon: Phone, label: 'Phone',         value: 'Contact via email for scheduling', href: null },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, background: S.ivory, border: '1.5px solid rgba(92,122,78,0.1)', borderRadius: 16, padding: '18px' }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: `${S.green}12`, border: `1px solid ${S.green}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <item.icon style={{ color: S.green, width: 18, height: 18 }} />
                </div>
                <div>
                  <p style={{ fontFamily: S.sans, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: S.sage, fontWeight: 600 }}>{item.label}</p>
                  {item.href
                    ? <a href={item.href} style={{ fontFamily: S.sans, fontSize: 14, color: S.green, fontWeight: 600, textDecoration: 'none' }}>{item.value}</a>
                    : <p style={{ fontFamily: S.sans, fontSize: 14, color: S.muted }}>{item.value}</p>
                  }
                </div>
              </div>
            ))}

            {/* Quick links */}
            <div style={{ background: S.ivory, border: '1.5px solid rgba(92,122,78,0.1)', borderRadius: 18, padding: '22px' }}>
              <p style={{ fontFamily: S.sans, fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: S.sage, fontWeight: 600, marginBottom: 14 }}>Quick Links</p>
              <div className="space-y-2">
                {[
                  { label: 'View Summer 2026 Schedule', to: '/chef-cheryl/classes' },
                  { label: 'Reserve Your Spot',         to: '/chef-cheryl/reserve' },
                  { label: 'Browse the Gallery',        to: '/chef-cheryl/gallery' },
                  { label: 'FAQ',                       to: '/chef-cheryl/faq'     },
                ].map(link => (
                  <Link key={link.to} to={link.to} style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: S.sans, fontSize: 14, color: S.green, textDecoration: 'none', fontWeight: 500 }}>
                    <ChevronRight style={{ width: 14, height: 14 }} />
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-2">
            {status === 'success' ? (
              <div style={{ background: '#FAFAF7', border: `1.5px solid ${S.green}25`, borderRadius: 28, padding: '60px 40px', textAlign: 'center', boxShadow: '0 8px 40px rgba(42,61,31,0.08)' }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: `${S.green}14`, border: `2px solid ${S.green}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <CheckCircle style={{ color: S.green, width: 36, height: 36 }} />
                </div>
                <h2 style={{ fontFamily: S.serif, fontSize: 28, fontWeight: 700, color: S.darkGreen, marginBottom: 12 }}>Message received!</h2>
                <p style={{ fontFamily: S.sans, fontSize: 16, color: S.muted, lineHeight: 1.7, maxWidth: 380, margin: '0 auto 28px' }}>
                  Thank you for reaching out. We'll be in touch shortly.
                </p>
                <Link to="/chef-cheryl" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: S.green, color: '#fff',
                  fontFamily: S.sans, fontSize: 15, fontWeight: 600,
                  padding: '13px 28px', borderRadius: 50, textDecoration: 'none',
                }}>
                  Back to Home
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ background: '#FAFAF7', border: '1.5px solid rgba(92,122,78,0.12)', borderRadius: 28, padding: 'clamp(24px, 5vw, 44px)', boxShadow: '0 8px 40px rgba(42,61,31,0.08)' }}>
                <h2 style={{ fontFamily: S.serif, fontSize: 22, fontWeight: 700, color: S.darkGreen, marginBottom: 28 }}>Send a Message</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="Your Name *" error={errors.name}>
                    <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Full name" style={inputStyle} />
                  </Field>
                  <Field label="Email Address *" error={errors.email}>
                    <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="your@email.com" style={inputStyle} />
                  </Field>
                  <div className="sm:col-span-2">
                    <Field label="Subject">
                      <input type="text" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="What's this about?" style={inputStyle} />
                    </Field>
                  </div>
                  <div className="sm:col-span-2">
                    <Field label="Message *" error={errors.message}>
                      <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Your question or message..." rows={5} style={{ ...inputStyle, resize: 'vertical' as const }} />
                    </Field>
                  </div>
                </div>

                {status === 'error' && (
                  <div style={{ background: `${S.tomato}0A`, border: `1px solid ${S.tomato}25`, borderRadius: 12, padding: '14px 18px', marginTop: 20, display: 'flex', gap: 10 }}>
                    <AlertCircle style={{ color: S.tomato, width: 18, height: 18, flexShrink: 0 }} />
                    <p style={{ fontFamily: S.sans, fontSize: 14, color: S.tomato }}>Something went wrong. Please try again or email us directly.</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  style={{
                    marginTop: 24, width: '100%',
                    background: status === 'loading' ? S.sage : S.green, color: '#fff',
                    fontFamily: S.sans, fontSize: 16, fontWeight: 700,
                    padding: '16px', borderRadius: 50, border: 'none',
                    cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                    boxShadow: '0 6px 24px rgba(92,122,78,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  }}
                >
                  {status === 'loading' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{ background: S.ivory, padding: '60px 0', textAlign: 'center' }}>
        <div className="max-w-2xl mx-auto px-5 sm:px-8">
          <p style={{ fontFamily: S.sans, fontSize: 15, color: S.muted, marginBottom: 20 }}>
            Ready to secure your child's spot before enrollment opens?
          </p>
          <Link to="/chef-cheryl/reserve" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: S.green, color: '#fff',
            fontFamily: S.sans, fontSize: 15, fontWeight: 700,
            padding: '14px 32px', borderRadius: 50, textDecoration: 'none',
            boxShadow: '0 6px 24px rgba(92,122,78,0.28)',
          }}>
            <Star style={{ width: 17, height: 17 }} />
            Reserve Your Spot — No Payment Needed
          </Link>
        </div>
      </section>

    </div>
  );
}
