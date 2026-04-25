import { type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { usePageMeta } from '../hooks/usePageMeta';
import { useScrollDepth } from '../hooks/useScrollDepth';
import { Analytics } from '../lib/analytics';
import {
  ArrowRight, Zap, Megaphone, TrendingUp, Waves,
  LayoutGrid as Layout, Database, Workflow,
  Building2, Music, DollarSign, Settings, Globe,
} from 'lucide-react';
import GMGMotif from '../components/GMGMotif';
import GlobeVisual from '../components/GlobeVisual';
import { useReveal } from '../hooks/useReveal';
import { RevealChild } from '../components/RevealSection';
import { useIndustryOS } from '../auth/IndustryOSContext';
import { ROUTES } from '../lib/routes';
import { useMagneticCard } from '../hooks/useMagneticCard';

// ─── Gallagher logo — inline SVG, re-colored for dark system aesthetic ──────
// Globe mark: blue accent. Wordmark: white. Dark overlay path: removed.
function GallagherLogo({ width = 110, opacity = 0.82 }: { width?: number; opacity?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="9 143 175 27"
      width={width}
      height="auto"
      aria-label="Gallagher"
      style={{
        display: 'block',
        opacity,
        filter: 'drop-shadow(0 0 8px rgba(120,180,255,0.15))',
        flexShrink: 0,
      }}
    >
      {/* Wordmark — GALLAGHER — white fill */}
      <path
        fill="rgba(255,255,255,0.92)"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M22.303 162.453v-10.039h-7.398v4.18h2.379v2.176c-.609.145-1.16.232-1.625.232-3.046 0-5.165-2.205-5.165-5.311 0-3.279 2.292-5.484 5.89-5.484 1.828 0 3.83.523 6.006 1.568v-4.643c-2.524-1.104-4.991-1.654-7.457-1.654-3.396 0-6.093.928-8.27 2.902-2.147 1.973-3.191 4.41-3.191 7.34 0 3.656 1.741 6.674 4.961 8.617 1.828 1.104 3.975 1.629 6.557 1.629 2.526.001 4.934-.525 7.313-1.513z"
      />
      <path
        fill="rgba(255,255,255,0.92)"
        d="M23.082 163.615h6.939l1.393-3.395h8.965l1.335 3.395h6.876l-9.024-19.818h-7.225l-9.259 19.818zm9.898-7.195l2.989-7.342 2.901 7.342h-5.89z"
      />
      <path
        fill="rgba(255,255,255,0.92)"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M49.78 163.615h14.74v-5.107h-7.922v-14.711H49.78v19.818zM66.608 163.615h14.74v-5.107h-7.921v-14.711h-6.819v19.818z"
      />
      <path
        fill="rgba(255,255,255,0.92)"
        d="M80.879 163.615h6.939l1.393-3.395h8.965l1.336 3.395h6.877l-9.025-19.818H90.14l-9.261 19.818zm9.899-7.195l2.988-7.342 2.902 7.342h-5.89z"
      />
      <path
        fill="rgba(255,255,255,0.92)"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M124.609 162.453v-10.039h-7.398v4.18h2.379v2.176c-.609.145-1.16.232-1.625.232-3.047 0-5.164-2.205-5.164-5.311 0-3.279 2.291-5.484 5.889-5.484 1.828 0 3.83.523 6.006 1.568v-4.643c-2.523-1.104-4.99-1.654-7.457-1.654-3.395 0-6.092.928-8.27 2.902-2.146 1.973-3.189 4.41-3.189 7.34 0 3.656 1.74 6.674 4.961 8.617 1.828 1.104 3.975 1.629 6.557 1.629 2.524.001 4.932-.525 7.311-1.513z"
      />
      <path
        fill="rgba(255,255,255,0.92)"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M127.828 163.615h6.936v-7.342h7.107v7.342h6.936v-19.818h-6.936v7.254h-7.107v-7.254h-6.936v19.818zM152.346 163.615h14.74v-4.236h-7.922v-3.656h7.371v-4.149h-7.371v-3.453h7.66v-4.324h-14.478v19.818z"
      />
      <path
        fill="rgba(255,255,255,0.92)"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M169.756 163.615h6.848v-8.299h.957c1.711 0 2.408 1.074 3.627 3.859l1.943 4.439h6.789L186.99 157c-.58-1.336-1.248-2.293-2.322-2.873 2.061-.928 3.076-2.408 3.076-4.469 0-4.033-2.93-5.861-8.906-5.861h-9.082v19.818zm6.848-11.693v-4.613h1.422c2.146 0 3.162.639 3.162 2.32 0 1.771-1.074 2.293-3.279 2.293h-1.305z"
      />
    </svg>
  );
}

// ─── Data ───────────────────────────────────────────────────────────────────

const aiCoworkers = [
  {
    name: 'Atlas',
    roleType: 'Campaign Operator',
    specialty: 'Release Strategy & Campaign Execution',
    description: 'Plans, coordinates, and executes real releases across platforms.',
    tags: ['Release Strategy', 'Campaign Planning', 'Rollout Execution'],
    icon: Megaphone,
  },
  {
    name: 'Crest',
    roleType: 'Audience Builder',
    specialty: 'Audience Growth & Fan Development',
    description: 'Builds and optimizes audience systems, engagement loops, and growth strategy.',
    tags: ['Audience Growth', 'Platform Strategy', 'Fan Engagement'],
    icon: TrendingUp,
  },
  {
    name: 'Echo',
    roleType: 'Cultural Analyst',
    specialty: 'Cultural Intelligence & Positioning',
    description: 'Identifies trends, signals, and positioning opportunities before they break.',
    tags: ['Trend Analysis', 'Cultural Positioning', 'Signal Identification'],
    icon: Waves,
  },
  {
    name: 'Current',
    roleType: 'Content Systems',
    specialty: 'Content + Distribution',
    description: 'Supports content creation systems, posting strategy, and distribution workflows.',
    tags: ['Content Strategy', 'Distribution', 'Short Form Systems'],
    icon: Layout,
  },
  {
    name: 'Ledger',
    roleType: 'Catalog Operator',
    specialty: 'Catalog Growth',
    description: 'Optimizes catalog performance, metadata, and long-term audience expansion.',
    tags: ['Catalog Strategy', 'Metadata Optimization', 'Revenue Growth'],
    icon: Database,
  },
  {
    name: 'Vector',
    roleType: 'Artist Operations',
    specialty: 'Day-to-Day Execution',
    description: 'Supports artist workflows, coordination, and operational execution across teams.',
    tags: ['Artist Support', 'Operations', 'Coordination'],
    icon: Workflow,
  },
];

const boutiqueTools = [
  { icon: Music,      label: 'Artist OS',            sub: 'Career Operating System',  accent: '145,168,255' },
  { icon: Megaphone,  label: 'Campaign Builder',      sub: 'Campaign Execution',       accent: '100,210,180' },
  { icon: DollarSign, label: 'Revenue Dashboard',     sub: 'Financial Intelligence',   accent: '255,190,80'  },
  { icon: Zap,        label: 'AI Coworkers',           sub: 'Autonomous Workflow',      accent: '195,145,255' },
  { icon: Settings,   label: 'Release System',         sub: 'Release Infrastructure',   accent: '120,200,255' },
  { icon: Globe,      label: 'Cultural Intelligence',  sub: 'Trend Signal Engine',      accent: '255,145,145' },
];

// Star field data — module-level so it's computed once, not on every render.
// boxShadow pre-computed to avoid template-string allocation per render.
const STARS: Array<{ x: number; y: number; r: number; o: number; shadow: string }> = [
  { x: 12, y: 18, r: 1.4, o: 0.35, shadow: '' }, { x: 27, y: 8,  r: 1.0, o: 0.22, shadow: '' },
  { x: 44, y: 14, r: 1.6, o: 0.42, shadow: '' }, { x: 58, y: 6,  r: 0.9, o: 0.18, shadow: '' },
  { x: 71, y: 21, r: 1.2, o: 0.28, shadow: '' }, { x: 83, y: 11, r: 1.5, o: 0.32, shadow: '' },
  { x: 93, y: 27, r: 0.8, o: 0.16, shadow: '' }, { x: 6,  y: 42, r: 1.1, o: 0.24, shadow: '' },
  { x: 19, y: 55, r: 1.3, o: 0.30, shadow: '' }, { x: 33, y: 38, r: 1.8, o: 0.45, shadow: '' },
  { x: 48, y: 32, r: 1.0, o: 0.22, shadow: '' }, { x: 63, y: 45, r: 1.4, o: 0.36, shadow: '' },
  { x: 76, y: 36, r: 0.9, o: 0.20, shadow: '' }, { x: 89, y: 50, r: 1.6, o: 0.38, shadow: '' },
  { x: 97, y: 40, r: 1.2, o: 0.26, shadow: '' }, { x: 8,  y: 68, r: 1.0, o: 0.20, shadow: '' },
  { x: 22, y: 74, r: 1.5, o: 0.34, shadow: '' }, { x: 37, y: 62, r: 1.1, o: 0.24, shadow: '' },
  { x: 52, y: 71, r: 2.0, o: 0.48, shadow: '' }, { x: 66, y: 58, r: 1.3, o: 0.30, shadow: '' },
  { x: 79, y: 72, r: 1.0, o: 0.20, shadow: '' }, { x: 91, y: 63, r: 1.7, o: 0.40, shadow: '' },
  { x: 15, y: 86, r: 0.9, o: 0.18, shadow: '' }, { x: 30, y: 90, r: 1.2, o: 0.26, shadow: '' },
  { x: 45, y: 83, r: 1.5, o: 0.35, shadow: '' }, { x: 60, y: 88, r: 1.0, o: 0.22, shadow: '' },
  { x: 74, y: 82, r: 1.8, o: 0.42, shadow: '' }, { x: 87, y: 91, r: 1.1, o: 0.24, shadow: '' },
  { x: 96, y: 78, r: 1.4, o: 0.32, shadow: '' }, { x: 4,  y: 95, r: 0.8, o: 0.16, shadow: '' },
  { x: 38, y: 48, r: 2.2, o: 0.52, shadow: '' }, { x: 42, y: 52, r: 1.6, o: 0.38, shadow: '' },
  { x: 35, y: 44, r: 1.2, o: 0.28, shadow: '' },
].map(s => ({ ...s, shadow: s.o > 0.35 ? `0 0 ${s.r * 4}px rgba(200,210,255,${s.o * 0.5})` : 'none' }));

// ─── Sub-components ─────────────────────────────────────────────────────────

function SectionLabel({ text }: { text: string }) {
  return (
    <p
      className="mb-5"
      style={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.30em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.38)',
      }}
    >
      {text}
    </p>
  );
}

