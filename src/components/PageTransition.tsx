import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';

interface SignalNode {
  x: number;
  y: number;
  color: string;
  delay: number;
}

interface SignalLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  delay: number;
}

export default function PageTransition() {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prevLocationRef = useRef(location.pathname);

  useEffect(() => {
    if (prevLocationRef.current !== location.pathname) {
      setIsTransitioning(true);

      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 800);

      prevLocationRef.current = location.pathname;

      return () => clearTimeout(timer);
    }
  }, [location]);

  useEffect(() => {
    if (!isTransitioning) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = [
      'rgba(139, 92, 246, 0.8)',
      'rgba(6, 182, 212, 0.8)',
      'rgba(236, 72, 153, 0.8)',
    ];

    const isMobile = window.innerWidth < 768;
    const nodeCount = isMobile ? 8 : 15;
    const lineCount = isMobile ? 3 : 6;

    const nodes: SignalNode[] = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 200,
      });
    }

    const lines: SignalLine[] = [];
    for (let i = 0; i < lineCount; i++) {
      const isHorizontal = Math.random() > 0.5;
      lines.push({
        x1: isHorizontal ? 0 : Math.random() * canvas.width,
        y1: isHorizontal ? Math.random() * canvas.height : 0,
        x2: isHorizontal ? canvas.width : Math.random() * canvas.width,
        y2: isHorizontal ? Math.random() * canvas.height : canvas.height,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 150,
      });
    }

    const startTime = Date.now();
    const duration = 800;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const gridSize = isMobile ? 100 : 80;
      const gridOpacity = Math.sin(progress * Math.PI) * 0.05;
      ctx.strokeStyle = `rgba(139, 92, 246, ${gridOpacity})`;
      ctx.lineWidth = 1;

      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      lines.forEach((line) => {
        const lineStart = line.delay / duration;
        const lineProgress = Math.max(0, (progress - lineStart) / (1 - lineStart));

        if (lineProgress > 0 && lineProgress < 1) {
          const currentX = line.x1 + (line.x2 - line.x1) * lineProgress;
          const currentY = line.y1 + (line.y2 - line.y1) * lineProgress;

          const opacity = Math.sin(lineProgress * Math.PI) * 0.6;
          ctx.strokeStyle = line.color.replace('0.8', opacity.toString());
          ctx.lineWidth = 2;
          ctx.shadowBlur = 15;
          ctx.shadowColor = line.color;

          ctx.beginPath();
          ctx.moveTo(line.x1, line.y1);
          ctx.lineTo(currentX, currentY);
          ctx.stroke();

          ctx.shadowBlur = 0;
        }
      });

      nodes.forEach((node) => {
        const nodeStart = node.delay / duration;
        const nodeProgress = Math.max(0, (progress - nodeStart) / (1 - nodeStart));

        if (nodeProgress > 0) {
          const pulsePhase = nodeProgress * Math.PI * 2;
          const pulse = Math.sin(pulsePhase) * 0.5 + 0.5;
          const opacity = pulse * Math.sin(progress * Math.PI) * 0.8;

          ctx.shadowBlur = 20 * pulse;
          ctx.shadowColor = node.color;
          ctx.fillStyle = node.color.replace('0.8', opacity.toString());

          const radius = isMobile ? 3 : 4;
          ctx.beginPath();
          ctx.arc(node.x, node.y, radius * (1 + pulse * 0.5), 0, Math.PI * 2);
          ctx.fill();

          ctx.shadowBlur = 0;
        }
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [isTransitioning]);

  if (!isTransitioning) return null;

  return (
    <div
      className="fixed inset-0 z-50 pointer-events-none transition-opacity duration-300"
      style={{
        backgroundColor: 'rgba(11, 11, 13, 0.7)',
        animation: 'pageTransitionFade 800ms ease-in-out',
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}
