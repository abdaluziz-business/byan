import { useI18n } from '@/i18n/i18nContext';
import { HeaderSectionProps } from '@/site/types';

export function HeaderClassic({ siteName, siteNameAr, logo }: HeaderSectionProps) {
  const { language, t } = useI18n();
  const displayName = language === 'ar' ? siteNameAr : siteName;

  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          {logo ? (
            <img src={logo} alt={displayName} className="h-10 w-10 rounded object-cover" />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded bg-primary font-heading text-cta-text">
              {displayName.charAt(0)}
            </div>
          )}
          <span className="font-heading text-lg font-bold text-text">{displayName}</span>
        </div>
        <a
          href="#contact"
          className="rounded-md bg-cta px-4 py-2 text-sm font-medium text-cta-text transition hover:opacity-90"
        >
          {t.site.bookNow}
        </a>
      </div>
    </header>
  );
}
