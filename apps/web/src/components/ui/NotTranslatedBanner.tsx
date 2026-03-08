'use client';

import { Info } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function NotTranslatedBanner() {
  const t = useTranslations();
  return (
    <div className="flex items-center gap-2 px-4 py-2.5 mb-6 rounded-xl bg-brand/10 border border-brand/20 font-sans text-[13px] text-foreground/70">
      <Info className="w-4 h-4 shrink-0 text-brand/60" />
      {t('notTranslated')}
    </div>
  );
}
