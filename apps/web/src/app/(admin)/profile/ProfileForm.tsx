'use client';

import { UpdateProfileSchema } from '@my-website/schemas/profile';
import { useEffect } from 'react';
import { FormProvider } from 'react-hook-form';

import { FormButton } from '@/components/form/FormButton';
import { FormField } from '@/components/form/FormField';
import { FormTextarea } from '@/components/form/FormTextarea';
import { useZodForm } from '@/hooks/useZodForm';
import { type UpdateProfileInput } from '@/http/profile';

import { ProfileSocialLinksFields } from './ProfileSocialLinksFields';

interface ProfileFormProps {
  defaultValues: UpdateProfileInput;
  isSubmitting: boolean;
  onSubmit: (values: UpdateProfileInput) => void;
}

export function ProfileForm({ defaultValues, isSubmitting, onSubmit }: ProfileFormProps) {
  const methods = useZodForm<UpdateProfileInput>(UpdateProfileSchema, {
    defaultValues,
    mode: 'onChange',
  });

  useEffect(() => {
    methods.reset(defaultValues);
  }, [defaultValues, methods]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
        <FormField name="name" label="Nome" placeholder="Seu nome completo" maxLength={50} />
        <FormField
          name="position"
          label="Cargo"
          placeholder="Ex: Engenheiro de Software"
          maxLength={50}
        />
        <FormTextarea
          name="description"
          label="Descrição curta"
          hint="Máx. 130 caracteres"
          placeholder="Uma frase sobre você"
          maxLength={130}
          rows={2}
        />
        <FormTextarea
          name="bio"
          label="Bio"
          hint="Máx. 1000 caracteres"
          placeholder="Sua biografia completa"
          maxLength={1000}
          rows={6}
        />
        <FormField
          name="email"
          label="E-mail"
          type="email"
          placeholder="seu@email.com"
          maxLength={50}
        />
        <ProfileSocialLinksFields />
        <div className="pt-2">
          <FormButton disabled={isSubmitting} loadingText="Salvando...">
            Salvar alterações
          </FormButton>
        </div>
      </form>
    </FormProvider>
  );
}
