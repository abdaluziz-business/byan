import { useI18n } from '@/i18n/i18nContext';

export function GalleryGrid() {
  const { t } = useI18n();

  return (
    <section className="bg-surface py-16">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center font-heading text-3xl font-bold text-text">{t.site.gallery}</h2>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="aspect-square rounded-lg bg-background" />
          ))}
        </div>
      </div>
    </section>
  );
}
