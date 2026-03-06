import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  createPost,
  type CreatePostInput,
  deletePost,
  getPostAdmin,
  getPostsAdmin,
  type PostAdmin,
  updatePost,
  type UpdatePostInput,
} from '@/http/post';
import { useAuth } from '@/lib/firebase';

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
