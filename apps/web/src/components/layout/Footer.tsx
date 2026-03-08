import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="mt-24 pb-10 border-t border-brand/20 pt-8">
      <p className="font-sans text-[12px] text-foreground/40">
        {t('copyright', { year: new Date().getFullYear() })}
      </p>
    </footer>
  );
}
