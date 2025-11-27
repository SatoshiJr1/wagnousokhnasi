/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'wagnou-primary': '#D48C8C', // Rose saumon / Bordeaux léger
        'wagnou-secondary': '#C5A059', // Doré
        'wagnou-bg': '#FDFBF7', // Crème / Beige très clair
        'wagnou-text': '#4A4A4A', // Gris foncé doux
        'wagnou-card': '#FFFFFF',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // You might want to import a Google Font later
        serif: ['Playfair Display', 'serif'], // For headings
      }
    },
  },
  plugins: [],
}
