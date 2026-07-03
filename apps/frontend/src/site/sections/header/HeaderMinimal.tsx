import { useI18n } from '@/i18n/i18nContext';
import { HeaderSectionProps } from '@/site/types';

export function HeaderMinimal({ siteName, siteNameAr }: HeaderSectionProps) {
  const { language } = useI18n();
  const displayName = language === 'ar' ? siteNameAr : siteName;

  return (
    <header className="bg-background">
      <div className="mx-auto flex max-w-6xl items-center justify-center px-6 py-6">
        <span className="font-heading text-xl font-semibold tracking-wide text-text">{displayName}</span>
      </div>
    </header>
  );
}
