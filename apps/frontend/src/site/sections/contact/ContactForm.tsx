import { useMutation } from '@tanstack/react-query';
import { FormEvent, useState } from 'react';
import { useI18n } from '@/i18n/i18nContext';
import { api } from '@/lib/api';
import { ContactSectionProps } from '@/site/types';

export function ContactForm({ siteId }: ContactSectionProps) {
  const { t } = useI18n();
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

  const mutation = useMutation({
    mutationFn: () => api.post(`/sites/${siteId}/contact`, form),
    onSuccess: () => setForm({ name: '', email: '', phone: '', message: '' }),
  });

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    mutation.mutate();
  }

  return (
    <section id="contact" className="bg-background py-16">
      <div className="mx-auto max-w-xl px-6">
        <h2 className="text-center font-heading text-3xl font-bold text-text">{t.site.contactUs}</h2>
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <input
            required
            placeholder={t.site.name}
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="rounded-md border border-border bg-surface px-4 py-2 text-text placeholder:text-text-muted"
          />
          <input
            required
            type="email"
            placeholder={t.auth.email}
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="rounded-md border border-border bg-surface px-4 py-2 text-text placeholder:text-text-muted"
          />
          <input
            placeholder={t.site.phone}
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            className="rounded-md border border-border bg-surface px-4 py-2 text-text placeholder:text-text-muted"
          />
          <textarea
            required
            rows={4}
            placeholder={t.site.message}
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            className="rounded-md border border-border bg-surface px-4 py-2 text-text placeholder:text-text-muted"
          />
          <button
            type="submit"
            disabled={mutation.isPending}
            className="rounded-md bg-cta px-6 py-3 font-medium text-cta-text transition hover:opacity-90 disabled:opacity-50"
          >
            {t.site.sendMessage}
          </button>
          {mutation.isSuccess && <p className="text-center text-sm text-cta">{t.common.confirm}</p>}
          {mutation.isError && <p className="text-center text-sm text-red-500">{t.common.error}</p>}
        </form>
      </div>
    </section>
  );
}
