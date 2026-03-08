'use client';

import { UpsertProjectTranslationSchema } from '@my-website/schemas/project';
import { useEffect } from 'react';
import { FormProvider } from 'react-hook-form';

import { FormButton } from '@/components/form/FormButton';
import { FormField } from '@/components/form/FormField';
import { FormTextarea } from '@/components/form/FormTextarea';
import { useProjectTranslation, useUpsertProjectTranslation } from '@/hooks/useProjects';
import { useZodForm } from '@/hooks/useZodForm';
import { type UpsertProjectTranslationInput } from '@/http/project';

interface ProjectsTranslationFormProps {
  projectId: string;
  onSuccess: () => void;
}

export function ProjectsTranslationForm({ projectId, onSuccess }: ProjectsTranslationFormProps) {
  const { data: translation, isLoading } = useProjectTranslation(projectId, 'pt');
  const { mutate: upsert, isPending } = useUpsertProjectTranslation();

  const methods = useZodForm<UpsertProjectTranslationInput>(UpsertProjectTranslationSchema, {
    defaultValues: { title: '', summary: '', description: '' },
    mode: 'onChange',
  });

  useEffect(() => {
    if (translation) {
      methods.reset({
        title: translation.title,
        summary: translation.summary,
        description: translation.description,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [translation]);

  const handleSubmit = (values: UpsertProjectTranslationInput) => {
    upsert({ id: projectId, locale: 'pt', data: values }, { onSuccess });
  };

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Carregando tradução...</p>;
  }

  return (
    <FormProvider {...methods}>
      <p className="mb-4 text-xs text-muted-foreground">
        Campos em <strong>Português</strong>. Tecnologias, links, datas e imagens são compartilhados
        entre idiomas.
      </p>
      <form
        onSubmit={methods.handleSubmit(handleSubmit)}
        className="flex flex-col gap-4"
        noValidate
      >
        <FormField name="title" label="Título" placeholder="Ex: meu-website" maxLength={200} />
        <FormField
          name="summary"
          label="Resumo"
          placeholder="Breve descrição em português (máx. 300 caracteres)"
          maxLength={300}
        />
        <FormTextarea
          name="description"
          label="Descrição completa"
          hint="Formatação preservada"
          placeholder={
            'Descreva o projeto em detalhes...\n\n- Funcionalidade 1\n- Funcionalidade 2'
          }
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
