/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        'shake-crazy': {
          '0%': { transform: 'translate(0, 0) rotate(0)' },
          '25%': { transform: 'translate(-2px, 2px) rotate(-5deg)' },
          '50%': { transform: 'translate(2px, -2px) rotate(5deg)' },
          '75%': { transform: 'translate(-2px, 2px) rotate(-3deg)' },
          '100%': { transform: 'translate(0, 0) rotate(0)' },
        },
      },
      animation: {
        'shake-crazy': 'shake-crazy 0.5s infinite ease-in-out',
      },
    },
  },
  plugins: [],
};
