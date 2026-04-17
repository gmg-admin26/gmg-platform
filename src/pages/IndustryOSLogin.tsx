import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useIndustryOS } from '../auth/IndustryOSContext';

// ── FULLSCREEN ANIMATED BACKGROUND ────────────────────────────────────────────

function CinematicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    interface Node { x: number; y: number; vx: number; vy: number; pulse: number; size: number }

    const nodes: Node[] = Array.from({ length: 70 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      pulse: Math.random() * Math.PI * 2,
      size: 0.8 + Math.random() * 1.4,
    }));

    let raf: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const COLS = 42;
      const cellW = canvas.width / COLS;
      const cellH = cellW;

      ctx.strokeStyle = 'rgba(16,185,129,0.035)';
      ctx.lineWidth = 0.4;
      for (let x = 0; x <= canvas.width; x += cellW) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y <= canvas.height; y += cellH) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      nodes.forEach(n => {
        n.x += n.vx;
        n.y += n.vy;
        n.pulse += 0.012;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      });

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            const alpha = (0.06 * (1 - dist / 150)).toFixed(3);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(16,185,129,${alpha})`;
            ctx.lineWidth = 0.4;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      nodes.forEach(n => {
        const alpha = 0.2 + 0.18 * Math.sin(n.pulse);
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(16,185,129,${alpha.toFixed(3)})`;
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />;
}

// ── FEATURE PILL ───────────────────────────────────────────────────────────────

