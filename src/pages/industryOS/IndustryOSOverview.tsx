import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight, Lock, Radio, Zap, Layers, Target,
  Globe, Sparkles, ArrowUpRight, Users, TrendingUp, Shield,
  Activity, Bot, BookOpen, Package, DollarSign, BarChart3,
  Star, Briefcase, CheckCircle, ArrowRight, Play,
  MapPin, Cpu, Network, FileText,
} from 'lucide-react';
import { useIndustryOS } from '../../auth/IndustryOSContext';

const ACCENT = '#10B981';

function CinematicHeroBG() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf: number;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const PARTICLES = 55;
    const pts = Array.from({ length: PARTICLES }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.4 + 0.1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const grad = ctx.createRadialGradient(
        canvas.width * 0.5, canvas.height * 0.35, 0,
        canvas.width * 0.5, canvas.height * 0.35, canvas.width * 0.65
      );
      grad.addColorStop(0, 'rgba(16,185,129,0.07)');
      grad.addColorStop(0.5, 'rgba(16,185,129,0.02)');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const CELL = 60;
      ctx.strokeStyle = 'rgba(16,185,129,0.04)';
      ctx.lineWidth = 0.5;
      for (let x = 0; x < canvas.width; x += CELL) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += CELL) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(16,185,129,${p.opacity})`;
        ctx.fill();
      });

      pts.forEach((a, i) => {
        pts.slice(i + 1).forEach(b => {
          const dx = a.x - b.x; const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(16,185,129,${0.08 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.9 }}
    />
  );
}

const SIGNAL_ITEMS = [
  'New member approved — Brooklyn, NY',
  'Sync opportunity posted — Film Score / Indie',
  'AI training session added — Campaign Strategy',
  'New resource available — Release Templates',
  'Member connected to opportunity — West Coast',
  'System update — New tool integrations available',
  'Network expansion — Chicago market open',
];

function SignalStrip() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % SIGNAL_ITEMS.length), 3200);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="flex items-center gap-2 overflow-hidden">
      <div className="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse" style={{ background: ACCENT }} />
      <p key={idx} className="text-[10.5px] font-mono text-white/35 truncate ios-signal">
        {SIGNAL_ITEMS[idx]}
      </p>
    </div>
  );
}

const ACTIVITY_ITEMS = [
  { icon: Users, label: 'New member approved', sub: 'Austin, TX — Approved access', time: '2m ago', color: ACCENT },
  { icon: Target, label: 'Opportunity posted', sub: 'Sync licensing — Drama / Streaming', time: '11m ago', color: '#F59E0B' },
  { icon: Bot, label: 'AI session available', sub: 'Campaign Strategy Training updated', time: '24m ago', color: '#3B82F6' },
  { icon: BookOpen, label: 'Resource uploaded', sub: 'Release planning template added', time: '38m ago', color: ACCENT },
  { icon: Network, label: 'Network connection', sub: 'Two members introduced via system', time: '1h ago', color: '#8B5CF6' },
  { icon: Cpu, label: 'System update', sub: 'New integrations deployed', time: '2h ago', color: '#EC4899' },
];

function SystemActivityFeed() {
  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5" style={{ color: ACCENT }} />
          <h2 className="text-[13px] font-semibold text-white/80 tracking-wide">System Activity</h2>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: ACCENT }} />
          <span className="text-[9px] font-mono text-white/25 uppercase tracking-widest">Live</span>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {ACTIVITY_ITEMS.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              className="rounded-xl p-3 border ios-rise"
              style={{
                background: `${item.color}06`,
                borderColor: `${item.color}14`,
                animationDelay: `${i * 0.06}s`,
              }}
            >
              <div className="flex items-center gap-1.5 mb-2">
                <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
                  style={{ background: `${item.color}12` }}>
                  <Icon className="w-2.5 h-2.5" style={{ color: item.color }} />
                </div>
                <span className="text-[8px] font-mono text-white/20 ml-auto">{item.time}</span>
              </div>
              <p className="text-[10px] font-semibold text-white/65 leading-tight mb-0.5">{item.label}</p>
              <p className="text-[8.5px] text-white/25 leading-tight">{item.sub}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

const HEATMAP_CITIES = [
  { city: 'Los Angeles', state: 'CA', signals: 94, x: 8, y: 55 },
  { city: 'New York', state: 'NY', signals: 88, x: 82, y: 32 },
  { city: 'Atlanta', state: 'GA', signals: 76, x: 70, y: 58 },
  { city: 'Chicago', state: 'IL', signals: 71, x: 60, y: 30 },
  { city: 'Nashville', state: 'TN', signals: 65, x: 64, y: 50 },
  { city: 'Austin', state: 'TX', signals: 58, x: 48, y: 62 },
  { city: 'Miami', state: 'FL', signals: 54, x: 76, y: 72 },
  { city: 'Seattle', state: 'WA', signals: 48, x: 10, y: 18 },
  { city: 'Denver', state: 'CO', signals: 42, x: 33, y: 42 },
  { city: 'Phoenix', state: 'AZ', signals: 38, x: 20, y: 60 },
  { city: 'Portland', state: 'OR', signals: 35, x: 9, y: 26 },
  { city: 'Detroit', state: 'MI', signals: 31, x: 68, y: 28 },
];

function OpportunityHeatmap() {
  const [hovered, setHovered] = useState<number | null>(null);
  const maxSignals = Math.max(...HEATMAP_CITIES.map(c => c.signals));

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5" style={{ color: ACCENT }} />
          <h2 className="text-[13px] font-semibold text-white/80 tracking-wide">Opportunity Signals</h2>
        </div>
        <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">US Market Intelligence</span>
      </div>
      <div className="rounded-2xl border border-white/[0.06] overflow-hidden"
        style={{ background: 'rgba(10,12,15,0.95)' }}>
        <div className="relative" style={{ paddingBottom: '42%' }}>
          <div className="absolute inset-0 p-4">
            <div className="absolute inset-0"
              style={{
                backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(16,185,129,0.03) 0%, transparent 70%)',
              }} />
            {HEATMAP_CITIES.map((city, i) => {
              const intensity = city.signals / maxSignals;
              const isHovered = hovered === i;
              const size = 6 + intensity * 10;
              return (
                <div
                  key={i}
                  className="absolute flex flex-col items-center cursor-pointer transition-all"
                  style={{ left: `${city.x}%`, top: `${city.y}%`, transform: 'translate(-50%,-50%)' }}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <div
                    className="rounded-full transition-all"
                    style={{
                      width: isHovered ? size + 6 : size,
                      height: isHovered ? size + 6 : size,
                      background: `rgba(16,185,129,${0.2 + intensity * 0.55})`,
                      boxShadow: isHovered
                        ? `0 0 ${20 + intensity * 20}px rgba(16,185,129,${0.4 + intensity * 0.3})`
                        : `0 0 ${8 + intensity * 12}px rgba(16,185,129,${0.2 + intensity * 0.25})`,
                    }}
                  />
                  {isHovered && (
                    <div className="absolute z-10 rounded-lg px-2.5 py-1.5 border text-center"
                      style={{
                        bottom: '100%', marginBottom: 6,
                        background: '#0D1117', borderColor: `${ACCENT}30`,
                        minWidth: 90,
                      }}>
                      <p className="text-[10px] font-semibold text-white/80">{city.city}</p>
                      <p className="text-[8.5px] font-mono" style={{ color: ACCENT }}>{city.signals} signals</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="px-4 py-3 border-t border-white/[0.04] flex items-center gap-4 flex-wrap">
          {HEATMAP_CITIES.slice(0, 6).map((city, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full"
                style={{ background: `rgba(16,185,129,${0.3 + (city.signals / maxSignals) * 0.6})` }} />
              <span className="text-[9px] text-white/30">{city.city}</span>
              <span className="text-[9px] font-mono" style={{ color: `rgba(16,185,129,${0.4 + (city.signals / maxSignals) * 0.5})` }}>
                {city.signals}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const PACKAGES = [
  {
    tier: 'Artist',
    tag: 'For Emerging Artists',
    color: ACCENT,
    icon: Star,
    price: 'Apply for Access',
    description: 'Core infrastructure for independent artists building their business and brand.',
    features: [
      'Artist OS access',
      'Release planning tools',
      'Campaign & marketing support',
      'Revenue workflow infrastructure',
      'Network access (limited)',
    ],
  },
  {
    tier: 'Professional',
    tag: 'For Managers & Operators',
    color: '#3B82F6',
    icon: Briefcase,
    price: 'Apply for Access',
    description: 'Expanded tools for music professionals managing artists and operations.',
    features: [
      'All Artist tier features',
      'Multi-artist management tools',
      'Operator-level campaign access',
      'Advanced analytics & reporting',
      'Priority network placement',
    ],
    featured: true,
  },
  {
    tier: 'Company',
    tag: 'For Labels & Enterprises',
    color: '#F59E0B',
    icon: Globe,
    price: 'Custom — Contact Us',
    description: 'Full system access for labels, catalog owners, and enterprise partners.',
    features: [
      'All Professional tier features',
      'Catalog OS access',
      'Label infrastructure tools',
      'Custom integrations',
      'Dedicated account management',
    ],
  },
];

function PackageCard({ pkg }: { pkg: typeof PACKAGES[0] }) {
  const Icon = pkg.icon;
  const [hov, setHov] = useState(false);
  return (
    <div
      className="rounded-2xl border p-5 flex flex-col transition-all cursor-default"
      style={{
        background: hov ? `${pkg.color}08` : 'rgba(12,14,18,0.8)',
        borderColor: hov ? `${pkg.color}35` : `${pkg.color}18`,
        boxShadow: hov ? `0 0 30px ${pkg.color}10` : 'none',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {(pkg as any).featured && (
        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[8px] font-mono uppercase tracking-wider"
          style={{ background: `${pkg.color}18`, color: pkg.color, border: `1px solid ${pkg.color}30` }}>
          Most Popular
        </div>
      )}
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${pkg.color}12`, border: `1px solid ${pkg.color}20` }}>
          <Icon className="w-4 h-4" style={{ color: pkg.color }} />
        </div>
        <div>
          <p className="text-[13px] font-bold text-white/85">{pkg.tier}</p>
          <p className="text-[8.5px] font-mono text-white/30 uppercase tracking-wider">{pkg.tag}</p>
        </div>
      </div>
      <p className="text-[11px] text-white/40 leading-relaxed mb-4">{pkg.description}</p>
      <ul className="space-y-2 mb-5 flex-1">
        {pkg.features.map((f, i) => (
          <li key={i} className="flex items-start gap-2">
            <CheckCircle className="w-3 h-3 mt-0.5 shrink-0" style={{ color: pkg.color }} />
            <span className="text-[10.5px] text-white/50">{f}</span>
          </li>
        ))}
      </ul>
      <div className="pt-3 border-t" style={{ borderColor: `${pkg.color}12` }}>
        <p className="text-[9px] font-mono text-white/25 mb-2">{pkg.price}</p>
        <Link
          to="/industry-os/signup"
          className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg text-[11px] font-semibold transition-all"
          style={{
            background: `${pkg.color}15`,
            color: pkg.color,
            border: `1px solid ${pkg.color}25`,
          }}
        >
          Apply Now <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}

