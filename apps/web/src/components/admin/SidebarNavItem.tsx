import { type LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface SidebarNavItemProps {
  href: string;
  label: string;
  icon: LucideIcon;
  collapsed: boolean;
  active: boolean;
}

export function SidebarNavItem({
  href,
  label,
  icon: Icon,
  collapsed,
  active,
}: SidebarNavItemProps) {
  return (
    <Link
      href={href}
      className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
        collapsed ? 'justify-center' : ''
      } ${
        active
          ? 'bg-brand-foreground/15 text-brand-foreground'
          : 'text-brand-foreground/60 hover:bg-brand-foreground/10 hover:text-brand-foreground'
      }`}
    >
      <Icon size={18} className="shrink-0" />
      {!collapsed && <span className="truncate">{label}</span>}
      {collapsed && (
        <span className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 whitespace-nowrap rounded bg-foreground px-2 py-1 text-xs text-background opacity-0 transition-opacity group-hover:opacity-100">
          {label}
        </span>
      )}
    </Link>
  );
}
