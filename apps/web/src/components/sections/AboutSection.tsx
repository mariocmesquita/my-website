import { type Profile } from '@my-website/schemas/profile';

interface AboutSectionProps {
  profile: Profile | null;
}

export function AboutSection({ profile }: AboutSectionProps) {
  const paragraphs = profile?.bio
    .split('\n\n')
    .filter(Boolean)
    .map((p) => p.trim());

  return (
    <section id="about" className="max-w-2xl">
      <div className="font-spectral text-[16px] text-foreground leading-[1.75] space-y-5">
        {paragraphs?.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}
