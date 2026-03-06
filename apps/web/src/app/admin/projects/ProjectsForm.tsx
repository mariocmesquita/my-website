'use client';

import { CreateProjectSchema } from '@my-website/schemas/project';
import { useEffect } from 'react';
import { FormProvider } from 'react-hook-form';

import { FormButton } from '@/components/form/FormButton';
import { FormDatePicker } from '@/components/form/FormDatePicker';
import { FormField } from '@/components/form/FormField';
import { FormSwitch } from '@/components/form/FormSwitch';
import { FormTextarea } from '@/components/form/FormTextarea';
import { useZodForm } from '@/hooks/useZodForm';
import { type PostAdmin } from '@/http/post';
import { type CreateProjectInput, type ProjectAdmin } from '@/http/project';

import { BannerImageField } from './BannerImageField';
import { RelatedPostsField } from './RelatedPostsField';
import { ScreenshotsField } from './ScreenshotsField';
import { TechStackField } from './TechStackField';

interface ProjectsFormProps {
  project?: ProjectAdmin;
  posts: PostAdmin[];
  isSubmitting: boolean;
  onSubmit: (values: CreateProjectInput) => void;
}

function toDateInput(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  return dateStr.split('T')[0] ?? '';
}

function toFormValues(project?: ProjectAdmin): CreateProjectInput {
  return {
    title: project?.title ?? '',
    summary: project?.summary ?? '',
    description: project?.description ?? '',
    techStack: project?.techStack ?? [],
    bannerImage: project?.bannerImage ?? null,
    screenshots: project?.screenshots ?? [],
    githubLink: project?.githubLink ?? '',
    publishDate: toDateInput(project?.publishDate),
    archived: project?.archived ?? false,
    relatedPostIds: project?.relatedPostIds ?? [],
  };
}

export function ProjectsForm({ project, posts, isSubmitting, onSubmit }: ProjectsFormProps) {
  const methods = useZodForm<CreateProjectInput>(CreateProjectSchema, {
    defaultValues: toFormValues(project),
    mode: 'onChange',
  });

  useEffect(() => {
    methods.reset(toFormValues(project));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        <FormField name="title" label="Título" placeholder="Ex: my-website" maxLength={200} />

        <FormField
          name="summary"
          label="Resumo"
          placeholder="Breve descrição para cards e tabelas (máx. 300 caracteres)"
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

        <TechStackField name="techStack" label="Tecnologias" />

        <FormField
          name="githubLink"
          label="Link do GitHub"
          placeholder="https://github.com/usuario/repositorio"
          type="url"
        />

        <FormDatePicker
          name="publishDate"
          label="Data de publicação"
          hint="Projetos com data futura ficam agendados"
          toYear={new Date().getFullYear() + 5}
        />

        <FormSwitch
          name="archived"
          label="Arquivado"
          hint="Projetos arquivados não aparecem em páginas públicas"
        />

        <BannerImageField name="bannerImage" label="Imagem de capa" />

        <ScreenshotsField name="screenshots" label="Screenshots" />

        <RelatedPostsField name="relatedPostIds" posts={posts} />

        <div className="pt-2">
          <FormButton disabled={isSubmitting} loadingText="Salvando...">
            {project ? 'Salvar alterações' : 'Criar projeto'}
          </FormButton>
        </div>
      </form>
    </FormProvider>
  );
}
