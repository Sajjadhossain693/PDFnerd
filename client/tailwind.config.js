/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        lime: {
          accent: '#07090E',
          hover: '#131826',
          muted: 'rgba(255, 255, 255, 0.05)',
        },
        forest: {
          canvas: '#07090E',     // Deep Obsidian Dark Canvas
          dark: '#0B0F17',       // Secondary Dark
          card: '#0D111C',       // Dark Card Surface
          cardHover: '#131927',  // Elevated Card Hover
          border: '#1E2638',     // Sleek subtle border
          borderMuted: '#161C28',
          medium: '#1E2638',
          light: '#141A26',
          textMuted: '#8B949E',  // Readable Muted Secondary Text
        },
        brand: {
          orange: '#FF7A00',
          peach: '#FF6B4A',
          coral: '#FF5E62',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'lime-glow': '0 4px 20px rgba(255, 107, 74, 0.15)',
        'lime-glow-lg': '0 8px 30px rgba(255, 107, 74, 0.25)',
        'forest-card': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
      },
      borderRadius: {
        'xl': '0.85rem',
        '2xl': '1.15rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
};
