import { type ProjectListItem } from '@my-website/schemas/project';
import Image from 'next/image';
import Link from 'next/link';

import { TechBadge } from '@/components/ui/TechBadge';

export function ProjectCard({ project }: { project: ProjectListItem }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex items-start gap-5 -mx-4 px-4 py-3 rounded-2xl hover:bg-brand/10 transition-colors"
    >
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
        <p className="font-spectral font-bold text-[16px] text-foreground group-hover:text-olive transition-colors">
          {project.title}
        </p>
        <p className="font-spectral text-[16px] text-foreground/80 leading-[1.65] mt-1 max-w-lg">
          {project.summary}
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          {project.techStack.map((tech) => (
            <TechBadge key={tech} label={tech} />
          ))}
        </div>
      </div>
    </Link>
  );
}
