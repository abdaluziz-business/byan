import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { defaultTheme } from './defaultTheme';
import { ThemeConfig } from './ThemeTypes';

interface ThemeContextValue {
  theme: ThemeConfig;
  setTheme: (theme: ThemeConfig) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function applyCssVariables(theme: ThemeConfig): void {
  const root = document.documentElement;

  root.style.setProperty('--color-primary', theme.colors.primary);
  root.style.setProperty('--color-secondary', theme.colors.secondary);
  root.style.setProperty('--color-background', theme.colors.background);
  root.style.setProperty('--color-surface', theme.colors.surface);
  root.style.setProperty('--color-text', theme.colors.text);
  root.style.setProperty('--color-text-muted', theme.colors.textMuted);
  root.style.setProperty('--color-border', theme.colors.border);
  root.style.setProperty('--color-cta', theme.colors.cta);
  root.style.setProperty('--color-cta-text', theme.colors.ctaText);
  root.style.setProperty('--font-heading', theme.fonts.heading);
  root.style.setProperty('--font-body', theme.fonts.body);

  root.setAttribute('dir', theme.direction);
  root.setAttribute('lang', theme.language);
  root.classList.toggle('dark', theme.mode === 'dark');
}

export function ThemeProvider({
  initialTheme = defaultTheme,
  children,
}: {
  initialTheme?: ThemeConfig;
  children: ReactNode;
}) {
  const [theme, setTheme] = useState<ThemeConfig>(initialTheme);

  useEffect(() => {
    applyCssVariables(theme);
  }, [theme]);

  const value = useMemo(() => ({ theme, setTheme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}
