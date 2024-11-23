/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Include all React files
    './public/index.html',
  ],
  theme: {
    extend: {
      animation: {
        shimmer: 'shimmer 2s infinite linear',
        imageSkeleton: 'imageSkeleton 1.5s ease-in-out infinite',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '100% 0' },
          '100%': { backgroundPosition: '0 0' },
        },
        imageSkeleton: {
          '0%': {
            backgroundColor: 'rgb(31, 41, 55)', // darker gray
          },
          '50%': {
            backgroundColor: 'rgb(75, 85, 99)', // lighter gray
          },
          '100%': {
            backgroundColor: 'rgb(31, 41, 55)', // back to darker gray
          }
        },
        pulse: {
          '0%, 100%': {
            opacity: 1
          },
          '50%': {
            opacity: .5
          },
        },
      },
      backgroundImage: {
        'skeleton-gradient': 'linear-gradient(90deg, transparent 0%, rgb(75, 85, 99) 50%, transparent 100%)',
      },
    },
  },
  plugins: [],
};
