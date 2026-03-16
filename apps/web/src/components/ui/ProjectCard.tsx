import { type ProjectListItem } from '@my-website/schemas/project';
import Image from 'next/image';

import { TechBadge } from '@/components/ui/TechBadge';
import { Link } from '@/i18n/navigation';

const MAX_VISIBLE_TECHS = 5;

interface ProjectCardProps {
  project: ProjectListItem;
  locale?: string;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex flex-col md:flex-row md:items-start gap-3 md:gap-5 -mx-4 px-4 py-3 rounded-2xl hover:bg-brand/10 transition-colors"
    >
      <div className="relative w-full aspect-video md:w-42 md:h-30 md:aspect-auto md:shrink-0 overflow-hidden rounded-xl border-2 border-brand/60">
        {project.bannerImage ? (
          <Image
            src={project.bannerImage}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 168px"
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-stone-300 to-stone-400" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-spectral font-bold text-[16px] text-foreground group-hover:text-olive transition-colors">
          {project.title}
        </p>
        <p className="font-spectral text-[16px] text-foreground/80 leading-[1.65] mt-1 max-w-lg line-clamp-3">
          {project.summary}
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          {project.techStack.slice(0, MAX_VISIBLE_TECHS).map((tech) => (
            <TechBadge key={tech} label={tech} />
          ))}
          {project.techStack.length > MAX_VISIBLE_TECHS && (
            <span className="inline-flex items-center h-7 px-2.5 text-[12px] font-sans text-foreground/50">
              +{project.techStack.length - MAX_VISIBLE_TECHS}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
