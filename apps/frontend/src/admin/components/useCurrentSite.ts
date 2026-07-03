import { useQuery } from '@tanstack/react-query';
import { Site } from '@bayan/shared';
import { api } from '@/lib/api';

/**
 * Bayan currently gives each client a single site (created at registration).
 * This resolves it once so admin pages can operate on `siteId` directly
 * instead of each re-fetching the client's site list.
 */
export function useCurrentSite() {
  const query = useQuery({
    queryKey: ['sites'],
    queryFn: async () => {
      const response = await api.get<Site[]>('/sites');
      return response.data;
    },
  });

  return {
    site: query.data?.[0],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
