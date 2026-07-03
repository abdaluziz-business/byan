import { useI18n } from '@/i18n/i18nContext';
import { HeroSectionProps } from '@/site/types';

export function HeroVideo({ siteName, siteNameAr }: HeroSectionProps) {
  const { language, t } = useI18n();
  const displayName = language === 'ar' ? siteNameAr : siteName;

  return (
    <section className="relative overflow-hidden bg-primary py-24 text-center">
      <div className="relative z-10 mx-auto max-w-3xl px-6">
        <h1 className="font-heading text-4xl font-bold text-cta-text sm:text-5xl">{displayName}</h1>
        <p className="mt-4 text-lg text-cta-text/80">{t.site.ourServices}</p>
        <a
          href="#contact"
          className="mt-8 inline-block rounded-md bg-cta px-6 py-3 font-medium text-cta-text transition hover:opacity-90"
        >
          {t.site.bookNow}
        </a>
      </div>
    </section>
  );
}
