import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Landmark, ChevronDown, ArrowRight, Building2, Mic2, Briefcase } from 'lucide-react';

interface PackageDetail {
  capitalLayer: string[];
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
    title: 'Artist OS Banking',
    subtitle: 'Artist',
    positioning: 'Give the artist better banking structure, stronger cash control, and access to growth capital.',
    bestFor: 'Recording artists, DJs, producers, performers, touring acts, writers, and artist-led businesses managing inconsistent cash flow, royalty income, touring revenue, or growth investment needs.',
    includes: 'Access through institutional partners to business banking accounts, savings structure, payment flow organization, cash reserve planning, royalty-backed credit exploration, GMG corporate card credit line access where qualified, and potential advance-based lending pathways tied to royalty and revenue performance.',
    icon: Mic2,
    accentColor: 'from-amber-500/8 via-transparent to-transparent',
    borderColor: 'border-amber-500/20',
    glowColor: 'rgba(245, 158, 11, 0.12)',
    badgeColor: 'text-amber-400 bg-amber-400/8 border-amber-400/15',
    details: {
      capitalLayer: [
        'Business banking accounts',
        'Savings structure support',
        'GMG corporate card access',
        'Royalty-backed credit exploration',
        'Potential advance-based lending pathways tied to royalty / revenue performance',
        'Capital-readiness and underwriting positioning support',
      ],
      core: [
        'Business banking structure guidance',
        'Account setup support',
        'Payment flow organization',
        'Cash reserve structuring support',
        'Revenue routing visibility',
        'Capital-readiness support',
      ],
      addons: [
        'Royalty-backed credit exploration',
        'Advance and funding readiness support',
        'Touring cash flow structure planning',
        'Release budget funding prep',
        'Entity and account structure coordination',
        'Financial partner introductions',
        'Founder / artist banking advisory support',
      ],
    },
  },
  {
    id: 'company',
    title: 'Artist OS Banking',
    subtitle: 'Company',
    positioning: 'Give the company stronger financial infrastructure, cleaner cash management, and more serious capital positioning.',
    bestFor: 'Labels, distributors, management companies, entertainment startups, touring businesses, and music companies managing payroll, payouts, operating costs, and expansion.',
    includes: 'Access through institutional partners to business banking accounts, savings structure, multi-account cash management, payment flow design, treasury-style organization, royalty-backed credit exploration, GMG corporate card credit line access where qualified, and potential advance-based lending pathways tied to royalties and revenue performance.',
    icon: Building2,
    accentColor: 'from-sky-500/8 via-transparent to-transparent',
    borderColor: 'border-sky-500/20',
    glowColor: 'rgba(14, 165, 233, 0.12)',
    badgeColor: 'text-sky-400 bg-sky-400/8 border-sky-400/15',
    details: {
      capitalLayer: [
        'Business banking accounts',
        'Savings structure support',
        'GMG corporate card access',
        'Royalty-backed credit exploration',
        'Potential advance-based lending pathways tied to royalty / revenue performance',
        'Capital-readiness and underwriting positioning support',
      ],
      core: [
        'Business banking structure planning',
        'Multi-account operating structure support',
        'Payment and payout flow design',
        'Cash management support',
        'Capital-readiness preparation',
        'Financial infrastructure planning',
      ],
      addons: [
        'Royalty-backed credit exploration',
        'Working capital strategy support',
        'Multi-entity banking structure',
        'Release and operating reserve planning',
        'Investor / lender readiness support',
        'Distribution and royalty flow structuring',
        'Executive financial infrastructure advisory',
      ],
    },
  },
  {
    id: 'professional',
    title: 'Artist OS Banking',
    subtitle: 'Professional',
    positioning: 'Give the independent operator more control over cash, payments, and financial infrastructure.',
    bestFor: 'Producers, songwriters, engineers, consultants, directors, photographers, designers, managers, editors, and freelance creative professionals building more stable creative businesses.',
    includes: 'Access through institutional partners to business banking guidance, account structuring, business checking and savings pathways, invoicing and payment flow organization, reserve planning, GMG corporate card credit line access where qualified, royalty-backed credit exploration where applicable, and capital-readiness guidance for independent creative operators.',
    icon: Briefcase,
    accentColor: 'from-emerald-500/8 via-transparent to-transparent',
    borderColor: 'border-emerald-500/20',
    glowColor: 'rgba(16, 185, 129, 0.12)',
    badgeColor: 'text-emerald-400 bg-emerald-400/8 border-emerald-400/15',
    details: {
      capitalLayer: [
        'Business banking accounts',
        'Savings structure support',
        'GMG corporate card access',
        'Royalty-backed credit exploration where applicable',
        'Potential advance-based lending pathways tied to royalty / revenue performance where applicable',
        'Capital-readiness and underwriting positioning support',
      ],
      core: [
        'Business banking setup guidance',
        'Account structure support',
        'Payment flow organization',
        'Cash reserve planning',
        'Revenue management visibility',
        'Financial operations support',
      ],
      addons: [
        'Project-based reserve planning',
        'Business credit readiness',
        'Entity and banking alignment',
        'Payment system optimization',
        'Contractor payment flow organization',
        'Capital-readiness support',
        'Creative business finance advisory',
      ],
    },
  },
];

