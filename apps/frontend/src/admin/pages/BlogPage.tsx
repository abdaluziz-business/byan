import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FormEvent, useState } from 'react';
import { BlogPost } from '@bayan/shared';
import { Button } from '@/admin/components/Button';
import { Card } from '@/admin/components/Card';
import { DataTable } from '@/admin/components/DataTable';
import { Input } from '@/admin/components/Input';
import { useCurrentSite } from '@/admin/components/useCurrentSite';
import { useI18n } from '@/i18n/i18nContext';
import { api } from '@/lib/api';

const EMPTY_FORM = { titleAr: '', titleEn: '', contentAr: '', contentEn: '', publishNow: false };

export function BlogPage() {
  const { t } = useI18n();
  const { site } = useCurrentSite();
  const queryClient = useQueryClient();
  const [form, setForm] = useState(EMPTY_FORM);

  const postsQuery = useQuery({
    queryKey: ['blog-admin', site?.id],
    queryFn: async () => (await api.get<BlogPost[]>(`/sites/${site!.id}/blog/admin`)).data,
    enabled: Boolean(site),
  });

  const createMutation = useMutation({
    mutationFn: () => api.post(`/sites/${site!.id}/blog`, form),
    onSuccess: () => {
      setForm(EMPTY_FORM);
      queryClient.invalidateQueries({ queryKey: ['blog-admin', site?.id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/blog/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blog-admin', site?.id] }),
  });

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    createMutation.mutate();
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-bold text-[#111111]">{t.admin.blog}</h1>

      <Card>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Title (AR)"
            value={form.titleAr}
            onChange={(e) => setForm({ ...form, titleAr: e.target.value })}
            required
          />
          <Input
            label="Title (EN)"
            value={form.titleEn}
            onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
            required
          />
          <textarea
            placeholder="Content (AR)"
            value={form.contentAr}
            onChange={(e) => setForm({ ...form, contentAr: e.target.value })}
            required
            rows={3}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm sm:col-span-2"
          />
          <textarea
            placeholder="Content (EN)"
            value={form.contentEn}
            onChange={(e) => setForm({ ...form, contentEn: e.target.value })}
            required
            rows={3}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm sm:col-span-2"
          />
          <label className="flex items-center gap-2 text-sm text-[#111111]">
            <input
              type="checkbox"
              checked={form.publishNow}
              onChange={(e) => setForm({ ...form, publishNow: e.target.checked })}
            />
            Publish now
          </label>
          <div className="flex items-end justify-end">
            <Button type="submit" disabled={createMutation.isPending}>
              {t.common.add}
            </Button>
          </div>
        </form>
      </Card>

      <Card>
        <DataTable
          rows={postsQuery.data ?? []}
          rowKey={(row) => row.id}
          columns={[
            { header: 'Title', render: (row) => `${row.titleAr} / ${row.titleEn}` },
            { header: 'Published', render: (row) => (row.publishedAt ? 'Yes' : 'Draft') },
            {
              header: '',
              render: (row) => (
                <Button variant="danger" onClick={() => deleteMutation.mutate(row.id)}>
                  {t.common.delete}
                </Button>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}
