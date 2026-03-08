'use client';

import { usePathname } from 'next/navigation';

const ROUTE_LABELS: Record<string, string> = {
  admin: 'Admin',
  dashboard: 'Dashboard',
  career: 'Carreira',
  projects: 'Projetos',
  posts: 'Posts',
  profile: 'Perfil',
  new: 'Novo',
  edit: 'Editar',
};

export function AdminBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  const crumbs = segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/');
    const label = ROUTE_LABELS[segment] ?? segment;
    return { href, label };
  });

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex shrink-0 items-center gap-1.5 border-b border-border px-6 py-4 text-sm"
    >
      {crumbs.map(({ href, label }, index) => (
        <span key={href} className="flex items-center gap-1.5">
          {index > 0 && <span className="text-muted-foreground">/</span>}
          <span className="font-medium text-foreground">{label}</span>
        </span>
      ))}
    </nav>
  );
}
