import { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  opacity: number;
  opacityDirection: number;
  pulsePhase: number;
  color: string;
  connections: number[];
}

export default function SignalGridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const colors = [
      'rgba(139, 92, 246, 1)',
      'rgba(6, 182, 212, 1)',
      'rgba(236, 72, 153, 1)',
    ];

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initNodes();
    };

    const isMobile = () => window.innerWidth < 768;

    const initNodes = () => {
      const nodeCount = isMobile() ? 15 : 30;
      const nodes: Node[] = [];

      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          opacity: Math.random() * 0.5 + 0.2,
          opacityDirection: Math.random() > 0.5 ? 1 : -1,
          pulsePhase: Math.random() * Math.PI * 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          connections: [],
        });
      }

      nodesRef.current = nodes;
    };

    const drawGrid = () => {
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.03)';
      ctx.lineWidth = 1;

      const gridSize = isMobile() ? 80 : 60;

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
    };

    const updateNodes = () => {
      const nodes = nodesRef.current;

      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        node.opacity += node.opacityDirection * 0.003;
        if (node.opacity > 0.7 || node.opacity < 0.1) {
          node.opacityDirection *= -1;
        }

        node.pulsePhase += 0.02;
      });
    };

    const findConnections = () => {
      const nodes = nodesRef.current;
      const maxDistance = isMobile() ? 150 : 200;

      nodes.forEach((node, i) => {
        node.connections = [];
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - node.x;
          const dy = nodes[j].y - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance && Math.random() > 0.95) {
            node.connections.push(j);
          }
        }
      });
    };

    const drawNodes = () => {
      const nodes = nodesRef.current;

      nodes.forEach((node) => {
        const pulse = Math.sin(node.pulsePhase) * 0.3 + 0.7;
        const radius = isMobile() ? 2 : 3;

        ctx.shadowBlur = 15 * pulse;
        ctx.shadowColor = node.color;

        ctx.fillStyle = node.color.replace('1)', `${node.opacity})`);
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius * pulse, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;
      });
    };

    const drawConnections = () => {
      const nodes = nodesRef.current;

      nodes.forEach((node, i) => {
        node.connections.forEach((targetIndex) => {
          const target = nodes[targetIndex];
          const avgOpacity = (node.opacity + target.opacity) / 2;

          ctx.strokeStyle = node.color.replace('1)', `${avgOpacity * 0.3})`);
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(target.x, target.y);
          ctx.stroke();
        });
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawGrid();
      updateNodes();

      if (Math.random() > 0.98) {
        findConnections();
      }

      drawConnections();
      drawNodes();

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-60"
      style={{ zIndex: 1 }}
    />
  );
}
