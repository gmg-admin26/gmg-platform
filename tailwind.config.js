/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'gmg-charcoal': '#0B0B0D',
        'gmg-graphite': '#15161A',
        'gmg-purple': '#1A1326',
        'gmg-violet': '#8B5CF6',
        'gmg-violet-light': '#5A4A92',
        'gmg-violet-deep': '#2A223F',
        'gmg-violet-accent': '#171322',
        'gmg-violet-shadow': '#221B33',
        'gmg-lavender': '#7D6AB0',
        'gmg-magenta': '#EC4899',
        'gmg-cyan': '#06B6D4',
        'gmg-gold': '#EAB308',
        'gmg-white': '#F5F5F7',
        'gmg-gray': '#A6A8AD',
        'gmg-soft-grey': '#E5E5E7',
        'gmg-smoky-grey': '#A9AAB0',
        'gmg-green': '#10B981',
        'gmg-orange': '#F59E0B',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { opacity: '0.5' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