const EXCLUSIVE_OPPS = [
  {
    icon: Play,
    title: 'Private Campaign Placements',
    desc: 'Priority placement in GMG-managed campaigns. Reserved for approved network members.',
    tag: 'Members Only',
    color: ACCENT,
  },
  {
    icon: FileText,
    title: 'Sync Licensing Access',
    desc: 'Curated sync opportunities for film, TV, and advertising. Reviewed quarterly.',
    tag: 'Application Required',
    color: '#3B82F6',
  },
  {
    icon: Users,
    title: 'Creator Collaborations',
    desc: 'Exclusive co-creation and feature opportunities connecting members across the network.',
    tag: 'Network Access',
    color: '#F59E0B',
  },
  {
    icon: Sparkles,
    title: 'Brand Partnerships',
    desc: 'Brand integration and ambassador opportunities sourced through the GMG ecosystem.',
    tag: 'Curated',
    color: '#EC4899',
  },
];

function ExclusiveOppCard({ opp }: { opp: typeof EXCLUSIVE_OPPS[0] }) {
  const Icon = opp.icon;
  const [hov, setHov] = useState(false);
  return (
    <div
      className="rounded-xl p-4 border flex flex-col gap-3 transition-all cursor-default"
      style={{
        background: hov ? `${opp.color}07` : 'rgba(11,13,17,0.9)',
        borderColor: hov ? `${opp.color}28` : 'rgba(255,255,255,0.05)',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: `${opp.color}12`, border: `1px solid ${opp.color}20` }}>
          <Icon className="w-3.5 h-3.5" style={{ color: opp.color }} />
        </div>
        <span className="text-[8px] font-mono px-1.5 py-0.5 rounded uppercase tracking-wide shrink-0"
          style={{ color: opp.color, background: `${opp.color}10`, border: `1px solid ${opp.color}18` }}>
          {opp.tag}
        </span>
      </div>
      <div>
        <p className="text-[12px] font-semibold text-white/75 mb-1">{opp.title}</p>
        <p className="text-[10px] text-white/35 leading-relaxed">{opp.desc}</p>
      </div>
      <div className="flex items-center gap-1 mt-auto">
        <Lock className="w-2.5 h-2.5 text-white/20" />
        <span className="text-[8.5px] text-white/20">Requires approved membership</span>
      </div>
    </div>
  );
}

