import { getSession } from '@/server/session';

export default async function DashboardPage() {
  const session = await getSession();

  return (
    <div className="max-w-2xl">
      <h1 className="font-spectral mb-2 text-3xl font-bold text-foreground">Dashboard</h1>
      <p className="mb-8 text-foreground">
        Bem-vindo, <span className="font-semibold">{session?.email ?? session?.uid}</span>!
      </p>

      <div className="rounded-lg border border-input bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Informações da Sessão</h2>
        <dl className="space-y-2 text-sm text-foreground">
          <div>
            <dt className="font-medium">UID:</dt>
            <dd className="break-all text-muted-foreground">{session?.uid}</dd>
          </div>
          <div>
            <dt className="font-medium">E-mail:</dt>
            <dd className="text-muted-foreground">{session?.email ?? 'Não fornecido'}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
