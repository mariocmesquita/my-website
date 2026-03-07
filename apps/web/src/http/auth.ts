export async function postSession(idToken: string): Promise<void> {
  const response = await fetch('/api/auth/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    const message = (data as { message?: string }).message ?? 'Erro ao criar sessão.';
    throw new Error(message);
  }
}

export async function deleteSession(): Promise<void> {
  const response = await fetch('/api/auth/session', { method: 'DELETE' });

  if (!response.ok) {
    throw new Error('Erro ao encerrar sessão.');
  }
}
