import { useQuery } from '@tanstack/react-query';
import { ContactMessage } from '@bayan/shared';
import { Card } from '@/admin/components/Card';
import { DataTable } from '@/admin/components/DataTable';
import { useCurrentSite } from '@/admin/components/useCurrentSite';
import { useI18n } from '@/i18n/i18nContext';
import { api } from '@/lib/api';

export function ContactMessagesPage() {
  const { t } = useI18n();
  const { site } = useCurrentSite();

  const messagesQuery = useQuery({
    queryKey: ['contact-messages', site?.id],
    queryFn: async () => (await api.get<ContactMessage[]>(`/sites/${site!.id}/contact`)).data,
    enabled: Boolean(site),
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-bold text-[#111111]">{t.admin.contactMessages}</h1>
      <Card>
        <DataTable
          rows={messagesQuery.data ?? []}
          rowKey={(row) => row.id}
          columns={[
            { header: 'Name', render: (row) => row.name },
            { header: 'Email', render: (row) => row.email },
            { header: 'Phone', render: (row) => row.phone ?? '-' },
            { header: 'Message', render: (row) => row.message },
            { header: 'Date', render: (row) => new Date(row.createdAt).toLocaleString() },
          ]}
        />
      </Card>
    </div>
  );
}
