import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, ChevronDown, ArrowRight, Building2, Mic2, Briefcase } from 'lucide-react';

interface PackageDetail {
  core: string[];
  addons: string[];
}

interface Package {
  id: string;
  title: string;
  subtitle: string;
  positioning: string;
  bestFor: string;
  includes: string;
  icon: React.ElementType;
  accentColor: string;
  borderColor: string;
  glowColor: string;
  badgeColor: string;
  details: PackageDetail;
}

const packages: Package[] = [
  {
    id: 'artist',
    title: 'Artist OS Protect',
    subtitle: 'Artist',
    positioning: 'Protect the artist, the career, and the income stream.',
    bestFor: 'Recording artists, DJs, producers, performers, touring acts, writers, and artist-led businesses.',
    includes: 'Entertainment E&O / media liability, general liability, travel accident and travel protection, cyber liability, disability and specialty income protection, contingency and event cancellation coverage, plus optional body-part, life, health, touring, and specialty protections.',
    icon: Mic2,
    accentColor: 'from-amber-500/8 via-transparent to-transparent',
    borderColor: 'border-amber-500/20',
    glowColor: 'rgba(245, 158, 11, 0.12)',
    badgeColor: 'text-amber-400 bg-amber-400/8 border-amber-400/15',
    details: {
      core: [
        'Entertainment E&O / Media Liability',
        'General Liability',
        'Travel Accident & Travel Protection',
        'Cyber Liability',
        'Disability / Body-Part or Specialty Income Protection',
        'Contingency / Event Cancellation',
      ],
      addons: [
        'Hands / voice / specialty body-part insurance',
        'Kidnap, ransom, and certain stalking-related protection',
        'Touring package coverage',
        'Life insurance',
        'Health insurance options',
        'Additional insured endorsements',
        'Completion / surety bond review',
      ],
    },
  },
  {
    id: 'company',
    title: 'Artist OS Protect',
    subtitle: 'Company',
    positioning: 'Protect the company, the operators, the staff, the catalog activity, and the live business.',
    bestFor: 'Labels, distributors, management firms, touring companies, entertainment startups, and music businesses with staff, contractors, events, releases, and multiple entities.',
    includes: 'Entertainment E&O / professional liability, general liability, EPLI, wage and hour defense review, cyber liability, executive risk considerations, event and touring protection, contingency coverage, and optional multi-entity structuring support.',
    icon: Building2,
    accentColor: 'from-sky-500/8 via-transparent to-transparent',
    borderColor: 'border-sky-500/20',
    glowColor: 'rgba(14, 165, 233, 0.12)',
    badgeColor: 'text-sky-400 bg-sky-400/8 border-sky-400/15',
    details: {
      core: [
        'Entertainment E&O / Professional Liability',
        'General Liability',
        'EPLI',
        'Wage & Hour Defense Review',
        'Cyber Liability',
        'Executive Risk Considerations',
        'Event / Touring / Pop-Up Property Coverage',
        'Contingency / Cancellation Coverage',
      ],
      addons: [
        'Multi-entity structuring',
        'Additional insured endorsements',
        'Contract review support',
        'Claims management support',
        'Completion / performance bond evaluation',
        'Commercial umbrella / excess liability',
        'Business travel coverage',
        'Private client / personal lines options for founders and senior executives',
      ],
    },
  },
  {
    id: 'professional',
    title: 'Artist OS Protect',
    subtitle: 'Professional',
    positioning: 'Protect the independent operator behind the work.',
    bestFor: 'Producers, songwriters, engineers, consultants, directors, photographers, designers, managers, editors, and freelance creative operators.',
    includes: 'Professional liability / E&O, general liability, cyber liability, travel protection, disability and income protection, life and health options, plus optional project-specific, media, equipment, and business owner coverage pathways.',
    icon: Briefcase,
    accentColor: 'from-emerald-500/8 via-transparent to-transparent',
    borderColor: 'border-emerald-500/20',
    glowColor: 'rgba(16, 185, 129, 0.12)',
    badgeColor: 'text-emerald-400 bg-emerald-400/8 border-emerald-400/15',
    details: {
      core: [
        'Professional Liability / E&O',
        'General Liability',
        'Cyber Liability',
        'Travel Accident / Travel Protection',
        'Disability / Income Protection',
        'Life Insurance Options',
        'Health Insurance Options',
      ],
      addons: [
        'Equipment / gear coverage',
        'Media liability for content creators and directors',
        'Contracted deliverable / completion bond review',
        'Additional insured endorsements',
        'Short-term project / event coverage',
        'Business owner package options',
      ],
    },
  },
];

