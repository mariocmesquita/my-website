import { Suspense } from 'react';

import { SignInForm } from './SignInForm';

function SignInFormSkeleton() {
  return (
    <div className="flex flex-col gap-4 animate-pulse">
      <div className="h-10 bg-muted rounded-lg" />
      <div className="h-10 bg-muted rounded-lg" />
      <div className="h-10 bg-muted rounded-lg" />
    </div>
  );
}

export default function SignInPage() {
  return (
    <div className="w-full max-w-sm">
      <h1 className="font-spectral text-2xl font-bold text-foreground mb-6 text-center">Entrar</h1>
      <Suspense fallback={<SignInFormSkeleton />}>
        <SignInForm />
      </Suspense>
    </div>
  );
}
