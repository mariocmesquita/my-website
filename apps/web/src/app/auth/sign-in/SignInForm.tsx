'use client';

import { signInWithEmailAndPassword } from 'firebase/auth';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { FormButton } from '@/components/form/FormButton';
import { FormError } from '@/components/form/FormError';
import { FormField } from '@/components/form/FormField';
import { useZodForm } from '@/hooks/useZodForm';
import { postSession } from '@/http/auth';
import { firebaseAuth } from '@/server/firebase';

const signInSchema = z.object({
  email: z.string().min(1, 'E-mail é obrigatório.').email('E-mail inválido.'),
  password: z.string().min(1, 'Senha é obrigatória.'),
});

type SignInValues = z.infer<typeof signInSchema>;

function resolveFirebaseError(code: string): string {
  const messages: Record<string, string> = {
    'auth/user-not-found': 'Usuário não encontrado.',
    'auth/wrong-password': 'Senha incorreta.',
    'auth/invalid-credential': 'Credenciais inválidas.',
    'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde.',
    'auth/network-request-failed': 'Falha de rede. Verifique sua conexão.',
  };
  return messages[code] ?? 'Erro ao entrar. Tente novamente.';
}

export function SignInForm() {
  const searchParams = useSearchParams();
  const rawNext = searchParams.get('next') ?? '/admin/dashboard';
  const next = rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/admin/dashboard';
  const [generalError, setGeneralError] = useState<string | null>(null);

  const methods = useZodForm<SignInValues>(signInSchema);

  const onSubmit = async (values: SignInValues): Promise<void> => {
    try {
      setGeneralError(null);
      const credential = await signInWithEmailAndPassword(
        firebaseAuth,
        values.email,
        values.password,
      );

      const idToken = await credential.user.getIdToken();
      await postSession(idToken);

      toast.success('Login realizado com sucesso!');
      window.location.replace(next);
    } catch (error) {
      const code = (error as { code?: string }).code ?? '';
      const message = resolveFirebaseError(code);

      if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        methods.setError('password', { message });
      } else {
        setGeneralError(message);
      }
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        {generalError && <FormError message={generalError} />}

        <FormField
          name="email"
          label="E-mail"
          type="email"
          autoComplete="email"
          placeholder="seu@email.com"
        />

        <FormField
          name="password"
          label="Senha"
          type="password"
          autoComplete="current-password"
          placeholder="Sua senha"
        />

        <FormButton loadingText="Entrando...">Entrar</FormButton>
      </form>
    </FormProvider>
  );
}
