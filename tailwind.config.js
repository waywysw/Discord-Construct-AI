/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  media: false, // or 'media' or 'class'
  theme: {
    extend: {      
      backgroundColor: {
        'selected': 'var(--selected-color)',
        'selected-italic': 'var(--selected-italic-color)',
        'selected-text': 'var(--selected-text-color)',
        'selected-bb': 'var(--selected-bb-color)',
      },
      textColor: {
        'selected-text': 'var(--selected-text-color)',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
