import GMGMotif from './GMGMotif';
import LaunchpadSignalNetwork from './LaunchpadSignalNetwork';

export default function HeroCinematicBackground() {
  return (
    <>
      <GMGMotif />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 0, opacity: 0.20, transform: 'scale(1.35)', transformOrigin: 'center center' }}
      >
        <div style={{ margin: '-10% -15%', width: '130%', height: '120%' }}>
          <LaunchpadSignalNetwork />
        </div>
      </div>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background: `
            radial-gradient(
              circle at 50% 35%,
              rgba(88, 28, 135, 0.65) 0%,
              rgba(88, 28, 135, 0.45) 20%,
              rgba(88, 28, 135, 0.25) 40%,
              rgba(59, 130, 246, 0.12) 60%,
              rgba(0, 0, 0, 0.85) 80%,
              rgba(0, 0, 0, 0) 100%
            ),
            radial-gradient(
              circle at 20% 10%,
              rgba(139, 92, 246, 0.35),
              transparent 70%
            ),
            radial-gradient(
              circle at 80% 70%,
              rgba(59, 130, 246, 0.15),
              transparent 75%
            )
          `,
        }}
      />

      <div className="hero-atmospheric-light" style={{ zIndex: 4 }}></div>
    </>
  );
}
