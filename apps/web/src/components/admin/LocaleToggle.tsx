'use client';

interface LocaleToggleProps {
  locale: 'en' | 'pt';
  onChange: (locale: 'en' | 'pt') => void;
  disabled?: boolean;
}

export function LocaleToggle({ locale, onChange, disabled }: LocaleToggleProps) {
  return (
    <div
      className={`inline-flex rounded-lg border border-brand/20 bg-brand/5 p-0.5 ${disabled ? 'opacity-40 pointer-events-none' : ''}`}
    >
      {(['en', 'pt'] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => onChange(l)}
          disabled={locale === l}
          className={[
            'h-7 px-3 rounded-md font-sans text-[12px] font-medium uppercase tracking-wide transition-all',
            locale === l
              ? 'bg-brand text-brand-foreground shadow-sm cursor-default'
              : 'text-foreground/60 hover:text-foreground',
          ].join(' ')}
        >
          {l === 'en' ? 'EN' : 'PT'}
        </button>
      ))}
    </div>
  );
}
