import { useEffect, useRef, useState, useCallback } from 'react';

// Premium wireframe globe — slow rotation, mouse parallax, scroll fade-in.
// Pure canvas + CSS. No external dependencies.

// Rotation: ~140s per full revolution — almost imperceptible, like a living system
const ROTATION_SPEED  = 0.000115; // radians/ms

const LAT_LINES = 10;
const LON_LINES = 14;

// Palette — cool steel-blue
const LINE_DIM   = 'rgba(145,168,222,0.18)';
const LINE_MID   = 'rgba(168,190,238,0.36)';
const RIM_A      = 'rgba(200,220,255,0.32)';
const RIM_B      = 'rgba(90,115,200,0.08)';
const ORBIT_BACK = 'rgba(150,175,232,0.13)';
const ORBIT_FORE = 'rgba(185,210,255,0.38)';
const DOT_COLOR  = 'rgba(220,232,255,0.90)';

// Timing constants
const BREATH_PERIOD  = 11000;  // scale pulse: very slow 11s
const BREATH_AMP     = 0.010;  // 1% scale range — barely perceptible
const PULSE_PERIOD   = 8500;   // opacity/glow pulse
const SHIMMER_PERIOD = 18000;  // slow atmospheric shimmer sweep

function projectSphere(
  latDeg: number, lonDeg: number,
  rotY: number, cx: number, cy: number, r: number,
): { x: number; y: number; z: number } {
  const phi   = (90 - latDeg)  * (Math.PI / 180);
  const theta = (lonDeg + rotY * (180 / Math.PI)) * (Math.PI / 180);
  const sx = r * Math.sin(phi) * Math.cos(theta);
  const sy = r * Math.cos(phi);
  const sz = r * Math.sin(phi) * Math.sin(theta);
  const scale = (r * 2.4) / (r * 2.4 + sz * 0.28);
  return { x: cx + sx * scale, y: cy - sy * scale, z: sz };
}