function BankingCard({ pkg }: { pkg: Package }) {
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
            to={`/get-started?service=banking&package=${pkg.id}`}
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
          className={`overflow-hidden transition-all duration-500 ease-in-out ${expanded ? 'max-h-[800px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}
        >
          <div className="border-t border-white/[0.06] pt-5 space-y-5">
            <div>
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/30 mb-3">GMG Capital Layer (when qualified)</p>
              <ul className="space-y-2">
                {pkg.details.capitalLayer.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${pkg.badgeColor.split(' ')[0].replace('text-', 'bg-')}`} />
                    <span className="text-sm text-white/60 font-light leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/30 mb-3">Core Services</p>
              <ul className="space-y-2">
                {pkg.details.core.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-white/20" />
                    <span className="text-sm text-white/55 font-light leading-relaxed">{item}</span>
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

export default function ArtistOSBanking() {
  return (
    <section className="relative py-32 px-8 lg:px-12 overflow-hidden" style={{ background: 'linear-gradient(to bottom, #0B0B0D 0%, #0d1118 50%, #0B0B0D 100%)' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(59,130,246,0.04) 0%, transparent 70%)' }} className="absolute inset-0" />
        <div style={{ background: 'radial-gradient(ellipse 50% 50% at 20% 80%, rgba(245,158,11,0.03) 0%, transparent 60%)' }} className="absolute inset-0" />
        <div style={{ background: 'radial-gradient(ellipse 50% 50% at 80% 80%, rgba(16,185,129,0.03) 0%, transparent 60%)' }} className="absolute inset-0" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.02] border border-white/[0.07] mb-7">
            <Landmark className="w-3.5 h-3.5 text-blue-400/70" />
            <span className="text-[10px] font-bold tracking-[0.22em] uppercase text-white/35">Institutional Capital Access</span>
          </div>

          <h2 className="font-black tracking-tighter mb-5 leading-[0.93]" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#E5E5E7' }}>
            Banking and Capital Infrastructure for Creative Businesses
          </h2>

          <p className="text-lg md:text-xl text-white/55 max-w-3xl mx-auto font-light leading-relaxed mb-5">
            Artist OS Banking connects artists, music companies, and creative professionals to institutional banking infrastructure through GMG's financial partners. Banking structure, cash management, royalty-backed credit, corporate card access, capital positioning, and operational financial tools — designed to give modern entertainment businesses the leverage, stability, and control to operate at a higher level.
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
            <BankingCard key={pkg.id} pkg={pkg} />
          ))}
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl border border-white/[0.05] bg-white/[0.015] p-6 md:p-8 backdrop-blur-sm">
            <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-white/20 mb-3">Disclaimer</p>
            <p className="text-xs text-white/28 leading-relaxed font-light">
              Banking, credit, and capital access are provided through third-party financial institutions and partners. Greater Music Group does not directly provide banking or lending services. All financial products, including accounts, credit lines, and advances, are subject to partner approval, underwriting, eligibility requirements, and applicable regulations. Nothing presented constitutes an offer to lend or a guarantee of financing.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
