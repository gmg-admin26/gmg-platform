import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';

const release = {
  date: 'April 6, 2026',
  dateline: 'LOS ANGELES, CA — April 6, 2026',
  headline: 'Greater Music Group Launches First to Market AI Native Music Company Powered by a Trained AI Army',
  tags: ['Company News', 'AI', 'Platform'],
};

function handlePrint() {
  window.print();
}

function VisualHeader() {
  return (
    <div className="relative w-full overflow-hidden rounded-t-2xl bg-[#060608]" style={{ height: 'clamp(180px, 26vw, 300px)' }}>
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1400 300"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="vhbg" cx="50%" cy="50%" r="75%">
            <stop offset="0%" stopColor="#131318" />
            <stop offset="60%" stopColor="#0a0a0d" />
            <stop offset="100%" stopColor="#050507" />
          </radialGradient>
          <radialGradient id="vhatm" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#c8ccd8" stopOpacity="0.09" />
            <stop offset="100%" stopColor="#9098a8" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="vhcl" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="50%" stopColor="#d0d8e4" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.08" />
          </linearGradient>
          <linearGradient id="vhcr" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="50%" stopColor="#d0d8e4" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.08" />
          </linearGradient>
          <linearGradient id="vhf1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="35%" stopColor="#e8ecf4" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="vhf2" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="35%" stopColor="#e8ecf4" stopOpacity="0.24" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="vhwv" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="50%" stopColor="#d8dce8" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="vhfb" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#060608" stopOpacity="0" />
            <stop offset="100%" stopColor="#060608" stopOpacity="1" />
          </linearGradient>
          <filter id="vhng" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="vhhg" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="vhag" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="18" />
          </filter>
          <style>{`
            @keyframes vhph { 0%,100%{opacity:0.6} 50%{opacity:1} }
            @keyframes vhpa { 0%,100%{opacity:0.25} 50%{opacity:0.85} }
            @keyframes vhpb { 0%,100%{opacity:0.18} 50%{opacity:0.7} }
            @keyframes vhpc { 0%,100%{opacity:0.22} 50%{opacity:0.75} }
            @keyframes vhpd { 0%,100%{opacity:0.15} 50%{opacity:0.6} }
            @keyframes vhrs { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
            @keyframes vhrr { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
            @keyframes vhfr { 0%{stroke-dashoffset:700} 100%{stroke-dashoffset:0} }
            @keyframes vhfl { 0%{stroke-dashoffset:0} 100%{stroke-dashoffset:700} }
            @keyframes vhtr { 0%{stroke-dashoffset:300} 100%{stroke-dashoffset:0} }
            @keyframes vhdm { 0%,100%{opacity:0.06} 50%{opacity:0.14} }
            .vh-hub { animation: vhph 3.5s ease-in-out infinite; }
            .vh-na  { animation: vhpa 3.8s ease-in-out infinite; }
            .vh-nb  { animation: vhpb 4.2s ease-in-out infinite 0.7s; }
            .vh-nc  { animation: vhpc 3.1s ease-in-out infinite 1.4s; }
            .vh-nd  { animation: vhpd 4.6s ease-in-out infinite 0.3s; }
            .vh-ne  { animation: vhpa 2.9s ease-in-out infinite 2.1s; }
            .vh-ro  { transform-origin:700px 150px; animation: vhrs 60s linear infinite; }
            .vh-rm  { transform-origin:700px 150px; animation: vhrr 40s linear infinite; }
            .vh-fr1 { animation: vhfr 4.2s linear infinite; }
            .vh-fl1 { animation: vhfl 4.5s linear infinite 0.5s; }
            .vh-tr  { animation: vhtr 3.6s linear infinite; }
            .vh-dm  { animation: vhdm 5s ease-in-out infinite; }
          `}</style>
        </defs>
        <rect width="1400" height="300" fill="url(#vhbg)" />
        <rect width="1400" height="300" fill="url(#vhatm)" />
        <path d="M 0 150 C 70 125,140 175,210 150 C 280 125,350 175,420 150 C 490 125,560 175,630 150 C 700 125,770 175,840 150 C 910 125,980 175,1050 150 C 1120 125,1190 175,1260 150 C 1330 125,1400 150,1400 150" stroke="url(#vhwv)" strokeWidth="0.5" fill="none" opacity="0.6" />
        <line x1="0" y1="150" x2="1400" y2="150" stroke="#ffffff" strokeWidth="0.4" opacity="0.05" />
        <ellipse cx="700" cy="150" rx="250" ry="100" fill="none" stroke="#ffffff" strokeWidth="0.4" opacity="0.04" strokeDasharray="8 16" className="vh-ro" />
        <ellipse cx="700" cy="150" rx="158" ry="65" fill="none" stroke="#d0d8e4" strokeWidth="0.5" opacity="0.07" strokeDasharray="5 12" className="vh-rm" />
        <circle cx="700" cy="150" r="80" fill="none" stroke="#ffffff" strokeWidth="0.4" opacity="0.06" />
        <line x1="700" y1="150" x2="700" y2="62" stroke="url(#vhcl)" strokeWidth="0.7" opacity="0.5" />
        <line x1="700" y1="150" x2="700" y2="238" stroke="url(#vhcl)" strokeWidth="0.7" opacity="0.5" />
        <line x1="700" y1="150" x2="490" y2="150" stroke="url(#vhcl)" strokeWidth="0.7" opacity="0.5" />
        <line x1="700" y1="150" x2="910" y2="150" stroke="url(#vhcr)" strokeWidth="0.7" opacity="0.5" />
        <line x1="490" y1="150" x2="240" y2="95" stroke="#ffffff" strokeWidth="0.3" opacity="0.06" />
        <line x1="910" y1="150" x2="1160" y2="95" stroke="#ffffff" strokeWidth="0.3" opacity="0.06" />
        <line x1="700" y1="150" x2="910" y2="150" stroke="url(#vhf1)" strokeWidth="1.2" fill="none" strokeDasharray="100 600" className="vh-fr1" opacity="0.7" />
        <line x1="490" y1="150" x2="700" y2="150" stroke="url(#vhf2)" strokeWidth="1.2" fill="none" strokeDasharray="100 600" className="vh-fl1" opacity="0.7" />
        <line x1="700" y1="150" x2="700" y2="62" stroke="#e8ecf4" strokeWidth="1.0" fill="none" strokeDasharray="60 200" className="vh-tr" opacity="0.45" />
        <circle cx="700" cy="150" r="38" fill="#c8ccd8" opacity="0.05" filter="url(#vhag)" className="vh-hub" />
        <g filter="url(#vhhg)">
          <circle cx="700" cy="150" r="34" fill="none" stroke="#c0c8d8" strokeWidth="0.5" opacity="0.12" className="vh-hub" />
          <circle cx="700" cy="150" r="26" fill="none" stroke="#d0d8e8" strokeWidth="0.6" opacity="0.18" className="vh-hub" />
          <circle cx="700" cy="150" r="17" fill="#101015" stroke="#d8dce8" strokeWidth="0.8" opacity="0.9" className="vh-hub" />
          <line x1="691" y1="150" x2="709" y2="150" stroke="#e8ecf4" strokeWidth="0.6" opacity="0.5" />
          <line x1="700" y1="141" x2="700" y2="159" stroke="#e8ecf4" strokeWidth="0.6" opacity="0.5" />
          <circle cx="700" cy="150" r="2.8" fill="#f0f4ff" className="vh-hub" />
          <circle cx="700" cy="150" r="1.1" fill="#ffffff" />
        </g>
        <g filter="url(#vhng)">
          <circle cx="700" cy="62" r="10" fill="#0d0d11" stroke="#c8d0dc" strokeWidth="0.7" opacity="0.8" className="vh-nb" />
          <circle cx="700" cy="62" r="2.8" fill="#e4e8f4" className="vh-nb" />
        </g>
        <g filter="url(#vhng)">
          <circle cx="700" cy="238" r="10" fill="#0d0d11" stroke="#c8d0dc" strokeWidth="0.7" opacity="0.8" className="vh-nd" />
          <circle cx="700" cy="238" r="2.8" fill="#dce0ec" className="vh-nd" />
        </g>
        <g filter="url(#vhng)">
          <circle cx="490" cy="150" r="10" fill="#0d0d11" stroke="#c8d0dc" strokeWidth="0.7" opacity="0.8" className="vh-na" />
          <circle cx="490" cy="150" r="2.8" fill="#e0e4f0" className="vh-na" />
        </g>
        <g filter="url(#vhng)">
          <circle cx="910" cy="150" r="10" fill="#0d0d11" stroke="#c8d0dc" strokeWidth="0.7" opacity="0.8" className="vh-nc" />
          <circle cx="910" cy="150" r="2.8" fill="#e0e4f0" className="vh-nc" />
        </g>
        <g filter="url(#vhng)">
          <circle cx="240" cy="95" r="5" fill="#0d0d11" stroke="#a8b0bc" strokeWidth="0.5" opacity="0.6" className="vh-ne" />
          <circle cx="240" cy="95" r="2" fill="#c0c8d4" className="vh-ne" />
          <circle cx="1160" cy="95" r="5" fill="#0d0d11" stroke="#a8b0bc" strokeWidth="0.5" opacity="0.6" className="vh-nb" />
          <circle cx="1160" cy="95" r="2" fill="#c0c8d4" className="vh-nb" />
        </g>
        <text x="700" y="42" textAnchor="middle" fill="#808898" fontSize="8" fontFamily="system-ui,sans-serif" fontWeight="700" letterSpacing="0.15em" className="vh-dm">A&amp;R INTELLIGENCE</text>
        <text x="700" y="265" textAnchor="middle" fill="#808898" fontSize="8" fontFamily="system-ui,sans-serif" fontWeight="700" letterSpacing="0.15em" className="vh-dm">CATALOG OS</text>
        <text x="428" y="153" textAnchor="middle" fill="#808898" fontSize="8" fontFamily="system-ui,sans-serif" fontWeight="700" letterSpacing="0.15em" className="vh-dm">ARTIST OS</text>
        <text x="972" y="153" textAnchor="middle" fill="#808898" fontSize="8" fontFamily="system-ui,sans-serif" fontWeight="700" letterSpacing="0.15em" className="vh-dm">CAMPAIGN</text>
        <rect width="1400" height="300" fill="url(#vhfb)" />
      </svg>
      <div className="absolute top-5 left-6 sm:left-8 flex items-center gap-2.5">
        <div className="w-px h-3 bg-gray-700" />
        <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.24em] text-gray-600">Greater Music Group</span>
      </div>
      <div className="absolute top-5 right-6 sm:right-8">
        <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.22em] text-gray-600">Press Release</span>
      </div>
      <div className="absolute bottom-6 left-6 sm:left-8 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-gray-700" />
        <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.2em] text-gray-700">AI Music Stack</span>
      </div>
    </div>
  );
}

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
        { threshold: 0.05 }
      );
      observer.observe(el);
      return () => observer.disconnect();
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        transition: 'opacity 0.7s ease, transform 0.7s ease',
      }}
    >
      {children}
    </div>
  );
}

