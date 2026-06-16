import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/presentation/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        green: {
          primary: '#4CAF82',
          dark: '#2E7D5E',
          light: '#E8F5EF',
        },
        teal: {
          primary: '#38B2AC',
          light: '#E6FFFA',
        },
        pink: {
          primary: '#F9A8C9',
          light: '#FFF0F6',
        },
        surface: '#F8FFFE',
        border: '#E2EDE8',
        'text-primary': '#1A2E25',
        'text-secondary': '#6B8F7A',
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 12px rgba(76, 175, 130, 0.08)',
        'card-hover': '0 8px 24px rgba(76, 175, 130, 0.16)',
      },
      borderRadius: {
        card: '16px',
      },
    },
  },
  plugins: [],
};

export default config;
