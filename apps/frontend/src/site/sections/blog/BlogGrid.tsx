import { useI18n } from '@/i18n/i18nContext';
import { BlogSectionProps } from '@/site/types';

export function BlogGrid({ posts }: BlogSectionProps) {
  const { language, t } = useI18n();

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="bg-surface py-16">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center font-heading text-3xl font-bold text-text">{t.site.latestPosts}</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article key={post.id} className="overflow-hidden rounded-xl border border-border bg-background">
              {post.coverImage && <img src={post.coverImage} alt="" className="h-40 w-full object-cover" />}
              <div className="p-5">
                <h3 className="font-heading font-semibold text-text">
                  {language === 'ar' ? post.titleAr : post.titleEn}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm text-text-muted">
                  {language === 'ar' ? post.contentAr : post.contentEn}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