export default function Press() {
  return (
    <div className="min-h-screen bg-[#08080b] text-white">
      <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-6 pt-32 sm:pt-36 pb-32">

        <div className="mb-8">
          <Link
            to="/about"
            className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-gray-600 hover:text-gray-400 transition-colors duration-200"
          >
            <ArrowLeft className="w-3 h-3" />
            About
          </Link>
        </div>

        <div className="mb-20 pb-12 border-b border-white/8">
          <div className="mb-5">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-600">Greater Music Group</span>
          </div>
          <h1 className="text-[60px] sm:text-[72px] md:text-[84px] font-black tracking-tighter leading-[0.92] text-white mb-6">
            Press
          </h1>
          <p className="text-[17px] text-gray-500 font-normal leading-relaxed max-w-md">
            Official announcements and company news.
          </p>
        </div>

        <FadeIn>
          <article className="rounded-2xl border border-white/10 overflow-hidden">
            <VisualHeader />

            <div className="bg-[#0a0a0c] px-8 sm:px-10 md:px-14 py-10 border-b border-white/8">
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.18em]">{release.date}</span>
                {release.tags.map((tag) => (
                  <span key={tag} className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/10 text-gray-500">
                    {tag}
                  </span>
                ))}
              </div>
              <h2 className="text-[24px] sm:text-[30px] md:text-[36px] lg:text-[40px] font-black text-white leading-[1.12] tracking-tight max-w-4xl">
                {release.headline}
              </h2>
            </div>

            <div className="bg-white" id="press-release-print-area">
              <div className="px-8 sm:px-10 md:px-14 lg:px-20 py-12 md:py-16">

                <p className="print-kicker" style={{ display: 'none' }}>Greater Music Group — Press Release</p>
                <p className="print-headline" style={{ display: 'none' }}>{release.headline}</p>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-12 pb-10 border-b border-gray-200">
                  <p className="print-dateline text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                    {release.dateline}
                  </p>
                  <button
                    onClick={handlePrint}
                    className="no-print inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-gray-400 hover:text-gray-900 transition-colors duration-200 border border-gray-200 hover:border-gray-500 px-4 py-2 rounded-lg"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Print / Save as PDF
                  </button>
                </div>

                <div className="print-body max-w-[660px] space-y-7">

                  <p className="text-[17px] text-gray-800 leading-[1.85]">
                    Greater Music Group has officially entered the market with a fully built AI native system operating at scale, introducing what it describes as the first coordinated AI army designed to serve artists, labels, and creators across the entire music lifecycle.
                  </p>
                  <p className="text-[17px] text-gray-800 leading-[1.85]">
                    While much of the industry continues to experiment with AI tools, GMG has taken a fundamentally different approach. The company was built from the ground up as a unified system where intelligence, infrastructure, and execution move together in real time.
                  </p>
                  <p className="text-[17px] text-gray-800 leading-[1.85]">
                    At the core is a trained AI workforce composed of specialized scouts, marketers, operators, and reps working as a coordinated system across discovery, artist development, campaigns, operations, and catalog growth.
                  </p>
                  <p className="text-[17px] text-gray-800 leading-[1.85]">
                    The system runs continuously, 24 hours a day, enabling artists and teams to access and activate campaigns, strategies, and growth systems at any time.
                  </p>

                  <div className="my-2 py-8 border-t border-b border-gray-200">
                    <p className="print-section-label text-[10px] font-black text-gray-400 uppercase tracking-[0.22em] mb-7">What the System Does</p>
                    <ul className="print-system-list">
                      {[
                        'Artists and teams can launch campaigns instantly',
                        'The system begins working as soon as music is released',
                        'AI scouts identify and contact artists within minutes',
                        'Campaigns deploy and optimize automatically',
                        'Catalog systems revive and expand past releases',
                        'AI reps coordinate campaigns, collaborations, and opportunities',
                        'Cultural signal reports are generated and distributed to partners',
                      ].map((item, i) => (
                        <li key={i} className="flex items-baseline gap-5 py-3.5 border-b border-gray-100 last:border-b-0">
                          <span className="print-num text-[11px] font-black text-gray-300 tabular-nums flex-shrink-0 w-5">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span className="text-[17px] text-gray-900 font-medium leading-snug">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <p className="text-[17px] text-gray-800 leading-[1.85]">
                    This creates a continuous intelligence loop where discovery, execution, and growth are no longer separate functions.
                  </p>

                  <h3 className="print-section-label text-[11px] font-black text-gray-400 uppercase tracking-[0.22em] pt-6">AI Music Stack</h3>
                  <p className="text-[17px] text-gray-800 leading-[1.85]">
                    GMG's platform, called the AI Music Stack, is built across three core systems:
                  </p>

                  <h3 className="print-section-label text-[11px] font-black text-gray-400 uppercase tracking-[0.22em] pt-4">A&R Intelligence</h3>
                  <p className="text-[17px] text-gray-800 leading-[1.85]">
                    AI driven discovery identifying emerging artists, cultural signals, and momentum patterns in real time.
                  </p>

                  <h3 className="print-section-label text-[11px] font-black text-gray-400 uppercase tracking-[0.22em] pt-4">Artist OS</h3>
                  <p className="text-[17px] text-gray-800 leading-[1.85]">
                    A centralized operating system where campaigns, marketing, distribution, financial systems, and back office operations run as one coordinated layer.
                  </p>

                  <h3 className="print-section-label text-[11px] font-black text-gray-400 uppercase tracking-[0.22em] pt-4">Catalog OS</h3>
                  <p className="text-[17px] text-gray-800 leading-[1.85]">
                    A system designed to optimize, monetize, and expand catalog value over time.
                  </p>

                  <p className="text-[17px] text-gray-800 leading-[1.85]">
                    Together, these systems form a unified execution layer across the entire business.
                  </p>

                  <p className="text-[17px] text-gray-800 leading-[1.85]">
                    The system was architected by Paula Moore, marking her return to hands on technology development and the second time in her career building a first of its kind system. Her previous platforms were created at and later acquired by Universal Music Group and Warner Music Group. The group currently provides music distribution through an exclusive agreement with Virgin Music Group.
                  </p>

                  <blockquote className="print-quote my-10 py-2">
                    <div className="border-l-[3px] border-gray-900 pl-8">
                      <p className="text-[21px] md:text-[23px] text-gray-900 font-medium leading-[1.55] mb-5">
                        &ldquo;Everyone is experimenting with AI tools. Any company can assemble tools. I wanted to build what the system should look like if it were designed correctly from the ground up.&rdquo;
                      </p>
                      <cite className="not-italic text-[11px] text-gray-400 font-bold uppercase tracking-[0.18em]">
                        — Paula Moore, Co-CEO, Greater Music Group
                      </cite>
                    </div>
                  </blockquote>

                  <blockquote className="print-quote my-10 py-2">
                    <div className="border-l-[3px] border-gray-900 pl-8">
                      <p className="text-[21px] md:text-[23px] text-gray-900 font-medium leading-[1.55] mb-5">
                        &ldquo;What we've built is a trained AI workforce and a coordinated intelligence layer that moves across discovery, execution, and growth in real time.&rdquo;
                      </p>
                      <cite className="not-italic text-[11px] text-gray-400 font-bold uppercase tracking-[0.18em]">
                        — Paula Moore, Co-CEO, Greater Music Group
                      </cite>
                    </div>
                  </blockquote>

                  <p className="text-[17px] text-gray-800 leading-[1.85]">
                    GMG is led by Co-CEOs Paula Moore and Randy Jackson and enters the market with its system fully active.
                  </p>

                  <blockquote className="print-quote my-10 py-2">
                    <div className="border-l-[3px] border-gray-900 pl-8">
                      <p className="text-[21px] md:text-[23px] text-gray-900 font-medium leading-[1.55] mb-5">
                        &ldquo;We did not want to introduce an idea. We wanted to introduce a system already doing the work.&rdquo;
                      </p>
                      <cite className="not-italic text-[11px] text-gray-400 font-bold uppercase tracking-[0.18em]">
                        — Paula Moore, Co-CEO, Greater Music Group
                      </cite>
                    </div>
                  </blockquote>

                  <h3 className="print-section-label text-[11px] font-black text-gray-400 uppercase tracking-[0.22em] pt-6">Infrastructure Layer</h3>
                  <p className="text-[17px] text-gray-800 leading-[1.85]">
                    In parallel with its core system, GMG is rolling out infrastructure designed to support artists and industry professionals at every level, from emerging to established.
                  </p>
                  <p className="text-[17px] text-gray-800 leading-[1.85]">
                    This includes integrated solutions across financial management, reporting, risk infrastructure, employment verification, and operational support. These systems are designed to remove friction, reduce costs, and provide access to tools and infrastructure that have not previously existed in a unified format.
                  </p>
                  <p className="text-[17px] text-gray-800 leading-[1.85]">
                    Greater Music Group confirmed it has not taken on external funding, choosing instead to fully build and validate its system before entering capital markets.
                  </p>
                  <p className="text-[17px] text-gray-800 leading-[1.85]">
                    Preview the platform at greatermusicgroup.com.
                  </p>

                  <div className="mt-20 pt-12 border-t border-gray-200 space-y-6">
                    <hr className="print-divider" style={{ display: 'none' }} />
                    <div>
                      <p className="print-about-label text-[10px] font-black text-gray-400 uppercase tracking-[0.22em] mb-3">About Greater Music Group</p>
                      <p className="print-about-text text-[15px] text-gray-600 leading-[1.8]">
                        Greater Music Group is an AI-native music and media company built on integrated systems for artist discovery, development, catalog growth, operations, and original media production. Founded by Randy Jackson and Paula Moore, GMG combines artificial intelligence with human expertise to build the infrastructure that helps artists and catalogs grow in the modern music economy. For more information, visit greatermusicgroup.com.
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                      <p className="print-about-label text-[10px] font-black text-gray-400 uppercase tracking-[0.22em]">Media Inquiries</p>
                      <span className="no-print hidden sm:block text-gray-300">·</span>
                      <p className="print-contact text-[13px] text-gray-500">Greater Music Group</p>
                      <span className="no-print hidden sm:block text-gray-300">·</span>
                      <a
                        href="mailto:press@greatermusicgroup.com"
                        className="print-contact text-[13px] text-gray-800 hover:text-black transition-colors duration-200 underline underline-offset-2 decoration-gray-300 hover:decoration-gray-600"
                      >
                        press@greatermusicgroup.com
                      </a>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </article>
        </FadeIn>

        <div className="mt-20 pt-10 border-t border-white/8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-600 mb-2">Media Contact</p>
              <p className="text-[15px] text-gray-300 font-medium">Greater Music Group Press Office</p>
              <a
                href="mailto:press@greatermusicgroup.com"
                className="text-[14px] text-gray-500 hover:text-white transition-colors duration-200 underline underline-offset-2 decoration-white/20 hover:decoration-white/40"
              >
                press@greatermusicgroup.com
              </a>
            </div>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-white/10 hover:border-white/20 text-[11px] font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-all duration-200"
            >
              About GMG
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
