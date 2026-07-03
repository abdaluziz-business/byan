import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Testimonial } from '@bayan/shared';
import { Button } from '@/admin/components/Button';
import { Card } from '@/admin/components/Card';
import { DataTable } from '@/admin/components/DataTable';
import { useCurrentSite } from '@/admin/components/useCurrentSite';
import { useI18n } from '@/i18n/i18nContext';
import { api } from '@/lib/api';

export function TestimonialsPage() {
  const { t } = useI18n();
  const { site } = useCurrentSite();
  const queryClient = useQueryClient();

  const testimonialsQuery = useQuery({
    queryKey: ['testimonials-admin', site?.id],
    queryFn: async () => (await api.get<Testimonial[]>(`/sites/${site!.id}/testimonials/admin`)).data,
    enabled: Boolean(site),
  });

  const approveMutation = useMutation({
    mutationFn: ({ id, isApproved }: { id: string; isApproved: boolean }) =>
      api.patch(`/testimonials/${id}`, { isApproved }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['testimonials-admin', site?.id] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/testimonials/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['testimonials-admin', site?.id] }),
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-bold text-[#111111]">{t.admin.testimonials}</h1>
      <Card>
        <DataTable
          rows={testimonialsQuery.data ?? []}
          rowKey={(row) => row.id}
          columns={[
            { header: 'Author', render: (row) => row.authorName },
            { header: 'Rating', render: (row) => '★'.repeat(row.rating) },
            { header: 'Content', render: (row) => row.content },
            {
              header: 'Approved',
              render: (row) => (
                <input
                  type="checkbox"
                  checked={row.isApproved}
                  onChange={(e) => approveMutation.mutate({ id: row.id, isApproved: e.target.checked })}
                />
              ),
            },
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
