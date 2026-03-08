import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';

import { LanguageSwitcher } from './LanguageSwitcher';

export function Navbar() {
  const t = useTranslations('nav');

  const NAV_ITEMS = [
    { labelKey: 'home' as const, href: '/' },
    { labelKey: 'projects' as const, href: '/projects' },
    { labelKey: 'blog' as const, href: '/blog' },
  ];

  return (
    <nav className="mt-5 mb-10">
      <div className="flex items-center gap-6 bg-brand h-11 px-6 rounded-xl font-sans w-full">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-[14px] text-brand-foreground hover:opacity-75 transition-opacity"
          >
            {t(item.labelKey)}
          </Link>
        ))}
        <div className="ml-auto">
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  );
}
