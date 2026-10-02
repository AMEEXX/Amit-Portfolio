/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        accent: '#62a2d8',
        'accent-safe': '#3d7ab0',
        'accent-soft': '#acbde0',
        'accent-deep': '#2c165f',
        'accent-indigo': '#455792',
        'ink-deep': '#05060f',
      },
      fontFamily: {
        sans: ['Geist', 'Onest', 'system-ui', 'sans-serif'],
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
        mono: ['"Geist Mono"', '"JetBrains Mono"', 'ui-monospace', 'monospace'],
        onest: ['Geist', 'Onest', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
