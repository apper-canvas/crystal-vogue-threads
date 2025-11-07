/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'sans': ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#1a1a1a',
        secondary: '#f5f5f5',
        accent: '#d4af37',
        surface: '#ffffff',
        background: '#fafafa',
      },
      animation: {
        'bounce-subtle': 'bounce-subtle 0.6s ease-out',
      },
      keyframes: {
        'bounce-subtle': {
          '0%, 20%, 53%, 80%, 100%': { transform: 'scale(1)' },
          '40%, 43%': { transform: 'scale(1.1)' },
        }
      },
    },
  },
  plugins: [],
}