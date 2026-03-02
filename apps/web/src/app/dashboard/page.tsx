import { redirect } from 'next/navigation';

import { verifySession } from '@/lib/session';

import { SignOutButton } from './SignOutButton';

export default async function DashboardPage() {
  const session = await verifySession();

  if (!session) {
    redirect('/auth/sign-in');
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-spectral text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-foreground mb-8">
          Bem-vindo, <span className="font-semibold">{session.email || session.uid}</span>!
        </p>

        <div className="rounded-lg border border-input bg-card p-6 mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Informações da Sessão</h2>
          <dl className="space-y-2 text-sm text-foreground">
            <div>
              <dt className="font-medium">UID:</dt>
              <dd className="text-muted-foreground break-all">{session.uid}</dd>
            </div>
            <div>
              <dt className="font-medium">E-mail:</dt>
              <dd className="text-muted-foreground">{session.email || 'Não fornecido'}</dd>
            </div>
          </dl>
        </div>

        <SignOutButton />
      </div>
    </div>
  );
}
