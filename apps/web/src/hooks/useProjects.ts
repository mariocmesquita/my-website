import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  createProject,
  type CreateProjectInput,
  deleteProject,
  getProjectsAdmin,
  getProjectTranslation,
  type ProjectAdmin,
  type ProjectTranslation,
  updateProject,
  type UpdateProjectInput,
  upsertProjectTranslation,
  type UpsertProjectTranslationInput,
} from '@/http/project';
import { useAuth } from '@/server/firebase';

export const PROJECTS_QUERY_KEY = ['projects', 'admin'] as const;

export function useProjectsAdmin() {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: PROJECTS_QUERY_KEY,
    queryFn: async () => {
      const token = await getToken();
      return getProjectsAdmin(token);
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreateProject() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateProjectInput): Promise<ProjectAdmin> => {
      const token = await getToken();
      return createProject(token, data);
    },
    onSuccess: (created) => {
      queryClient.setQueryData<ProjectAdmin[]>(PROJECTS_QUERY_KEY, (prev = []) => [
        created,
        ...prev,
      ]);
      toast.success('Projeto criado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message ?? 'Erro ao criar projeto.');
    },
  });
}

export function useUpdateProject() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateProjectInput;
    }): Promise<ProjectAdmin> => {
      const token = await getToken();
      return updateProject(token, id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY });
      toast.success('Projeto atualizado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message ?? 'Erro ao atualizar projeto.');
    },
  });
}

export function useDeleteProject() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const token = await getToken();
      return deleteProject(token, id);
    },
    onSuccess: (_, id) => {
      queryClient.setQueryData<ProjectAdmin[]>(PROJECTS_QUERY_KEY, (prev = []) =>
        prev.filter((p) => p.id !== id),
      );
      toast.success('Projeto removido com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message ?? 'Erro ao remover projeto.');
    },
  });
}

export function useProjectTranslation(id: string, locale: string) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ['projects', id, 'translation', locale],
    queryFn: async (): Promise<ProjectTranslation | null> => {
      const token = await getToken();
      return getProjectTranslation(token, id, locale);
    },
    enabled: !!id && locale !== 'en',
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpsertProjectTranslation() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      locale,
      data,
    }: {
      id: string;
      locale: string;
      data: UpsertProjectTranslationInput;
    }): Promise<ProjectTranslation> => {
      const token = await getToken();
      return upsertProjectTranslation(token, id, locale, data);
    },
    onSuccess: (updated, { id, locale }) => {
      queryClient.setQueryData(['projects', id, 'translation', locale], updated);
      toast.success('Tradução salva com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message ?? 'Erro ao salvar tradução.');
    },
  });
}
