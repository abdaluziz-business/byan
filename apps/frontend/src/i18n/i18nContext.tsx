import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { ThemeLanguage } from '@bayan/shared';
import { ar } from './ar';
import { en } from './en';
import { Translations } from './types';

const dictionaries = { ar, en } satisfies Record<ThemeLanguage, Translations>;

type Dictionary = Translations;

interface I18nContextValue {
  language: ThemeLanguage;
  setLanguage: (language: ThemeLanguage) => void;
  t: Dictionary;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export function I18nProvider({
  initialLanguage = 'ar',
  children,
}: {
  initialLanguage?: ThemeLanguage;
  children: ReactNode;
}) {
  const [language, setLanguage] = useState<ThemeLanguage>(initialLanguage);

  const value = useMemo<I18nContextValue>(
    () => ({ language, setLanguage, t: dictionaries[language] }),
    [language],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }

  return context;
}
