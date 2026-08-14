import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: 'var(--accent)',
          fg: 'var(--accent-fg)',
          soft: 'var(--accent-soft)',
        },
        surface: 'var(--surface)',
        'surface-muted': 'var(--surface-muted)',
        border: 'var(--border)',
        ink: 'var(--ink)',
        'ink-muted': 'var(--ink-muted)',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
      },
      borderRadius: {
        card: '12px',
      },
    },
  },
  plugins: [],
};
export default config;
