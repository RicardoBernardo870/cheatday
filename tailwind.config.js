/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary:   '#FF6B6B',
        secondary: '#FFA07A',
        warn:   '#FFD700',
        danger: '#FF4444',
        surface:  '#1a1a1a',
        card:     '#242424',
        border:   '#333333',
        muted:    '#888888',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Segoe UI', 'sans-serif']
      },
      padding: {
        safe: 'env(safe-area-inset-bottom)'
      }
    }
  },
  plugins: []
}
