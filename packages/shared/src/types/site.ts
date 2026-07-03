import { Language } from './enums';
import { SectionsConfig, ThemeColors, ThemeFonts } from './theme';

export interface SiteTheme {
  mode: 'dark' | 'light';
  colors: ThemeColors;
  fonts: ThemeFonts;
  logo: string;
  siteName: string;
  siteNameAr: string;
}

export interface Site {
  id: string;
  clientId: string;
  theme: SiteTheme;
  sections: SectionsConfig;
  language: Language;
  domain: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}
