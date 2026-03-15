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

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { SidebarNavItem } from './SidebarNavItem';
import { SidebarProfile } from './SidebarProfile';

interface AdminSidebarProps {
  email: string | null;
}

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/career', label: 'Carreira', icon: Briefcase },
  { href: '/admin/projects', label: 'Projetos', icon: FolderOpen },
  { href: '/admin/posts', label: 'Posts', icon: FileText },
  { href: '/admin/profile', label: 'Perfil', icon: User },
] as const;

export function AdminSidebar({ email }: AdminSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') return pathname === '/admin/dashboard';
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
        {collapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setCollapsed(false)}
                className="flex w-full items-center justify-center gap-3 rounded-lg px-3 py-2.5 text-sm text-brand-foreground/60 transition-all duration-150 hover:bg-brand-foreground/10 hover:text-brand-foreground"
              >
                <ChevronRight size={18} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={8}>
              Expandir
            </TooltipContent>
          </Tooltip>
        ) : (
          <button
            onClick={() => setCollapsed(true)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-brand-foreground/60 transition-all duration-150 hover:bg-brand-foreground/10 hover:text-brand-foreground"
          >
            <ChevronLeft size={18} />
            <span>Recolher</span>
          </button>
        )}
      </div>

      <SidebarProfile email={email} collapsed={collapsed} />
    </aside>
  );
}
