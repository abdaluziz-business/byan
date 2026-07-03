import { SectionsConfig } from '@bayan/shared';
import { SiteTheme } from '@bayan/shared';

export const DEFAULT_SITE_THEME: SiteTheme = {
  mode: 'light',
  colors: {
    primary: '#0F172A',
    secondary: '#1E293B',
    background: '#FFFFFF',
    surface: '#F8FAFC',
    text: '#0F172A',
    textMuted: '#64748B',
    border: '#E2E8F0',
    cta: '#2563EB',
    ctaText: '#FFFFFF',
  },
  fonts: { heading: 'Tajawal, sans-serif', body: 'Tajawal, sans-serif' },
  logo: '',
  siteName: '',
  siteNameAr: '',
};

export const DEFAULT_SITE_SECTIONS: SectionsConfig = {
  header: { enabled: true, variant: 'classic', order: 0 },
  hero: { enabled: true, variant: 'text', order: 1 },
  about: { enabled: false, variant: 'default', order: 2 },
  services: { enabled: true, variant: 'grid', order: 3 },
  team: { enabled: true, variant: 'grid', order: 4 },
  testimonials: { enabled: true, variant: 'slider', order: 5 },
  achievements: { enabled: false, variant: 'counter', order: 6 },
  gallery: { enabled: false, variant: 'grid', order: 7 },
  trust: { enabled: false, variant: 'badges', order: 8 },
  'how-we-work': { enabled: false, variant: 'steps', order: 9 },
  blog: { enabled: false, variant: 'grid', order: 10 },
  contact: { enabled: true, variant: 'form', order: 11 },
  footer: { enabled: true, variant: 'simple', order: 12 },
};
