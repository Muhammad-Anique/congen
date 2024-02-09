/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        primary:"#85d0df",
        primary2:"#0f172a",
        secondary:"#53beec"
      }
    },
  },
  plugins: [],
}