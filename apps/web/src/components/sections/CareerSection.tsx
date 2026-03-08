import { type Career } from '@my-website/schemas/career';
import { getLocale, getTranslations } from 'next-intl/server';

interface CareerSectionProps {
  entries: Career[];
}

async function getDateFormatter(locale: string) {
  const dateLocale = locale === 'pt' ? 'pt-BR' : 'en-US';
  return (d: string) => {
    const [year, month] = d.split('T')[0]!.split('-').map(Number);
    return new Date(year!, month! - 1, 1).toLocaleDateString(dateLocale, {
      month: 'short',
      year: 'numeric',
    });
  };
}

export async function CareerSection({ entries }: CareerSectionProps) {
  const t = await getTranslations('career');
  const locale = await getLocale();
  const fmt = await getDateFormatter(locale);

  if (entries.length === 0) return null;

  return (
    <section id="career" className="mt-16">
      <h2 className="font-spectral font-bold text-[19px] text-foreground mb-7">{t('heading')}</h2>

      <div className="relative">
        <div className="absolute left-[5px] top-1.5 bottom-0 w-[1.5px] bg-brand/40" />

        <div className="space-y-9">
          {entries.map((entry) => (
            <div key={entry.id} className="relative pl-8">
              <div className="absolute left-0 top-[6px] w-[11px] h-[11px] rounded-full bg-brand border-2 border-background" />

              <p className="font-sans text-[12px] text-foreground/60">
                {fmt(entry.startDate)} — {entry.endDate ? fmt(entry.endDate) : t('present')}
              </p>
              <p className="font-spectral font-bold text-[16px] text-foreground mt-0.5">
                {entry.role}
              </p>
              <p className="font-sans text-[11px] text-foreground/50 mt-0.5 italic">
                {entry.company}
              </p>

              <p className="mt-3 font-spectral text-[16px] text-foreground leading-[1.7] max-w-2xl whitespace-pre-wrap">
                {entry.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
