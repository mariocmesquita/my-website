'use client';

import { useMemo, useState } from 'react';

import { useProfile, useUpdateProfile } from '@/hooks/useProfile';
import { type UpdateProfileInput } from '@/http/profile';

import { ProfileForm } from './ProfileForm';
import { ProfileReviewDialog } from './ProfileReviewDialog';

const emptyDefaults: UpdateProfileInput = {
  name: '',
  position: '',
  description: '',
  bio: '',
  email: '',
  socialLinks: { github: '', linkedin: '', instagram: '', youtube: '' },
};

export function ProfileFormContainer() {
  const { data: profile, isLoading, isError } = useProfile();
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const [pendingValues, setPendingValues] = useState<UpdateProfileInput | null>(null);

  const defaultValues = useMemo<UpdateProfileInput>(
    () =>
      profile
        ? {
            name: profile.name,
            position: profile.position,
            description: profile.description,
            bio: profile.bio,
            email: profile.email,
            socialLinks: profile.socialLinks,
          }
        : emptyDefaults,
    [profile],
  );

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Carregando perfil...</p>;
  }

  if (isError) {
    return (
      <p className="text-sm text-destructive">
        Erro ao carregar o perfil. Tente recarregar a página.
      </p>
    );
  }

  const handleSubmitRequest = (values: UpdateProfileInput) => {
    setPendingValues(values);
  };

  const handleConfirm = () => {
    if (!pendingValues) return;
    updateProfile(pendingValues, {
      onSettled: () => setPendingValues(null),
    });
  };

  return (
    <>
      <ProfileForm
        defaultValues={defaultValues}
        isSubmitting={isPending}
        onSubmit={handleSubmitRequest}
      />
      {pendingValues && (
        <ProfileReviewDialog
          open
          currentValues={profile ?? emptyDefaults}
          pendingValues={pendingValues}
          isLoading={isPending}
          onConfirm={handleConfirm}
          onOpenChange={(open) => !open && setPendingValues(null)}
        />
      )}
    </>
  );
}
