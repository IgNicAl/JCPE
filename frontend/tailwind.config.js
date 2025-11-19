/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#F81539',
        'primary-muted': 'rgba(248, 21, 57, 0.08)',
        dark: '#3E3232',
        'dark-75': 'rgba(62, 50, 50, 0.75)',
        'dark-50': 'rgba(62, 50, 50, 0.5)',
        gray: '#F5F5F5',
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
      },
      boxShadow: {
        card: '0px 0px 32px 0px rgba(0, 0, 0, 0.07)',
      },
      borderRadius: {
        md: '12px',
      },
    },
  },
  plugins: [],
};

