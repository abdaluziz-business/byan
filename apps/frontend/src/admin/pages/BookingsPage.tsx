import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Booking, BookingStatus } from '@bayan/shared';
import { Button } from '@/admin/components/Button';
import { Card } from '@/admin/components/Card';
import { DataTable } from '@/admin/components/DataTable';
import { useCurrentSite } from '@/admin/components/useCurrentSite';
import { useI18n } from '@/i18n/i18nContext';
import { api } from '@/lib/api';

const STATUS_OPTIONS = Object.values(BookingStatus);

export function BookingsPage() {
  const { t } = useI18n();
  const { site } = useCurrentSite();
  const queryClient = useQueryClient();

  const bookingsQuery = useQuery({
    queryKey: ['bookings', site?.id],
    queryFn: async () => (await api.get<Booking[]>(`/sites/${site!.id}/bookings`)).data,
    enabled: Boolean(site),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: BookingStatus }) =>
      api.patch(`/bookings/${id}/status`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookings', site?.id] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/bookings/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookings', site?.id] }),
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-bold text-[#111111]">{t.admin.bookings}</h1>
      <Card>
        <DataTable
          rows={bookingsQuery.data ?? []}
          rowKey={(row) => row.id}
          columns={[
            { header: 'Client', render: (row) => `${row.clientName} (${row.clientEmail})` },
            { header: 'Date', render: (row) => `${new Date(row.date).toLocaleDateString()} ${row.time}` },
            {
              header: 'Status',
              render: (row) => (
                <select
                  value={row.status}
                  onChange={(e) =>
                    updateStatusMutation.mutate({ id: row.id, status: e.target.value as BookingStatus })
                  }
                  className="rounded-md border border-neutral-300 bg-white px-2 py-1 text-sm"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              ),
            },
            { header: 'Payment', render: (row) => row.paymentStatus },
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
