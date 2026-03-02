import type { ReactNode } from 'react';

export default function SignInLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      {children}
    </div>
  );
}
