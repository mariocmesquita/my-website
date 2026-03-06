import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  type Career,
  createCareer,
  type CreateCareerInput,
  deleteCareer,
  getCareers,
  updateCareer,
  type UpdateCareerInput,
} from '@/http/career';
import { useAuth } from '@/server/firebase';

export const CAREER_QUERY_KEY = ['career'] as const;

export function useCareers() {
  return useQuery({
    queryKey: CAREER_QUERY_KEY,
    queryFn: getCareers,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreateCareer() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCareerInput): Promise<Career> => {
      const token = await getToken();
      return createCareer(token, data);
    },
    onSuccess: (created) => {
      queryClient.setQueryData<Career[]>(CAREER_QUERY_KEY, (prev = []) => [created, ...prev]);
      toast.success('Carreira criada com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message ?? 'Erro ao criar carreira.');
    },
  });
}

export function useUpdateCareer() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateCareerInput }): Promise<Career> => {
      const token = await getToken();
      return updateCareer(token, id, data);
    },
    onSuccess: (updated) => {
      queryClient.setQueryData<Career[]>(CAREER_QUERY_KEY, (prev = []) =>
        prev.map((c) => (c.id === updated.id ? updated : c)),
      );
      toast.success('Carreira atualizada com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message ?? 'Erro ao atualizar carreira.');
    },
  });
}

export function useDeleteCareer() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const token = await getToken();
      return deleteCareer(token, id);
    },
    onSuccess: (_, id) => {
      queryClient.setQueryData<Career[]>(CAREER_QUERY_KEY, (prev = []) =>
        prev.filter((c) => c.id !== id),
      );
      toast.success('Carreira removida com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message ?? 'Erro ao remover carreira.');
    },
  });
}
