import { type LucideIcon } from 'lucide-react';
import Link from 'next/link';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

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
  const link = (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
        collapsed ? 'justify-center' : ''
      } ${
        active
          ? 'bg-brand-foreground/15 text-brand-foreground'
          : 'text-brand-foreground/60 hover:bg-brand-foreground/10 hover:text-brand-foreground'
      }`}
    >
      <Icon size={18} className="shrink-0" />
      {!collapsed && <span className="truncate">{label}</span>}
    </Link>
  );

  if (!collapsed) return link;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right" sideOffset={8}>
        {label}
      </TooltipContent>
    </Tooltip>
  );
}
