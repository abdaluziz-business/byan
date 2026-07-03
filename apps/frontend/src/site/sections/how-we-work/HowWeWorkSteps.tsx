import { useI18n } from '@/i18n/i18nContext';

const STEPS = [
  { number: '01', titleAr: 'احجز موعدك', titleEn: 'Book your appointment' },
  { number: '02', titleAr: 'أكّد الحجز', titleEn: 'Confirm the booking' },
  { number: '03', titleAr: 'استمتع بالخدمة', titleEn: 'Enjoy the service' },
];

export function HowWeWorkSteps() {
  const { language, t } = useI18n();

  return (
    <section className="bg-surface py-16">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center font-heading text-3xl font-bold text-text">{t.site.howWeWork}</h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.number} className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-cta font-heading font-bold text-cta-text">
                {step.number}
              </div>
              <p className="mt-4 font-heading font-semibold text-text">
                {language === 'ar' ? step.titleAr : step.titleEn}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
