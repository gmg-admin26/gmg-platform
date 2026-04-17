import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, AlertCircle, ArrowRight, Shield, Cpu, Wifi, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { useRole } from '../../auth/RoleContext';

const ROLE_REDIRECT: Record<string, string> = {
  artist_manager: '/dashboard/artist-os',
  label_partner:  '/dashboard/artist-os',
  admin_team:     '/dashboard/admin-os',
};

const BOOT_LINES = [
  { text: 'ACCESS GRANTED',               delay: 0,    hero: true  },
  { text: 'Initializing Artist OS v3.0',  delay: 380,  hero: false },
  { text: 'Loading artist profile...',    delay: 720,  hero: false },
  { text: 'Syncing campaign engine...',   delay: 1080, hero: false },
  { text: 'Connecting AI intelligence...', delay: 1440, hero: false },
  { text: 'Decrypting financial layer...', delay: 1760, hero: false },
  { text: 'System ready.',                delay: 2080, hero: false },
];


function WaveformViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animId: number;
    let t = 0;

    function resize() {
      if (!canvas) return;
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();

    function draw() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.012;
      const bars = 80;
      const barW = canvas.width / bars;

      for (let i = 0; i < bars; i++) {
        const freq1 = Math.sin(i * 0.18 + t) * 0.5 + 0.5;
        const freq2 = Math.sin(i * 0.07 + t * 1.4) * 0.5 + 0.5;
        const freq3 = Math.sin(i * 0.31 + t * 0.7) * 0.5 + 0.5;
        const h = ((freq1 + freq2 * 0.5 + freq3 * 0.3) / 1.8) * canvas.height * 0.55 + 4;
        const alpha = 0.12 + freq1 * 0.18;

        const cx = i * barW + barW / 2;
        const cy = canvas.height / 2;

        ctx.fillStyle = `rgba(16,185,129,${alpha})`;
        ctx.beginPath();
        ctx.roundRect(cx - barW * 0.3, cy - h / 2, barW * 0.6, h, 2);
        ctx.fill();
      }
      animId = requestAnimationFrame(draw);
    }
    draw();
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />;
}

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    interface P { x: number; y: number; vx: number; vy: number; size: number; alpha: number; dir: number; color: string }
    let animId: number;
    const pts: P[] = [];
    const colors = ['16,185,129', '6,182,212', '16,185,129'];

    function resize() {
      if (!canvas) return;
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    for (let i = 0; i < 110; i++) {
      pts.push({
        x: Math.random() * (canvas?.width ?? 800),
        y: Math.random() * (canvas?.height ?? 600),
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.1,
        size: Math.random() * 1.4 + 0.3,
        alpha: Math.random() * 0.3 + 0.04,
        dir: Math.random() > 0.5 ? 1 : -1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    function draw() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        p.alpha += p.dir * 0.0015;
        if (p.alpha > 0.35 || p.alpha < 0.02) p.dir *= -1;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
        ctx.fill();
      }
      ctx.lineWidth = 0.4;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 90) {
            ctx.globalAlpha = (1 - d / 90) * 0.07;
            ctx.strokeStyle = `rgba(${pts[i].color},1)`;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    }
    draw();
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />;
}

function BootOverlay({ visible, onDone }: { visible: boolean; onDone: () => void }) {
  const [lines, setLines] = useState<number[]>([]);
  const [exiting, setExiting] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!visible) { setLines([]); setExiting(false); setProgress(0); return; }
    const timers: ReturnType<typeof setTimeout>[] = [];
    BOOT_LINES.forEach((item, i) => {
      timers.push(setTimeout(() => {
        setLines(prev => [...prev, i]);
        setProgress(Math.round(((i + 1) / BOOT_LINES.length) * 100));
      }, item.delay));
    });
    timers.push(setTimeout(() => {
      setExiting(true);
      setTimeout(onDone, 600);
    }, 2900));
    return () => timers.forEach(clearTimeout);
  }, [visible, onDone]);

  if (!visible && lines.length === 0) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'radial-gradient(ellipse at 30% 50%, #030e09 0%, #030405 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      opacity: exiting ? 0 : 1,
      transition: 'opacity 0.6s cubic-bezier(0.4,0,0.2,1)',
    }}>
      <style>{`
        @keyframes bootHeroIn { from{opacity:0;letter-spacing:0.3em;filter:blur(8px)} to{opacity:1;letter-spacing:0.12em;filter:blur(0)} }
        @keyframes bootLineIn { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }
        @keyframes bootCursor { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes bootScan { from{transform:translateY(-100vh)} to{transform:translateY(100vh)} }
        @keyframes bootGlow { 0%,100%{opacity:0.4;transform:scaleX(0.95)} 50%{opacity:1;transform:scaleX(1)} }
      `}</style>

      <div style={{ position:'absolute', top:0, left:0, right:0, height:'1px', background:'rgba(16,185,129,0.2)', animation:'bootScan 2.4s linear infinite', pointerEvents:'none' }} />
      <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(16,185,129,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(16,185,129,0.015) 1px,transparent 1px)', backgroundSize:'48px 48px', pointerEvents:'none' }} />

      <div style={{ width:'100%', maxWidth:560, padding:'0 40px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:48 }}>
          <div style={{ width:6, height:6, borderRadius:'50%', background:'#10B981', boxShadow:'0 0 16px #10B981' }} />
          <span style={{ fontFamily:'monospace', fontSize:9, letterSpacing:'0.25em', color:'rgba(16,185,129,0.5)', textTransform:'uppercase' }}>GMG // ARTIST OS // v3.0.0</span>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {BOOT_LINES.map((item, i) => (
            <div key={i} style={{ opacity: lines.includes(i) ? 1 : 0, animation: lines.includes(i) ? (item.hero ? 'bootHeroIn 0.6s ease forwards' : 'bootLineIn 0.35s ease forwards') : 'none' }}>
              {item.hero ? (
                <div style={{ fontFamily:'monospace', fontSize:'clamp(2.2rem,5vw,3.2rem)', fontWeight:900, letterSpacing:'0.12em', color:'#10B981', textShadow:'0 0 60px rgba(16,185,129,0.7),0 0 120px rgba(16,185,129,0.3)', lineHeight:1, marginBottom:8 }}>
                  {item.text}
                </div>
              ) : (
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <span style={{ fontFamily:'monospace', fontSize:10, color:'rgba(16,185,129,0.35)', flexShrink:0 }}>{'>>'}</span>
                  <span style={{ fontFamily:'monospace', fontSize:13, color: i === lines[lines.length - 1] ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.4)', letterSpacing:'0.01em' }}>{item.text}</span>
                  {i === lines[lines.length - 1] && lines.length < BOOT_LINES.length && (
                    <span style={{ display:'inline-block', width:7, height:14, background:'#10B981', animation:'bootCursor 0.65s step-end infinite', opacity:0.8 }} />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ marginTop:48 }}>
          <div style={{ height:2, background:'rgba(255,255,255,0.04)', borderRadius:2, overflow:'hidden' }}>
            <div style={{ height:'100%', background:'linear-gradient(90deg,rgba(16,185,129,0.6),rgba(6,182,212,0.8))', borderRadius:2, width:`${progress}%`, transition:'width 0.35s ease', boxShadow:'0 0 12px rgba(16,185,129,0.5)', animation:'bootGlow 1.5s ease infinite' }} />
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:8 }}>
            <span style={{ fontFamily:'monospace', fontSize:9, color:'rgba(255,255,255,0.15)' }}>INITIALIZING</span>
            <span style={{ fontFamily:'monospace', fontSize:9, color:'rgba(16,185,129,0.5)' }}>{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ArtistOSLogin() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { login, auth } = useAuth();
  const { resolveRoleFromCredentials, roleState } = useRole();
  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || '/dashboard/artist-os';

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');
  const [shake, setShake]       = useState(false);
  const [phase, setPhase]       = useState<'idle' | 'loading' | 'boot'>('idle');
  const [mounted, setMounted]   = useState(false);
  const [bootDest, setBootDest] = useState('/dashboard/artist-os');
  const [focusedField, setFocusedField] = useState<'email' | 'pass' | null>(null);

  useEffect(() => { const t = setTimeout(() => setMounted(true), 80); return () => clearTimeout(t); }, []);

  if (auth.authenticated && roleState.role) {
    const dest = ROLE_REDIRECT[roleState.role] || '/dashboard/artist-os';
    return <Navigate to={dest} replace />;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (phase !== 'idle') return;
    setError('');
    setPhase('loading');
    setTimeout(() => {
      const ok = login(email, password);
      if (ok) {
        const role = resolveRoleFromCredentials(email, password);
        const dest = (role && ROLE_REDIRECT[role]) || from;
        setBootDest(dest);
        setPhase('boot');
      } else {
        setError('Access denied — credentials not recognized');
        setPhase('idle');
        setShake(true);
        setTimeout(() => setShake(false), 600);
      }
    }, 1100);
  }

  const isLoading = phase === 'loading';
  const G = '#10B981';
  const C = '#06B6D4';

  return (
    <>
      <style>{`
        @keyframes aos-in-left   { from{opacity:0;transform:translateX(-28px)} to{opacity:1;transform:translateX(0)} }
        @keyframes aos-in-right  { from{opacity:0;transform:translateX(28px)}  to{opacity:1;transform:translateX(0)} }
        @keyframes aos-pulse     { 0%,100%{opacity:0.7;transform:scale(1)} 50%{opacity:0.3;transform:scale(0.8)} }
        @keyframes aos-drift     { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes aos-scan      { from{transform:translateY(-100%)} to{transform:translateY(200vh)} }
        @keyframes aos-shake     { 0%,100%{transform:translateX(0)} 15%{transform:translateX(-8px)} 30%{transform:translateX(7px)} 45%{transform:translateX(-5px)} 60%{transform:translateX(4px)} 75%{transform:translateX(-3px)} 90%{transform:translateX(2px)} }
        @keyframes aos-spin      { to{transform:rotate(360deg)} }
        @keyframes aos-float-up  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes aos-border-glow { 0%,100%{opacity:0.5} 50%{opacity:1} }

        .aos-field-wrap { position:relative; }
        .aos-field-wrap::after {
          content:''; position:absolute; bottom:0; left:0; right:0; height:1px;
          background:linear-gradient(90deg,transparent,rgba(16,185,129,0),transparent);
          transition:background 0.3s ease;
        }
        .aos-field-wrap.focused::after {
          background:linear-gradient(90deg,transparent,rgba(16,185,129,0.5),transparent);
          animation:aos-border-glow 2s ease infinite;
        }
        .aos-input {
          width:100%; background:rgba(255,255,255,0.025); border:1px solid rgba(255,255,255,0.07);
          border-radius:10px; color:rgba(255,255,255,0.88); font-size:13.5px;
          transition:all 0.25s ease; box-sizing:border-box; font-family:inherit;
        }
        .aos-input:focus { outline:none; border-color:rgba(16,185,129,0.4); background:rgba(16,185,129,0.03); box-shadow:0 0 0 3px rgba(16,185,129,0.06),0 0 30px rgba(16,185,129,0.04); }
        .aos-input::placeholder { color:rgba(255,255,255,0.18); }
        .aos-submit:not(:disabled):hover { background:linear-gradient(135deg,rgba(16,185,129,0.25),rgba(6,182,212,0.15)) !important; box-shadow:0 0 50px rgba(16,185,129,0.2),0 0 100px rgba(16,185,129,0.07),inset 0 1px 0 rgba(255,255,255,0.06) !important; transform:translateY(-1px); }
        .aos-submit:not(:disabled):active { transform:translateY(0); }
      `}</style>

      <BootOverlay visible={phase === 'boot'} onDone={() => navigate(bootDest, { replace: true })} />

      <div style={{ minHeight:'100vh', width:'100%', display:'flex', background:'#05060A', fontFamily:"'Inter',system-ui,sans-serif", overflow:'hidden' }}>

        {/* ══ LEFT PANEL ══ */}
        <div style={{
          flex:'0 0 58%', position:'relative', overflow:'hidden',
          background:'linear-gradient(140deg,#04080A 0%,#050A0D 35%,#030609 70%,#05060A 100%)',
          display:'flex', flexDirection:'column', justifyContent:'space-between',
          padding:'52px 72px',
          opacity: mounted ? 1 : 0,
          animation: mounted ? 'aos-in-left 1.1s cubic-bezier(0.16,1,0.3,1) 0.05s both' : 'none',
        }}>
          <ParticleField />

          {/* Grid overlay */}
          <div style={{ position:'absolute', inset:0, pointerEvents:'none', opacity:0.018, backgroundImage:`linear-gradient(rgba(16,185,129,1) 1px,transparent 1px),linear-gradient(90deg,rgba(16,185,129,1) 1px,transparent 1px)`, backgroundSize:'72px 72px' }} />

          {/* Gradient drift */}
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(225deg,rgba(16,185,129,0.055) 0%,transparent 45%,rgba(6,182,212,0.035) 100%)', backgroundSize:'200% 200%', animation:'aos-drift 16s ease infinite', pointerEvents:'none' }} />

          {/* Bottom glow */}
          <div style={{ position:'absolute', bottom:'-8%', left:'15%', width:700, height:500, borderRadius:'50%', background:'radial-gradient(ellipse,rgba(16,185,129,0.065) 0%,transparent 65%)', pointerEvents:'none' }} />
          <div style={{ position:'absolute', top:'-5%', right:'10%', width:450, height:450, borderRadius:'50%', background:'radial-gradient(ellipse,rgba(6,182,212,0.04) 0%,transparent 65%)', pointerEvents:'none' }} />

          {/* Vignette */}
          <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 110% 110% at 50% 50%,transparent 35%,rgba(0,0,0,0.55) 100%)', pointerEvents:'none' }} />

          {/* Scanline sweep */}
          <div style={{ position:'absolute', top:0, left:0, right:0, height:'1.5px', background:'rgba(16,185,129,0.1)', animation:'aos-scan 9s linear infinite', pointerEvents:'none' }} />

          {/* Brand bar */}
          <div style={{ position:'relative', zIndex:10 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:5, height:5, borderRadius:'50%', background:G, boxShadow:`0 0 10px ${G}`, animation:'aos-pulse 2.4s ease-in-out infinite' }} />
              <span style={{ fontFamily:'monospace', fontSize:9, letterSpacing:'0.26em', color:`rgba(16,185,129,0.5)`, textTransform:'uppercase' }}>SYSTEM STATUS: OPERATIONAL</span>
              <div style={{ flex:1 }} />
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <Cpu size={9} color="rgba(255,255,255,0.15)" />
                <span style={{ fontFamily:'monospace', fontSize:9, color:'rgba(255,255,255,0.15)', letterSpacing:'0.1em' }}>GMG / v3.0</span>
              </div>
            </div>
          </div>

          {/* Hero content */}
          <div style={{ position:'relative', zIndex:10 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:7, marginBottom:32, padding:'4px 12px 4px 9px', background:`rgba(16,185,129,0.07)`, border:`1px solid rgba(16,185,129,0.16)`, borderRadius:100 }}>
              <div style={{ width:4, height:4, borderRadius:'50%', background:G, animation:'aos-pulse 2s ease-in-out infinite' }} />
              <span style={{ fontFamily:'monospace', fontSize:9, letterSpacing:'0.22em', color:`rgba(16,185,129,0.72)`, textTransform:'uppercase' }}>Artist Operating System</span>
            </div>

            <h1 style={{
              fontSize:'clamp(4.5rem,7.5vw,8rem)', fontWeight:900, color:'#E8E8EA', lineHeight:0.9,
              letterSpacing:'-0.045em', marginBottom:28,
              textShadow:`0 0 140px rgba(16,185,129,0.09),0 1px 0 rgba(255,255,255,0.03)`,
            }}>
              Artist OS
            </h1>

            <p style={{ fontSize:'clamp(1rem,1.5vw,1.3rem)', color:'rgba(255,255,255,0.4)', fontWeight:300, letterSpacing:'-0.01em', lineHeight:1.6, maxWidth:400, marginBottom:40 }}>
              Your career,<br />
              <span style={{ color:'rgba(255,255,255,0.65)', fontWeight:500 }}>operated as a system.</span>
            </p>

            {/* Waveform strip */}
            <div style={{ position:'relative', height:64, width:'100%', maxWidth:420, borderRadius:12, overflow:'hidden', border:'1px solid rgba(16,185,129,0.1)', background:'rgba(0,0,0,0.3)' }}>
              <WaveformViz />
              <div style={{ position:'absolute', inset:0, background:'linear-gradient(90deg,rgba(5,6,10,0.8) 0%,transparent 20%,transparent 80%,rgba(5,6,10,0.8) 100%)', pointerEvents:'none' }} />
              <div style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', display:'flex', alignItems:'center', gap:5 }}>
                <div style={{ width:4, height:4, borderRadius:'50%', background:G, boxShadow:`0 0 6px ${G}`, animation:'aos-pulse 1.5s ease-in-out infinite' }} />
                <span style={{ fontFamily:'monospace', fontSize:8, color:`rgba(16,185,129,0.55)`, letterSpacing:'0.15em' }}>LIVE SIGNAL</span>
              </div>
            </div>

            <div style={{ marginTop:24, display:'inline-flex', alignItems:'center', gap:8, padding:'7px 13px', background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)', borderRadius:8 }}>
              <Shield size={10} color="rgba(255,255,255,0.22)" />
              <span style={{ fontFamily:'monospace', fontSize:9, color:'rgba(255,255,255,0.2)', letterSpacing:'0.04em' }}>Authorized access only · All activity monitored and logged</span>
            </div>
          </div>

          {/* System status footer */}
          <div style={{ position:'relative', zIndex:10 }}>
            <div style={{ display:'flex', gap:24 }}>
              {[
                { label:'Artist OS',  icon: Cpu  },
                { label:'AI Reps',    icon: Wifi },
                { label:'Data Layer', icon: Wifi },
              ].map(s => (
                <div key={s.label} style={{ display:'flex', alignItems:'center', gap:5 }}>
                  <span style={{ width:4, height:4, borderRadius:'50%', background:G, display:'inline-block', animation:'aos-pulse 2.8s ease-in-out infinite' }} />
                  <s.icon size={8} color="rgba(255,255,255,0.2)" />
                  <span style={{ fontFamily:'monospace', fontSize:8, color:'rgba(255,255,255,0.18)', letterSpacing:'0.12em', textTransform:'uppercase' }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══ RIGHT PANEL ══ */}
        <div style={{
          flex:'0 0 42%', display:'flex', flexDirection:'column', justifyContent:'center',
          padding:'52px 60px',
          background:'rgba(4,5,8,0.97)',
          borderLeft:'1px solid rgba(255,255,255,0.045)',
          position:'relative', overflow:'hidden',
          opacity: mounted ? 1 : 0,
          animation: mounted ? 'aos-in-right 1.1s cubic-bezier(0.16,1,0.3,1) 0.2s both' : 'none',
        }}>
          {/* Panel glow */}
          <div style={{ position:'absolute', top:'15%', right:'-12%', width:360, height:360, borderRadius:'50%', background:`radial-gradient(circle,rgba(16,185,129,0.04) 0%,transparent 70%)`, pointerEvents:'none' }} />
          <div style={{ position:'absolute', bottom:'10%', left:'-8%', width:280, height:280, borderRadius:'50%', background:`radial-gradient(circle,rgba(6,182,212,0.03) 0%,transparent 70%)`, pointerEvents:'none' }} />

          <div style={{ position:'relative', zIndex:10, maxWidth:400, width:'100%', margin:'0 auto' }}>

            {/* Header */}
            <div style={{ marginBottom:40 }}>
              <p style={{ fontFamily:'monospace', fontSize:9, letterSpacing:'0.26em', color:`rgba(16,185,129,0.5)`, textTransform:'uppercase', marginBottom:12 }}>
                GMG Artist System Access
              </p>
              <h2 style={{ fontSize:24, fontWeight:700, color:'rgba(255,255,255,0.92)', letterSpacing:'-0.025em', lineHeight:1.2, marginBottom:6 }}>
                Enter your credentials
              </h2>
              <p style={{ fontSize:13, color:'rgba(255,255,255,0.28)', lineHeight:1.6 }}>
                Restricted to approved artists, partners, and team members.
              </p>
            </div>

            {/* Form */}
            <div style={{ animation: shake ? 'aos-shake 0.55s ease' : 'none' }}>
              <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>

                {/* Email */}
                <div>
                  <label style={{ display:'block', fontFamily:'monospace', fontSize:9, letterSpacing:'0.2em', color:'rgba(255,255,255,0.25)', textTransform:'uppercase', marginBottom:9 }}>
                    Email Address
                  </label>
                  <div className={`aos-field-wrap ${focusedField === 'email' ? 'focused' : ''}`}>
                    <div style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}>
                      <Mail size={14} color={focusedField === 'email' ? `rgba(16,185,129,0.5)` : 'rgba(255,255,255,0.15)'} style={{ transition:'color 0.25s' }} />
                    </div>
                    <input
                      className="aos-input"
                      type="email"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setError(''); }}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="user@gmg.ai"
                      required disabled={isLoading}
                      style={{ paddingLeft:42, paddingRight:14, paddingTop:13, paddingBottom:13, border:`1px solid ${error ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.07)'}` }}
                    />
                  </div>
                </div>

                {/* Passphrase */}
                <div>
                  <label style={{ display:'block', fontFamily:'monospace', fontSize:9, letterSpacing:'0.2em', color:'rgba(255,255,255,0.25)', textTransform:'uppercase', marginBottom:9 }}>
                    Passphrase
                  </label>
                  <div className={`aos-field-wrap ${focusedField === 'pass' ? 'focused' : ''}`}>
                    <div style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}>
                      <Lock size={14} color={focusedField === 'pass' ? `rgba(16,185,129,0.5)` : 'rgba(255,255,255,0.15)'} style={{ transition:'color 0.25s' }} />
                    </div>
                    <input
                      className="aos-input"
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={e => { setPassword(e.target.value); setError(''); }}
                      onFocus={() => setFocusedField('pass')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="••••••••••••"
                      required disabled={isLoading}
                      style={{ paddingLeft:42, paddingRight:48, paddingTop:13, paddingBottom:13, border:`1px solid ${error ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.07)'}` }}
                    />
                    <button type="button" onClick={() => setShowPass(p => !p)} style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', padding:0, color:'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', transition:'color 0.2s' }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.2)')}>
                      {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div style={{ display:'flex', alignItems:'center', gap:9, padding:'10px 14px', background:'rgba(239,68,68,0.06)', border:'1px solid rgba(239,68,68,0.22)', borderRadius:10 }}>
                    <AlertCircle size={13} color="#EF4444" />
                    <p style={{ fontFamily:'monospace', fontSize:11, letterSpacing:'0.04em', color:'rgba(239,68,68,0.9)' }}>{error}</p>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  className="aos-submit"
                  disabled={isLoading}
                  style={{
                    width:'100%', padding:'15px 20px', borderRadius:11, fontSize:13.5,
                    fontWeight:600, letterSpacing:'0.01em', cursor: isLoading ? 'not-allowed' : 'pointer',
                    border:`1px solid rgba(16,185,129,${isLoading ? '0.12' : '0.28'})`,
                    transition:'all 0.3s cubic-bezier(0.16,1,0.3,1)',
                    background: isLoading ? 'rgba(16,185,129,0.05)' : 'linear-gradient(135deg,rgba(16,185,129,0.18) 0%,rgba(6,182,212,0.1) 100%)',
                    color: isLoading ? 'rgba(16,185,129,0.4)' : 'rgba(16,185,129,0.95)',
                    boxShadow: isLoading ? 'none' : '0 0 32px rgba(16,185,129,0.1),inset 0 1px 0 rgba(255,255,255,0.04)',
                    display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                  }}
                >
                  {isLoading ? (
                    <>
                      <span style={{ display:'inline-block', width:12, height:12, border:'2px solid rgba(16,185,129,0.2)', borderTopColor:'rgba(16,185,129,0.6)', borderRadius:'50%', animation:'aos-spin 0.75s linear infinite', flexShrink:0 }} />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      Enter Artist OS
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Private Access module */}
            <div style={{ marginTop:28, padding:'20px 22px', background:'rgba(255,255,255,0.016)', border:'1px solid rgba(255,255,255,0.055)', borderRadius:14 }}>
              <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:14 }}>
                <div style={{ width:4, height:4, borderRadius:'50%', background:G, animation:'aos-pulse 2.4s ease-in-out infinite' }} />
                <p style={{ fontFamily:'monospace', fontSize:8, letterSpacing:'0.24em', color:`rgba(16,185,129,0.45)`, textTransform:'uppercase', margin:0 }}>
                  Private Access
                </p>
              </div>

              <p style={{ fontSize:12, color:'rgba(255,255,255,0.3)', lineHeight:1.65, marginBottom:16 }}>
                Access is provisioned directly by Greater Music Group for approved artists, label partners, and invited stakeholders.
              </p>

              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {[
                  { label: 'Invite-only environment' },
                  { label: 'Credentials issued directly by GMG' },
                ].map(row => (
                  <div key={row.label} style={{ display:'flex', alignItems:'center', gap:9, padding:'8px 12px', background:'rgba(255,255,255,0.018)', border:'1px solid rgba(255,255,255,0.05)', borderRadius:8 }}>
                    <CheckCircle2 size={11} color={`rgba(16,185,129,0.45)`} />
                    <span style={{ fontFamily:'monospace', fontSize:10, color:'rgba(255,255,255,0.3)', letterSpacing:'0.03em' }}>{row.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer note */}
            <p style={{ marginTop:22, fontSize:11, color:'rgba(255,255,255,0.16)', textAlign:'center', lineHeight:1.6, letterSpacing:'0.01em' }}>
              Need access? Request an invitation through Greater Music Group.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
