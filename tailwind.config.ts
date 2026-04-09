import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary:      '#1A56DB',
        'primary-dark': '#1040B0',
        gold:         '#F5A623',
        'gold-dark':  '#D48A0A',
        navy:         '#0D1B3E',
        'navy-mid':   '#1E3A6E',
        light:        '#EEF4FF',
        'light-gold': '#FFF8EC',
        gray:         '#5A6A80',
        border:       '#D0DCF0',
        'bg-alt':     '#F4F7FF',
      },
      fontFamily: {
        fraunces:  ['Fraunces', 'serif'],
        jakarta:   ['Plus Jakarta Sans', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '12px',
      },
      boxShadow: {
        card: '0 4px 20px rgba(13, 27, 62, 0.08)',
        'card-hover': '0 12px 40px rgba(13, 27, 62, 0.15)',
      },
    },
  },
  plugins: [],
}

export default config
