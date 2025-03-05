/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      textShadow: {
        'glow': '0 0 10px rgba(218, 165, 32, 0.5)',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.text-shadow-glow': {
          'text-shadow': '0 0 10px rgba(218, 165, 32, 0.5)',
        },
      }
      addUtilities(newUtilities)
    },
  ],
}