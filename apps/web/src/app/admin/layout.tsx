import { type ReactNode } from 'react';

import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { getSession } from '@/server/session';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AdminSidebar email={session.email ?? null} />
      <main className="flex flex-1 flex-col overflow-hidden">
        <AdminBreadcrumb />
        <div className="flex-1 overflow-auto p-6">{children}</div>
      </main>
    </div>
  );
}
