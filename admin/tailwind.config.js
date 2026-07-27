/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf8f0',
          100: '#f9eddb',
          200: '#f2d7b0',
          300: '#e9bb7c',
          400: '#df9a46',
          500: '#d68020',
          600: '#c86a16',
          700: '#a65114',
          800: '#854118',
          900: '#6c3616',
        },
        coffee: {
          50: '#faf6f1',
          100: '#f0e6d5',
          200: '#e0cba8',
          300: '#cdaa75',
          400: '#be8e4f',
          500: '#b07a3e',
          600: '#9a6133',
          700: '#7d492c',
          800: '#683c2a',
          900: '#583326',
        },
      },
      fontFamily: {
        sans: ['Vazirmatn', 'Tahoma', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
