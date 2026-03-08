'use client';

import { UpsertCareerTranslationSchema } from '@my-website/schemas/career';
import { useEffect } from 'react';
import { FormProvider } from 'react-hook-form';

import { FormButton } from '@/components/form/FormButton';
import { FormField } from '@/components/form/FormField';
import { FormTextarea } from '@/components/form/FormTextarea';
import { useCareerTranslation, useUpsertCareerTranslation } from '@/hooks/useCareer';
import { useZodForm } from '@/hooks/useZodForm';
import { type UpsertCareerTranslationInput } from '@/http/career';

interface CareerTranslationFormProps {
  careerId: string;
  onSuccess: () => void;
}

export function CareerTranslationForm({ careerId, onSuccess }: CareerTranslationFormProps) {
  const { data: translation, isLoading } = useCareerTranslation(careerId, 'pt');
  const { mutate: upsert, isPending } = useUpsertCareerTranslation();

  const methods = useZodForm<UpsertCareerTranslationInput>(UpsertCareerTranslationSchema, {
    defaultValues: { role: '', content: '' },
    mode: 'onChange',
  });

  useEffect(() => {
    if (translation) {
      methods.reset({ role: translation.role, content: translation.content });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [translation]);

  const handleSubmit = (values: UpsertCareerTranslationInput) => {
    upsert({ id: careerId, locale: 'pt', data: values }, { onSuccess });
  };

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Carregando tradução...</p>;
  }

  return (
    <FormProvider {...methods}>
      <p className="mb-4 text-xs text-muted-foreground">
        Campos em <strong>Português</strong>. Empresa e datas são compartilhados entre idiomas.
      </p>
      <form
        onSubmit={methods.handleSubmit(handleSubmit)}
        className="flex flex-col gap-4"
        noValidate
      >
        <FormField name="role" label="Cargo" placeholder="Ex: Líder Técnico" maxLength={100} />
        <FormTextarea
          name="content"
          label="Conteúdo"
          hint="Formatação preservada — traços, quebras de linha, etc."
          placeholder={'Breve intro sobre o cargo\n\n- Conquista 1\n- Conquista 2'}
          rows={10}
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
