import { useI18n } from '@/i18n/i18nContext';
import { FooterSectionProps } from '@/site/types';

export function FooterSimple({ siteName, siteNameAr }: FooterSectionProps) {
  const { language, t } = useI18n();
  const displayName = language === 'ar' ? siteNameAr : siteName;

  return (
    <footer className="border-t border-border bg-surface py-8">
      <div className="mx-auto max-w-6xl px-6 text-center text-sm text-text-muted">
        © {new Date().getFullYear()} {displayName} — {t.site.allRightsReserved}
      </div>
    </footer>
  );
}
