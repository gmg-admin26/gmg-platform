export default function SystemRebuildStatement({ accentColor = 'emerald' }: { accentColor?: 'emerald' | 'violet' }) {
  const glowColor = accentColor === 'violet'
    ? 'rgba(139,92,246,0.05)'
    : 'rgba(16,185,129,0.05)';

  return (
    <section
      className="relative px-6 overflow-hidden"
      style={{ background: '#030303', paddingTop: '72px', paddingBottom: '72px' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 80% at 50% 50%, ${glowColor} 0%, transparent 70%)`,
        }}
      />

      <div
        className="relative z-10 max-w-[860px] mx-auto text-center"
        style={{
          animation: 'srb-fade 0.6s ease forwards',
          opacity: 0,
        }}
      >
        <p
          className="text-xl md:text-2xl font-light"
          style={{
            color: 'rgba(255,255,255,0.62)',
            letterSpacing: '-0.01em',
            lineHeight: 1.55,
            marginBottom: '0.35em',
          }}
        >
          We've seen what happens when execution depends on people.
        </p>
        <p
          className="text-xl md:text-2xl font-normal"
          style={{
            color: 'rgba(255,255,255,0.82)',
            letterSpacing: '-0.01em',
            lineHeight: 1.55,
            marginBottom: '0.35em',
          }}
        >
          Missed moments. Slow responses. Inconsistent results. That's disappointment for artists.
        </p>
        <p
          className="text-xl md:text-2xl font-semibold"
          style={{
            color: 'rgba(255,255,255,0.95)',
            letterSpacing: '-0.01em',
            lineHeight: 1.55,
            marginBottom: '0.35em',
            textShadow: '0 0 20px rgba(255,255,255,0.08)',
          }}
        >
          So we rebuilt the system. Every rep. Every action.
        </p>
        <p
          className="text-xl md:text-2xl font-bold"
          style={{
            color: '#FFFFFF',
            letterSpacing: '-0.015em',
            lineHeight: 1.55,
            textShadow: '0 0 28px rgba(255,255,255,0.14)',
          }}
        >
          Running 24/7 delivering at the level artists actually need.
        </p>
      </div>

      <style>{`
        @keyframes srb-fade {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
