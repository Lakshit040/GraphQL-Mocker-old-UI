/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/ui/**/*.tsx"],
  theme: {
    extend: {},
  },
  variants: {
    display: ['responsive', 'group-hover', 'group-focus'],
  },
  plugins: [],
};
