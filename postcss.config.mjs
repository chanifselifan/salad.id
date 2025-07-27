const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}', 
  ],
  theme : {
    extend: {
      colors: {
        'deep-teal': '#00796B',
        'soft-grey': '#F2F4F7',
        'lime-green': '#8BC34A',
        'warm-peach': '#FFAB91',
        'dark-grey-text': '#37474F',
      },
    },        
  },
};

export default config;