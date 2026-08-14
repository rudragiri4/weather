/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc8fc',
          400: '#36a9f8',
          500: '#0c8de9',
          600: '#026fc7',
          700: '#0358a1',
          800: '#074b83',
          900: '#0c3f6e',
          950: '#082848',
        },
        dark: {
          bg: '#0B0F19',
          surface: '#111827',
          card: '#1F2937',
          border: '#374151',
          hover: '#1F293D',
        },
        weather: {
          sun: '#F59E0B',
          rain: '#3B82F6',
          cloud: '#9CA3AF',
          wind: '#06B6D4',
          snow: '#E0F2FE',
          thunder: '#8B5CF6',
          aqi: {
            good: '#10B981',
            moderate: '#F59E0B',
            unhealthy: '#EF4444',
            hazardous: '#7C3AED'
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'spin-slow': 'spin 12s linear infinite',
        'spin-slow-3s': 'spin 3s linear infinite',
        'slideDown': 'slideDown 0.2s ease forwards',
        'fadeIn': 'fadeIn 0.2s ease forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      boxShadow: {
        'glow-blue': '0 0 20px -3px rgba(12, 141, 233, 0.3)',
        'glow-cyan': '0 0 20px -3px rgba(6, 182, 212, 0.4)',
        'glow-sun': '0 0 25px -2px rgba(245, 158, 11, 0.35)',
        'glow-wind': '0 0 24px -4px rgba(6, 182, 212, 0.6)',
        'glow-amber': '0 0 20px -3px rgba(245, 158, 11, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      opacity: {
        '3': '0.03',
        '8': '0.08',
      },
    },
  },
  plugins: [],
}
