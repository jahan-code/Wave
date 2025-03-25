import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'ig-blue': '#0095f6',
        'ig-gray': '#737373',
        'ig-stories-start': '#fdf497',
        'ig-stories-middle': '#fdf497',
        'ig-stories-end': '#fd5949',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      
    },
  },
  plugins: [tailwindcssAnimate],
};
