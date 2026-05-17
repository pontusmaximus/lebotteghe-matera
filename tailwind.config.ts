import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Door-green palette inspired by the restaurant's iconic doors
        bottega: {
          50:  '#f1f6f2',
          100: '#dde9df',
          200: '#bcd4c0',
          300: '#92b599',
          400: '#669171',
          500: '#477357',
          600: '#345b44',
          700: '#284734', // primary dark green (the doors)
          800: '#1f3829',
          900: '#172a1f',
          950: '#0c1812',
        },
        gold: {
          400: '#d4b262',
          500: '#c69b3f',
          600: '#a37e2c',
        },
        cream: {
          50:  '#fbf8f1',
          100: '#f5eedf',
          200: '#ece2c6',
        },
      },
      fontFamily: {
        // Cormorant Garamond mirrors the elegant serif used on the LE BOTTEGHE sign
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'plaster': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' seed='5'/%3E%3CfeColorMatrix values='0 0 0 0 0.99 0 0 0 0 0.97 0 0 0 0 0.91 0 0 0 0.08 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      },
      letterSpacing: {
        widest2: '0.25em',
      },
    },
  },
  plugins: [],
};

export default config;
