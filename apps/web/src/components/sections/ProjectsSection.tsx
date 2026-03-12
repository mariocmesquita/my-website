import { type ProjectListItem } from '@my-website/schemas/project';
import { ArrowUpRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ProjectCard } from '@/components/ui/ProjectCard';
import { Link } from '@/i18n/navigation';

interface ProjectsSectionProps {
  projects: ProjectListItem[];
  locale: string;
}

export function ProjectsSection({ projects, locale }: ProjectsSectionProps) {
  const t = useTranslations('projects');
  const visible = projects.slice(0, 3);

  return (
    <section id="projects" className="mt-10 lg:mt-16">
      <h2 className="font-spectral font-bold text-[19px] text-foreground mb-4 lg:mb-7">
        {t('heading')}
      </h2>

      {visible.length > 0 ? (
        <div className="space-y-5 lg:space-y-9">
          {visible.map((project) => (
            <ProjectCard key={project.id} project={project} locale={locale} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">{t('empty')}</p>
      )}

      <Link
        href="/projects"
        className="inline-flex items-center gap-1 mt-4 lg:mt-7 font-sans text-[14px] text-olive hover:opacity-75 transition-opacity"
      >
        {t('viewAll')}
        <ArrowUpRight className="w-3.5 h-3.5" />
      </Link>
    </section>
  );
}
