import { type ProjectListItem } from '@my-website/schemas/project';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

import { ProjectCard } from '@/components/ui/ProjectCard';

interface ProjectsSectionProps {
  projects: ProjectListItem[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const visible = projects.slice(0, 3);

  return (
    <section id="projects" className="mt-16">
      <h2 className="font-spectral font-bold text-[19px] text-foreground mb-7">Últimos Projetos</h2>

      {visible.length > 0 ? (
        <div className="space-y-9">
          {visible.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Nenhum projeto publicado ainda.</p>
      )}

      <Link
        href="/projects"
        className="inline-flex items-center gap-1 mt-7 font-sans text-[14px] text-olive hover:opacity-75 transition-opacity"
      >
        Todos os projetos
        <ArrowUpRight className="w-3.5 h-3.5" />
      </Link>
    </section>
  );
}
