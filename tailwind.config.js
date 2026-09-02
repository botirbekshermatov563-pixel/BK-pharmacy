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
        bkGreen: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#16a34a', // Primary Medical Emerald
          600: '#15803d',
          700: '#166534',
          800: '#14532d',
          900: '#052e16',
        },
        bkMint: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6', // Soft Mint Accent
          600: '#0d9488',
          700: '#0f766e',
        },
        bkSlate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 8px 30px -4px rgba(22, 163, 74, 0.08), 0 2px 8px -2px rgba(22, 163, 74, 0.04)',
        'soft-hover': '0 20px 40px -6px rgba(22, 163, 74, 0.16), 0 6px 16px -2px rgba(22, 163, 74, 0.08)',
        'modal': '0 25px 60px -12px rgba(15, 23, 42, 0.25)',
      }
    },
  },
  plugins: [],
}
