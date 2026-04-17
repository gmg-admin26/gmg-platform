import { useState, useEffect } from 'react';
import { TrendingUp, Radio, Activity, Map } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TickerSignal {
  id: string;
  type: 'discovery' | 'campaign' | 'growth' | 'scout';
  message: string;
  location: string;
  timestamp: number;
}

const signalMessages = [
  { type: 'scout', message: 'Scout submission detected', location: 'Austin TX' },
  { type: 'growth', message: 'Artist momentum rising', location: 'Nashville TN' },
  { type: 'campaign', message: 'Campaign launched', location: 'Los Angeles CA' },
  { type: 'growth', message: 'Audience growth spike', location: 'Toronto ON' },
  { type: 'discovery', message: 'New discovery signal', location: 'Atlanta GA' },
  { type: 'scout', message: 'Launchpad scout report submitted', location: 'Chicago IL' },
  { type: 'discovery', message: 'Discovery signal detected', location: 'Seattle WA' },
  { type: 'scout', message: 'Scout report submitted', location: 'University of Michigan' },
  { type: 'campaign', message: 'Release campaign active', location: 'New York NY' },
  { type: 'growth', message: 'Streaming momentum detected', location: 'Miami FL' },
  { type: 'discovery', message: 'Emerging artist signal', location: 'Portland OR' },
  { type: 'scout', message: 'Campus scout activity', location: 'Boston MA' },
  { type: 'campaign', message: 'Marketing campaign initiated', location: 'Phoenix AZ' },
  { type: 'growth', message: 'Fan engagement surge', location: 'Denver CO' },
  { type: 'discovery', message: 'Cultural signal identified', location: 'London UK' },
  { type: 'scout', message: 'International scout report', location: 'Melbourne AU' },
  { type: 'campaign', message: 'Multi-platform campaign live', location: 'Dallas TX' },
  { type: 'growth', message: 'Viral growth detected', location: 'San Francisco CA' },
  { type: 'discovery', message: 'Breakout signal detected', location: 'Philadelphia PA' },
  { type: 'scout', message: 'Network scout submission', location: 'Washington DC' }
];

export default function SignalActivityTicker() {
  const [signals, setSignals] = useState<TickerSignal[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const initialSignals: TickerSignal[] = signalMessages.slice(0, 8).map((msg, i) => ({
      id: `${Date.now()}-${i}`,
      type: msg.type as TickerSignal['type'],
      message: msg.message,
      location: msg.location,
      timestamp: Date.now() + i * 1000
    }));

    setSignals(initialSignals);

    const interval = setInterval(() => {
      const randomMsg = signalMessages[Math.floor(Math.random() * signalMessages.length)];
      const newSignal: TickerSignal = {
        id: `${Date.now()}-${Math.random()}`,
        type: randomMsg.type as TickerSignal['type'],
        message: randomMsg.message,
        location: randomMsg.location,
        timestamp: Date.now()
      };

      setSignals(prev => {
        const updated = [...prev, newSignal];
        if (updated.length > 12) {
          return updated.slice(-12);
        }
        return updated;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getSignalColor = (type: TickerSignal['type']) => {
    switch (type) {
      case 'discovery': return 'text-gmg-cyan';
      case 'campaign': return 'text-gmg-magenta';
      case 'growth': return 'text-blue-400';
      case 'scout': return 'text-gmg-violet';
    }
  };

  const getSignalIcon = (type: TickerSignal['type']) => {
    switch (type) {
      case 'discovery': return Activity;
      case 'campaign': return Radio;
      case 'growth': return TrendingUp;
      case 'scout': return Map;
    }
  };

  const handleSignalClick = () => {
    navigate('/rocksteady');
  };

  return (
    <div className="relative w-full bg-gradient-to-r from-gmg-charcoal via-gmg-graphite to-gmg-charcoal border-b border-gmg-violet/20 overflow-hidden" style={{ height: '36px' }}>
      <div className="absolute inset-0 bg-gradient-to-r from-gmg-violet/5 via-transparent to-gmg-magenta/5"></div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gmg-violet/40 to-transparent"></div>

      <div className="relative h-full flex items-center">
        <div className="flex-shrink-0 flex items-center gap-2 px-4 border-r border-gmg-violet/20 bg-gmg-charcoal/80 backdrop-blur-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-gmg-violet animate-pulse" style={{ animationDuration: '2s' }}></div>
          <span className="text-[10px] font-black tracking-widest text-gmg-violet/90 uppercase">Live Signal Feed</span>
        </div>

        <div
          className="flex-1 relative overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            className={`flex gap-8 ${isPaused ? '' : 'animate-scroll'}`}
            style={{
              width: 'max-content',
              animationPlayState: isPaused ? 'paused' : 'running'
            }}
          >
            {[...signals, ...signals].map((signal, i) => {
              const Icon = getSignalIcon(signal.type);
              const colorClass = getSignalColor(signal.type);

              return (
                <button
                  key={`${signal.id}-${i}`}
                  onClick={handleSignalClick}
                  className="flex items-center gap-2.5 px-4 whitespace-nowrap transition-all duration-300 hover:brightness-125 cursor-pointer group"
                >
                  <Icon className={`w-3 h-3 ${colorClass} flex-shrink-0 transition-transform group-hover:scale-110`} />
                  <span className="text-[11px] font-medium text-gmg-gray/90 group-hover:text-gmg-white transition-colors">
                    {signal.message}
                  </span>
                  <span className="text-[10px] font-bold tracking-wide text-gmg-gray/60 group-hover:text-gmg-gray/80 transition-colors">
                    — {signal.location}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gmg-charcoal to-transparent pointer-events-none z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gmg-charcoal to-transparent pointer-events-none z-10"></div>
      </div>

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 60s linear infinite;
        }
      `}</style>
    </div>
  );
}
