import { useI18n } from '@/i18n/i18nContext';
import { AboutSectionProps } from '@/site/types';

export function AboutDefault({ siteName, siteNameAr }: AboutSectionProps) {
  const { language, t } = useI18n();
  const displayName = language === 'ar' ? siteNameAr : siteName;

  return (
    <section id="about" className="bg-surface py-16">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="font-heading text-3xl font-bold text-text">{t.site.aboutUs}</h2>
        <p className="mt-4 text-text-muted">
          {displayName} — {t.site.ourServices}
        </p>
      </div>
    </section>
  );
}
