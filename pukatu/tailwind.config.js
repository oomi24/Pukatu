/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./App.tsx",
    "./index.tsx",
    "./types.ts",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#818cf8', // indigo-400
          DEFAULT: '#4f46e5', // indigo-600
          dark: '#3730a3', // indigo-800
        },
        secondary: {
          light: '#fb923c', // orange-400
          DEFAULT: '#f97316', // orange-500
          dark: '#ea580c', // orange-600
        },
        background: '#111827', // slate-900 (gris muy oscuro, casi negro)
        card: '#1f2937', // slate-800 (Gris oscuro para tarjetas)
        'text-primary': '#F3F4F6', // slate-100 (Gris muy claro para texto principal)
        'text-secondary': '#9CA3AF', // slate-400 (Gris claro para texto secundario)
        success: '#10B981', // green-500 (Verde esmeralda)
        danger: '#EF4444', // red-500 (Rojo)
        warning: '#F59E0B', // amber-500 (Ámbar)
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'], // Changed from Inter to Montserrat
        display: ['Orbitron', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-in-up': 'slideInUp 0.5s ease-out',
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideInUp: {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      }
    },
  },
  plugins: [],
}