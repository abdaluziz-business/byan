import { useI18n } from '@/i18n/i18nContext';
import { TeamSectionProps } from '@/site/types';

export function TeamGrid({ members }: TeamSectionProps) {
  const { language, t } = useI18n();

  if (members.length === 0) {
    return null;
  }

  return (
    <section id="team" className="bg-surface py-16">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center font-heading text-3xl font-bold text-text">{t.site.ourTeam}</h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {members.map((member) => (
            <div key={member.id} className="text-center">
              <div className="mx-auto h-24 w-24 overflow-hidden rounded-full bg-background">
                {member.image && <img src={member.image} alt={member.nameEn} className="h-full w-full object-cover" />}
              </div>
              <h3 className="mt-4 font-heading font-semibold text-text">
                {language === 'ar' ? member.nameAr : member.nameEn}
              </h3>
              <p className="text-sm text-text-muted">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
