/** @type {import('tailwindcss').Config} */
export default {
  // Important: Configure content to find all your React/JS and HTML files
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Optional: Custom font for better Malayalam/English rendering
      fontFamily: {
        sans: ['"Noto Sans"', 'sans-serif'],
      },
      // Subtle entrance animation for polish
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeInUp: 'fadeInUp 0.8s ease-out forwards',
      },
    },
  },
  plugins: [],
}