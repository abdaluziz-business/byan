import { useI18n } from '@/i18n/i18nContext';

const STATS = [
  { value: '500+', labelAr: 'عميل سعيد', labelEn: 'Happy clients' },
  { value: '1200+', labelAr: 'حجز مكتمل', labelEn: 'Bookings completed' },
  { value: '4.9', labelAr: 'تقييم العملاء', labelEn: 'Client rating' },
  { value: '5', labelAr: 'سنوات خبرة', labelEn: 'Years of experience' },
];

export function AchievementsCounter() {
  const { language, t } = useI18n();

  return (
    <section className="bg-primary py-16">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center font-heading text-3xl font-bold text-cta-text">{t.site.ourAchievements}</h2>
        <div className="mt-10 grid grid-cols-2 gap-8 text-center md:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.labelEn}>
              <p className="font-heading text-4xl font-bold text-cta-text">{stat.value}</p>
              <p className="mt-2 text-sm text-cta-text/80">{language === 'ar' ? stat.labelAr : stat.labelEn}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
