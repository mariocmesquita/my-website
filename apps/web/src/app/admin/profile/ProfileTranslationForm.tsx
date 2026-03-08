'use client';

import { UpsertProfileTranslationSchema } from '@my-website/schemas/profile';
import { useEffect } from 'react';
import { FormProvider } from 'react-hook-form';

import { FormButton } from '@/components/form/FormButton';
import { FormField } from '@/components/form/FormField';
import { FormTextarea } from '@/components/form/FormTextarea';
import { useProfileTranslation, useUpsertProfileTranslation } from '@/hooks/useProfile';
import { useZodForm } from '@/hooks/useZodForm';
import { type UpsertProfileTranslationInput } from '@/http/profile';

interface ProfileTranslationFormProps {
  onSuccess: () => void;
}

export function ProfileTranslationForm({ onSuccess }: ProfileTranslationFormProps) {
  const { data: translation, isLoading } = useProfileTranslation('pt');
  const { mutate: upsert, isPending } = useUpsertProfileTranslation();

  const methods = useZodForm<UpsertProfileTranslationInput>(UpsertProfileTranslationSchema, {
    defaultValues: { position: '', description: '', bio: '' },
    mode: 'onChange',
  });

  useEffect(() => {
    if (translation) {
      methods.reset({
        position: translation.position,
        description: translation.description,
        bio: translation.bio,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [translation]);

  const handleSubmit = (values: UpsertProfileTranslationInput) => {
    upsert({ locale: 'pt', data: values }, { onSuccess });
  };

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Carregando tradução...</p>;
  }

  return (
    <FormProvider {...methods}>
      <p className="mb-6 text-xs text-muted-foreground">
        Campos em <strong>Português</strong>. Nome, e-mail e redes sociais são compartilhados entre
        idiomas.
      </p>
      <form
        onSubmit={methods.handleSubmit(handleSubmit)}
        className="flex flex-col gap-4"
        noValidate
      >
        <FormField
          name="position"
          label="Cargo"
          placeholder="Ex: Desenvolvedor Full Stack"
          maxLength={50}
        />
        <FormField
          name="description"
          label="Descrição curta"
          placeholder="Ex: Desenvolvedor apaixonado por código limpo"
          maxLength={130}
        />
        <FormTextarea
          name="bio"
          label="Bio"
          placeholder="Fale sobre você em português..."
          rows={8}
        />
        <div className="pt-2">
          <FormButton disabled={isPending} loadingText="Salvando...">
            Salvar tradução
          </FormButton>
        </div>
      </form>
    </FormProvider>
  );
}
