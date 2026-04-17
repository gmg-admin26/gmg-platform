import { useEffect, useRef, useState } from 'react';

interface Signal {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  pulsePhase: number;
  label?: string;
  showLabel: boolean;
  labelTimer: number;
  color: string;
}

const signalLabels = [
  'TikTok Spike',
  'Producer Network',
  'Scene Breakout',
  'Streaming Acceleration',
  'Festival Circuit',
  'Underground Buzz',
  'Playlist Momentum',
  'Regional Emergence',
  'Cultural Signal',
  'Fan Behavior',
  'Collaboration Network',
  'Genre Crossover',
];

const signalColors = [
  'rgba(139, 92, 246, 0.6)',   // violet
  'rgba(168, 85, 247, 0.6)',   // purple
  'rgba(147, 197, 253, 0.6)',  // blue
  'rgba(196, 181, 253, 0.6)',  // light purple
];

export default function SignalStream() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const signalsRef = useRef<Signal[]>([]);
  const animationFrameRef = useRef<number>();
  const scrollYRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.documentElement.scrollHeight;
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Initialize signals
    const signalCount = Math.min(30, Math.floor(window.innerWidth / 50));
    for (let i = 0; i < signalCount; i++) {
      signalsRef.current.push({
        id: `signal-${i}`,
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.3 + 0.2,
        pulsePhase: Math.random() * Math.PI * 2,
        showLabel: false,
        labelTimer: Math.random() * 300 + 200,
        color: signalColors[Math.floor(Math.random() * signalColors.length)],
      });
    }

    // Handle scroll for parallax
    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    let lastTime = Date.now();

    const animate = () => {
      const currentTime = Date.now();
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      signalsRef.current.forEach((signal) => {
        // Update position with parallax effect
        signal.x += signal.vx * (deltaTime / 16);
        signal.y += signal.vy * (deltaTime / 16);

        // Apply subtle parallax based on scroll
        const parallaxOffset = scrollYRef.current * 0.05;

        // Wrap around edges
        if (signal.x < -50) signal.x = canvas.width + 50;
        if (signal.x > canvas.width + 50) signal.x = -50;
        if (signal.y < -50) signal.y = canvas.height + 50;
        if (signal.y > canvas.height + 50) signal.y = -50;

        // Update pulse
        signal.pulsePhase += 0.02;
        const pulseScale = 1 + Math.sin(signal.pulsePhase) * 0.3;

        // Update label timer
        signal.labelTimer -= deltaTime / 16;
        if (signal.labelTimer <= 0) {
          signal.showLabel = !signal.showLabel;
          if (signal.showLabel) {
            signal.label = signalLabels[Math.floor(Math.random() * signalLabels.length)];
            signal.labelTimer = 180; // Show for ~3 seconds
          } else {
            signal.labelTimer = Math.random() * 300 + 200; // Hide for random time
          }
        }

        // Draw signal glow
        const gradient = ctx.createRadialGradient(
          signal.x,
          signal.y - parallaxOffset,
          0,
          signal.x,
          signal.y - parallaxOffset,
          signal.size * pulseScale * 8
        );
        gradient.addColorStop(0, signal.color);
        gradient.addColorStop(0.5, signal.color.replace('0.6', '0.2'));
        gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(
          signal.x - signal.size * pulseScale * 8,
          signal.y - parallaxOffset - signal.size * pulseScale * 8,
          signal.size * pulseScale * 16,
          signal.size * pulseScale * 16
        );

        // Draw signal core
        ctx.beginPath();
        ctx.arc(signal.x, signal.y - parallaxOffset, signal.size * pulseScale, 0, Math.PI * 2);
        ctx.fillStyle = signal.color.replace('0.6', String(signal.opacity));
        ctx.fill();

        // Draw label if active
        if (signal.showLabel && signal.label) {
          const fadeProgress = Math.min(signal.labelTimer / 30, 1);
          const labelOpacity = signal.labelTimer < 30
            ? fadeProgress * 0.6
            : Math.min((180 - signal.labelTimer) / 30, 1) * 0.6;

          ctx.font = '9px Inter, system-ui, sans-serif';
          ctx.letterSpacing = '0.05em';

          const metrics = ctx.measureText(signal.label);
          const labelWidth = metrics.width;
          const labelHeight = 12;
          const padding = 6;

          // Label background
          ctx.fillStyle = `rgba(0, 0, 0, ${labelOpacity * 0.8})`;
          ctx.fillRect(
            signal.x + 8,
            signal.y - parallaxOffset - labelHeight / 2 - padding / 2,
            labelWidth + padding * 2,
            labelHeight + padding
          );

          // Label border
          ctx.strokeStyle = `rgba(139, 92, 246, ${labelOpacity * 0.4})`;
          ctx.lineWidth = 0.5;
          ctx.strokeRect(
            signal.x + 8,
            signal.y - parallaxOffset - labelHeight / 2 - padding / 2,
            labelWidth + padding * 2,
            labelHeight + padding
          );

          // Label text
          ctx.fillStyle = `rgba(196, 181, 253, ${labelOpacity})`;
          ctx.textBaseline = 'middle';
          ctx.fillText(
            signal.label.toUpperCase(),
            signal.x + 8 + padding,
            signal.y - parallaxOffset + 1
          );
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.4 }}
    />
  );
}