export default function GlobeVisual() {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const wrapRef     = useRef<HTMLDivElement>(null);
  const rafRef      = useRef(0);
  const rotRef      = useRef(0.4);
  const lastTsRef   = useRef<number | null>(null);
  const mouseRef    = useRef({ x: 0, y: 0 });
  const targetMouse = useRef({ x: 0, y: 0 });

  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [mouse,   setMouse]   = useState({ x: 0, y: 0 });

  // ── Scroll-triggered fade-in ─────────────────────────────────────────────
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // ── Mouse parallax ───────────────────────────────────────────────────────
  const onMouseMove = useCallback((e: MouseEvent) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
    const ny = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
    targetMouse.current = { x: nx, y: ny };
    setMouse({ x: nx, y: ny });
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const enter = () => { setHovered(true);  window.addEventListener('mousemove', onMouseMove); };
    const leave = () => {
      setHovered(false);
      window.removeEventListener('mousemove', onMouseMove);
      targetMouse.current = { x: 0, y: 0 };
      setMouse({ x: 0, y: 0 });
    };
    el.addEventListener('mouseenter', enter);
    el.addEventListener('mouseleave', leave);
    return () => {
      el.removeEventListener('mouseenter', enter);
      el.removeEventListener('mouseleave', leave);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [onMouseMove]);

  // ── Canvas render loop ────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W   = canvas.offsetWidth;
    const H   = canvas.offsetHeight;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    const cx0 = W / 2;
    const cy0 = H / 2;
    const r   = Math.min(W, H) * 0.37;

    function frame(ts: number) {
      if (!ctx) return;
      if (lastTsRef.current === null) lastTsRef.current = ts;
      const dt = Math.min(ts - lastTsRef.current, 50);
      lastTsRef.current = ts;

      // Smooth mouse lerp
      const lerpSpeed = 0.045;
      mouseRef.current.x += (targetMouse.current.x - mouseRef.current.x) * lerpSpeed;
      mouseRef.current.y += (targetMouse.current.y - mouseRef.current.y) * lerpSpeed;

      rotRef.current += ROTATION_SPEED * dt;

      // ── Living pulse: scale breathes 1 → 1.01 → 1 over 11s ───────────
      const breathT  = ((ts % BREATH_PERIOD) / BREATH_PERIOD) * Math.PI * 2;
      const breathScale = 1 + Math.sin(breathT) * BREATH_AMP;

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const cx = cx0 + mx * 8;
      const cy = cy0 + my * 6;
      const rr = r * breathScale;

      ctx.clearRect(0, 0, W, H);

      // ── Glow pulse: gentle opacity oscillation ─────────────────────────
      const pulseT = ((ts % PULSE_PERIOD) / PULSE_PERIOD) * Math.PI * 2;
      const pulseA = 0.5 + 0.5 * Math.sin(pulseT); // 0..1, smooth

      // ── Shimmer: slow atmospheric light sweeping the surface ──────────
      const shimmerT = ((ts % SHIMMER_PERIOD) / SHIMMER_PERIOD) * Math.PI * 2;
      const shimmerX = cx + rr * 1.1 * Math.cos(shimmerT);

      // ── Outer glow — large, very subtle, pulsing slightly ─────────────
      // Blur simulated by layering multiple radial gradients at increasing radii
      const outerR = hovered ? rr * 2.8 : rr * 2.4;
      const outerA = (hovered ? 0.11 : 0.075) * (0.88 + pulseA * 0.12); // subtle pulse
      for (let layer = 0; layer < 3; layer++) {
        const lR = outerR * (0.7 + layer * 0.15);
        const lA = outerA * (1 - layer * 0.28);
        const g  = ctx.createRadialGradient(cx, cy, rr * 0.5, cx, cy, lR);
        g.addColorStop(0,   `rgba(75,105,215,${lA})`);
        g.addColorStop(0.5, `rgba(50,80,190,${lA * 0.40})`);
        g.addColorStop(1,   'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      }

      // ── Mid glow — mouse-reactive, pulsing ────────────────────────────
      const midR = hovered ? rr * 1.85 : rr * 1.58;
      const midA = (hovered ? 0.22 : 0.15) * (0.85 + pulseA * 0.15);
      const midG = ctx.createRadialGradient(
        cx - rr * 0.18 + mx * 10, cy - rr * 0.14 + my * 8, 0,
        cx, cy, midR,
      );
      midG.addColorStop(0,    `rgba(110,148,240,${midA})`);
      midG.addColorStop(0.40, `rgba(80,118,218,${midA * 0.55})`);
      midG.addColorStop(0.75, `rgba(50,85,185,${midA * 0.18})`);
      midG.addColorStop(1,    'rgba(0,0,0,0)');
      ctx.fillStyle = midG;
      ctx.fillRect(0, 0, W, H);

      // ── Inner glow — tight, brighter, pulsing stronger ────────────────
      const innerA = 0.072 + pulseA * 0.068; // 0.072..0.140
      const innerG = ctx.createRadialGradient(
        cx - rr * 0.22 + mx * 5, cy - rr * 0.18 + my * 4, 0,
        cx, cy, rr * 0.88,
      );
      innerG.addColorStop(0,   `rgba(175,205,255,${innerA})`);
      innerG.addColorStop(0.5, `rgba(130,165,240,${innerA * 0.45})`);
      innerG.addColorStop(1,   'rgba(0,0,0,0)');
      ctx.fillStyle = innerG;
      ctx.beginPath();
      ctx.arc(cx, cy, rr * 0.88, 0, Math.PI * 2);
      ctx.fill();

      // ── Pulsing core light — scale 1→1.03→1 riding breath ─────────────
      const coreA    = 0.030 + pulseA * 0.042; // 0.030..0.072
      const coreGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, rr * 0.50 * breathScale);
      coreGlow.addColorStop(0,   `rgba(205,222,255,${coreA})`);
      coreGlow.addColorStop(0.5, `rgba(150,178,242,${coreA * 0.38})`);
      coreGlow.addColorStop(1,   'rgba(0,0,0,0)');
      ctx.fillStyle = coreGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, rr * 0.50 * breathScale, 0, Math.PI * 2);
      ctx.fill();

      // ── Atmospheric haze ───────────────────────────────────────────────
      ctx.beginPath();
      ctx.arc(cx, cy, rr * 1.09, 0, Math.PI * 2);
      const haze = ctx.createRadialGradient(cx, cy, rr * 0.68, cx, cy, rr * 1.09);
      haze.addColorStop(0,   'rgba(0,0,0,0)');
      haze.addColorStop(0.5, `rgba(100,130,220,${0.055 + pulseA * 0.018})`);
      haze.addColorStop(1,   `rgba(145,168,242,${0.10  + pulseA * 0.025})`);
      ctx.fillStyle = haze;
      ctx.fill();

      // ── Outer corona — depth-of-field blur simulation ─────────────────
      // Three stacked rings at slightly different radii = soft bokeh halo
      for (let i = 0; i < 4; i++) {
        const coronaR = rr * (1.10 + i * 0.06);
        const coronaA = (0.038 + pulseA * 0.022) * Math.pow(0.62, i);
        ctx.beginPath();
        ctx.arc(cx, cy, coronaR, 0, Math.PI * 2);
        const cg = ctx.createRadialGradient(cx, cy, rr * (1.05 + i * 0.04), cx, cy, coronaR);
        cg.addColorStop(0, `rgba(168,192,255,${coronaA})`);
        cg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = cg;
        ctx.fill();
      }

      const rot   = rotRef.current;
      const STEPS = 90;

      // ── Latitude rings ─────────────────────────────────────────────────
      for (let i = 1; i < LAT_LINES; i++) {
        const lat = -90 + (180 / LAT_LINES) * i;
        ctx.beginPath();
        let penDown = false;
        for (let s = 0; s <= STEPS; s++) {
          const lon = -180 + (360 / STEPS) * s;
          const p   = projectSphere(lat, lon, rot, cx, cy, rr);
          if (p.z > 2) { penDown = false; continue; }
          if (!penDown) { ctx.moveTo(p.x, p.y); penDown = true; }
          else ctx.lineTo(p.x, p.y);
        }
        ctx.strokeStyle = Math.abs(lat) < 1 ? LINE_MID : LINE_DIM;
        ctx.lineWidth   = Math.abs(lat) < 1 ? 0.95 : 0.70;
        ctx.stroke();
      }

      // ── Longitude meridians ────────────────────────────────────────────
      for (let j = 0; j < LON_LINES; j++) {
        const lon = (360 / LON_LINES) * j;
        ctx.beginPath();
        let penDown = false;
        for (let s = 0; s <= STEPS; s++) {
          const lat = -90 + (180 / STEPS) * s;
          const p   = projectSphere(lat, lon, rot, cx, cy, rr);
          if (p.z > 2) { penDown = false; continue; }
          if (!penDown) { ctx.moveTo(p.x, p.y); penDown = true; }
          else ctx.lineTo(p.x, p.y);
        }
        ctx.strokeStyle = LINE_DIM;
        ctx.lineWidth   = 0.70;
        ctx.stroke();
      }

      // ── Silhouette rim ─────────────────────────────────────────────────
      ctx.beginPath();
      ctx.arc(cx, cy, rr, 0, Math.PI * 2);
      const rim = ctx.createLinearGradient(cx - rr, cy - rr * 0.8, cx + rr * 0.6, cy + rr);
      rim.addColorStop(0,    RIM_A);
      rim.addColorStop(0.38, 'rgba(155,185,245,0.14)');
      rim.addColorStop(1,    RIM_B);
      ctx.strokeStyle = rim;
      ctx.lineWidth   = hovered ? 1.7 : 1.25;
      ctx.stroke();

      // ── Shimmer sweep — clipped to sphere ─────────────────────────────
      const shimA = 0.025 + pulseA * 0.014;
      const shimG = ctx.createRadialGradient(
        shimmerX, cy - rr * 0.30, 0,
        shimmerX, cy - rr * 0.30, rr * 0.78,
      );
      shimG.addColorStop(0,   `rgba(220,232,255,${shimA})`);
      shimG.addColorStop(0.5, `rgba(185,205,255,${shimA * 0.35})`);
      shimG.addColorStop(1,   'rgba(0,0,0,0)');
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, rr, 0, Math.PI * 2);
      ctx.clip();
      ctx.fillStyle = shimG;
      ctx.fillRect(cx - rr * 1.5, cy - rr * 1.5, rr * 3, rr * 3);
      ctx.restore();

      // ── Lit hemisphere overlay ─────────────────────────────────────────
      ctx.beginPath();
      ctx.arc(cx, cy, rr, 0, Math.PI * 2);
      const lit = ctx.createRadialGradient(
        cx - rr * 0.38 + mx * 7, cy - rr * 0.32 + my * 6, 0,
        cx, cy, rr,
      );
      lit.addColorStop(0,   'rgba(215,228,255,0.058)');
      lit.addColorStop(0.5, 'rgba(148,168,235,0.022)');
      lit.addColorStop(1,   'rgba(0,0,0,0)');
      ctx.fillStyle = lit;
      ctx.fill();

      // ── Edge vignette ──────────────────────────────────────────────────
      ctx.beginPath();
      ctx.arc(cx, cy, rr * 1.01, 0, Math.PI * 2);
      const vignette = ctx.createRadialGradient(cx, cy, rr * 0.58, cx, cy, rr * 1.01);
      vignette.addColorStop(0, 'rgba(0,0,0,0)');
      vignette.addColorStop(1, 'rgba(5,5,9,0.60)');
      ctx.fillStyle = vignette;
      ctx.fill();

      // ── Primary orbit arc — slowly precessing ─────────────────────────
      // The tilt angle slowly drifts over time for a living quality
      const orbitDrift = Math.sin(ts * 0.000028) * 0.08; // very slow drift ±4.6°
      const orx  = rr * 1.32 + mx * 4;
      const ory  = rr * 0.30;
      const tilt = -0.42 + my * 0.04 + orbitDrift;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(tilt);

      // Back half — dashed, subtle
      ctx.beginPath();
      ctx.ellipse(0, 0, orx, ory, 0, Math.PI, Math.PI * 2);
      ctx.strokeStyle  = ORBIT_BACK;
      ctx.lineWidth    = 0.8;
      ctx.setLineDash([2, 8]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Front half — glowing
      ctx.beginPath();
      ctx.ellipse(0, 0, orx, ory, 0, 0, Math.PI);
      ctx.strokeStyle = ORBIT_FORE;
      ctx.lineWidth   = hovered ? 1.5 : 1.1;
      ctx.shadowColor = 'rgba(180,210,255,0.45)';
      ctx.shadowBlur  = hovered ? 10 : 6;
      ctx.stroke();
      ctx.shadowBlur  = 0;
      ctx.shadowColor = 'transparent';

      // ── Traveling light point on orbit ────────────────────────────────
      const dotAngle = rot * 0.55 + 0.3;
      const dox = orx * Math.cos(dotAngle);
      const doy = ory * Math.sin(dotAngle);
      const dotFront = Math.sin(dotAngle) <= 0;

      if (dotFront) {
        // Faint traveling glow ahead of dot — depth-of-field bokeh
        const travelGlow = ctx.createRadialGradient(dox, doy, 0, dox, doy, 32);
        travelGlow.addColorStop(0, `rgba(185,215,255,${0.12 + pulseA * 0.04})`);
        travelGlow.addColorStop(0.4, `rgba(155,190,255,${0.06 + pulseA * 0.02})`);
        travelGlow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = travelGlow;
        ctx.beginPath();
        ctx.arc(dox, doy, 32, 0, Math.PI * 2);
        ctx.fill();

        // Trail — 4 fading echoes
        for (let t = 4; t >= 1; t--) {
          const trailAngle = dotAngle - t * 0.07;
          const tax = orx * Math.cos(trailAngle);
          const tay = ory * Math.sin(trailAngle);
          const ta  = (0.05 - t * 0.01) * (hovered ? 1.4 : 1);
          ctx.beginPath();
          ctx.arc(tax, tay, 1.2 + t * 0.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(210,228,255,${ta})`;
          ctx.fill();
        }

        // Core dot — pulsing size with breathScale
        const dotR = (hovered ? 3.2 : 2.6) * (0.92 + pulseA * 0.08);
        ctx.beginPath();
        ctx.arc(dox, doy, dotR, 0, Math.PI * 2);
        ctx.fillStyle = DOT_COLOR;
        ctx.shadowColor = 'rgba(200,220,255,0.85)';
        ctx.shadowBlur  = hovered ? 14 : 9;
        ctx.fill();
        ctx.shadowBlur  = 0;
        ctx.shadowColor = 'transparent';

        // Dot halo — blurred ring for depth
        const dg = ctx.createRadialGradient(dox, doy, 0, dox, doy, 26);
        dg.addColorStop(0, hovered ? 'rgba(220,235,255,0.42)' : 'rgba(200,220,255,0.30)');
        dg.addColorStop(0.5, `rgba(180,205,255,${0.10 + pulseA * 0.06})`);
        dg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = dg;
        ctx.beginPath();
        ctx.arc(dox, doy, 26, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      // ── Secondary orbit — tighter, cross-plane, slow drift ────────────
      const orbitDrift2 = Math.cos(ts * 0.000022) * 0.06;
      const orx2  = rr * 0.95 + mx * 2;
      const ory2  = rr * 1.18 + my * 2;
      const tilt2 = 1.15 + mx * 0.03 + orbitDrift2;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(tilt2);

      ctx.beginPath();
      ctx.ellipse(0, 0, orx2, ory2, 0, Math.PI, Math.PI * 2);
      ctx.strokeStyle = 'rgba(140,165,235,0.07)';
      ctx.lineWidth   = 0.7;
      ctx.setLineDash([1.5, 10]);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.beginPath();
      ctx.ellipse(0, 0, orx2, ory2, 0, 0, Math.PI);
      ctx.strokeStyle = 'rgba(165,192,252,0.18)';
      ctx.lineWidth   = 0.8;
      ctx.shadowColor = 'rgba(155,185,255,0.25)';
      ctx.shadowBlur  = 4;
      ctx.stroke();
      ctx.shadowBlur  = 0;
      ctx.shadowColor = 'transparent';

      // Second dot — slower, opposite phase, pulsing
      const dotAngle2 = rot * 0.32 + 2.1;
      const dox2 = orx2 * Math.cos(dotAngle2);
      const doy2 = ory2 * Math.sin(dotAngle2);
      const dotFront2 = Math.sin(dotAngle2) <= 0;

      if (dotFront2) {
        // Outer bokeh glow
        const travelGlow2 = ctx.createRadialGradient(dox2, doy2, 0, dox2, doy2, 20);
        travelGlow2.addColorStop(0, `rgba(175,205,255,${0.08 + pulseA * 0.03})`);
        travelGlow2.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = travelGlow2;
        ctx.beginPath();
        ctx.arc(dox2, doy2, 20, 0, Math.PI * 2);
        ctx.fill();

        for (let t = 2; t >= 1; t--) {
          const trailAngle = dotAngle2 - t * 0.07;
          const tax = orx2 * Math.cos(trailAngle);
          const tay = ory2 * Math.sin(trailAngle);
          ctx.beginPath();
          ctx.arc(tax, tay, 1.0, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(195,215,255,${0.030 - t * 0.005})`;
          ctx.fill();
        }

        const dot2R = 2.0 * (0.92 + pulseA * 0.08);
        ctx.beginPath();
        ctx.arc(dox2, doy2, dot2R, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(200,218,255,0.62)';
        ctx.shadowColor = 'rgba(180,205,255,0.55)';
        ctx.shadowBlur  = 7;
        ctx.fill();
        ctx.shadowBlur  = 0;
        ctx.shadowColor = 'transparent';

        const dg2 = ctx.createRadialGradient(dox2, doy2, 0, dox2, doy2, 14);
        dg2.addColorStop(0, `rgba(190,210,255,${0.22 + pulseA * 0.08})`);
        dg2.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = dg2;
        ctx.beginPath();
        ctx.arc(dox2, doy2, 14, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      rafRef.current = requestAnimationFrame(frame);
    }

    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // CSS-driven parallax translation values — different speeds = depth layers
  const outerPX  = `translate(${mouse.x * -6}px, ${mouse.y * -5}px)`;
  const midPX    = `translate(${mouse.x * -10}px, ${mouse.y * -8}px)`;
  const innerPX  = `translate(${mouse.x * -14}px, ${mouse.y * -11}px)`;
  const canvasPX = `translate(${mouse.x * 6}px, ${mouse.y * 5}px)`;

  return (
    <div
      ref={wrapRef}
      className="relative flex items-center justify-center select-none"
      style={{
        width: '100%',
        aspectRatio: '1 / 1',
        maxWidth: 516,
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(0.95)',
        transition: 'opacity 1.1s cubic-bezier(0.16,1,0.3,1), transform 1.1s cubic-bezier(0.16,1,0.3,1)',
        filter: visible
          ? 'drop-shadow(0 32px 64px rgba(0,0,0,0.55)) drop-shadow(0 8px 24px rgba(50,80,200,0.12))'
          : 'none',
      }}
    >
      {/* ── Depth-of-field outer bloom — most defocused, widest spread ── */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          inset: '-38%',
          background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(55,85,200,0.10) 0%, rgba(35,62,172,0.04) 55%, transparent 72%)',
          filter: 'blur(18px)',
          transform: outerPX,
          opacity: hovered ? 1 : 0.82,
          transition: 'transform 1.6s cubic-bezier(0.16,1,0.3,1), opacity 0.9s ease',
        }}
      />

      {/* ── Mid glow — moderate blur, moderate parallax ── */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          inset: '-16%',
          background: 'radial-gradient(ellipse 78% 78% at 50% 50%, rgba(90,125,230,0.16) 0%, rgba(60,95,208,0.06) 52%, transparent 72%)',
          filter: 'blur(8px)',
          transform: midPX,
          opacity: hovered ? 1 : 0.72,
          transition: 'transform 1.1s cubic-bezier(0.16,1,0.3,1), opacity 0.9s ease',
        }}
      />

      {/* ── Inner glow — sharpest, moves fastest ── */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          inset: '-5%',
          background: 'radial-gradient(ellipse 84% 84% at 48% 46%, rgba(120,158,248,0.13) 0%, rgba(85,122,228,0.05) 55%, transparent 75%)',
          filter: 'blur(3px)',
          transform: innerPX,
          opacity: hovered ? 1 : 0.62,
          transition: 'transform 0.8s cubic-bezier(0.16,1,0.3,1), opacity 0.9s ease',
        }}
      />

      {/* Canvas — slight opposite parallax for depth separation */}
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{
          transform: `${canvasPX} scale(${hovered ? 1.018 : 1})`,
          transition: 'transform 0.8s cubic-bezier(0.16,1,0.3,1)',
          position: 'relative',
          zIndex: 1,
        }}
      />

      {/* ── Gallagher brand plaque — glass surface with inner glow ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          zIndex: 2,
          opacity: visible ? (hovered ? 0.97 : 0.82) : 0,
          transform: hovered
            ? `scale(1.028) translateY(-1px) translate(${mouse.x * 4}px, ${mouse.y * 3}px)`
            : 'scale(0.97) translateY(2px)',
          transition: 'opacity 1.4s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {/* Depth-of-field halo behind plaque — blurred */}
        <div
          style={{
            position: 'absolute',
            inset: -40,
            borderRadius: 48,
            background: 'radial-gradient(ellipse 88% 62% at 50% 50%, rgba(85,125,240,0.16) 0%, rgba(55,92,210,0.06) 55%, transparent 80%)',
            filter: 'blur(14px)',
            pointerEvents: 'none',
          }}
        />

        {/* Secondary softer halo */}
        <div
          style={{
            position: 'absolute',
            inset: -20,
            borderRadius: 36,
            background: 'radial-gradient(ellipse 90% 68% at 50% 50%, rgba(110,150,252,0.10) 0%, rgba(70,108,228,0.04) 60%, transparent 80%)',
            filter: 'blur(6px)',
            pointerEvents: 'none',
          }}
        />

        {/* Glass plaque with inner glow + reflection band */}
        <div
          style={{
            borderRadius: 18,
            padding: '14px 22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: hovered
              ? 'rgba(6,10,22,0.82)'
              : 'rgba(4,7,16,0.80)',
            border: '1px solid rgba(255,255,255,0.14)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: hovered
              ? [
                  '0 0 48px rgba(0,0,0,0.75)',
                  'inset 0 1px 0 rgba(255,255,255,0.10)',  // top reflection band
                  'inset 0 -1px 0 rgba(0,0,0,0.50)',
                  'inset 0 0 24px rgba(90,130,240,0.08)',  // inner glow
                  '0 0 0 1px rgba(130,165,240,0.18)',
                  '0 8px 40px rgba(40,70,210,0.22)',
                ].join(', ')
              : [
                  '0 0 28px rgba(0,0,0,0.65)',
                  'inset 0 1px 0 rgba(255,255,255,0.07)',  // subtle top reflection
                  'inset 0 -1px 0 rgba(0,0,0,0.38)',
                  'inset 0 0 16px rgba(80,120,230,0.05)',  // faint inner glow
                  '0 0 0 1px rgba(255,255,255,0.06)',
                ].join(', '),
            position: 'relative',
            overflow: 'hidden',
            transition: 'box-shadow 0.75s ease, background 0.5s ease',
          }}
        >
          {/* Glass reflection streak — diagonal highlight */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '-20%',
              width: '55%',
              height: '100%',
              background: 'linear-gradient(125deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.018) 40%, transparent 65%)',
              borderRadius: 18,
              pointerEvents: 'none',
              transform: hovered ? 'translateX(5%)' : 'translateX(0)',
              transition: 'transform 0.9s cubic-bezier(0.16,1,0.3,1)',
            }}
          />

          <img
            src="/gallagher-logo.svg"
            alt="Gallagher"
            style={{
              width: 160,
              height: 'auto',
              objectFit: 'contain',
              display: 'block',
              position: 'relative',
              zIndex: 1,
              filter: hovered
                ? 'drop-shadow(0 0 8px rgba(160,190,255,0.22))'
                : 'drop-shadow(0 0 4px rgba(140,175,255,0.12))',
              transition: 'filter 0.7s ease',
            }}
          />
        </div>
      </div>
    </div>
  );
}
