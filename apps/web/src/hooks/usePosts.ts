import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  createPost,
  type CreatePostInput,
  deletePost,
  getPostAdmin,
  getPostsAdmin,
  getPostTranslation,
  type PostAdmin,
  type PostTranslation,
  updatePost,
  type UpdatePostInput,
  upsertPostTranslation,
  type UpsertPostTranslationInput,
} from '@/http/post';
import { useAuth } from '@/server/firebase';

export const POSTS_QUERY_KEY = ['posts', 'admin'] as const;

export function usePostsAdmin() {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: POSTS_QUERY_KEY,
    queryFn: async () => {
      const token = await getToken();
      return getPostsAdmin(token);
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function usePostAdmin(id: string | undefined) {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ['posts', 'admin', id],
    queryFn: async () => {
      const token = await getToken();
      return getPostAdmin(token, id!);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreatePost() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePostInput): Promise<PostAdmin> => {
      const token = await getToken();
      return createPost(token, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEY });
      toast.success('Post criado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message ?? 'Erro ao criar post.');
    },
  });
}

export function useUpdatePost() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdatePostInput }): Promise<PostAdmin> => {
      const token = await getToken();
      return updatePost(token, id, data);
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEY });
      queryClient.setQueryData(['posts', 'admin', updated.id], updated);
      toast.success('Post atualizado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message ?? 'Erro ao atualizar post.');
    },
  });
}

export function useDeletePost() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const token = await getToken();
      return deletePost(token, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEY });
      toast.success('Post removido com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message ?? 'Erro ao remover post.');
    },
  });
}

export function usePostTranslation(id: string | undefined, locale: string) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ['posts', 'admin', id, 'translation', locale],
    queryFn: async (): Promise<PostTranslation | null> => {
      const token = await getToken();
      return getPostTranslation(token, id!, locale);
    },
    enabled: !!id && locale !== 'en',
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpsertPostTranslation() {
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
      data: UpsertPostTranslationInput;
    }): Promise<PostTranslation> => {
      const token = await getToken();
      return upsertPostTranslation(token, id, locale, data);
    },
    onSuccess: (updated, { id, locale }) => {
      queryClient.setQueryData(['posts', 'admin', id, 'translation', locale], updated);
      queryClient.invalidateQueries({ queryKey: ['posts', 'admin', id] });
      toast.success('Tradução salva com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message ?? 'Erro ao salvar tradução.');
    },
  });
}