function Divider() {
  return <div className="w-10 h-px mt-5 mb-6" style={{ background: 'rgba(255,255,255,0.12)' }} />;
}

// Returns the inline style for a hero entry element.
// All children share the same transition (defined in .entry-el CSS);
// only the delay and initial translateY differ per element.
function entryStyle(entered: boolean, delayMs: number, yPx = 18): CSSProperties {
  return {
    transitionDelay: `${delayMs}ms`,
    opacity: entered ? 1 : 0,
    transform: entered ? 'none' : `translateY(${yPx}px)`,
  };
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function IndustryOS() {
  const { iosAuth } = useIndustryOS();
  const isMember = iosAuth.authenticated;
  const magnetic = useMagneticCard(5);

  usePageMeta({
    title:       'Industry OS — Greater Music Group',
    description: 'Industry OS is a private platform for artists, operators, and creatives — combining tools, systems, and real opportunities to build in music and culture.',
    ogTitle:     'Industry OS — Greater Music Group',
    ogImage:     'https://greatermusicgroup.com/og/artist-os-preview.jpg',
    ogImageAlt:  'Industry OS — Greater Music Group',
    ogUrl:       'https://greatermusicgroup.com/industry-os',
  });

  useScrollDepth('industry_os');

  useEffect(() => {
    Analytics.pageView('industry_os');
  }, []);

  // ── Entry sequence ────────────────────────────────────────────────────────
  // `entered` fires after a single rAF so the browser has painted the dark bg
  // before any content becomes visible.  Each hero element reads from this
  // flag instead of the IntersectionObserver so it animates immediately on
  // mount regardless of scroll position.
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Logged-in users go straight to the app; guests go to signup
  const primaryCTARoute = isMember ? ROUTES.INDUSTRY_OS_APP : ROUTES.INDUSTRY_OS_SIGNUP;
  const primaryCTALabel = isMember ? 'Enter Industry OS' : 'Become a Member';
  const secondaryCTARoute = ROUTES.LOGIN_INDUSTRY_ALT;

  // Hero uses `entered` for its entry sequence; other sections use IntersectionObserver
  const [heroRef]                          = useReveal<HTMLElement>({ threshold: 0.05, rootMargin: '0px' });
  const [gigRef,       gigRevealed]       = useReveal<HTMLElement>({ threshold: 0.08 });
  const [communityRef, communityRevealed] = useReveal<HTMLElement>({ threshold: 0.08 });
  const [infraRef,     infraRevealed]     = useReveal<HTMLElement>({ threshold: 0.08 });
  const [learnRef,     learnRevealed]     = useReveal<HTMLElement>({ threshold: 0.08 });
  const [ctaRef,       ctaRevealed]       = useReveal<HTMLElement>({ threshold: 0.08 });

  // Fire section_engaged once per section when it first scrolls into view
  useEffect(() => { if (gigRevealed)       Analytics.sectionEngaged('gig_featured'); },       [gigRevealed]);
  useEffect(() => { if (communityRevealed) Analytics.sectionEngaged('community'); },           [communityRevealed]);
  useEffect(() => { if (infraRevealed)     Analytics.sectionEngaged('creative_infrastructure'); }, [infraRevealed]);
  useEffect(() => { if (learnRevealed)     Analytics.sectionEngaged('learn_ai_coworkers'); },  [learnRevealed]);
  useEffect(() => { if (ctaRevealed)       Analytics.sectionEngaged('join_cta'); },            [ctaRevealed]);

  return (
    <div className="min-h-screen text-white bg-[#060608]">

      {/* ── 1. HERO ─────────────────────────────────────────────────────── */}
      <section ref={heroRef} aria-label="Industry OS — hero" className="relative min-h-screen flex items-center overflow-hidden">
        {/* Base dark field */}
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 130% 100% at 50% 55%, rgba(8,8,13,1) 0%, rgba(6,6,8,1) 100%)' }} />

        {/* Headline radial glow — gives the text a halo source */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 55% 42% at 38% 44%, rgba(30,26,72,0.55) 0%, transparent 65%)' }} />

        {/* System-init glow ramp — fades in over 1.4s on mount, then pulses gently */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 68% 52% at 42% 46%, rgba(55,42,130,0.18) 0%, rgba(30,22,80,0.06) 55%, transparent 75%)',
            opacity: entered ? 1 : 0,
            transition: 'opacity 1.4s cubic-bezier(0.16, 1, 0.3, 1)',
            animation: entered ? 'sys-init-pulse 6s 1.4s ease-in-out infinite alternate' : 'none',
          }}
        />

        {/* Edge ambients */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 50% 38% at 8% 35%, rgba(14,160,110,0.04) 0%, transparent 60%)' }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 40% 32% at 88% 65%, rgba(6,140,200,0.035) 0%, transparent 58%)' }} />

        {/* Noise / grain layer — subtle moving texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '300px 300px',
            opacity: 0.6,
            mixBlendMode: 'overlay',
          }}
        />

        <div className="absolute inset-0 pointer-events-none" style={{ overflow: 'hidden' }}>
          {STARS.map((s, i) => (
            <div key={i} className="absolute rounded-full"
              style={{
                left: `${s.x}%`, top: `${s.y}%`,
                width: s.r * 2, height: s.r * 2,
                background: `rgba(255,255,255,${s.o})`,
                transform: 'translate(-50%,-50%)',
                boxShadow: s.shadow,
              }}
            />
          ))}
        </div>

        <GMGMotif />

        <div className="relative z-10 max-w-7xl mx-auto px-8 lg:px-16 py-40">
          <div className="max-w-3xl">

            <div className="entry-el mb-0" style={entryStyle(entered, 0)}>
              <SectionLabel text="Greater Music Group — Industry OS" />
            </div>

            <div className="entry-el" style={entryStyle(entered, 80, 22)}>
              <h1
                className="font-black tracking-[-0.035em] mb-8"
                style={{ fontSize: 'clamp(4.4rem, 8.5vw, 8.6rem)', lineHeight: 1.08, paddingBottom: '0.04em' }}
              >
                <span
                  style={{
                    background: 'linear-gradient(160deg, #ffffff 0%, rgba(235,238,255,0.94) 55%, rgba(185,192,240,0.82) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    display: 'block',
                  }}
                >
                  Enter the
                </span>
                <span
                  style={{
                    background: 'linear-gradient(160deg, rgba(210,218,255,0.92) 0%, rgba(185,198,252,0.78) 55%, rgba(160,176,245,0.64) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    display: 'block',
                    filter: 'drop-shadow(0 0 48px rgba(170,185,255,0.26))',
                  }}
                >
                  Industry OS
                </span>
              </h1>
            </div>

            <div className="entry-el" style={entryStyle(entered, 280)}>
              <p
                className="mb-5 font-medium"
                style={{
                  fontSize: 'clamp(1.2rem, 2vw, 1.25rem)',
                  lineHeight: 1.35,
                  color: 'rgba(255,255,255,0.82)',
                  maxWidth: '36ch',
                  letterSpacing: '-0.01em',
                }}
              >
                A private platform for artists, operators, and collaborators — built for creative business.
              </p>
            </div>

            <div className="entry-el" style={entryStyle(entered, 420, 16)}>
              <p
                className="mb-12"
                style={{
                  fontSize: 'clamp(1rem, 1.4vw, 1.125rem)',
                  lineHeight: 1.6,
                  color: 'rgba(255,255,255,0.86)',
                  maxWidth: '40ch',
                  letterSpacing: '0.003em',
                }}
              >
                Curated Resources. Real Collaborations.<br />
                No content. No followers.{' '}
                <span style={{ whiteSpace: 'nowrap' }}>Exclusively community.</span>
              </p>
            </div>

            <div className="entry-el" style={entryStyle(entered, 580, 14)}>
              <div className="flex flex-wrap items-center gap-4 mb-5">
                <Link
                  to={primaryCTARoute}
                  className="gmg-btn group inline-flex items-center gap-3 px-8 py-3.5 rounded-full font-semibold text-[13.5px] tracking-wide"
                  style={{
                    background: 'rgba(255,255,255,0.96)',
                    color: '#07060D',
                    boxShadow: '0 0 28px rgba(200,210,255,0.14), 0 4px 16px rgba(0,0,0,0.5)',
                  }}
                  onClick={() => Analytics.ctaClicked(primaryCTALabel, primaryCTARoute)}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#ffffff';
                    e.currentTarget.style.boxShadow = '0 0 40px rgba(200,210,255,0.22), 0 6px 20px rgba(0,0,0,0.55)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.96)';
                    e.currentTarget.style.boxShadow = '0 0 28px rgba(200,210,255,0.14), 0 4px 16px rgba(0,0,0,0.5)';
                  }}
                >
                  {primaryCTALabel}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                {!isMember && (
                  <Link
                    to={secondaryCTARoute}
                    className="gmg-btn inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-medium text-[13.5px] tracking-wide"
                    style={{ border: '1px solid rgba(255,255,255,0.13)', color: 'rgba(255,255,255,0.48)' }}
                    onClick={() => Analytics.ctaClicked('Log In', secondaryCTARoute)}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.28)'; e.currentTarget.style.color = 'rgba(255,255,255,0.82)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.13)'; e.currentTarget.style.color = 'rgba(255,255,255,0.48)'; }}
                  >
                    Log In
                  </Link>
                )}
              </div>
              <p className="text-[11px] tracking-[0.08em]" style={{ color: 'rgba(255,255,255,0.30)' }}>
                Free to join. Acceptance required.
              </p>
              <p className="text-[11px] tracking-[0.06em] mt-2" style={{ color: 'rgba(255,255,255,0.20)' }}>
                Used by artists, executives, and operators across the industry.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── Glow-bleed bridge: hero → GIG ─────────────────────────────── */}
      <div className="pointer-events-none" style={{ height: 80, background: 'linear-gradient(180deg, transparent 0%, rgba(45,35,115,0.08) 50%, transparent 100%)' }} />

      {/* ── 2. GIG FEATURED SECTION ─────────────────────────────────────── */}
      <section ref={gigRef} aria-label="GIG — Featured System" className={`relative py-36 px-8 lg:px-16 overflow-hidden reveal-section${gigRevealed ? ' is-revealed' : ''}`}
        style={{ background: 'linear-gradient(180deg, #060608 0%, #08070F 40%, #07060D 100%)' }}>
        {/* Slow background drift — CSS keyframe via inline style */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 70% 60% at 52% 46%, rgba(45,35,115,0.20) 0%, transparent 62%)',
            animation: 'gig-drift 18s ease-in-out infinite alternate',
          }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 35% 45% at 80% 36%, rgba(40,65,160,0.09) 0%, transparent 56%)' }} />

        <div className="max-w-7xl mx-auto relative z-10">
          <RevealChild revealed={gigRevealed} delay={0}>
            <SectionLabel text="Featured System" />
          </RevealChild>

          <RevealChild revealed={gigRevealed} delay={100}>
          <div
            className="group relative rounded-3xl overflow-hidden mb-6 transition-all duration-700"
            style={{
              background: 'linear-gradient(148deg, rgba(14,11,24,0.99) 0%, rgba(9,7,18,1) 100%)',
              border: '1px solid rgba(100,80,190,0.14)',
              boxShadow: '0 0 120px rgba(55,40,150,0.10), 0 52px 100px rgba(0,0,0,0.75)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
              (e.currentTarget as HTMLDivElement).style.boxShadow = '0 0 150px rgba(70,50,180,0.16), 0 64px 120px rgba(0,0,0,0.82), 0 0 0 1px rgba(130,105,240,0.12)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLDivElement).style.boxShadow = '0 0 120px rgba(55,40,150,0.10), 0 52px 100px rgba(0,0,0,0.75)';
            }}
          >
            {/* Top edge light */}
            <div className="absolute top-0 left-0 right-0 h-px pointer-events-none"
              style={{ background: 'linear-gradient(90deg, transparent 10%, rgba(120,95,230,0.28) 50%, transparent 90%)' }} />
            {/* Right ambient bleed */}
            <div className="absolute -right-28 top-0 bottom-0 w-72 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse 100% 70% at 100% 50%, rgba(55,90,195,0.07) 0%, transparent 70%)' }} />

            <div className="p-10 md:p-14 lg:p-16">

              {/* ── Partnership badge row ── */}
              <div className="flex items-center gap-3 mb-12">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <Zap className="w-3 h-3" style={{ color: 'rgba(165,145,248,0.85)' }} />
                  <span className="text-[10.5px] font-bold tracking-[0.16em] uppercase"
                    style={{ color: 'rgba(255,255,255,0.72)' }}>GMG</span>
                </div>
                <div className="w-4 h-px" style={{ background: 'rgba(255,255,255,0.10)' }} />
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <GallagherLogo width={64} opacity={0.75} />
                </div>
                <span className="ml-auto text-[8px] font-bold tracking-[0.24em] uppercase px-3 py-1.5 rounded-full"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.09)',
                    color: 'rgba(255,255,255,0.32)',
                    fontFamily: 'monospace',
                  }}>
                  Available
                </span>
              </div>

              {/* Two-column: copy left, globe right */}
              <div className="grid lg:grid-cols-[1fr_420px] gap-16 items-center">

                {/* ── Left: copy ── */}
                <div>

                  {/* ── GIG unified lockup — treated as one typographic unit ── */}
                  <div className="mb-6 select-none" style={{ maxWidth: 520 }}>

                    {/* GIG — flagship product mark */}
                    <div className="leading-none" style={{ marginBottom: '0.10em' }}>
                      <span
                        className="font-black"
                        style={{
                          fontSize: 'clamp(5.2rem, 9.5vw, 8.4rem)',
                          letterSpacing: '-0.055em',
                          lineHeight: 1,
                          background: 'linear-gradient(128deg, #ffffff 0%, rgba(232,237,255,0.98) 28%, rgba(200,212,255,0.92) 58%, rgba(165,182,248,0.82) 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                          filter: [
                            'drop-shadow(0 0 56px rgba(160,185,255,0.28))',
                            'drop-shadow(0 0 12px rgba(180,200,255,0.16))',
                            'drop-shadow(0 4px 0 rgba(0,0,0,0.65))',
                          ].join(' '),
                          display: 'inline-block',
                        }}
                      >
                        GIG
                      </span>
                    </div>

                    {/* "Greater Insurance with Gallagher" — sits flush under GIG, same unit */}
                    <p
                      className="font-bold leading-none"
                      style={{
                        fontSize: 'clamp(1.25rem, 2.2vw, 1.75rem)',
                        letterSpacing: '-0.022em',
                        color: 'rgba(255,255,255,0.96)',
                        textShadow: '0 0 28px rgba(175,195,255,0.14)',
                        marginBottom: '1.05em',
                      }}
                    >
                      Greater Insurance{' '}
                      <span style={{ color: 'rgba(180,198,255,0.66)', letterSpacing: '-0.018em' }}>
                        with Gallagher
                      </span>
                    </p>

                    {/* Gallagher partner badge */}
                    <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 5, alignItems: 'flex-start' }}>
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 600,
                          letterSpacing: '0.24em',
                          textTransform: 'uppercase',
                          color: 'rgba(255,255,255,0.35)',
                          lineHeight: 1,
                          paddingLeft: 2,
                        }}
                      >
                        Powered by
                      </span>
                      <GallagherLogo width={114} opacity={0.88} />
                    </div>

                  </div>

                  {/* Divider rule */}
                  <div className="w-8 h-px mb-5" style={{ background: 'rgba(120,95,215,0.38)' }} />

                  {/* Subhead — flagship authority */}
                  <div className="mb-4" style={{ maxWidth: '44ch' }}>
                    <p
                      style={{
                        fontSize: 'clamp(17px, 1.5vw, 19px)',
                        lineHeight: 1.5,
                        fontWeight: 400,
                        color: 'rgba(255,255,255,0.88)',
                        letterSpacing: '-0.005em',
                      }}
                    >
                      GIG insurance is a custom-built package for creatives — thoughtfully crafted with Gallagher, the global leader in entertainment insurance.
                    </p>
                  </div>

                  {/* Body copy — larger, readable */}
                  <div className="mb-8" style={{ maxWidth: '44ch' }}>
                    <p style={{ fontSize: 17, lineHeight: 1.55, color: 'rgba(255,255,255,0.54)', fontWeight: 400 }}>
                      Designed around the way creative work actually happens: touring, equipment, liability, production, teams, travel, and growth.
                    </p>
                    <p style={{ fontSize: 17, lineHeight: 1.55, color: 'rgba(255,255,255,0.54)', fontWeight: 400, marginTop: '0.75em' }}>
                      Comprehensive coverage. Thoughtful pricing. Real protection for every stage of your career.
                    </p>
                  </div>

                  {/* Package tiers */}
                  <div className="space-y-2 mb-10">
                    {[
                      { label: 'Artists',                sub: 'For artists, DJs, and producers building and performing.', dot: '140,168,242' },
                      { label: 'Creative Professionals', sub: 'For executives and independent operators.',               dot: '172,158,235' },
                      { label: 'Creative Companies',     sub: 'For labels, agencies, and creative businesses.',         dot: '155,178,230' },
                    ].map((pkg) => (
                      <div key={pkg.label}
                        className="rounded-xl px-5 py-4 cursor-default"
                        style={{
                          background: 'rgba(255,255,255,0.032)',
                          border: '1px solid rgba(255,255,255,0.068)',
                          backdropFilter: 'blur(8px)',
                          transition: 'transform 0.26s cubic-bezier(0.16,1,0.3,1), box-shadow 0.26s ease, border-color 0.26s ease, background 0.26s ease',
                        }}
                        onMouseEnter={e => {
                          const el = e.currentTarget as HTMLDivElement;
                          el.style.transform = 'translateY(-2px)';
                          el.style.background = 'rgba(255,255,255,0.06)';
                          el.style.borderColor = `rgba(${pkg.dot},0.28)`;
                          el.style.boxShadow = `0 8px 28px rgba(0,0,0,0.42), 0 0 18px rgba(${pkg.dot},0.08), 0 0 0 1px rgba(${pkg.dot},0.12)`;
                        }}
                        onMouseLeave={e => {
                          const el = e.currentTarget as HTMLDivElement;
                          el.style.transform = 'translateY(0)';
                          el.style.background = 'rgba(255,255,255,0.032)';
                          el.style.borderColor = 'rgba(255,255,255,0.068)';
                          el.style.boxShadow = 'none';
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{
                              background: `rgba(${pkg.dot},0.80)`,
                              boxShadow: `0 0 6px rgba(${pkg.dot},0.40)`,
                            }} />
                          <p className="text-[13.5px] font-semibold" style={{ color: 'rgba(255,255,255,0.92)' }}>{pkg.label}</p>
                        </div>
                        <p className="text-[12px] mt-1.5 ml-5" style={{ color: 'rgba(255,255,255,0.48)' }}>{pkg.sub}</p>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap gap-3">
                      <Link
                        to={primaryCTARoute}
                        className="gmg-btn group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full font-semibold text-[13px] tracking-wide"
                        style={{ background: 'rgba(255,255,255,0.94)', color: '#07060D' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,1)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.94)')}
                      >
                        {primaryCTALabel}
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                      {!isMember && (
                        <Link
                          to={secondaryCTARoute}
                          className="gmg-btn inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-medium text-[13px] tracking-wide"
                          style={{ border: '1px solid rgba(255,255,255,0.11)', color: 'rgba(255,255,255,0.42)' }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.24)'; e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.11)'; e.currentTarget.style.color = 'rgba(255,255,255,0.42)'; }}
                        >
                          Log In
                        </Link>
                      )}
                    </div>
                    <p className="text-[10.5px] tracking-[0.1em] uppercase"
                      style={{ color: 'rgba(255,255,255,0.30)', letterSpacing: '0.1em' }}>
                      Free to join. Approval required.
                    </p>
                  </div>
                </div>

                {/* ── Right: globe — aligned with headline block ── */}
                <div className="hidden lg:flex items-center justify-center">
                  <GlobeVisual />
                </div>
              </div>
            </div>
          </div>

          </RevealChild>

          <RevealChild revealed={gigRevealed} delay={220}>
            {/* Infrastructure footnote */}
            <div className="px-2 py-5 flex items-start gap-4">
              <div className="w-0.5 h-0.5 rounded-full mt-2.5 shrink-0"
                style={{ background: 'rgba(120,98,225,0.6)' }} />
              <p className="text-[13px] leading-relaxed italic"
                style={{ color: 'rgba(255,255,255,0.34)' }}>
                We're building infrastructure for creatives — thoughtfully, intentionally, and from the inside out.
              </p>
            </div>
          </RevealChild>
        </div>
      </section>

      {/* ── Glow-bleed bridge: GIG → Community ─────────────────────────── */}
      <div className="pointer-events-none" style={{ height: 80, background: 'linear-gradient(180deg, transparent 0%, rgba(55,45,140,0.06) 50%, transparent 100%)' }} />

      {/* ── 3. COMMUNITY ────────────────────────────────────────────────── */}
      <section ref={communityRef} aria-label="Community — Industry OS" className={`relative py-32 px-8 lg:px-16 overflow-hidden reveal-section${communityRevealed ? ' is-revealed' : ''}`}
        style={{ background: 'linear-gradient(180deg, #07060D 0%, #06060A 100%)' }}>
        {/* Ambient radial — right side, behind the product panel */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 55% 65% at 82% 50%, rgba(80,55,170,0.07) 0%, transparent 65%)' }} />
        {/* Left ambient — behind headline */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 45% 50% at 15% 40%, rgba(55,45,140,0.05) 0%, transparent 60%)' }} />
        <GMGMotif />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-[1fr_400px] gap-20 items-start">
            <div>
              <RevealChild revealed={communityRevealed} delay={0}>
                <SectionLabel text="Community" />
              </RevealChild>

              {/* Headline */}
              <RevealChild revealed={communityRevealed} delay={80}>
              <h2
                className="font-black tracking-[-0.03em] leading-[0.90] mb-7"
                style={{ fontSize: 'clamp(2.6rem, 5.2vw, 4.6rem)' }}
              >
                <span
                  style={{
                    background: 'linear-gradient(160deg, #ffffff 0%, rgba(230,234,255,0.95) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    display: 'block',
                  }}
                >
                  A Community That Actually
                </span>
                <span
                  style={{
                    background: 'linear-gradient(118deg, rgba(195,206,255,0.82) 0%, rgba(160,178,248,0.65) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    display: 'block',
                    filter: 'drop-shadow(0 0 36px rgba(170,188,255,0.14))',
                  }}
                >
                  Moves You Forward
                </span>
              </h2>
              </RevealChild>

              {/* Body */}
              <RevealChild revealed={communityRevealed} delay={160}>
              <div className="mb-9" style={{ maxWidth: '40ch' }}>
                {/* Subhead — sharper, higher contrast, slightly larger */}
                <p
                  style={{
                    fontSize: 17,
                    lineHeight: 1.5,
                    fontWeight: 500,
                    color: 'rgba(255,255,255,0.88)',
                    marginBottom: '0.7em',
                    letterSpacing: '-0.005em',
                  }}
                >
                  You don't need to be inside GMG to be part of this.
                </p>
                <p className="text-[14.5px] leading-[1.68]"
                  style={{ color: 'rgba(255,255,255,0.44)' }}>
                  Industry OS is a free, curated community for creatives across music, media, and culture — tools, opportunities, and people designed to help you grow.
                </p>
              </div>

              {/* Bullet system — wider spacing, hover lift */}
              <div className="mb-10" style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                {[
                  { title: 'Curated opportunities and collaborations',          sub: 'Hand-picked, not algorithmic' },
                  { title: 'Access to real tools used inside GMG',              sub: 'Same infrastructure, available to members' },
                  { title: 'A community of artists, executives, and creatives', sub: 'Application-based, high-signal' },
                  { title: 'Early access to new systems and releases',          sub: 'First to know, first to act' },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-3.5 rounded-xl px-3 py-3 cursor-default"
                    style={{
                      transition: 'background 0.22s ease, transform 0.22s cubic-bezier(0.16,1,0.3,1), box-shadow 0.22s ease',
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLDivElement;
                      el.style.background = 'rgba(255,255,255,0.028)';
                      el.style.transform  = 'translateY(-1px)';
                      el.style.boxShadow  = '0 4px 20px rgba(0,0,0,0.30), 0 0 0 1px rgba(175,190,255,0.06)';
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLDivElement;
                      el.style.background = 'transparent';
                      el.style.transform  = 'translateY(0)';
                      el.style.boxShadow  = 'none';
                    }}
                  >
                    {/* Glow dot */}
                    <div className="mt-[6px] shrink-0" style={{ position: 'relative', width: 8, height: 8 }}>
                      <div style={{
                        width: 6, height: 6,
                        borderRadius: '50%',
                        background: 'rgba(175,190,255,0.80)',
                        boxShadow: '0 0 8px rgba(175,190,255,0.50), 0 0 18px rgba(155,172,248,0.22)',
                        position: 'absolute',
                        top: 1, left: 1,
                      }} />
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold leading-snug"
                        style={{ color: 'rgba(255,255,255,0.84)' }}>
                        {item.title}
                      </p>
                      <p className="text-[12px] mt-0.5 leading-snug"
                        style={{ color: 'rgba(255,255,255,0.30)' }}>
                        {item.sub}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              </RevealChild>

              <RevealChild revealed={communityRevealed} delay={260}>
                {/* CTA — more prominent */}
                <div className="flex flex-wrap gap-3 mb-3.5">
                  <Link
                    to={primaryCTARoute}
                    className="gmg-btn group inline-flex items-center gap-3 rounded-full font-semibold text-[14px] tracking-wide"
                    style={{
                      padding: '14px 32px',
                      background: 'rgba(255,255,255,0.97)',
                      color: '#07060D',
                      boxShadow: '0 0 32px rgba(200,210,255,0.18), 0 6px 20px rgba(0,0,0,0.50)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background  = '#ffffff';
                      e.currentTarget.style.boxShadow   = '0 0 44px rgba(200,210,255,0.28), 0 8px 24px rgba(0,0,0,0.55)';
                      e.currentTarget.style.transform   = 'translateY(-1px)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background  = 'rgba(255,255,255,0.97)';
                      e.currentTarget.style.boxShadow   = '0 0 32px rgba(200,210,255,0.18), 0 6px 20px rgba(0,0,0,0.50)';
                      e.currentTarget.style.transform   = 'translateY(0)';
                    }}
                    onClick={() => Analytics.ctaClicked(primaryCTALabel, primaryCTARoute)}
                  >
                    {primaryCTALabel}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                  {!isMember && (
                    <Link
                      to={secondaryCTARoute}
                      className="gmg-btn inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-medium text-[13.5px] tracking-wide"
                      style={{ border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.44)' }}
                      onClick={() => Analytics.ctaClicked('Log In', secondaryCTARoute)}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.24)'; e.currentTarget.style.color = 'rgba(255,255,255,0.76)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.44)'; }}
                    >
                      Log In
                    </Link>
                  )}
                </div>
                {/* Micro trust line */}
                <p style={{ fontSize: 11.5, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', fontWeight: 500 }}>
                  Applications reviewed. High-signal community.
                </p>
              </RevealChild>
            </div>

            {/* Product panel — productized card */}
            <RevealChild revealed={communityRevealed} delay={180}>
            <div className="relative rounded-3xl overflow-hidden"
              style={{
                background: 'linear-gradient(158deg, rgba(18,14,30,0.98) 0%, rgba(11,9,20,1) 100%)',
                border: '1px solid rgba(130,105,220,0.22)',
                boxShadow: [
                  '0 0 100px rgba(80,55,180,0.14)',
                  '0 32px 72px rgba(0,0,0,0.68)',
                  'inset 0 1px 0 rgba(255,255,255,0.055)',
                  '0 0 0 1px rgba(115,88,210,0.08)',
                ].join(', '),
              }}>
              {/* Top edge light — brighter */}
              <div className="absolute top-0 left-0 right-0 h-px pointer-events-none"
                style={{ background: 'linear-gradient(90deg, transparent 5%, rgba(165,130,255,0.38) 50%, transparent 95%)' }} />
              {/* Inner radial glow — top center */}
              <div className="absolute top-0 left-0 right-0 h-52 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(110,85,215,0.11) 0%, transparent 70%)' }} />

              <div className="relative z-10 px-7 py-2">
                {[
                  { label: 'Who',     value: 'Artists · Executives · Operators', sub: 'Curated, application-based' },
                  { label: 'Access',  value: 'Free membership',                  sub: 'Approval required to join' },
                  { label: 'Tools',   value: 'GMG-grade systems',                sub: 'Same infrastructure used internally' },
                  { label: 'Network', value: 'Real relationships',               sub: 'Not followers — collaborators' },
                ].map((s, i, arr) => (
                  <div
                    key={s.label}
                    className="py-5 cursor-default"
                    style={{
                      borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                      transition: 'background 0.2s ease, padding-left 0.2s ease',
                      borderRadius: 8,
                      paddingLeft: 8,
                      paddingRight: 8,
                      margin: '0 -8px',
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLDivElement;
                      el.style.background   = 'rgba(255,255,255,0.032)';
                      el.style.borderBottom = i < arr.length - 1 ? '1px solid rgba(255,255,255,0.10)' : 'none';
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLDivElement;
                      el.style.background   = 'transparent';
                      el.style.borderBottom = i < arr.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none';
                    }}
                  >
                    <p className="text-[9px] font-mono tracking-[0.28em] uppercase mb-1.5"
                      style={{ color: 'rgba(255,255,255,0.24)' }}>{s.label}</p>
                    <p className="text-[14.5px] font-semibold leading-snug mb-1"
                      style={{ color: 'rgba(255,255,255,0.88)' }}>{s.value}</p>
                    <p className="text-[11.5px] leading-snug"
                      style={{ color: 'rgba(255,255,255,0.34)' }}>{s.sub}</p>
                  </div>
                ))}
              </div>
            </div>
            </RevealChild>
          </div>
        </div>
      </section>

      {/* ── Glow-bleed bridge: Community → Infrastructure ───────────────── */}
      <div className="pointer-events-none" style={{ height: 80, background: 'linear-gradient(180deg, transparent 0%, rgba(50,40,130,0.05) 50%, transparent 100%)' }} />

      {/* ── 4. CREATIVE INFRASTRUCTURE ──────────────────────────────────── */}
      <section ref={infraRef} aria-label="Creative Infrastructure" className={`relative py-28 px-8 lg:px-16 overflow-hidden reveal-section${infraRevealed ? ' is-revealed' : ''}`}
        style={{ background: 'linear-gradient(180deg, #06060A 0%, #08080D 50%, #060608 100%)' }}>
        {/* Top-center ambient — draws eye to heading */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 40% at 30% 20%, rgba(55,45,130,0.07) 0%, transparent 65%)' }} />
        <GMGMotif />
        <div className="max-w-7xl mx-auto relative z-10">
          <RevealChild revealed={infraRevealed} delay={0}>
            <div className="max-w-2xl mb-14">
              <SectionLabel text="Creative Infrastructure" />
              <h2
                className="font-black tracking-[-0.03em] leading-[0.92] mb-5"
                style={{ fontSize: 'clamp(2.4rem, 4.5vw, 4rem)', color: 'rgba(255,255,255,0.95)' }}
              >
                Built to Support How Creatives Actually Work
              </h2>
              <p className="text-[15px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.52)' }}>
                A curated boutique of tools, systems, and opportunities designed to help creatives operate, grow, and scale.
              </p>
            </div>
          </RevealChild>

          <RevealChild revealed={infraRevealed} delay={120}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {boutiqueTools.map((tool) => (
              <div
                key={tool.label}
                className="gmg-card group relative rounded-2xl overflow-hidden"
                data-interactive
                style={{
                  background: `linear-gradient(148deg, rgba(20,17,30,0.97) 0%, rgba(12,10,20,1) 100%)`,
                  border: `1px solid rgba(${tool.accent},0.13)`,
                  boxShadow: `0 2px 12px rgba(0,0,0,0.40), inset 0 1px 0 rgba(255,255,255,0.025)`,
                  padding: '1.625rem',
                }}
                onClick={() => Analytics.cardClicked('tool', tool.label)}
                onMouseEnter={e => {
                  Analytics.cardViewed('tool', tool.label);
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.background   = `linear-gradient(148deg, rgba(24,20,36,0.99) 0%, rgba(14,12,24,1) 100%)`;
                  el.style.boxShadow    = `0 0 40px rgba(${tool.accent},0.12), 0 20px 48px rgba(0,0,0,0.65), 0 0 0 1px rgba(${tool.accent},0.20), inset 0 1px 0 rgba(255,255,255,0.04)`;
                  el.style.borderColor  = `rgba(${tool.accent},0.28)`;
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.background   = `linear-gradient(148deg, rgba(20,17,30,0.97) 0%, rgba(12,10,20,1) 100%)`;
                  el.style.boxShadow    = `0 2px 12px rgba(0,0,0,0.40), inset 0 1px 0 rgba(255,255,255,0.025)`;
                  el.style.borderColor  = `rgba(${tool.accent},0.13)`;
                }}
              >
                {/* Top edge highlight */}
                <div className="absolute top-0 left-0 right-0 h-px pointer-events-none"
                  style={{ background: `linear-gradient(90deg, transparent 10%, rgba(${tool.accent},0.26) 50%, transparent 90%)` }} />

                {/* Hover glow bloom */}
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(ellipse 80% 55% at 50% 0%, rgba(${tool.accent},0.08) 0%, transparent 62%)`,
                    transition: 'opacity 0.35s ease',
                  }} />

                {/* Icon well */}
                <div
                  className="relative mb-5"
                  style={{
                    width: 44, height: 44,
                    borderRadius: 13,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: `radial-gradient(ellipse 110% 110% at 38% 28%, rgba(${tool.accent},0.14) 0%, rgba(255,255,255,0.03) 100%)`,
                    border: `1px solid rgba(${tool.accent},0.22)`,
                    // Glow behind icon — always slightly visible
                    boxShadow: `0 0 18px rgba(${tool.accent},0.12), 0 0 6px rgba(${tool.accent},0.08)`,
                    transition: 'box-shadow 0.28s ease, border-color 0.28s ease, background 0.28s ease',
                  }}
                  ref={(el) => {
                    if (!el) return;
                    const parent = el.closest('.group') as HTMLElement;
                    if (!parent) return;
                    parent.addEventListener('mouseenter', () => {
                      el.style.boxShadow   = `0 0 28px rgba(${tool.accent},0.32), 0 0 12px rgba(${tool.accent},0.18)`;
                      el.style.borderColor = `rgba(${tool.accent},0.42)`;
                      el.style.background  = `radial-gradient(ellipse 110% 110% at 38% 28%, rgba(${tool.accent},0.22) 0%, rgba(255,255,255,0.05) 100%)`;
                      const icon = el.querySelector('svg') as SVGElement;
                      if (icon) {
                        icon.style.color  = `rgba(${tool.accent},1)`;
                        icon.style.filter = `drop-shadow(0 0 5px rgba(${tool.accent},0.55))`;
                      }
                    });
                    parent.addEventListener('mouseleave', () => {
                      el.style.boxShadow   = `0 0 18px rgba(${tool.accent},0.12), 0 0 6px rgba(${tool.accent},0.08)`;
                      el.style.borderColor = `rgba(${tool.accent},0.22)`;
                      el.style.background  = `radial-gradient(ellipse 110% 110% at 38% 28%, rgba(${tool.accent},0.14) 0%, rgba(255,255,255,0.03) 100%)`;
                      const icon = el.querySelector('svg') as SVGElement;
                      if (icon) {
                        icon.style.color  = `rgba(${tool.accent},0.72)`;
                        icon.style.filter = 'none';
                      }
                    });
                  }}
                >
                  <tool.icon
                    style={{
                      width: 18, height: 18,
                      color: `rgba(${tool.accent},0.72)`,
                      transition: 'color 0.28s ease, filter 0.28s ease',
                      flexShrink: 0,
                    }}
                  />
                </div>

                {/* Title */}
                <p
                  className="leading-snug mb-1.5"
                  style={{ fontSize: 15, fontWeight: 700, color: 'rgba(255,255,255,0.92)', letterSpacing: '-0.012em' }}
                >
                  {tool.label}
                </p>
                {/* Subtitle — tool category language */}
                <p style={{ fontSize: 11.5, fontWeight: 500, color: `rgba(${tool.accent},0.52)`, lineHeight: 1.4, letterSpacing: '0.01em' }}>
                  {tool.sub}
                </p>
              </div>
            ))}
          </div>
          </RevealChild>
        </div>
      </section>

      {/* ── Glow-bleed bridge: Infrastructure → Learn+AI ────────────────── */}
      <div className="pointer-events-none" style={{ height: 80, background: 'linear-gradient(180deg, transparent 0%, rgba(60,48,155,0.06) 50%, transparent 100%)' }} />

      {/* ── 5. LEARN + AI ───────────────────────────────────────────────── */}
      <section ref={learnRef} aria-label="Learn and AI Coworkers" className={`relative py-32 px-8 lg:px-16 overflow-hidden reveal-section${learnRevealed ? ' is-revealed' : ''}`}
        style={{ background: 'linear-gradient(180deg, #060608 0%, #07070C 50%, #060608 100%)' }}>
        {/* Pulsing center ambient — gives the section a breathing core */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 65% 45% at 50% 22%, rgba(70,55,160,0.08) 0%, transparent 62%)',
            animation: 'learn-pulse 12s ease-in-out infinite alternate',
          }} />
        <GMGMotif />

        <div className="max-w-7xl mx-auto relative z-10">
          <RevealChild revealed={learnRevealed} delay={0}>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <SectionLabel text="Learn + AI" />
            <h2
              className="font-black tracking-[-0.03em] leading-[0.92] mb-5"
              style={{ fontSize: 'clamp(2.6rem, 5.5vw, 4.5rem)', color: 'rgba(255,255,255,0.95)' }}
            >
              For Those Who Want to Work in the Industry
            </h2>
            <p className="text-lg font-light mb-4" style={{ color: 'rgba(255,255,255,0.62)' }}>
              Whether you're just starting or already inside, this is where you build real experience.
            </p>
            <p className="text-[15px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.42)' }}>
              Industry OS includes hands-on systems and AI coworkers designed to help you learn by doing — not watching. Work on real campaigns. Build real skills. Connect with real people.
            </p>
          </div>
          </RevealChild>

          {/* Segment pills — who this is for */}
          <RevealChild revealed={learnRevealed} delay={100}>
          <div className="flex flex-wrap justify-center gap-2 mb-14">
            {[
              'Aspiring Music Professionals',
              'Independent Artists',
              'Executives & Operators',
              'Creatives Entering the Industry',
            ].map((who) => (
              <div
                key={who}
                className="cursor-default"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '9px 18px',
                  borderRadius: 100,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  transition: 'background 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.background   = 'rgba(165,148,255,0.10)';
                  el.style.borderColor  = 'rgba(165,148,255,0.35)';
                  el.style.boxShadow    = '0 0 16px rgba(155,138,245,0.14)';
                  const dot = el.querySelector('.pill-dot') as HTMLElement;
                  if (dot) dot.style.boxShadow = '0 0 8px rgba(165,148,255,0.65)';
                  const txt = el.querySelector('.pill-txt') as HTMLElement;
                  if (txt) txt.style.color = 'rgba(255,255,255,0.86)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.background   = 'rgba(255,255,255,0.04)';
                  el.style.borderColor  = 'rgba(255,255,255,0.10)';
                  el.style.boxShadow    = 'none';
                  const dot = el.querySelector('.pill-dot') as HTMLElement;
                  if (dot) dot.style.boxShadow = '0 0 6px rgba(155,138,245,0.35)';
                  const txt = el.querySelector('.pill-txt') as HTMLElement;
                  if (txt) txt.style.color = 'rgba(255,255,255,0.64)';
                }}
              >
                <div
                  className="pill-dot shrink-0"
                  style={{
                    width: 5, height: 5, borderRadius: '50%',
                    background: 'rgba(165,148,255,0.78)',
                    boxShadow: '0 0 6px rgba(155,138,245,0.35)',
                    transition: 'box-shadow 0.22s ease',
                  }}
                />
                <span
                  className="pill-txt"
                  style={{
                    fontSize: 12, fontWeight: 500, lineHeight: 1,
                    color: 'rgba(255,255,255,0.64)',
                    letterSpacing: '0.005em',
                    transition: 'color 0.22s ease',
                  }}
                >{who}</span>
              </div>
            ))}
          </div>
          </RevealChild>

          {/* AI Coworker cards */}
          <RevealChild revealed={learnRevealed} delay={200}>
          {/* System Roles micro-label */}
          <div className="flex items-center gap-3 mb-5">
            <p style={{
              fontSize: 9, fontWeight: 700, letterSpacing: '0.22em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)',
            }}>System Roles</p>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-14" style={{ perspective: '1200px' }}>
            {aiCoworkers.map((coworker) => (
              <div key={coworker.name}
                className="gmg-card group relative rounded-2xl overflow-hidden"
                data-interactive
                style={{
                  background: 'linear-gradient(148deg, rgba(18,15,28,0.98) 0%, rgba(11,9,20,1) 100%)',
                  border: '1px solid rgba(130,105,230,0.14)',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.022)',
                }}
                onClick={() => Analytics.cardClicked('ai_coworker', coworker.name)}
                onMouseEnter={e => {
                  Analytics.cardViewed('ai_coworker', coworker.name);
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.background   = 'linear-gradient(148deg, rgba(22,18,34,0.99) 0%, rgba(13,10,24,1) 100%)';
                  el.style.boxShadow    = '0 0 48px rgba(120,95,220,0.13), 0 20px 52px rgba(0,0,0,0.65), 0 0 0 1px rgba(145,120,245,0.18), inset 0 1px 0 rgba(255,255,255,0.04)';
                  el.style.borderColor  = 'rgba(145,120,245,0.28)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.background   = 'linear-gradient(148deg, rgba(18,15,28,0.98) 0%, rgba(11,9,20,1) 100%)';
                  el.style.boxShadow    = '0 2px 12px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.022)';
                  el.style.borderColor  = 'rgba(130,105,230,0.14)';
                  magnetic.onMouseLeave(e);
                }}
                onMouseMove={magnetic.onMouseMove}
              >
                {/* Top edge highlight */}
                <div className="absolute top-0 left-0 right-0 h-px pointer-events-none"
                  style={{ background: 'linear-gradient(90deg, transparent 10%, rgba(145,120,245,0.24) 50%, transparent 90%)' }} />
                {/* Hover bloom */}
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100"
                  style={{
                    background: 'radial-gradient(ellipse 75% 50% at 50% 0%, rgba(110,88,215,0.09) 0%, transparent 62%)',
                    transition: 'opacity 0.32s ease',
                  }} />

                {/* gmg-card-inner receives the magnetic tilt */}
                <div className="gmg-card-inner relative p-6">
                  {/* Header row */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        background: 'radial-gradient(ellipse 110% 110% at 38% 28%, rgba(140,115,240,0.16) 0%, rgba(255,255,255,0.03) 100%)',
                        border: '1px solid rgba(140,115,240,0.24)',
                        boxShadow: '0 0 16px rgba(130,105,230,0.14), 0 0 6px rgba(130,105,230,0.08)',
                      }}>
                      <coworker.icon className="w-[17px] h-[17px]" style={{ color: 'rgba(178,158,252,0.88)' }} />
                    </div>
                    <span style={{
                      fontSize: 8, fontWeight: 700, letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      padding: '4px 10px', borderRadius: 100,
                      background: 'rgba(145,120,245,0.08)',
                      border: '1px solid rgba(145,120,245,0.16)',
                      color: 'rgba(165,148,255,0.55)',
                    }}>
                      Available
                    </span>
                  </div>

                  <p style={{
                    fontSize: 9, fontWeight: 700, letterSpacing: '0.20em',
                    textTransform: 'uppercase', marginBottom: 4,
                    color: 'rgba(165,148,255,0.62)',
                  }}>{coworker.roleType}</p>

                  <h3 style={{ fontSize: 22, fontWeight: 900, lineHeight: 1.1, marginBottom: 4, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.02em' }}>
                    {coworker.name}
                  </h3>

                  <p style={{ fontSize: 12, fontWeight: 500, marginBottom: 12, color: 'rgba(255,255,255,0.48)', lineHeight: 1.4 }}>
                    {coworker.specialty}
                  </p>

                  <p style={{ fontSize: 13, lineHeight: 1.65, marginBottom: 16, color: 'rgba(255,255,255,0.62)' }}>
                    {coworker.description}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {coworker.tags.map((tag) => (
                      <span key={tag} style={{
                        fontSize: 9.5, fontWeight: 600,
                        padding: '3px 9px', borderRadius: 100,
                        background: 'rgba(255,255,255,0.035)',
                        border: '1px solid rgba(255,255,255,0.07)',
                        color: 'rgba(255,255,255,0.36)',
                        letterSpacing: '0.01em',
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          </RevealChild>

          <RevealChild revealed={learnRevealed} delay={300}>
          <div className="text-center flex flex-wrap items-center justify-center gap-4">
            <Link
              to={primaryCTARoute}
              className="gmg-btn group inline-flex items-center gap-3 px-8 py-3.5 rounded-full font-semibold text-[13.5px] tracking-wide"
              style={{
                background: 'rgba(255,255,255,0.96)',
                color: '#07060D',
                boxShadow: '0 0 28px rgba(200,210,255,0.12), 0 4px 14px rgba(0,0,0,0.45)',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#ffffff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.96)'; }}
            >
              {primaryCTALabel}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            {!isMember && (
              <Link
                to={secondaryCTARoute}
                className="gmg-btn inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-medium text-[13px] tracking-wide"
                style={{ border: '1px solid rgba(255,255,255,0.11)', color: 'rgba(255,255,255,0.42)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.24)'; e.currentTarget.style.color = 'rgba(255,255,255,0.78)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.11)'; e.currentTarget.style.color = 'rgba(255,255,255,0.42)'; }}
              >
                Log In
              </Link>
            )}
          </div>
          </RevealChild>
        </div>
      </section>

      {/* ── Glow-bleed bridge: Learn+AI → Final CTA ─────────────────────── */}
      <div className="pointer-events-none" style={{ height: 80, background: 'linear-gradient(180deg, transparent 0%, rgba(65,48,160,0.07) 50%, transparent 100%)' }} />

      {/* ── 6. FINAL CTA ────────────────────────────────────────────────── */}
      <section ref={ctaRef} aria-label="Join Industry OS" className={`relative py-44 px-8 lg:px-16 overflow-hidden reveal-section${ctaRevealed ? ' is-revealed' : ''}`}
        style={{ background: 'linear-gradient(180deg, #06060A 0%, #0E0B18 45%, #0A0812 100%)' }}>
        {/* Primary center ambient — stronger than other sections */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 75% 65% at 50% 52%, rgba(85,62,185,0.16) 0%, rgba(60,42,140,0.06) 55%, transparent 72%)',
            animation: 'cta-pulse 10s ease-in-out infinite alternate',
          }} />
        {/* Secondary outer ring — gives the section depth */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 100% 80% at 50% 50%, rgba(45,32,110,0.09) 0%, transparent 65%)' }} />
        {/* Top edge highlight — brighter than other sections */}
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent 10%, rgba(155,125,255,0.28) 50%, transparent 90%)' }} />
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{ background: 'linear-gradient(0deg, rgba(4,3,8,0.6) 0%, transparent 100%)' }} />
        <GMGMotif />

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <RevealChild revealed={ctaRevealed} delay={0}>
            <SectionLabel text="Industry OS" />
          </RevealChild>

          {/* Headline — larger, tighter */}
          <RevealChild revealed={ctaRevealed} delay={80}>
            <h2
              className="font-black tracking-[-0.045em] mb-7"
              style={{ fontSize: 'clamp(3.4rem, 8vw, 6.5rem)', lineHeight: 0.86 }}
            >
              <span style={{ color: 'rgba(255,255,255,0.97)' }}>Join the</span>
              <br />
              <span
                style={{
                  background: 'linear-gradient(118deg, rgba(200,185,255,0.82) 0%, rgba(165,148,248,0.65) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 0 40px rgba(175,158,255,0.22))',
                }}
              >
                Community
              </span>
            </h2>
          </RevealChild>

          {/* Subhead — larger, more readable */}
          <RevealChild revealed={ctaRevealed} delay={180}>
            <p
              className="mx-auto mb-12 leading-[1.72]"
              style={{ fontSize: 17, fontWeight: 300, color: 'rgba(255,255,255,0.60)', maxWidth: '38ch' }}
            >
              Create your profile to access tools, opportunities, and a curated community built to support creatives.
            </p>
          </RevealChild>

          {/* CTA — final conversion, largest button on the page */}
          <RevealChild revealed={ctaRevealed} delay={280}>
            <div className="flex flex-col items-center gap-4">
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  to={primaryCTARoute}
                  className="gmg-btn group inline-flex items-center gap-3 rounded-full font-bold tracking-wide"
                  style={{
                    fontSize: 15,
                    padding: '17px 40px',
                    background: 'rgba(255,255,255,0.98)',
                    color: '#06050E',
                    boxShadow: [
                      '0 0 48px rgba(210,200,255,0.22)',
                      '0 0 20px rgba(190,178,255,0.14)',
                      '0 8px 28px rgba(0,0,0,0.58)',
                    ].join(', '),
                    transition: 'transform 0.25s cubic-bezier(0.16,1,0.3,1), box-shadow 0.25s ease, background 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background  = '#ffffff';
                    e.currentTarget.style.transform   = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow   = [
                      '0 0 64px rgba(210,200,255,0.32)',
                      '0 0 28px rgba(190,178,255,0.20)',
                      '0 12px 36px rgba(0,0,0,0.65)',
                    ].join(', ');
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background  = 'rgba(255,255,255,0.98)';
                    e.currentTarget.style.transform   = 'translateY(0)';
                    e.currentTarget.style.boxShadow   = [
                      '0 0 48px rgba(210,200,255,0.22)',
                      '0 0 20px rgba(190,178,255,0.14)',
                      '0 8px 28px rgba(0,0,0,0.58)',
                    ].join(', ');
                  }}
                  onClick={() => Analytics.ctaClicked(primaryCTALabel, primaryCTARoute)}
                >
                  {primaryCTALabel}
                  <ArrowRight className="w-[17px] h-[17px] group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
                {!isMember && (
                  <Link
                    to={secondaryCTARoute}
                    className="gmg-btn inline-flex items-center gap-2 rounded-full font-medium tracking-wide"
                    style={{ fontSize: 14, padding: '17px 32px', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.50)' }}
                    onClick={() => Analytics.ctaClicked('Log In', secondaryCTARoute)}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.26)'; e.currentTarget.style.color = 'rgba(255,255,255,0.82)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.50)'; }}
                  >
                    Log In
                  </Link>
                )}
              </div>
              {/* Urgency line */}
              <p style={{
                fontSize: 11.5, fontWeight: 500,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.26)',
              }}>
                Limited access. Applications reviewed weekly.
              </p>
            </div>
          </RevealChild>
        </div>
      </section>

    </div>
  );
}
