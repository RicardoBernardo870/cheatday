/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand
        primary: '#FF823A',
        secondary: '#FFA07A',
        // Status
        warn: '#FFD700',
        danger: '#FF4444',
        // Glass-first neutrals (replaces opaque card/surface)
        surface: 'rgba(255,255,255,0.04)',
        card: 'rgba(255,255,255,0.06)',
        border: 'rgba(255,255,255,0.08)',
        // Base background — references CSS variable so it reacts to theme toggle
        base: 'var(--color-base)',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Segoe UI', 'sans-serif'],
      },
      padding: {
        safe: 'env(safe-area-inset-bottom)',
      },
      backdropBlur: {
        xs: '4px',
        glass: '20px',
        'glass-strong': '32px',
        'glass-elevated': '40px',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
        'glass-elevated': '0 16px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12)',
        'glass-primary': '0 4px 16px rgba(255,107,107,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
        'glow-primary': '0 0 20px rgba(255,107,107,0.4)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'scale-in': 'scaleIn 0.15s ease-out',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
