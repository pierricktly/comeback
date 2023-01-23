module.exports = {
  content: [
    './components/**/*.{vue,js}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
  ],
  
  darkMode: 'media', // or 'media' or 'class'

  theme: {
    extend: {
      colors: {
        'background':'#1F1D1D',
        'black-one': '#3B3B3B',
        'black-two': '#222020',
        'black-three': '#2B2B2B',
        'black-four': '#3A3A3A',

        'red-one': '#9E0102',

        'main-gray': '#A6A4A4',
        'second-gray': '#E1E1E1',
        'gray-three': '#3F3F3F',
        'gray-310': '#E0E0E0',
        'dark-gray': '#2D2D2D',

        'primary': '#4F0001', // red
        'secondary': '#1F1D1D', // black
        'tertiary': '#E1E1E1', // white
        'quaternary': '#2B2B2B', //gray
        'quinary': '#3A3A3A', // gray light
      },
    },
  },
  
  plugins: [
    require('tailwindcss-filters'),
  ],
}
