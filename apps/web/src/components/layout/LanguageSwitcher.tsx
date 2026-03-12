'use client';

import { ChevronDown } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useEffect, useRef, useState, useTransition } from 'react';

import { usePathname, useRouter } from '@/i18n/navigation';

const LOCALES = [
  { code: 'en', label: 'EN' },
  { code: 'pt', label: 'PT' },
];

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [pendingLocale, setPendingLocale] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pendingLocale) {
      document.cookie = `NEXT_LOCALE=${pendingLocale}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`;
    }
  }, [pendingLocale]);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  const switchLocale = (newLocale: string) => {
    setOpen(false);
    if (newLocale === locale) return;
    setPendingLocale(newLocale);
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  };

  const currentLabel = LOCALES.find((l) => l.code === locale)?.label ?? 'EN';

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={isPending}
        className="flex items-center gap-1 px-2 py-0.5 rounded text-[13px] font-sans font-medium text-brand-foreground hover:bg-brand-foreground/10 transition-all disabled:opacity-50 cursor-pointer"
      >
        {currentLabel}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-1 bg-background rounded-lg shadow-lg border border-brand/15 overflow-hidden z-50 min-w-[56px]">
          {LOCALES.map(({ code, label }) => (
            <button
              key={code}
              onClick={() => switchLocale(code)}
              className={`block w-full text-left px-3 py-1.5 text-[13px] font-sans font-medium transition-colors cursor-pointer ${
                locale === code ? 'text-brand bg-brand/10' : 'text-foreground hover:bg-brand/5'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