export default function IndustryOSOverview() {
  const { iosAuth } = useIndustryOS();
  const member = iosAuth.member;
  const approved = member?.membership_status === 'approved';

  return (
    <div className="min-h-screen">
      <style>{`
        @keyframes ios-rise { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .ios-rise { animation: ios-rise 0.5s ease both; }
        @keyframes ios-signal { from { opacity: 0; transform: translateX(-6px); } to { opacity: 1; transform: translateX(0); } }
        .ios-signal { animation: ios-signal 0.3s ease both; }
        .ios-1 { animation-delay: 0.05s; }
        .ios-2 { animation-delay: 0.10s; }
        .ios-3 { animation-delay: 0.15s; }
        .ios-4 { animation-delay: 0.20s; }
        .ios-5 { animation-delay: 0.25s; }
        .ios-6 { animation-delay: 0.30s; }
        .ios-7 { animation-delay: 0.35s; }
      `}</style>

      {/* HERO */}
      <div
        className="relative rounded-2xl overflow-hidden mb-8 ios-rise"
        style={{
          background: 'linear-gradient(135deg, #07090C 0%, #0C1118 50%, #07090C 100%)',
          minHeight: 260,
        }}
      >
        <CinematicHeroBG />
        <div className="relative z-10 p-6 sm:p-8 flex flex-col gap-4">

          {/* Tag row */}
          <div className="flex flex-wrap items-center gap-2 ios-rise ios-1">
            {[
              { label: approved ? 'Approved Member' : 'Pending Review', color: approved ? ACCENT : '#F59E0B', pulse: true },
              { label: 'Limited Access', color: '#3B82F6' },
              { label: 'System Active', color: ACCENT },
            ].map((tag, i) => (
              <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border"
                style={{ background: `${tag.color}0C`, borderColor: `${tag.color}22` }}>
                {tag.pulse && (
                  <div className="w-1.5 h-1.5 rounded-full animate-pulse shrink-0"
                    style={{ background: tag.color }} />
                )}
                <span className="text-[9px] font-mono uppercase tracking-wider" style={{ color: tag.color }}>
                  {tag.label}
                </span>
              </div>
            ))}
          </div>

          {/* Headline */}
          <div className="ios-rise ios-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight tracking-tight mb-2">
              Access the GMG System Layer
            </h1>
            <p className="text-[13px] text-white/40 max-w-lg leading-relaxed">
              A curated network of artists, operators, and music professionals connected through
              the Greater Music Group infrastructure.
            </p>
          </div>

          {/* Signal strip */}
          <div className="ios-rise ios-3 max-w-sm">
            <SignalStrip />
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-4 ios-rise ios-4">
            {[
              { label: 'Active Members', value: '240+' },
              { label: 'Opportunities', value: '18 live' },
              { label: 'US Markets', value: '12 cities' },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col">
                <span className="text-[15px] font-bold text-white">{stat.value}</span>
                <span className="text-[9px] font-mono text-white/25 uppercase tracking-wider">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          {!approved && (
            <div className="flex flex-wrap gap-2 ios-rise ios-5">
              <Link
                to="/industry-os/signup"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[11px] font-semibold transition-all hover:opacity-90"
                style={{ background: ACCENT, color: '#000' }}
              >
                Apply for Full Access <ArrowRight className="w-3 h-3" />
              </Link>
              <Link
                to="/industry-os/app/boutique"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[11px] font-semibold border transition-all"
                style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}
              >
                Browse Resources <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* SYSTEM ACTIVITY */}
      <SystemActivityFeed />

      {/* INSTITUTIONAL PACKAGES */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Package className="w-3.5 h-3.5" style={{ color: ACCENT }} />
            <h2 className="text-[13px] font-semibold text-white/80 tracking-wide">Built Into the System</h2>
          </div>
          <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">Institutional Access</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PACKAGES.map((pkg, i) => (
            <div key={i} className="ios-rise" style={{ animationDelay: `${0.08 + i * 0.07}s` }}>
              <PackageCard pkg={pkg} />
            </div>
          ))}
        </div>
      </section>

      {/* OPPORTUNITY HEATMAP */}
      <OpportunityHeatmap />

      {/* EXCLUSIVE OPPORTUNITIES */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target className="w-3.5 h-3.5" style={{ color: ACCENT }} />
            <h2 className="text-[13px] font-semibold text-white/80 tracking-wide">Exclusive Opportunities</h2>
          </div>
          <div className="flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-white/20" />
            <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">Members Only</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {EXCLUSIVE_OPPS.map((opp, i) => (
            <div key={i} className="ios-rise" style={{ animationDelay: `${0.1 + i * 0.07}s` }}>
              <ExclusiveOppCard opp={opp} />
            </div>
          ))}
        </div>
      </section>

      {/* NETWORK SNAPSHOT */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-3.5 h-3.5" style={{ color: ACCENT }} />
          <h2 className="text-[13px] font-semibold text-white/80 tracking-wide">Your Network</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon: Users, label: 'Network Members', value: '240+', sub: 'Approved professionals', color: ACCENT },
            { icon: TrendingUp, label: 'Growth This Month', value: '+18', sub: 'New approvals', color: '#3B82F6' },
            { icon: Globe, label: 'Active Markets', value: '12', sub: 'US cities represented', color: '#F59E0B' },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i}
                className="rounded-xl p-4 border flex items-center gap-3 ios-rise"
                style={{
                  background: `${stat.color}06`,
                  borderColor: `${stat.color}14`,
                  animationDelay: `${0.1 + i * 0.06}s`,
                }}
              >
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${stat.color}12`, border: `1px solid ${stat.color}20` }}>
                  <Icon className="w-4 h-4" style={{ color: stat.color }} />
                </div>
                <div>
                  <p className="text-[18px] font-bold text-white/85 leading-none">{stat.value}</p>
                  <p className="text-[10px] font-semibold text-white/50 mt-0.5">{stat.label}</p>
                  <p className="text-[8.5px] text-white/25">{stat.sub}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-3">
          <Link
            to="/industry-os/app/network"
            className="flex items-center gap-1.5 text-[11px] font-medium transition-colors hover:opacity-80"
            style={{ color: ACCENT }}
          >
            Explore the Network <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      </section>

      {/* QUICK LINKS */}
      <section className="mb-2">
        <div className="flex items-center gap-2 mb-4">
          <Layers className="w-3.5 h-3.5" style={{ color: ACCENT }} />
          <h2 className="text-[13px] font-semibold text-white/80 tracking-wide">Quick Access</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { label: 'Resource Boutique', sub: 'Tools & templates', icon: BookOpen, to: '/industry-os/app/boutique', color: ACCENT },
            { label: 'AI Coworkers', sub: 'Strategic support', icon: Bot, to: '/industry-os/app/ai-coworkers', color: '#3B82F6' },
            { label: 'Network', sub: 'Connect with members', icon: Users, to: '/industry-os/app/network', color: '#F59E0B' },
            { label: 'Profile', sub: 'Your member record', icon: Shield, to: '/industry-os/app/profile', color: '#EC4899' },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <Link
                key={i}
                to={item.to}
                className="rounded-xl p-3.5 border flex flex-col gap-2 transition-all hover:opacity-80 ios-rise"
                style={{
                  background: `${item.color}06`,
                  borderColor: `${item.color}14`,
                  animationDelay: `${0.12 + i * 0.06}s`,
                }}
              >
                <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                  style={{ background: `${item.color}12` }}>
                  <Icon className="w-3 h-3" style={{ color: item.color }} />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-white/65">{item.label}</p>
                  <p className="text-[8.5px] text-white/25">{item.sub}</p>
                </div>
                <ChevronRight className="w-3 h-3 self-end" style={{ color: item.color }} />
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
