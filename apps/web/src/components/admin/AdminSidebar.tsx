'use client';

import {
  Briefcase,
  ChevronLeft,
  ChevronRight,
  FileText,
  FolderOpen,
  LayoutDashboard,
  User,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { SidebarNavItem } from './SidebarNavItem';
import { SidebarProfile } from './SidebarProfile';

interface AdminSidebarProps {
  email: string | null;
}

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/career', label: 'Carreira', icon: Briefcase },
  { href: '/projects', label: 'Projetos', icon: FolderOpen },
  { href: '/posts', label: 'Posts', icon: FileText },
  { href: '/profile', label: 'Perfil', icon: User },
] as const;

export function AdminSidebar({ email }: AdminSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={`relative flex flex-col bg-brand transition-all duration-300 ease-in-out ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Header */}
      <div
        className={`flex h-16 shrink-0 items-center border-b border-brand-foreground/10 px-4 ${
          collapsed ? 'justify-center' : 'gap-2'
        }`}
      >
        <LayoutDashboard className="shrink-0 text-brand-foreground" size={20} />
        {!collapsed && (
          <span className="font-spectral truncate text-lg font-bold text-brand-foreground">
            Painel
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav
        className={`flex-1 space-y-0.5 px-2 py-4 ${collapsed ? 'overflow-visible' : 'overflow-y-auto'}`}
      >
        {navItems.map(({ href, label, icon }) => (
          <SidebarNavItem
            key={href}
            href={href}
            label={label}
            icon={icon}
            collapsed={collapsed}
            active={isActive(href)}
          />
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-brand-foreground/10 px-2 py-2">
        <button
          onClick={() => setCollapsed((c) => !c)}
          className={`group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-brand-foreground/60 transition-all duration-150 hover:bg-brand-foreground/10 hover:text-brand-foreground ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!collapsed && <span>Recolher</span>}
          {collapsed && (
            <span className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 whitespace-nowrap rounded bg-foreground px-2 py-1 text-xs text-background opacity-0 transition-opacity group-hover:opacity-100">
              Expandir
            </span>
          )}
        </button>
      </div>

      <SidebarProfile email={email} collapsed={collapsed} />
    </aside>
  );
}
