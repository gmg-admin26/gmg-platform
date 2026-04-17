import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, ChevronDown, ArrowRight, Building2, Mic2, Briefcase } from 'lucide-react';

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
    title: 'Artist OS Accounting',
    subtitle: 'Artist',
    positioning: 'Bring structure to artist income, royalties, expenses, and growth.',
    bestFor: 'Recording artists, DJs, producers, performers, touring acts, writers, and artist-led businesses with growing income streams and operational complexity.',
    includes: 'Bookkeeping, income and expense tracking, royalty and payout organization, tour and travel expense categorization, cash flow visibility, entity coordination, employment and income verification support, tax-ready financial reporting, and optional tax preparation and filing support through qualified partners.',
    icon: Mic2,
    accentColor: 'from-amber-500/8 via-transparent to-transparent',
    borderColor: 'border-amber-500/20',
    glowColor: 'rgba(245, 158, 11, 0.12)',
    badgeColor: 'text-amber-400 bg-amber-400/8 border-amber-400/15',
    details: {
      core: [
        'Bookkeeping and monthly reconciliations',
        'Income and expense categorization',
        'Royalty and payout tracking support',
        'Tour, travel, and creative expense tracking',
        'Cash flow reporting',
        'Tax-ready financial organization',
        'Year-end financial organization',
        'Employment and income verification support',
        'Financial documentation support for housing and life applications',
        'Optional tax preparation coordination through partner network',
      ],
      addons: [
        'Budgeting and forecasting',
        'Entity setup coordination',
        '1099 tracking support',
        'Contractor payment tracking',
        'Catalog income reporting support',
        'Profitability reporting by release, campaign, or tour cycle',
        'Business manager / CPA coordination',
        'Tax preparation and filing where applicable',
        'Touring and international tax considerations',
      ],
    },
  },
  {
    id: 'company',
    title: 'Artist OS Accounting',
    subtitle: 'Company',
    positioning: 'Bring financial control to the company, the releases, the teams, and the infrastructure.',
    bestFor: 'Labels, distributors, management firms, touring companies, entertainment startups, and music businesses managing multiple revenue streams, staff, contractors, and entities.',
    includes: 'Bookkeeping, AP/AR tracking, payroll coordination support, entity-level reporting, release and campaign cost allocation, cash flow management, contractor tracking, tax-ready financial reporting, and optional tax preparation and filing support through qualified partners.',
    icon: Building2,
    accentColor: 'from-sky-500/8 via-transparent to-transparent',
    borderColor: 'border-sky-500/20',
    glowColor: 'rgba(14, 165, 233, 0.12)',
    badgeColor: 'text-sky-400 bg-sky-400/8 border-sky-400/15',
    details: {
      core: [
        'Multi-account bookkeeping and reconciliations',
        'Accounts payable / receivable support',
        'Revenue and expense allocation',
        'Entity-level reporting',
        'Release, campaign, and project cost tracking',
        'Cash flow and operating visibility',
        'Tax-ready monthly financials',
        'Year-end financial organization',
        'Optional tax preparation coordination through partner network',
      ],
      addons: [
        'Multi-entity reporting packages',
        'Payroll and contractor coordination',
        'Budget creation and management',
        'Forecasting and scenario planning',
        'Label / distribution payout reporting',
        'Executive dashboard reporting',
        'CPA, controller, or finance lead coordination',
        'Tax preparation and filing where applicable',
        'Multi-state / multi-entity tax coordination',
      ],
    },
  },
  {
    id: 'professional',
    title: 'Artist OS Accounting',
    subtitle: 'Professional',
    positioning: 'Give the independent operator cleaner books, clearer reporting, and stronger financial control.',
    bestFor: 'Producers, songwriters, engineers, consultants, directors, photographers, designers, managers, editors, and freelance creative operators.',
    includes: 'Bookkeeping, invoicing support, expense management, contractor tracking, project-based reporting, cash flow visibility, employment and income verification support, tax-ready financial organization, and optional tax preparation and filing support through qualified partners.',
    icon: Briefcase,
    accentColor: 'from-emerald-500/8 via-transparent to-transparent',
    borderColor: 'border-emerald-500/20',
    glowColor: 'rgba(16, 185, 129, 0.12)',
    badgeColor: 'text-emerald-400 bg-emerald-400/8 border-emerald-400/15',
    details: {
      core: [
        'Monthly bookkeeping',
        'Income and expense categorization',
        'Invoicing and payment tracking support',
        'Cash flow reporting',
        'Project and client profitability visibility',
        'Tax-prep-ready financials',
        'Year-end financial organization',
        'Employment and income verification support',
        'Financial documentation support for housing and life applications',
        'Optional tax preparation coordination through partner network',
      ],
      addons: [
        'Budgeting support',
        '1099 tracking',
        'Business entity coordination',
        'Retainer / project revenue reporting',
        'Quarterly reporting packages',
        'CPA coordination',
        'Business-owner financial organization support',
        'Tax preparation and filing where applicable',
      ],
    },
  },
];

function AccountingCard({ pkg }: { pkg: Package }) {
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
            to={`/get-started?service=accounting&package=${pkg.id}`}
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
          className={`overflow-hidden transition-all duration-500 ease-in-out ${expanded ? 'max-h-[700px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}
        >
          <div className="border-t border-white/[0.06] pt-5 space-y-5">
            <div>
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/30 mb-3">Core Services</p>
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

export default function ArtistOSAccounting() {
  return (
    <section className="relative py-32 px-8 lg:px-12 overflow-hidden" style={{ background: 'linear-gradient(to bottom, #0B0B0D 0%, #0d1520 50%, #0B0B0D 100%)' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(14,165,233,0.04) 0%, transparent 70%)' }} className="absolute inset-0" />
        <div style={{ background: 'radial-gradient(ellipse 50% 50% at 20% 80%, rgba(245,158,11,0.03) 0%, transparent 60%)' }} className="absolute inset-0" />
        <div style={{ background: 'radial-gradient(ellipse 50% 50% at 80% 80%, rgba(16,185,129,0.03) 0%, transparent 60%)' }} className="absolute inset-0" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.02] border border-white/[0.07] mb-7">
            <Calculator className="w-3.5 h-3.5 text-sky-400/70" />
            <span className="text-[10px] font-bold tracking-[0.22em] uppercase text-white/35">Institutional Financial Operations</span>
          </div>

          <h2 className="font-black tracking-tighter mb-5 leading-[0.93]" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#E5E5E7' }}>
            The Financial Operating Layer for Creative Businesses
          </h2>

          <p className="text-lg md:text-xl text-white/55 max-w-3xl mx-auto font-light leading-relaxed mb-5">
            Artist OS Accounting connects artists, music companies, and creative professionals to structured financial infrastructure through institutional partners built for entertainment. Bookkeeping, royalty tracking, cash flow visibility, entity coordination, tax preparation, and reporting — designed to give creative businesses the financial control, discipline, and visibility they need to scale.
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
            <AccountingCard key={pkg.id} pkg={pkg} />
          ))}
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl border border-white/[0.05] bg-white/[0.015] p-6 md:p-8 backdrop-blur-sm">
            <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-white/20 mb-3">Disclaimer</p>
            <p className="text-xs text-white/28 leading-relaxed font-light">
              Accounting services are provided in coordination with independent, qualified accounting professionals and institutional partners. Services may vary based on engagement scope, jurisdiction, and provider. Optional tax preparation and filing services are subject to separate agreements and may be performed by licensed professionals where required. Nothing in this section constitutes legal, tax, audit, or assurance advice unless expressly defined in a formal written engagement.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
