/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}', // Adjust this path according to your folder structure
    './components/**/*.{js,jsx,ts,tsx}', // Adjust this path according to your folder structure
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
