'use client';

import { signOut } from 'firebase/auth';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { deleteSession } from '@/http/auth';
import { firebaseAuth } from '@/lib/firebase';

interface SidebarProfileProps {
  email: string | null;
  collapsed: boolean;
}

export function SidebarProfile({ email, collapsed }: SidebarProfileProps) {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [dropdownOpen]);

  const handleSignOut = async () => {
    try {
      setIsLoggingOut(true);
      await signOut(firebaseAuth);
      await deleteSession();
      toast.success('Logout realizado com sucesso!');
      router.push('/auth/sign-in');
      router.refresh();
    } catch {
      toast.error('Erro ao fazer logout. Tente novamente.');
      setIsLoggingOut(false);
    }
  };

  const avatarLetter = email?.[0]?.toUpperCase() ?? 'U';

  return (
    <div className="relative border-t border-brand-foreground/10 px-2 py-3" ref={profileRef}>
      <button
        onClick={() => setDropdownOpen((o) => !o)}
        className={`group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-150 hover:bg-brand-foreground/10 ${
          collapsed ? 'justify-center' : ''
        }`}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-foreground/20 text-xs font-semibold text-brand-foreground">
          {avatarLetter}
        </div>
        {!collapsed && (
          <div className="min-w-0 flex-1 text-left">
            <p className="truncate text-xs font-medium text-brand-foreground">
              {email ?? 'Usuário'}
            </p>
          </div>
        )}
        {collapsed && (
          <span className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 max-w-[160px] truncate whitespace-nowrap rounded bg-foreground px-2 py-1 text-xs text-background opacity-0 transition-opacity group-hover:opacity-100">
            {email ?? 'Usuário'}
          </span>
        )}
      </button>

      {dropdownOpen && (
        <div className="absolute bottom-3 left-full z-50 ml-2 w-44 rounded-lg border border-brand-foreground/20 bg-brand py-1 shadow-lg">
          <button
            onClick={handleSignOut}
            disabled={isLoggingOut}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-brand-foreground/80 transition-colors hover:bg-brand-foreground/10 hover:text-brand-foreground disabled:opacity-60"
          >
            <LogOut size={16} />
            {isLoggingOut ? 'Saindo...' : 'Sair'}
          </button>
        </div>
      )}
    </div>
  );
}
