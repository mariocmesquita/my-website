'use client';

import { ArrowUp } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

const SHOW_AFTER_PX = 400;

export function BackToTopButton() {
  const t = useTranslations();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER_PX);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <button
      onClick={scrollToTop}
      aria-label={t('backToTop')}
      className={`fixed bottom-6 right-6 md:bottom-12 md:right-12 w-10 h-10 bg-brand text-brand-foreground rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition-all duration-300 z-50 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}
