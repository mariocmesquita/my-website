import { type Career } from '@my-website/schemas/career';

interface CareerSectionProps {
  entries: Career[];
}

function formatPeriod(startDate: string, endDate: string | null): string {
  const fmt = (d: string) => {
    const [year, month] = d.split('T')[0]!.split('-').map(Number);
    return new Date(year!, month! - 1, 1).toLocaleDateString('pt-BR', {
      month: 'short',
      year: 'numeric',
    });
  };
  return `${fmt(startDate)} — ${endDate ? fmt(endDate) : 'presente'}`;
}

export function CareerSection({ entries }: CareerSectionProps) {
  if (entries.length === 0) return null;

  return (
    <section id="career" className="mt-16">
      <h2 className="font-spectral font-bold text-[19px] text-foreground mb-7">Carreira</h2>

      <div className="relative">
        <div className="absolute left-[5px] top-1.5 bottom-0 w-[1.5px] bg-brand/40" />

        <div className="space-y-9">
          {entries.map((entry) => (
            <div key={entry.id} className="relative pl-8">
              <div className="absolute left-0 top-[6px] w-[11px] h-[11px] rounded-full bg-brand border-2 border-background" />

              <p className="font-sans text-[12px] text-foreground/60">
                {formatPeriod(entry.startDate, entry.endDate)}
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