function ProtectCard({ pkg }: { pkg: Package }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = pkg.icon;

  return (
    <div
      className={`group relative flex flex-col rounded-2xl border bg-gradient-to-br from-zinc-950 via-zinc-900/80 to-zinc-950 overflow-hidden transition-all duration-500 hover:-translate-y-1 ${pkg.borderColor}`}
      style={{
        boxShadow: `0 12px 48px rgba(0,0,0,0.7), 0 0 0 0 ${pkg.glowColor}`,
      }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${pkg.accentColor} pointer-events-none`} />

      <div className="relative p-7 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-5">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${pkg.badgeColor}`}>
            <Icon className="w-5 h-5" />
          </div>
          <span className={`text-[10px] font-bold tracking-[0.18em] uppercase px-2.5 py-1 rounded-full border ${pkg.badgeColor}`}>
            {pkg.subtitle}
          </span>
        </div>

        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/25 mb-1">{pkg.title}</p>
        <h3 className="text-xl font-black text-white mb-1 leading-tight">{pkg.subtitle} Package</h3>
        <p className="text-sm text-white/50 italic font-light mb-4 leading-relaxed">{pkg.positioning}</p>

        <div className="mb-4">
          <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-white/25 mb-1.5">Best For</p>
          <p className="text-sm text-white/55 font-light leading-relaxed">{pkg.bestFor}</p>
        </div>

        <div className="mb-6">
          <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-white/25 mb-1.5">What It Can Include</p>
          <p className="text-sm text-white/50 font-light leading-relaxed">{pkg.includes}</p>
        </div>

        <div className="mt-auto space-y-3">
          <Link
            to={`/get-started?protect=${pkg.id}`}
            className={`group/cta w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold text-white border transition-all duration-300 ${pkg.borderColor}`}
            style={{
              background: `linear-gradient(135deg, ${pkg.glowColor}, rgba(255,255,255,0.01))`,
            }}
          >
            Inquire for Availability & Pricing
            <ArrowRight className="w-4 h-4 group-hover/cta:translate-x-1 transition-transform" />
          </Link>

          <button
            onClick={() => setExpanded(v => !v)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm text-white/45 hover:text-white/70 bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06] hover:border-white/[0.1] transition-all duration-200"
          >
            <span className="text-xs font-medium tracking-wide">View Package Details</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${expanded ? 'max-h-[600px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}
        >
          <div className="border-t border-white/[0.06] pt-5 space-y-5">
            <div>
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/30 mb-3">Core Coverages</p>
              <ul className="space-y-2">
                {pkg.details.core.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${pkg.badgeColor.split(' ')[0].replace('text-', 'bg-')}`} />
                    <span className="text-sm text-white/60 font-light leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/30 mb-3">Recommended Add-Ons</p>
              <ul className="space-y-2">
                {pkg.details.addons.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-white/15" />
                    <span className="text-sm text-white/40 font-light leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ArtistOSProtect() {
  return (
    <section className="relative py-32 px-8 lg:px-12 overflow-hidden" style={{ background: 'linear-gradient(to bottom, #0B0B0D 0%, #0d1a15 50%, #0B0B0D 100%)' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(16,185,129,0.04) 0%, transparent 70%)' }} className="absolute inset-0" />
        <div style={{ background: 'radial-gradient(ellipse 50% 50% at 20% 80%, rgba(245,158,11,0.03) 0%, transparent 60%)' }} className="absolute inset-0" />
        <div style={{ background: 'radial-gradient(ellipse 50% 50% at 80% 80%, rgba(14,165,233,0.03) 0%, transparent 60%)' }} className="absolute inset-0" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.02] border border-white/[0.07] mb-7">
            <Shield className="w-3.5 h-3.5 text-emerald-400/70" />
            <span className="text-[10px] font-bold tracking-[0.22em] uppercase text-white/35">Artist OS Protect</span>
          </div>

          <h2 className="font-black tracking-tighter mb-5 leading-[0.93]" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#E5E5E7' }}>
            Risk Infrastructure for the Modern Music Business
          </h2>

          <p className="text-lg md:text-xl text-white/55 max-w-3xl mx-auto font-light leading-relaxed mb-5">
            Artist OS Protect connects artists, music companies, and creative professionals to institutional-grade insurance pathways built for the realities of modern entertainment. Media liability, touring risk, cyber exposure, employment practices, income protection, and event cancellation — structured to protect careers, businesses, and income streams at every stage of scale.
          </p>

          <p className="text-sm text-white/35 font-light">
            Available in three tailored package pathways:{' '}
            <span className="text-amber-400/60">Artist</span>,{' '}
            <span className="text-sky-400/60">Company</span>, and{' '}
            <span className="text-emerald-400/60">Professional</span>.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mb-12">
          {packages.map(pkg => (
            <ProtectCard key={pkg.id} pkg={pkg} />
          ))}
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl border border-white/[0.05] bg-white/[0.015] p-6 md:p-8 backdrop-blur-sm">
            <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-white/20 mb-3">Disclaimer</p>
            <p className="text-xs text-white/28 leading-relaxed font-light">
              Coverage availability, scope, pricing, and eligibility are subject to underwriting review, carrier approval, state regulations, and final policy terms. Package descriptions are provided for general informational purposes only and do not constitute a binder, quote, or guarantee of coverage. Availability and pricing may vary based on applicant profile, business structure, activities, claims history, and jurisdiction.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
