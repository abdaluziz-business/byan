export type ThemeDirection = 'rtl' | 'ltr';
export type ThemeMode = 'dark' | 'light';
export type ThemeLanguage = 'ar' | 'en';

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
  cta: string;
  ctaText: string;
}

export interface ThemeFonts {
  heading: string;
  body: string;
}

export interface SectionConfig {
  enabled: boolean;
  variant: string;
  order: number;
}

export interface SectionsConfig {
  [sectionKey: string]: SectionConfig;
}

export interface ThemeConfig {
  clientId: string;
  language: ThemeLanguage;
  direction: ThemeDirection;
  mode: ThemeMode;
  colors: ThemeColors;
  fonts: ThemeFonts;
  logo: string;
  siteName: string;
  siteNameAr: string;
  sections: SectionsConfig;
}

/** Canonical keys for the sections registry, kept in sync between admin config UI and site renderer. */
export const SECTION_KEYS = [
  'header',
  'hero',
  'about',
  'services',
  'team',
  'testimonials',
  'achievements',
  'gallery',
  'trust',
  'how-we-work',
  'blog',
  'contact',
  'footer',
] as const;

export type SectionKey = (typeof SECTION_KEYS)[number];
