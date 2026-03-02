import { TechBadge } from '@/components/ui/TechBadge';

export interface Project {
  title: string;
  description: string;
  techStack: string[];
  bannerColor: string;
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="flex items-start gap-5">
      <div
        className={`w-42 h-30 rounded-xl border-2 border-brand/60 overflow-hidden shrink-0 bg-gradient-to-br ${project.bannerColor}`}
      />
      <div className="flex-1 min-w-0">
        <p className="font-spectral font-bold text-[16px] text-foreground">{project.title}</p>
        <p className="font-spectral text-[16px] text-foreground/80 leading-[1.65] mt-1 max-w-lg">
          {project.description}
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
