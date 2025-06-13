/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      // Custom font families for the design system
      fontFamily: {
        'serif': ['"Playfair Display"', '"DM Serif Display"', 'Times New Roman', 'serif'],
        'sans': ['Inter', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      // Design system colors matching the spec
      colors: {
        'green-primary': '#06B56C',
        'green-dark': '#00A15C',
        'orange': '#FF8C44',
        'yellow': '#F5BB33',
        'text-dark': '#111111',
        'text-body': '#333333',
        'surface-base': '#FFFFFF',
        'surface-subtle': '#EDEFF5',
      },
      // Custom spacing for consistent layout
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      // Animation utilities for micro-interactions
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};