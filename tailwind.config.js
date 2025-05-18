// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = { // Changed from export default for CommonJS compatibility with webpack.config.js
  content: [
    "./public/index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-purple-indigo': '#2b014c',
        'neon-electric-blue': '#7df9ff',
        'neon-light-yellow': '#fcf6bd',
        'neon-pink': '#ff5ecb',
        'neon-orange-start': '#ffbd44',
        'neon-orange-end': '#fcb045',
      },
      backgroundImage: {
        'neon-orange-gold-gradient': 'linear-gradient(to right, #ffbd44, #fcb045)',
      },
      boxShadow: {
        'neon-blue': '0 0 5px #7df9ff, 0 0 10px #7df9ff, 0 0 15px #7df9ff, 0 0 20px #7df9ff',
        'neon-pink': '0 0 5px #ff5ecb, 0 0 10px #ff5ecb, 0 0 15px #ff5ecb, 0 0 20px #ff5ecb',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        },
        pulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: 1 },
          '50%': { transform: 'scale(1.05)', opacity: 0.8 },
        }
      },
      animation: {
        'neon-flicker': 'flicker 1.5s infinite',
        'neon-pulse': 'pulse 2s infinite',
      }
    },
  },
  plugins: [],
};