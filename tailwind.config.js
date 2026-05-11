/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ocean: '#0077be',
        sunset: '#ff8c00',
        parchment: '#fdf6e3',
        'ocean-dark': '#005a8e',
        'sunset-dark': '#cc7000',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        handwritten: ['"Caveat"', 'cursive'],
      },
      animation: {
        'golden-pulse': 'goldenPulse 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        goldenPulse: {
          '0%, 100%': { boxShadow: '0 0 10px 2px #fbbf24, 0 0 20px 4px #f59e0b' },
          '50%': { boxShadow: '0 0 20px 6px #fbbf24, 0 0 40px 10px #f59e0b' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
}
