import { useQuery } from '@tanstack/react-query';

import { getLogs } from '@/http/log';
import { useAuth } from '@/server/firebase';

export const LOGS_QUERY_KEY = ['logs'] as const;

export function useLogs(page: number = 1, limit: number = 50) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: [...LOGS_QUERY_KEY, page, limit],
    queryFn: async () => {
      const token = await getToken();
      return getLogs(token, page, limit);
    },
    staleTime: 30_000,
    gcTime: 60_000,
    refetchInterval: 30_000,
  });
}
