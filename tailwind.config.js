/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand — matches CSS variables in main.css
        primary:   '#FF823A',    // Saffron Sunset
        secondary: '#5DC7B7',    // Aquatic Mint (doubles as success)
        success:   '#5DC7B7',    // Aquatic Mint
        warn:      '#FFBF5E',    // Amber Glow
        danger:    '#A3152F',    // Royal Burgundy

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
        xs:              '4px',
        'glass-thin':    '10px',
        glass:           '25px',
        'glass-strong':  '25px',
        'glass-elevated':'30px',
        'glass-nav':     '15px',
      },
      boxShadow: {
        // Saffron primary glow
        'glass-primary':  '0 4px 20px rgba(255,130,58,0.30), inset 0 1px 0 rgba(255,215,170,0.40)',
        'glow-primary':   '0 0 24px rgba(255,130,58,0.45)',
        'glow-success':   '0 0 16px rgba(93,199,183,0.45)',
        'glow-warn':      '0 0 16px rgba(255,191,94,0.45)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation: {
        'fade-in':  'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'scale-in': 'scaleIn 0.15s ease-out',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
