import { type ProjectListItem } from '@my-website/schemas/project';
import Image from 'next/image';
import Link from 'next/link';

import { TechBadge } from '@/components/ui/TechBadge';

interface RelatedProjectsProps {
  projects: ProjectListItem[];
}

export function RelatedProjects({ projects }: RelatedProjectsProps) {
  return (
    <section className="mt-16 pt-10 border-t border-brand/10">
      <p className="font-sans text-[11px] uppercase tracking-[0.14em] text-foreground/40 mb-6">
        Projetos relacionados
      </p>
      <div className="space-y-5">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.slug}`}
            className="group flex items-start gap-5 -mx-4 px-4 py-3 rounded-2xl hover:bg-brand/10 transition-colors"
          >
            <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-xl border-2 border-brand/60">
              {project.bannerImage ? (
                <Image
                  src={project.bannerImage}
                  alt={project.title}
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-stone-300 to-stone-400" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-spectral font-bold text-[15px] text-foreground group-hover:text-olive transition-colors">
                {project.title}
              </p>
              <p className="font-spectral text-[14px] text-foreground/70 leading-[1.6] mt-0.5 line-clamp-2">
                {project.summary}
              </p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {project.techStack.slice(0, 4).map((tech) => (
                  <TechBadge key={tech} label={tech} />
                ))}
                {project.techStack.length > 4 && (
                  <span className="inline-flex items-center h-7 px-2 text-[12px] font-sans text-foreground/40">
                    +{project.techStack.length - 4}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
