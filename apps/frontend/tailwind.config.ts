import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Theme-driven colors, consumed via CSS variables set by ThemeContext.
        // Components should read these instead of hardcoding hex values.
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        text: 'var(--color-text)',
        'text-muted': 'var(--color-text-muted)',
        border: 'var(--color-border)',
        cta: 'var(--color-cta)',
        'cta-text': 'var(--color-cta-text)',
        // Fixed neutral palette for the admin panel only.
        'admin-dark': '#111111',
        'admin-light': '#ffffff',
      },
      fontFamily: {
        heading: 'var(--font-heading)',
        body: 'var(--font-body)',
      },
    },
  },
  plugins: [
    plugin(({ addVariant }) => {
      addVariant('rtl', '[dir="rtl"] &');
      addVariant('ltr', '[dir="ltr"] &');
    }),
  ],
} satisfies Config;
