/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        cream: {
          50: '#fbfaf7',
          100: '#f6f3ee',
          200: '#ede8df',
          300: '#e0d9cc',
        },
        navy: {
          50: '#eef2f7',
          100: '#d8e0ec',
          200: '#b0c0d8',
          300: '#7d96bc',
          400: '#4d6c9c',
          500: '#2f4a7c',
          600: '#233a64',
          700: '#1c2e51',
          800: '#162340',
          900: '#101a33',
        },
        amber: {
          50: '#fef9ed',
          100: '#fbecd0',
          200: '#f6d89e',
          300: '#f0bd5f',
          400: '#e9a23a',
          500: '#d98824',
          600: '#bb6a1c',
          700: '#95501a',
        },
        sage: {
          50: '#f3f7f3',
          100: '#e3ece3',
          200: '#c5d8c5',
          300: '#9bbb9b',
          400: '#6f956f',
          500: '#527a52',
          600: '#3f6240',
          700: '#344f35',
        },
      },
      borderRadius: {
        DEFAULT: '8px',
        lg: '10px',
      },
    },
  },
  plugins: [],
};
