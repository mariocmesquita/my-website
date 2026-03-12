import { type Profile } from '@my-website/schemas/profile';
import { getTranslations } from 'next-intl/server';

interface AboutSectionProps {
  profile: Profile | null;
}

export async function AboutSection({ profile }: AboutSectionProps) {
  const t = await getTranslations('sidebar');

  const paragraphs = profile?.bio
    .split('\n\n')
    .filter(Boolean)
    .map((p) => p.trim());

  return (
    <section id="about" className="max-w-2xl">
      <h2 className="lg:hidden font-spectral font-bold text-[19px] text-foreground mb-4">
        {t('about')}
      </h2>
      <div className="font-spectral text-[16px] text-foreground leading-[1.75] space-y-5">
        {paragraphs?.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}
