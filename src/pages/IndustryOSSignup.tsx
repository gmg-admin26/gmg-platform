import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { useIndustryOS, type SignupData } from '../auth/IndustryOSContext';

const INDUSTRIES = [
  'Artist', 'Producer', 'Songwriter', 'Manager', 'Marketer',
  'A&R', 'Creative Director', 'Videographer', 'Engineer', 'Student', 'Other',
];

const INTERESTS = [
  'Collaborators', 'Industry access', 'Training', 'Opportunities', 'Exposure', 'Other',
];

type Step = 1 | 2 | 3 | 4;

interface FormState {
  full_name: string;
  email: string;
  password: string;
  confirm_password: string;
  location: string;
  primary_industry: string;
  primary_industry_other: string;
  member_current_role: string;
  desired_role: string;
  instagram: string;
  linkedin: string;
  website: string;
  promo_code: string;
  interests: string[];
}

const EMPTY: FormState = {
  full_name: '', email: '', password: '', confirm_password: '', location: '',
  primary_industry: '', primary_industry_other: '', member_current_role: '',
  desired_role: '', instagram: '', linkedin: '', website: '', promo_code: '',
  interests: [],
};

function Field({
  label, required, children,
}: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[9.5px] font-mono text-white/30 uppercase tracking-wide mb-1.5">
        {label}{required && <span className="text-[#10B981] ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const INPUT_CLS = "w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-[13px] text-white/80 placeholder-white/15 focus:outline-none focus:border-[#10B981]/50 transition-colors";

export default function IndustryOSSignup() {
  const navigate = useNavigate();
  const { signupIndustryOS } = useIndustryOS();

  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const set = (k: keyof FormState, v: string) => setForm(f => ({ ...f, [k]: v }));

  const toggleInterest = (i: string) => {
    setForm(f => ({
      ...f,
      interests: f.interests.includes(i)
        ? f.interests.filter(x => x !== i)
        : [...f.interests, i],
    }));
  };

  const canAdvance = () => {
    if (step === 1) return form.full_name.trim() && form.email.trim() && form.location.trim() && form.password.trim() && form.confirm_password.trim();
    if (step === 2) return form.primary_industry.trim() && (form.primary_industry !== 'Other' || form.primary_industry_other.trim());
    if (step === 3) return form.instagram.trim() && form.linkedin.trim();
    return true;
  };

  const handleNext = () => {
    setError('');
    if (step === 1) {
      if (form.password !== form.confirm_password) { setError('Passwords do not match'); return; }
      if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    }
    if (step < 4) setStep(s => (s + 1) as Step);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    const data: SignupData = {
      email: form.email,
      password: form.password,
      full_name: form.full_name,
      location: form.location,
      primary_industry: form.primary_industry,
      primary_industry_other: form.primary_industry_other || undefined,
      member_current_role: form.member_current_role || undefined,
      desired_role: form.desired_role || undefined,
      instagram: form.instagram,
      linkedin: form.linkedin,
      website: form.website || undefined,
      promo_code: form.promo_code || undefined,
      interests: form.interests,
    };
    const result = await signupIndustryOS(data);
    setSubmitting(false);
    if (result.ok) {
      navigate('/industry-os/app');
    } else {
      setError(result.error ?? 'Something went wrong. Please try again.');
    }
  };

  const STEP_LABELS: Record<Step, string> = {
    1: 'Basic Info',
    2: 'Professional Profile',
    3: 'Links',
    4: 'Access + Interests',
  };

  return (
    <div className="min-h-screen bg-[#050607] flex flex-col">
      <style>{`
        @keyframes ios-fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .ios-fade { animation: ios-fade-in 0.4s ease both; }
      `}</style>

      {/* Top bar */}
      <div className="border-b border-white/[0.05] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-[#10B981]/15 border border-[#10B981]/25">
            <div className="w-2.5 h-2.5 rounded-sm bg-[#10B981]" />
          </div>
          <span className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em]">Industry OS · Apply for Access</span>
        </div>
        <Link to="/industry-os/login" className="text-[10.5px] text-white/25 hover:text-white/50 transition-colors">
          Sign in instead
        </Link>
      </div>

      <div className="flex-1 flex items-start justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-lg ios-fade">

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-8">
            {([1, 2, 3, 4] as Step[]).map(s => (
              <div key={s} className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold transition-all"
                    style={{
                      background: s < step ? '#10B981' : s === step ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${s <= step ? '#10B981' : 'rgba(255,255,255,0.08)'}`,
                      color: s < step ? '#fff' : s === step ? '#10B981' : 'rgba(255,255,255,0.2)',
                    }}>
                    {s < step ? <Check className="w-2.5 h-2.5" /> : s}
                  </div>
                  <span className="text-[9.5px] font-mono hidden sm:block"
                    style={{ color: s === step ? '#10B981' : 'rgba(255,255,255,0.2)' }}>
                    {STEP_LABELS[s]}
                  </span>
                </div>
                {s < 4 && <div className="flex-1 h-[1px] w-6 bg-white/[0.07]" />}
              </div>
            ))}
          </div>

          {/* Step header */}
          <div className="mb-6">
            <p className="text-[9px] font-mono text-[#10B981]/50 uppercase tracking-[0.2em] mb-1">{`Step ${step} of 4`}</p>
            <h2 className="text-[22px] font-bold text-white/90">{STEP_LABELS[step]}</h2>
          </div>

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-4">
              <Field label="Full Name" required>
                <input value={form.full_name} onChange={e => set('full_name', e.target.value)} placeholder="Your full name" className={INPUT_CLS} />
              </Field>
              <Field label="Email" required>
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="your@email.com" autoComplete="email" className={INPUT_CLS} />
              </Field>
              <Field label="Location" required>
                <input value={form.location} onChange={e => set('location', e.target.value)} placeholder="City, State / Country" className={INPUT_CLS} />
              </Field>
              <Field label="Password" required>
                <input type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="At least 6 characters" autoComplete="new-password" className={INPUT_CLS} />
              </Field>
              <Field label="Confirm Password" required>
                <input type="password" value={form.confirm_password} onChange={e => set('confirm_password', e.target.value)} placeholder="Repeat password" autoComplete="new-password" className={INPUT_CLS} />
              </Field>
            </div>
          )}

          {/* Step 2: Professional Profile */}
          {step === 2 && (
            <div className="space-y-4">
              <Field label="Primary Industry" required>
                <select
                  value={form.primary_industry}
                  onChange={e => set('primary_industry', e.target.value)}
                  className={INPUT_CLS + ' appearance-none'}>
                  <option value="" disabled>Select your primary role...</option>
                  {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </Field>
              {form.primary_industry === 'Other' && (
                <Field label="Specify Industry" required>
                  <input value={form.primary_industry_other} onChange={e => set('primary_industry_other', e.target.value)} placeholder="Describe your industry / role" className={INPUT_CLS} />
                </Field>
              )}
              <Field label="Current Role">
                <input value={form.member_current_role} onChange={e => set('member_current_role', e.target.value)} placeholder="What you do now" className={INPUT_CLS} />
              </Field>
              <Field label="Desired Role">
                <input value={form.desired_role} onChange={e => set('desired_role', e.target.value)} placeholder="What you want to become" className={INPUT_CLS} />
              </Field>
            </div>
          )}

          {/* Step 3: Links */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="bg-white/[0.025] border border-white/[0.06] rounded-xl px-4 py-3 mb-2">
                <p className="text-[10.5px] text-white/40 leading-relaxed">
                  Links are required to verify your identity and professional presence. Profiles without verifiable links are not approved.
                </p>
              </div>
              <Field label="Instagram" required>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 text-[12px] font-mono">@</span>
                  <input value={form.instagram} onChange={e => set('instagram', e.target.value)} placeholder="username" className={INPUT_CLS + ' pl-8'} />
                </div>
              </Field>
              <Field label="LinkedIn" required>
                <input value={form.linkedin} onChange={e => set('linkedin', e.target.value)} placeholder="linkedin.com/in/yourname" className={INPUT_CLS} />
              </Field>
              <Field label="Website / Portfolio">
                <input value={form.website} onChange={e => set('website', e.target.value)} placeholder="yoursite.com (optional)" className={INPUT_CLS} />
              </Field>
            </div>
          )}

          {/* Step 4: Access + Interests */}
          {step === 4 && (
            <div className="space-y-5">
              <Field label="What are you looking for?" required={false}>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {INTERESTS.map(interest => {
                    const selected = form.interests.includes(interest);
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-left transition-all"
                        style={{
                          background: selected ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.02)',
                          borderColor: selected ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.07)',
                        }}>
                        <div className="w-3 h-3 rounded flex items-center justify-center border flex-shrink-0 transition-all"
                          style={{
                            background: selected ? '#10B981' : 'transparent',
                            borderColor: selected ? '#10B981' : 'rgba(255,255,255,0.2)',
                          }}>
                          {selected && <Check className="w-2 h-2 text-white" />}
                        </div>
                        <span className="text-[11px]" style={{ color: selected ? '#10B981' : 'rgba(255,255,255,0.5)' }}>{interest}</span>
                      </button>
                    );
                  })}
                </div>
              </Field>

              <Field label="Promo Code">
                <input
                  value={form.promo_code}
                  onChange={e => set('promo_code', e.target.value)}
                  placeholder="Optional — enter if you have one"
                  className={INPUT_CLS}
                />
                <p className="text-[9px] text-white/20 mt-1.5 font-mono">Promo codes may grant priority access or extended features.</p>
              </Field>

              <div className="bg-[#10B981]/[0.05] border border-[#10B981]/15 rounded-xl p-4 space-y-1.5">
                <p className="text-[10.5px] font-semibold text-[#10B981]/70">Application Review</p>
                <p className="text-[9.5px] text-white/30 leading-relaxed">
                  Your application will be reviewed by the GMG team. You'll receive access as soon as it's approved. Membership is currently free with limited seats.
                </p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-4 bg-[#EF4444]/[0.08] border border-[#EF4444]/20 rounded-xl px-4 py-3">
              <p className="text-[11px] text-[#EF4444]/80">{error}</p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center gap-3 mt-7">
            {step > 1 && (
              <button
                onClick={() => { setStep(s => (s - 1) as Step); setError(''); }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/[0.09] text-[11.5px] text-white/40 hover:text-white/65 transition-colors">
                <ChevronLeft className="w-3.5 h-3.5" /> Back
              </button>
            )}
            <div className="flex-1" />
            {step < 4 ? (
              <button
                onClick={handleNext}
                disabled={!canAdvance()}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-[12px] font-semibold text-white transition-all disabled:opacity-35"
                style={{ background: '#10B981', boxShadow: '0 2px 16px rgba(16,185,129,0.2)' }}>
                Continue <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-[12px] font-semibold text-white transition-all disabled:opacity-35"
                style={{ background: '#10B981', boxShadow: '0 2px 16px rgba(16,185,129,0.2)' }}>
                {submitting ? 'Submitting...' : 'Apply for Access'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
