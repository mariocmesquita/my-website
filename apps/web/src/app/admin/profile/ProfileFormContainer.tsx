'use client';

import { useMemo, useState } from 'react';

import { LocaleToggle } from '@/components/admin/LocaleToggle';
import { OtherLocaleDialog } from '@/components/admin/OtherLocaleDialog';
import { useProfile, useUpdateProfile } from '@/hooks/useProfile';
import { type UpdateProfileInput } from '@/http/profile';

import { ProfileForm } from './ProfileForm';
import { ProfileReviewDialog } from './ProfileReviewDialog';
import { ProfileTranslationForm } from './ProfileTranslationForm';

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
  const [locale, setLocale] = useState<'en' | 'pt'>('en');
  const [showLocaleDialog, setShowLocaleDialog] = useState(false);

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
      onSuccess: () => {
        setPendingValues(null);
        setShowLocaleDialog(true);
      },
      onError: () => setPendingValues(null),
    });
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">
          {locale === 'en' ? 'Editando perfil em Inglês' : 'Editando perfil em Português'}
        </p>
        <LocaleToggle locale={locale} onChange={setLocale} disabled={!profile || isPending} />
      </div>

      {locale === 'pt' && profile ? (
        <ProfileTranslationForm onSuccess={() => setShowLocaleDialog(true)} />
      ) : (
        <ProfileForm
          defaultValues={defaultValues}
          isSubmitting={isPending}
          onSubmit={handleSubmitRequest}
        />
      )}

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

      <OtherLocaleDialog
        open={showLocaleDialog}
        savedLocale={locale}
        onConfirm={() => {
          setShowLocaleDialog(false);
          setLocale(locale === 'en' ? 'pt' : 'en');
        }}
        onDismiss={() => setShowLocaleDialog(false)}
      />
    </>
  );
}
