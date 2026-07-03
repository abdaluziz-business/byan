import { useQuery } from '@tanstack/react-query';
import { Booking, ContactMessage, Service } from '@bayan/shared';
import { Card } from '@/admin/components/Card';
import { useCurrentSite } from '@/admin/components/useCurrentSite';
import { useI18n } from '@/i18n/i18nContext';
import { api } from '@/lib/api';

export function DashboardPage() {
  const { t } = useI18n();
  const { site } = useCurrentSite();

  const servicesQuery = useQuery({
    queryKey: ['services', site?.id],
    queryFn: async () => (await api.get<Service[]>(`/sites/${site!.id}/services`)).data,
    enabled: Boolean(site),
  });

  const bookingsQuery = useQuery({
    queryKey: ['bookings', site?.id],
    queryFn: async () => (await api.get<Booking[]>(`/sites/${site!.id}/bookings`)).data,
    enabled: Boolean(site),
  });

  const messagesQuery = useQuery({
    queryKey: ['contact-messages', site?.id],
    queryFn: async () => (await api.get<ContactMessage[]>(`/sites/${site!.id}/contact`)).data,
    enabled: Boolean(site),
  });

  const stats = [
    { label: t.admin.services, value: servicesQuery.data?.length ?? 0 },
    { label: t.admin.bookings, value: bookingsQuery.data?.length ?? 0 },
    { label: t.admin.contactMessages, value: messagesQuery.data?.length ?? 0 },
  ];

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-bold text-[#111111]">{t.admin.dashboard}</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <p className="text-sm text-neutral-500">{stat.label}</p>
            <p className="mt-2 font-heading text-3xl font-bold text-[#111111]">{stat.value}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
