module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        lexend: ['Lexend Tera', 'sans-serif'], 
      },
      colors: {
        background: '#0D0E16',
        primary: '#A7ACCD',
        secondary: '#5E3762',
        text: '#E5E6F0',
        accent: '#B2779F',
        btnOutline: '#A3688F',
      },
      boxShadow: {
        'secondary': '0px 4px 40px 6px rgba(94, 55, 98, 0.2), 0px 8px 12px 0px rgba(94, 55, 98, 0.1)',
        'custom': '0 2px 7.1px 14px rgba(52, 52, 52, 0.7)',
        'b2779f-custom': '0 5px 31.1px rgba(178, 119, 159, 1)', // blur: 21.1, spread: 5, color: #B2779F
      },
    },
  },
  plugins: [],
};
