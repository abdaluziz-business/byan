import { useI18n } from '@/i18n/i18nContext';

export function TrustBadges() {
  const { t } = useI18n();

  return (
    <section className="bg-background py-12">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-text-muted">{t.site.trustedBy}</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-8 opacity-70">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-8 w-24 rounded bg-surface" />
          ))}
        </div>
      </div>
    </section>
  );
}
