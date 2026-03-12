'use client';

import { CreateCareerSchema } from '@my-website/schemas/career';
import { useEffect } from 'react';
import { FormProvider } from 'react-hook-form';

import { FormButton } from '@/components/form/FormButton';
import { FormField } from '@/components/form/FormField';
import { FormMonthYearInput } from '@/components/form/FormMonthYearInput';
import { FormTextarea } from '@/components/form/FormTextarea';
import { useZodForm } from '@/hooks/useZodForm';
import { type Career, type CreateCareerInput } from '@/http/career';

interface CareerFormProps {
  career?: Career;
  isSubmitting: boolean;
  onSubmit: (values: CreateCareerInput) => void;
}

function toDateInput(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  return dateStr.split('T')[0] ?? '';
}

function toFormValues(career?: Career): CreateCareerInput {
  return {
    company: career?.company ?? '',
    role: career?.role ?? '',
    startDate: toDateInput(career?.startDate),
    endDate: toDateInput(career?.endDate),
    content: career?.content ?? '',
  };
}

export function CareerForm({ career, isSubmitting, onSubmit }: CareerFormProps) {
  const methods = useZodForm<CreateCareerInput>(CreateCareerSchema, {
    defaultValues: toFormValues(career),
    mode: 'onChange',
  });

  useEffect(() => {
    methods.reset(toFormValues(career));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [career]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        <FormField name="company" label="Empresa" placeholder="Ex: Acme Inc." maxLength={100} />
        <FormField name="role" label="Cargo" placeholder="Ex: Tech Lead" maxLength={100} />
        <div className="grid grid-cols-2 gap-4">
          <FormMonthYearInput name="startDate" label="Início" />
          <FormMonthYearInput
            name="endDate"
            label="Fim"
            hint="Em branco = emprego atual"
            nullable
          />
        </div>
        <FormTextarea
          name="content"
          label="Conteúdo"
          hint="Formatação preservada — traços, quebras de linha, etc."
          placeholder={'Breve intro sobre o cargo\n\n- Conquista 1\n- Conquista 2'}
          rows={10}
        />
        <div className="pt-2">
          <FormButton disabled={isSubmitting} loadingText="Salvando...">
            {career ? 'Salvar alterações' : 'Criar entrada'}
          </FormButton>
        </div>
      </form>
    </FormProvider>
  );
}
