/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'rpg-dark': '#1a1a1d',
        'rpg-slate': '#4e4e50',
        'rpg-crimson': '#c3073f',
        'rpg-gold': '#ffd700',
        'rpg-parchment': '#f5e6c8',
      },
    },
  },
  plugins: [],
};
