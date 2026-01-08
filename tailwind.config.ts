import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './app/**/*.{ts,tsx,js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
}

export default config

