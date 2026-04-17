interface BrandLockupProps {
  variant?: 'nav' | 'hero' | 'footer';
  showIcon?: boolean;
  showSignalMotif?: boolean;
}

export default function BrandLockup({ variant = 'nav', showIcon = true, showSignalMotif = false }: BrandLockupProps) {
  const sizeClasses = {
    nav: {
      name: 'text-base font-semibold',
      descriptor: 'text-[11px]',
      motifScale: 0.7,
    },
    hero: {
      name: 'text-xl font-semibold',
      descriptor: 'text-[13px]',
      motifScale: 1,
    },
    footer: {
      name: 'text-lg font-semibold',
      descriptor: 'text-[11px]',
      motifScale: 0.8,
    },
  };

  const classes = sizeClasses[variant];

  return (
    <div className="relative flex items-center gap-4 group">
      {showSignalMotif && (
        <div
          className="absolute inset-0 pointer-events-none overflow-visible"
          style={{
            transform: `scale(${classes.motifScale})`,
            transformOrigin: 'left center'
          }}
        >
          <svg
            className="absolute -left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
            width="100"
            height="60"
            viewBox="0 0 100 60"
          >
            <circle
              cx="15"
              cy="20"
              r="2"
              fill="#8B5CF6"
              opacity="0.2"
            >
              <animate
                attributeName="opacity"
                values="0.1;0.3;0.1"
                dur="6s"
                repeatCount="indefinite"
              />
            </circle>

            <circle
              cx="12"
              cy="40"
              r="1.5"
              fill="#7FB6D6"
              opacity="0.15"
            >
              <animate
                attributeName="opacity"
                values="0.1;0.25;0.1"
                dur="8s"
                begin="1s"
                repeatCount="indefinite"
              />
            </circle>

            <circle
              cx="25"
              cy="30"
              r="1.5"
              fill="#5A4A92"
              opacity="0.2"
            >
              <animate
                attributeName="opacity"
                values="0.15;0.3;0.15"
                dur="7s"
                begin="2s"
                repeatCount="indefinite"
              />
            </circle>

            <line
              x1="15"
              y1="20"
              x2="25"
              y2="30"
              stroke="#8B5CF6"
              strokeWidth="0.5"
              opacity="0.1"
            >
              <animate
                attributeName="opacity"
                values="0.05;0.15;0.05"
                dur="6s"
                repeatCount="indefinite"
              />
            </line>

            <line
              x1="12"
              y1="40"
              x2="25"
              y2="30"
              stroke="#7FB6D6"
              strokeWidth="0.5"
              opacity="0.08"
            >
              <animate
                attributeName="opacity"
                values="0.04;0.12;0.04"
                dur="8s"
                begin="1s"
                repeatCount="indefinite"
              />
            </line>

            <circle
              cx="15"
              cy="20"
              r="8"
              fill="none"
              stroke="#8B5CF6"
              strokeWidth="0.5"
              opacity="0"
            >
              <animate
                attributeName="r"
                values="3;12;3"
                dur="5s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.15;0;0.15"
                dur="5s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>

          <div
            className="absolute right-0 top-1/2 -translate-y-1/2 w-20 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.08) 0%, transparent 70%)',
            }}
          >
            <div className="absolute inset-0 animate-pulse-slow"></div>
          </div>
        </div>
      )}

      {showIcon && (
        <img
          src="/GMG_logo_Crown_black_and_color.png"
          alt="GMG"
          className="w-8 h-8 object-contain group-hover:scale-110 transition-transform duration-300 relative z-10"
        />
      )}
      <div className="flex flex-col relative z-10">
        <span className={`${classes.name} text-white leading-tight tracking-tight`}>
          Greater Music Group
        </span>
        <span className={`${classes.descriptor} text-[#9FA1A6] font-medium tracking-[0.04em] uppercase leading-tight`}>
          AI Music Systems
        </span>
      </div>
    </div>
  );
}
