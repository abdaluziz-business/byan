import { useI18n } from '@/i18n/i18nContext';
import { ServicesSectionProps } from '@/site/types';

export function ServicesGrid({ services }: ServicesSectionProps) {
  const { language, t } = useI18n();

  if (services.length === 0) {
    return null;
  }

  return (
    <section id="services" className="bg-background py-16">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center font-heading text-3xl font-bold text-text">{t.site.ourServices}</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div key={service.id} className="rounded-xl border border-border bg-surface p-6">
              <h3 className="font-heading text-lg font-semibold text-text">
                {language === 'ar' ? service.nameAr : service.nameEn}
              </h3>
              {service.description && <p className="mt-2 text-sm text-text-muted">{service.description}</p>}
              <div className="mt-4 flex items-center justify-between text-sm text-text-muted">
                <span>{service.duration} min</span>
                <span className="font-semibold text-cta">{service.price} SAR</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
