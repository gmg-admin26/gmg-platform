export const LIVE_CSS = `
  @keyframes ls-pulse-dot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.85); }
  }
  @keyframes ls-ring-ping {
    0% { transform: scale(1); opacity: 0.55; }
    80%, 100% { transform: scale(2.4); opacity: 0; }
  }
  @keyframes ls-bar-in {
    from { transform: scaleX(0); transform-origin: left; }
    to   { transform: scaleX(1); transform-origin: left; }
  }
  @keyframes ls-border-glow {
    0%, 100% { box-shadow: 0 0 0 0 transparent; }
    50% { box-shadow: 0 0 0 2px var(--ls-glow, rgba(6,182,212,0.25)); }
  }
  @keyframes ls-signal-flash {
    0%, 100% { background: transparent; }
    18% { background: rgba(6,182,212,0.06); }
  }
  @keyframes ls-ticker-slide {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes ls-shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes ls-fade-up {
    from { opacity: 0; transform: translateY(5px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes ls-number-pop {
    0%   { transform: scale(1); }
    35%  { transform: scale(1.08); }
    70%  { transform: scale(0.97); }
    100% { transform: scale(1); }
  }
  @keyframes ls-status-flicker {
    0%, 90%, 100% { opacity: 1; }
    92%  { opacity: 0.4; }
    96%  { opacity: 0.9; }
    98%  { opacity: 0.5; }
  }

  .ls-live-dot {
    animation: ls-pulse-dot 2.4s ease-in-out infinite;
  }
  .ls-live-dot-urgent {
    animation: ls-pulse-dot 1.1s ease-in-out infinite;
  }
  .ls-bar-animate {
    animation: ls-bar-in 0.7s cubic-bezier(0.25,1,0.5,1) both;
  }
  .ls-border-glow {
    animation: ls-border-glow 3.5s ease-in-out infinite;
  }
  .ls-signal-row-new {
    animation: ls-signal-flash 2.2s ease both;
  }
  .ls-ticker {
    display: flex;
    animation: ls-ticker-slide 38s linear infinite;
    will-change: transform;
  }
  .ls-ticker:hover {
    animation-play-state: paused;
  }
  .ls-shimmer-text {
    background: linear-gradient(90deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.65) 45%, rgba(255,255,255,0.25) 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: ls-shimmer 3.5s linear infinite;
  }
  .ls-fade-up {
    animation: ls-fade-up 0.45s cubic-bezier(0.16,1,0.3,1) both;
  }
  .ls-status-flicker {
    animation: ls-status-flicker 7s ease-in-out infinite;
  }
  .ls-module-live {
    position: relative;
  }
  .ls-module-live::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.4s;
  }
  .ls-module-live.ls-signalled::before {
    opacity: 1;
    animation: ls-signal-flash 1.8s ease both;
    border: 1px solid rgba(6,182,212,0.22);
    box-shadow: 0 0 14px rgba(6,182,212,0.08) inset;
  }
  .ls-confidence-bar {
    animation: ls-bar-in 0.9s cubic-bezier(0.25,1,0.5,1) both;
    animation-delay: var(--ls-bar-delay, 0ms);
  }
`;

export function injectLiveCSS() {
  if (document.getElementById('ls-styles')) return;
  const s = document.createElement('style');
  s.id = 'ls-styles';
  s.textContent = LIVE_CSS;
  document.head.appendChild(s);
}

export function useLastUpdated(intervalMs = 30000) {
  return { ts: 'just now', label: 'Updated' };
}

export function fmtRelativeTime(secondsAgo: number): string {
  if (secondsAgo < 60) return 'just now';
  if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)}m ago`;
  if (secondsAgo < 86400) return `${Math.floor(secondsAgo / 3600)}h ago`;
  return `${Math.floor(secondsAgo / 86400)}d ago`;
}
