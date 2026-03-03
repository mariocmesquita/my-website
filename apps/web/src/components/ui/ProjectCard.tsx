import { type ProjectListItem } from '@my-website/schemas/project';
import Image from 'next/image';

import { TechBadge } from '@/components/ui/TechBadge';

export function ProjectCard({ project }: { project: ProjectListItem }) {
  return (
    <div className="flex items-start gap-5">
      <div className="relative h-30 w-42 shrink-0 overflow-hidden rounded-xl border-2 border-brand/60">
        {project.bannerImage ? (
          <Image
            src={project.bannerImage}
            alt={project.title}
            fill
            sizes="168px"
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-stone-300 to-stone-400" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        {project.githubLink ? (
          <a
            href={project.githubLink}
            target="_blank"
            rel="noopener noreferrer"
            className="font-spectral font-bold text-[16px] text-foreground hover:text-olive transition-colors"
          >
            {project.title}
          </a>
        ) : (
          <p className="font-spectral font-bold text-[16px] text-foreground">{project.title}</p>
        )}
        <p className="font-spectral text-[16px] text-foreground/80 leading-[1.65] mt-1 max-w-lg">
          {project.summary}
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          {project.techStack.map((tech) => (
            <TechBadge key={tech} label={tech} />
          ))}
        </div>
      </div>
    </div>
  );
}
