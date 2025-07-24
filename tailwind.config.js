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
        // Daylight Mode Colors
        primary: {
          50: '#e6f7f7',
          100: '#b3e8e6',
          200: '#80d9d5',
          300: '#4dcac4',
          400: '#1abbb3',
          500: '#03A6A1',
          600: '#028581',
          700: '#026461',
          800: '#014341',
          900: '#012220',
        },
        // Dark Mode Colors  
        dark: {
          50: '#f5f5f5',
          100: '#eeeeee',
          200: '#e0e0e0',
          300: '#bdbdbd',
          400: '#9e9e9e',
          500: '#757575',
          600: '#616161',
          700: '#424242',
          800: '#393E46',
          900: '#222831',
        },
        // Dive Mode Colors
        ocean: {
          surface: '#F1F1F6',
          mid: '#E1CCEC',
          deep: '#BE9FE1',
          deeper: '#C9B6E4'
        },
        // Sunset Mode Colors
        sunset: {
          50: '#feffc4',
          100: '#ffde63',
          200: '#ffbc4c',
          300: '#ff9933',
          400: '#ff7f1a',
          500: '#799EFF',
          600: '#6889e6',
          700: '#5774cc',
          800: '#465fb3',
          900: '#354a99',
        }
      },
      backgroundImage: {
        'depth-gradient': 'linear-gradient(to bottom, #38bdf8, #0ea5e9, #0369a1)',
        'surface-gradient': 'linear-gradient(to bottom, #f0f9ff, #e0f2fe)',
        'dark-gradient': 'linear-gradient(to bottom, #1e293b, #0f172a)',
        'dive-gradient': 'linear-gradient(to bottom, #0369a1, #075985, #0c4a6e)',
      },
      animation: {
        'theme-transition': 'themeTransition 0.3s ease-in-out',
      },
      keyframes: {
        themeTransition: {
          '0%': { opacity: '0.8' },
          '100%': { opacity: '1' },
        }
      },
      transitionProperty: {
        'theme': 'background-color, border-color, color, fill, stroke',
      },
      transitionDuration: {
        'theme': '300ms',
      },
      transitionTimingFunction: {
        'theme': 'cubic-bezier(0.4, 0, 0.2, 1)',
      }
    },
  },
  plugins: [],
}