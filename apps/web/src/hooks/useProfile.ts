import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  getProfile,
  getProfileTranslation,
  type Profile,
  type ProfileTranslation,
  updateProfile,
  type UpdateProfileInput,
  upsertProfileTranslation,
  type UpsertProfileTranslationInput,
} from '@/http/profile';
import { useAuth } from '@/server/firebase';

export const PROFILE_QUERY_KEY = ['profile'] as const;

export function useProfile() {
  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: getProfile,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useUpdateProfile() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfileInput): Promise<Profile> => {
      const token = await getToken();
      return updateProfile(token, data);
    },
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(PROFILE_QUERY_KEY, updatedProfile);
      toast.success('Perfil atualizado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message ?? 'Erro ao atualizar perfil.');
    },
  });
}

export function useProfileTranslation(locale: string) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ['profile', 'translation', locale],
    queryFn: async (): Promise<ProfileTranslation | null> => {
      const token = await getToken();
      return getProfileTranslation(token, locale);
    },
    enabled: locale !== 'en',
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpsertProfileTranslation() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      locale,
      data,
    }: {
      locale: string;
      data: UpsertProfileTranslationInput;
    }): Promise<ProfileTranslation> => {
      const token = await getToken();
      return upsertProfileTranslation(token, locale, data);
    },
    onSuccess: (updated, { locale }) => {
      queryClient.setQueryData(['profile', 'translation', locale], updated);
      toast.success('Tradução salva com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message ?? 'Erro ao salvar tradução.');
    },
  });
}
