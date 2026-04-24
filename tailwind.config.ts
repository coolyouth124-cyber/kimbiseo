import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4CAF50',
        'primary-dark': '#45a049',
        dark: {
          bg: '#0f0f23',
          card: '#1a1a3e',
          border: 'rgba(255, 255, 255, 0.1)',
        },
        light: {
          bg: '#ffffff',
          card: 'rgba(255, 255, 255, 0.95)',
          border: 'rgba(255, 255, 255, 0.4)',
        },
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0, 0, 0, 0.1)',
        'glass-dark': '0 8px 32px rgba(0, 0, 0, 0.3)',
      },
      backdropFilter: {
        blur: 'blur(10px)',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
export default config
