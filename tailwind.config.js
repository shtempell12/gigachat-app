/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sidebar: '#171717',
        main: '#212121',
        input: '#2f2f2f',
        user: '#2f2f2f',
        assistant: 'transparent',
        border: '#3d3d3d',
        accent: '#19c37d',
      },
    },
  },
  plugins: [],
}
