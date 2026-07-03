import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FormEvent, useState } from 'react';
import { TeamMember } from '@bayan/shared';
import { Button } from '@/admin/components/Button';
import { Card } from '@/admin/components/Card';
import { DataTable } from '@/admin/components/DataTable';
import { Input } from '@/admin/components/Input';
import { useCurrentSite } from '@/admin/components/useCurrentSite';
import { useI18n } from '@/i18n/i18nContext';
import { api } from '@/lib/api';

const EMPTY_FORM = { nameAr: '', nameEn: '', role: '' };

export function TeamPage() {
  const { t } = useI18n();
  const { site } = useCurrentSite();
  const queryClient = useQueryClient();
  const [form, setForm] = useState(EMPTY_FORM);

  const teamQuery = useQuery({
    queryKey: ['team', site?.id],
    queryFn: async () => (await api.get<TeamMember[]>(`/sites/${site!.id}/team`)).data,
    enabled: Boolean(site),
  });

  const createMutation = useMutation({
    mutationFn: () => api.post(`/sites/${site!.id}/team`, form),
    onSuccess: () => {
      setForm(EMPTY_FORM);
      queryClient.invalidateQueries({ queryKey: ['team', site?.id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/team/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['team', site?.id] }),
  });

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    createMutation.mutate();
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-bold text-[#111111]">{t.admin.team}</h1>

      <Card>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
          <Input label="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required />
          <div className="flex items-end">
            <Button type="submit" disabled={createMutation.isPending}>
              {t.common.add}
            </Button>
          </div>
        </form>
      </Card>

      <Card>
        <DataTable
          rows={teamQuery.data ?? []}
          rowKey={(row) => row.id}
          columns={[
            { header: 'Name', render: (row) => `${row.nameAr} / ${row.nameEn}` },
            { header: 'Role', render: (row) => row.role },
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
