import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, AlertCircle, Zap, RotateCcw } from 'lucide-react';
import { useAuth, clearRocksteadySession } from '../../auth/AuthContext';
import { ROLE_USERS } from '../../auth/roles';

const LOADING_MESSAGES = [
  'Initializing signal network',
  'Syncing scout intelligence',
  'Loading live market view',
];

const PULSE_DOTS = [
  { top: '18%', left: '72%', size: 3, delay: 0, duration: 3.2 },
  { top: '34%', left: '85%', size: 2, delay: 1.1, duration: 4.5 },
  { top: '61%', left: '78%', size: 4, delay: 0.6, duration: 2.8 },
  { top: '72%', left: '91%', size: 2, delay: 2.0, duration: 5.1 },
  { top: '45%', left: '64%', size: 3, delay: 1.7, duration: 3.7 },
  { top: '82%', left: '70%', size: 2, delay: 0.3, duration: 4.2 },
  { top: '27%', left: '93%', size: 2, delay: 2.4, duration: 3.9 },
];

export default function RocksteadyLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginRocksteady, rocksteadyAuth } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');
  const [phase, setPhase]       = useState<'idle' | 'loading' | 'success'>('idle');
  const [msgIdx, setMsgIdx]     = useState(0);
  const [visible, setVisible]   = useState(false);

  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || '/dashboard/rocksteady';

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (phase !== 'loading') return;
    const t = setInterval(() => setMsgIdx(i => (i + 1) % LOADING_MESSAGES.length), 900);
    return () => clearInterval(t);
  }, [phase]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    function draw() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;

      ctx.strokeStyle = 'rgba(239,68,68,0.06)';
      ctx.lineWidth = 1;

      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        const y = h * 0.3 + i * 28;
        for (let x = 0; x < w; x += 4) {
          const amp = 6 + i * 2;
          const freq = 0.012 - i * 0.001;
          const phase_offset = i * 0.8;
          const yy = y + Math.sin(x * freq + time * 0.4 + phase_offset) * amp;
          if (x === 0) ctx.moveTo(x, yy);
          else ctx.lineTo(x, yy);
        }
        ctx.stroke();
      }

      time += 0.025;
      animId = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  function resolveRedirect(email: string): string {
    const aosUser = ROLE_USERS.find(u => u.email === email);
    if (aosUser?.role === 'admin_team') return '/dashboard/admin-os';
    return '/dashboard/admin-os';
  }

  function handleEnter(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setPhase('loading');

    setTimeout(() => {
      const ok = loginRocksteady(email, password);
      if (ok) {
        setPhase('success');
        const dest = from !== '/dashboard/rocksteady' ? from : resolveRedirect(email);
        setTimeout(() => navigate(dest, { replace: true }), 1200);
      } else {
        setError('Access denied. Verify credentials and try again.');
        setPhase('idle');
      }
    }, 1000);
  }

  const isLoading = phase === 'loading' || phase === 'success';

  function handleForceLoginScreen() {
    clearRocksteadySession();
    setEmail('');
    setPassword('');
    setError('');
    setPhase('idle');
    if (import.meta.env.DEV) console.log('[Rocksteady Auth] Force login screen — session cleared');
  }

  if (rocksteadyAuth.authenticated) {
    return <Navigate to="/dashboard/rocksteady" replace />;
  }

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden"
      style={{ fontFamily: "'Inter', system-ui, sans-serif", background: '#060708' }}
    >
      {/* Cinematic background — Shepard art */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/shepard_fairey_art.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          transform: visible ? 'scale(1.06)' : 'scale(1.0)',
          transition: 'transform 22s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 1.6s ease',
          opacity: visible ? 1 : 0,
          filter: 'contrast(1.1) brightness(0.65) saturate(0.9)',
          willChange: 'transform',
        }}
      />

      {/* Deep gradient — left dominant, right lighter to show art */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(105deg, #060708 0%, #060708 28%, rgba(6,7,8,0.88) 46%, rgba(6,7,8,0.45) 68%, rgba(6,7,8,0.15) 100%)',
        }}
      />

      {/* Top + bottom vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(6,7,8,0.65) 0%, transparent 20%, transparent 75%, rgba(6,7,8,0.85) 100%)',
        }}
      />

      {/* Film grain */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.032,
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
          backgroundRepeat: 'repeat',
          backgroundSize: '180px 180px',
        }}
      />

      {/* Ambient waveform canvas — right half only */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ width: '100%', height: '100%', opacity: visible ? 1 : 0, transition: 'opacity 2s ease 1.5s' }}
      />

      {/* Ambient pulsing dots — scattered right side */}
      {PULSE_DOTS.map((dot, i) => (
        <div
          key={i}
          className="absolute pointer-events-none"
          style={{
            top: dot.top,
            left: dot.left,
            width: dot.size,
            height: dot.size,
            borderRadius: '50%',
            background: 'rgba(239,68,68,0.5)',
            opacity: visible ? 1 : 0,
            transition: `opacity 1s ease ${1.8 + dot.delay * 0.3}s`,
            animation: `ambientPulse ${dot.duration}s ease-in-out ${dot.delay}s infinite`,
          }}
        />
      ))}

      {/* Subtle red glow — lower right */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: '-8%',
          right: '-5%',
          width: '520px',
          height: '520px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(239,68,68,0.06) 0%, transparent 70%)',
          opacity: visible ? 1 : 0,
          transition: 'opacity 3s ease 2s',
        }}
      />

      {/* Foreground content — left column only */}
      <div className="relative z-10 flex min-h-screen items-stretch">
        <div
          className="flex flex-col justify-between w-full max-w-[500px] px-10 py-10 xl:px-14 xl:py-12 min-h-screen"
          style={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 1s ease 0.3s',
          }}
        >
          {/* Top branding */}
          <div className="flex items-center gap-2.5">
            <Zap className="w-3.5 h-3.5 text-[#06B6D4]" style={{ opacity: 0.65 }} />
            <span style={{
              fontSize: '9.5px',
              letterSpacing: '0.22em',
              color: 'rgba(255,255,255,0.3)',
              fontWeight: 500,
              textTransform: 'uppercase',
              fontFamily: 'monospace',
            }}>
              GMG Intelligence Platform
            </span>
          </div>

          {/* Center — headline + login card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>

            {/* Editorial headline block */}
            <div
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(14px)',
                transition: 'opacity 1s ease 0.6s, transform 1s ease 0.6s',
              }}
            >
              {/* Live indicator */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '22px' }}>
                <span style={{
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  background: '#EF4444',
                  display: 'inline-block',
                  animation: 'ambientPulse 2s ease-in-out infinite',
                }} />
                <span style={{
                  fontSize: '9px',
                  fontFamily: 'monospace',
                  color: 'rgba(239,68,68,0.6)',
                  letterSpacing: '0.24em',
                  textTransform: 'uppercase',
                }}>
                  Live System
                </span>
              </div>

              <h1 style={{
                fontSize: 'clamp(2.1rem, 4.8vw, 3.2rem)',
                fontWeight: 700,
                color: '#ffffff',
                lineHeight: 1.07,
                letterSpacing: '-0.028em',
                marginBottom: '20px',
                fontFamily: "'Satoshi', 'Inter', sans-serif",
              }}>
                Intelligence moves<br />before the market does.
              </h1>

              <p style={{
                fontSize: '13.5px',
                color: 'rgba(255,255,255,0.38)',
                lineHeight: 1.75,
                maxWidth: '380px',
              }}>
                Rocksteady is GMG's live A&R intelligence system for breakout
                detection, market movement, scout reporting, and real-time signal tracking.
              </p>
            </div>

            {/* Login card */}
            <div
              style={{
                background: 'rgba(8,9,12,0.78)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '18px',
                padding: '30px',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(18px)',
                transition: 'opacity 1s ease 0.9s, transform 1s ease 0.9s',
                boxShadow: '0 24px 64px rgba(0,0,0,0.55)',
              }}
            >
              {/* System label */}
              <div style={{ marginBottom: '20px' }}>
                <p style={{
                  fontSize: '9px',
                  fontFamily: 'monospace',
                  color: 'rgba(255,255,255,0.22)',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  marginBottom: '4px',
                }}>
                  AI A&R Intelligence System
                </p>
              </div>

              {/* Restricted chip */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                marginBottom: '24px',
                padding: '10px 14px',
                background: 'rgba(239,68,68,0.05)',
                border: '1px solid rgba(239,68,68,0.1)',
                borderRadius: '10px',
              }}>
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#EF4444',
                  marginTop: '5px',
                  flexShrink: 0,
                }} />
                <div>
                  <p style={{
                    fontSize: '9px',
                    fontFamily: 'monospace',
                    color: 'rgba(239,68,68,0.6)',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    marginBottom: '4px',
                  }}>
                    Restricted Access
                  </p>
                  <p style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.26)', lineHeight: 1.6 }}>
                    Authorized GMG personnel only. All sessions are logged and monitored.
                  </p>
                </div>
              </div>

              <form onSubmit={handleEnter} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Email */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '9.5px',
                    fontFamily: 'monospace',
                    color: 'rgba(255,255,255,0.2)',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    marginBottom: '7px',
                  }}>
                    Access Email
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail style={{
                      position: 'absolute',
                      left: '13px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '13px',
                      height: '13px',
                      color: 'rgba(255,255,255,0.16)',
                    }} />
                    <input
                      type="email"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setError(''); }}
                      placeholder="user@gmg.ai"
                      required
                      disabled={isLoading}
                      style={{
                        width: '100%',
                        paddingLeft: '38px',
                        paddingRight: '14px',
                        paddingTop: '12px',
                        paddingBottom: '12px',
                        background: error ? 'rgba(239,68,68,0.04)' : 'rgba(255,255,255,0.025)',
                        border: `1px solid ${error ? 'rgba(239,68,68,0.35)' : 'rgba(255,255,255,0.07)'}`,
                        borderRadius: '10px',
                        fontSize: '13px',
                        color: 'rgba(255,255,255,0.82)',
                        outline: 'none',
                        boxSizing: 'border-box',
                        transition: 'border-color 0.2s, background 0.2s',
                        fontFamily: 'inherit',
                      }}
                      onFocus={e => { if (!error) e.target.style.borderColor = 'rgba(239,68,68,0.28)'; }}
                      onBlur={e => { if (!error) e.target.style.borderColor = 'rgba(255,255,255,0.07)'; }}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '9.5px',
                    fontFamily: 'monospace',
                    color: 'rgba(255,255,255,0.2)',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    marginBottom: '7px',
                  }}>
                    Passphrase
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock style={{
                      position: 'absolute',
                      left: '13px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '13px',
                      height: '13px',
                      color: 'rgba(255,255,255,0.16)',
                    }} />
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={e => { setPassword(e.target.value); setError(''); }}
                      placeholder="••••••••••••"
                      required
                      disabled={isLoading}
                      style={{
                        width: '100%',
                        paddingLeft: '38px',
                        paddingRight: '42px',
                        paddingTop: '12px',
                        paddingBottom: '12px',
                        background: error ? 'rgba(239,68,68,0.04)' : 'rgba(255,255,255,0.025)',
                        border: `1px solid ${error ? 'rgba(239,68,68,0.35)' : 'rgba(255,255,255,0.07)'}`,
                        borderRadius: '10px',
                        fontSize: '13px',
                        color: 'rgba(255,255,255,0.82)',
                        outline: 'none',
                        boxSizing: 'border-box',
                        transition: 'border-color 0.2s, background 0.2s',
                        fontFamily: 'inherit',
                      }}
                      onFocus={e => { if (!error) e.target.style.borderColor = 'rgba(239,68,68,0.28)'; }}
                      onBlur={e => { if (!error) e.target.style.borderColor = 'rgba(255,255,255,0.07)'; }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(p => !p)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'rgba(255,255,255,0.2)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '2px',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {showPass
                        ? <EyeOff style={{ width: '13px', height: '13px' }} />
                        : <Eye style={{ width: '13px', height: '13px' }} />
                      }
                    </button>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '9px',
                    padding: '10px 13px',
                    background: 'rgba(239,68,68,0.07)',
                    border: '1px solid rgba(239,68,68,0.18)',
                    borderRadius: '9px',
                  }}>
                    <AlertCircle style={{ width: '13px', height: '13px', color: '#EF4444', flexShrink: 0 }} />
                    <p style={{ fontSize: '12px', color: 'rgba(239,68,68,0.85)', margin: 0 }}>{error}</p>
                  </div>
                )}

                {/* Loading */}
                {phase === 'loading' && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 13px',
                    background: 'rgba(255,255,255,0.025)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '9px',
                  }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      border: '1.5px solid rgba(239,68,68,0.22)',
                      borderTopColor: '#EF4444',
                      animation: 'spin 0.8s linear infinite',
                      flexShrink: 0,
                    }} />
                    <p style={{
                      fontSize: '11.5px',
                      fontFamily: 'monospace',
                      color: 'rgba(255,255,255,0.32)',
                      margin: 0,
                      letterSpacing: '0.04em',
                    }}>
                      {LOADING_MESSAGES[msgIdx]}
                    </p>
                  </div>
                )}

                {/* Success */}
                {phase === 'success' && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 13px',
                    background: 'rgba(16,185,129,0.06)',
                    border: '1px solid rgba(16,185,129,0.16)',
                    borderRadius: '9px',
                  }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', flexShrink: 0 }} />
                    <p style={{ fontSize: '11.5px', fontFamily: 'monospace', color: 'rgba(16,185,129,0.78)', margin: 0, letterSpacing: '0.04em' }}>
                      Access granted. Entering system...
                    </p>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    padding: '14px 20px',
                    background: isLoading ? 'rgba(239,68,68,0.07)' : 'rgba(239,68,68,0.1)',
                    border: `1px solid ${isLoading ? 'rgba(239,68,68,0.15)' : 'rgba(239,68,68,0.26)'}`,
                    borderRadius: '10px',
                    color: isLoading ? 'rgba(239,68,68,0.45)' : '#EF4444',
                    fontSize: '12px',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    transition: 'background 0.2s, border-color 0.2s, box-shadow 0.2s',
                    fontFamily: 'inherit',
                    boxShadow: isLoading ? 'none' : '0 0 28px rgba(239,68,68,0.07)',
                  }}
                  onMouseEnter={e => {
                    if (!isLoading) {
                      (e.currentTarget).style.background = 'rgba(239,68,68,0.15)';
                      (e.currentTarget).style.boxShadow = '0 0 36px rgba(239,68,68,0.14)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isLoading) {
                      (e.currentTarget).style.background = 'rgba(239,68,68,0.1)';
                      (e.currentTarget).style.boxShadow = '0 0 28px rgba(239,68,68,0.07)';
                    }
                  }}
                >
                  {isLoading
                    ? <span style={{ fontFamily: 'monospace' }}>Authenticating...</span>
                    : 'Enter Rocksteady'
                  }
                </button>
              </form>

              {/* Microcopy */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '18px' }}>
                <span style={{ fontSize: '9.5px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.12)', letterSpacing: '0.04em' }}>
                  Access restricted to GMG personnel
                </span>
                <span style={{ fontSize: '9.5px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.1)', letterSpacing: '0.04em' }}>
                  v3.4.1 // secure
                </span>
              </div>

              {/* Dev-only: force login screen */}
              {import.meta.env.DEV && (
                <div style={{ marginTop: '14px', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '12px' }}>
                  <button
                    type="button"
                    onClick={handleForceLoginScreen}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: 'none',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '7px',
                      padding: '6px 11px',
                      cursor: 'pointer',
                      color: 'rgba(255,255,255,0.22)',
                      fontSize: '9px',
                      fontFamily: 'monospace',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      transition: 'color 0.2s, border-color 0.2s',
                      width: '100%',
                      justifyContent: 'center',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget).style.color = 'rgba(255,255,255,0.5)';
                      (e.currentTarget).style.borderColor = 'rgba(255,255,255,0.14)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget).style.color = 'rgba(255,255,255,0.22)';
                      (e.currentTarget).style.borderColor = 'rgba(255,255,255,0.06)';
                    }}
                  >
                    <RotateCcw style={{ width: '9px', height: '9px' }} />
                    Force login screen
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Bottom — system status minimal row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            {[
              { label: 'Signal Engine', on: true },
              { label: 'Scout Network', on: true },
              { label: 'AI Scoring', on: true },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  background: '#10B981',
                  animation: 'ambientPulse 3s ease-in-out infinite',
                }} />
                <span style={{ fontSize: '8px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.15)' }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes ambientPulse {
          0%, 100% { opacity: 0.9; }
          50% { opacity: 0.25; }
        }
        input::placeholder { color: rgba(255,255,255,0.13); }
        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 100px #08090c inset !important;
          -webkit-text-fill-color: rgba(255,255,255,0.82) !important;
        }
      `}</style>
    </div>
  );
}
