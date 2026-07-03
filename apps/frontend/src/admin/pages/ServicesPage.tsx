import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FormEvent, useState } from 'react';
import { Service } from '@bayan/shared';
import { Button } from '@/admin/components/Button';
import { Card } from '@/admin/components/Card';
import { DataTable } from '@/admin/components/DataTable';
import { Input } from '@/admin/components/Input';
import { useCurrentSite } from '@/admin/components/useCurrentSite';
import { useI18n } from '@/i18n/i18nContext';
import { api } from '@/lib/api';

const EMPTY_FORM = { nameAr: '', nameEn: '', description: '', price: 0, duration: 30 };

export function ServicesPage() {
  const { t } = useI18n();
  const { site } = useCurrentSite();
  const queryClient = useQueryClient();
  const [form, setForm] = useState(EMPTY_FORM);

  const servicesQuery = useQuery({
    queryKey: ['services', site?.id],
    queryFn: async () => (await api.get<Service[]>(`/sites/${site!.id}/services`)).data,
    enabled: Boolean(site),
  });

  const createMutation = useMutation({
    mutationFn: () => api.post(`/sites/${site!.id}/services`, form),
    onSuccess: () => {
      setForm(EMPTY_FORM);
      queryClient.invalidateQueries({ queryKey: ['services', site?.id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/services/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['services', site?.id] }),
  });

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    createMutation.mutate();
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-bold text-[#111111]">{t.admin.services}</h1>

      <Card>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Input
            label="Name (AR)"
            value={form.nameAr}
            onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
            required
          />
          <Input
            label="Name (EN)"
            value={form.nameEn}
            onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
            required
          />
          <Input
            label="Price"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            required
          />
          <Input
            label="Duration (min)"
            type="number"
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
            required
          />
          <div className="flex items-end">
            <Button type="submit" disabled={createMutation.isPending}>
              {t.common.add}
            </Button>
          </div>
        </form>
      </Card>

      <Card>
        <DataTable
          rows={servicesQuery.data ?? []}
          rowKey={(row) => row.id}
          columns={[
            { header: 'Name', render: (row) => `${row.nameAr} / ${row.nameEn}` },
            { header: 'Price', render: (row) => `${row.price} SAR` },
            { header: 'Duration', render: (row) => `${row.duration} min` },
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
