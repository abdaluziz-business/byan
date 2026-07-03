import { useI18n } from '@/i18n/i18nContext';
import { HeroSectionProps } from '@/site/types';

export function HeroImage({ siteName, siteNameAr, logo }: HeroSectionProps) {
  const { language, t } = useI18n();
  const displayName = language === 'ar' ? siteNameAr : siteName;

  return (
    <section className="bg-background">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 md:grid-cols-2">
        <div className="text-center rtl:md:text-right ltr:md:text-left">
          <h1 className="font-heading text-4xl font-bold text-text">{displayName}</h1>
          <p className="mt-4 text-lg text-text-muted">{t.site.ourServices}</p>
          <a
            href="#contact"
            className="mt-8 inline-block rounded-md bg-cta px-6 py-3 font-medium text-cta-text transition hover:opacity-90"
          >
            {t.site.bookNow}
          </a>
        </div>
        <div className="aspect-video w-full overflow-hidden rounded-xl bg-surface">
          {logo && <img src={logo} alt={displayName} className="h-full w-full object-cover" />}
        </div>
      </div>
    </section>
  );
}
