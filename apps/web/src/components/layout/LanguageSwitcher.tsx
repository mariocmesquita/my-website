'use client';

import { useLocale } from 'next-intl';
import { useEffect, useState, useTransition } from 'react';

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

  useEffect(() => {
    if (pendingLocale) {
      document.cookie = `NEXT_LOCALE=${pendingLocale}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`;
    }
  }, [pendingLocale]);

  const switchLocale = (newLocale: string) => {
    if (newLocale === locale) return;
    setPendingLocale(newLocale);
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  };

  return (
    <div className="flex items-center gap-0.5">
      {LOCALES.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => switchLocale(code)}
          disabled={isPending}
          className={`px-2 py-0.5 rounded text-[13px] font-sans font-medium transition-all disabled:opacity-50 ${
            locale === code
              ? 'text-brand-foreground bg-brand-foreground/20'
              : 'text-brand-foreground/60 hover:text-brand-foreground'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