function FeaturePill({ label, desc }: { label: string; desc: string }) {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl p-4 transition-all duration-300"
      style={{
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(16,185,129,0.12)',
      }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(16,185,129,0.04) 0%, transparent 70%)' }}
      />
      <p className="text-[11px] font-semibold tracking-wide mb-1" style={{ color: '#10B981' }}>{label}</p>
      <p className="text-[10px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.3)' }}>{desc}</p>
    </div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────

export default function IndustryOSLogin() {
  const navigate = useNavigate();
  const { loginIndustryOS, iosAuth } = useIndustryOS();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [pendingNotice, setPendingNotice] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shaking, setShaking] = useState(false);

  useEffect(() => {
    if (iosAuth.authenticated) navigate('/industry-os/app');
  }, [iosAuth.authenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    setError('');
    setPendingNotice(false);
    const result = await loginIndustryOS(email, password);
    setLoading(false);
    if (result.ok) {
      if (iosAuth.member?.membership_status === 'pending') {
        setPendingNotice(true);
        setTimeout(() => navigate('/industry-os/app'), 1800);
      } else {
        navigate('/industry-os/app');
      }
    } else {
      const msg = result.error ?? '';
      if (msg.toLowerCase().includes('no account') || msg.toLowerCase().includes('not found')) {
        setError('No account found. Use the link below to apply for membership.');
      } else {
        setError(msg || 'Invalid credentials. Check your email and password.');
      }
      setShaking(true);
      setTimeout(() => setShaking(false), 600);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-hidden relative flex" style={{ background: '#050608' }}>
      <style>{`
        @keyframes ios-rise { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes ios-shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 40%{transform:translateX(6px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }
        @keyframes ios-glow-pulse { 0%,100%{opacity:0.5} 50%{opacity:1} }
        .ios-rise-1 { animation: ios-rise 0.7s ease both 0.05s; }
        .ios-rise-2 { animation: ios-rise 0.7s ease both 0.15s; }
        .ios-rise-3 { animation: ios-rise 0.7s ease both 0.25s; }
        .ios-rise-4 { animation: ios-rise 0.7s ease both 0.35s; }
        .ios-rise-5 { animation: ios-rise 0.7s ease both 0.45s; }
        .ios-rise-6 { animation: ios-rise 0.7s ease both 0.55s; }
        .ios-shake { animation: ios-shake 0.5s ease; }
        .ios-input:focus { border-color: rgba(16,185,129,0.45) !important; box-shadow: 0 0 0 1px rgba(16,185,129,0.15); }
        .ios-btn:hover:not(:disabled) { box-shadow: 0 4px 32px rgba(16,185,129,0.35) !important; transform: translateY(-1px); }
        .ios-btn:active:not(:disabled) { transform: translateY(0); }
        .ios-btn { transition: all 0.2s ease; }
      `}</style>

      <CinematicBackground />

      {/* Deep radial glows */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div style={{
          position: 'absolute', top: '15%', left: '5%',
          width: '55%', height: '70%',
          background: 'radial-gradient(ellipse at center, rgba(16,185,129,0.06) 0%, transparent 65%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-10%', right: '30%',
          width: '40%', height: '50%',
          background: 'radial-gradient(ellipse at center, rgba(16,185,129,0.04) 0%, transparent 60%)',
        }} />
      </div>

      {/* ── LEFT SIDE (60%) ─────────────────────────────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between relative z-10 px-16 py-12" style={{ width: '60%' }}>

        {/* Top wordmark */}
        <div className="ios-rise-1 flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.22)' }}
          >
            <div className="w-3.5 h-3.5 rounded-sm" style={{ background: '#10B981' }} />
          </div>
          <div>
            <p className="text-[9px] font-mono uppercase tracking-[0.22em]" style={{ color: 'rgba(255,255,255,0.25)' }}>Greater Music Group</p>
            <p className="text-[8px] font-mono uppercase tracking-[0.18em]" style={{ color: 'rgba(16,185,129,0.55)' }}>Industry OS</p>
          </div>
        </div>

        {/* Main content */}
        <div className="space-y-10 max-w-[540px]">

          {/* Live indicator */}
          <div className="ios-rise-2 flex items-center gap-2">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: '#10B981', boxShadow: '0 0 6px rgba(16,185,129,0.7)', animation: 'ios-glow-pulse 2s ease infinite' }}
            />
            <span className="text-[9px] font-mono uppercase tracking-[0.2em]" style={{ color: 'rgba(16,185,129,0.6)' }}>
              Private Network · Members Only
            </span>
          </div>

          {/* Headline */}
          <div className="ios-rise-3 space-y-4">
            <h1
              className="font-bold leading-[1.02] tracking-tight"
              style={{ fontSize: 'clamp(36px, 4vw, 54px)', color: 'rgba(255,255,255,0.92)' }}
            >
              Curated access<br />
              <span style={{ color: '#10B981' }}>to GMG systems.</span>
            </h1>
            <p
              className="leading-relaxed"
              style={{ fontSize: '15px', color: 'rgba(255,255,255,0.32)', maxWidth: '460px' }}
            >
              A private, application-based network for artists, operators, and creatives working inside the modern music ecosystem.
            </p>
          </div>

          {/* Feature pills */}
          <div className="ios-rise-4 grid grid-cols-3 gap-3">
            <FeaturePill
              label="Network"
              desc="Curated members and collaboration across the GMG ecosystem"
            />
            <FeaturePill
              label="Training"
              desc="AI coworker system built on real GMG workflows"
            />
            <FeaturePill
              label="Access"
              desc="GMG tools, opportunities, and project pathways"
            />
          </div>

          {/* Status tags */}
          <div className="ios-rise-5 flex items-center gap-3 flex-wrap">
            <div
              className="flex items-center gap-2 rounded-full px-4 py-2"
              style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.18)' }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: '#10B981' }}
              />
              <span className="text-[9px] font-mono uppercase tracking-[0.15em]" style={{ color: 'rgba(16,185,129,0.75)' }}>
                Application-based
              </span>
            </div>
            <div
              className="flex items-center gap-2 rounded-full px-4 py-2"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <span className="text-[9px] font-mono uppercase tracking-[0.15em]" style={{ color: 'rgba(255,255,255,0.28)' }}>
                Limited access
              </span>
            </div>
          </div>
        </div>

        {/* Bottom label */}
        <p className="ios-rise-6 text-[8.5px] font-mono uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.12)' }}>
          Not publicly distributed · Members only
        </p>
      </div>

      {/* Vertical divider — subtle */}
      <div
        className="hidden lg:block absolute top-0 bottom-0 z-10 pointer-events-none"
        style={{ left: '60%', width: '1px', background: 'linear-gradient(to bottom, transparent, rgba(16,185,129,0.1) 25%, rgba(16,185,129,0.12) 50%, rgba(16,185,129,0.1) 75%, transparent)' }}
      />

      {/* ── RIGHT SIDE (40%) ────────────────────────────────────────────── */}
      <div
        className="flex-1 lg:flex-none flex items-center justify-center relative z-10 px-8 py-12"
        style={{ width: '40%' } as React.CSSProperties}
      >
        <div
          className={`w-full ${shaking ? 'ios-shake' : ''}`}
          style={{ maxWidth: '360px' }}
        >

          {/* Mobile wordmark */}
          <div className="lg:hidden flex items-center gap-2 mb-10 ios-rise-1">
            <div
              className="w-7 h-7 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.22)' }}
            >
              <div className="w-3 h-3 rounded-sm" style={{ background: '#10B981' }} />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em]" style={{ color: 'rgba(255,255,255,0.28)' }}>
              Industry OS
            </span>
          </div>

          {/* Form header */}
          <div className="mb-9 ios-rise-2">
            <p className="text-[8.5px] font-mono uppercase tracking-[0.22em] mb-3" style={{ color: 'rgba(16,185,129,0.5)' }}>
              Member Login
            </p>
            <h2 className="text-[26px] font-bold leading-tight" style={{ color: 'rgba(255,255,255,0.9)' }}>
              Welcome back.
            </h2>
          </div>

          {/* Form — no card, no box */}
          <form onSubmit={handleLogin} className="ios-rise-3 space-y-4">

            <div>
              <label className="block text-[8.5px] font-mono uppercase tracking-[0.16em] mb-2" style={{ color: 'rgba(255,255,255,0.28)' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                autoComplete="email"
                className="ios-input w-full rounded-xl px-4 py-3.5 text-[13px] outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: 'rgba(255,255,255,0.8)',
                }}
              />
            </div>

            <div>
              <label className="block text-[8.5px] font-mono uppercase tracking-[0.16em] mb-2" style={{ color: 'rgba(255,255,255,0.28)' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="ios-input w-full rounded-xl px-4 py-3.5 text-[13px] outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: 'rgba(255,255,255,0.8)',
                }}
              />
            </div>

            {pendingNotice && (
              <div
                className="rounded-xl px-4 py-3"
                style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.18)' }}
              >
                <p className="text-[11px] font-semibold" style={{ color: 'rgba(245,158,11,0.9)' }}>
                  Application under review
                </p>
                <p className="text-[10px] mt-0.5" style={{ color: 'rgba(245,158,11,0.5)' }}>
                  Taking you inside with limited access...
                </p>
              </div>
            )}

            {error && !pendingNotice && (
              <div
                className="rounded-xl px-4 py-3"
                style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.18)' }}
              >
                <p className="text-[11px]" style={{ color: 'rgba(239,68,68,0.85)' }}>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email.trim() || !password.trim()}
              className="ios-btn w-full py-3.5 rounded-xl text-[13px] font-semibold text-white disabled:opacity-35 mt-1"
              style={{ background: '#10B981', boxShadow: '0 2px 24px rgba(16,185,129,0.22)' }}
            >
              {loading ? 'Connecting...' : 'Access Industry OS'}
            </button>
          </form>

          {/* Apply link */}
          <div className="ios-rise-4 mt-6">
            <Link
              to="/industry-os/signup"
              className="group flex items-center gap-2 transition-all"
            >
              <span className="text-[11.5px] font-medium" style={{ color: 'rgba(16,185,129,0.65)' }}>
                Apply for membership
              </span>
              <span
                className="text-[10px] transition-transform group-hover:translate-x-0.5"
                style={{ color: 'rgba(16,185,129,0.4)' }}
              >
                →
              </span>
            </Link>
          </div>

          {/* Footer text */}
          <div className="ios-rise-5 mt-10 space-y-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
            <p className="text-[9.5px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.18)' }}>
              Membership is currently free with limited access. Applications are reviewed and approved.
            </p>
            <p className="text-[9.5px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.18)' }}>
              Project OS requires an active GMG project assignment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
