import { useState } from 'react';
import { useI18n } from '@/i18n/i18nContext';
import { TestimonialsSectionProps } from '@/site/types';

export function TestimonialsSlider({ testimonials }: TestimonialsSectionProps) {
  const [index, setIndex] = useState(0);
  const { t } = useI18n();

  if (testimonials.length === 0) {
    return null;
  }

  const current = testimonials[index % testimonials.length];

  return (
    <section className="bg-background py-16">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <h2 className="font-heading text-3xl font-bold text-text">{t.site.testimonials}</h2>
        <div className="mt-10 rounded-xl border border-border bg-surface p-8">
          <p className="text-lg text-text">&ldquo;{current.content}&rdquo;</p>
          <div className="mt-4 text-cta">{'★'.repeat(current.rating)}</div>
          <p className="mt-2 font-heading font-semibold text-text">{current.authorName}</p>
        </div>
        {testimonials.length > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            {testimonials.map((testimonial, i) => (
              <button
                key={testimonial.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Testimonial ${i + 1}`}
                className={`h-2 w-2 rounded-full ${i === index % testimonials.length ? 'bg-cta' : 'bg-border'}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
