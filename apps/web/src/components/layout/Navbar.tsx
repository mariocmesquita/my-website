'use client';

import { Menu, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

import { Link } from '@/i18n/navigation';

import { LanguageSwitcher } from './LanguageSwitcher';

const NAV_ITEMS = [
  { labelKey: 'home' as const, href: '/' },
  { labelKey: 'projects' as const, href: '/projects' },
  { labelKey: 'blog' as const, href: '/blog' },
];

export function Navbar() {
  const t = useTranslations('nav');
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [menuOpen]);

  const handleLinkClick = () => setMenuOpen(false);

  return (
    <nav ref={navRef} className="lg:mt-5 lg:mb-10 relative">
      <div className="flex items-center bg-brand h-11 px-4 lg:px-6 lg:rounded-xl font-sans w-full">
        {/* Mobile: hamburger toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden text-brand-foreground p-1 -ml-1 cursor-pointer"
          aria-label={menuOpen ? t('closeMenu') : t('openMenu')}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Desktop: inline nav links */}
        <div className="hidden lg:flex items-center gap-6">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[14px] text-brand-foreground hover:opacity-75 transition-opacity"
            >
              {t(item.labelKey)}
            </Link>
          ))}
        </div>

        {/* Language switcher */}
        <div className="ml-auto">
          <LanguageSwitcher />
        </div>
      </div>

      {/* Mobile: dropdown menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 lg:hidden bg-brand px-4 pb-3 shadow-lg z-50">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleLinkClick}
              className="block py-2.5 text-[14px] text-brand-foreground hover:opacity-75 transition-opacity font-sans border-t border-brand-foreground/10 first:border-t-0"
            >
              {t(item.labelKey)}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
