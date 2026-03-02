'use client';

import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { deleteSession } from '@/http/auth';
import { firebaseAuth } from '@/lib/firebase';

export function SignOutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await signOut(firebaseAuth);
      await deleteSession();
      toast.success('Logout realizado com sucesso!');
      router.push('/auth/sign-in');
      router.refresh();
    } catch {
      toast.error('Erro ao fazer logout. Tente novamente.');
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={isLoading}
      className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60 transition"
    >
      {isLoading ? 'Saindo...' : 'Sair'}
    </button>
  );
}
