/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        ocean: {
          surface: '#38bdf8',
          mid: '#0ea5e9',
          deep: '#0369a1',
        }
      },
      backgroundImage: {
        'depth-gradient': 'linear-gradient(to bottom, #38bdf8, #0ea5e9, #0369a1)',
        'surface-gradient': 'linear-gradient(to bottom, #f0f9ff, #e0f2fe)',
      },
    },
  },
  plugins: [],
}