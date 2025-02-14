/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        'xs': '450px',
        // ... other breakpoints
      },
      backgroundImage: {
        'islamic-pattern': "url('/islamic-pattern.svg')",
      },
    },
  },
  plugins: [],
}