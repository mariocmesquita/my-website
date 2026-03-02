import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

import type { Project } from '@/components/ui/ProjectCard';
import { ProjectCard } from '@/components/ui/ProjectCard';

const PROJECTS: Project[] = [
  {
    title: 'my-website',
    description:
      'Personal website with CV, portfolio, projects, and blog. Built as a full-stack monorepo with Next.js and NestJS, featuring Firebase Auth and a PostgreSQL database.',
    techStack: ['Next.js', 'NestJS', 'PostgreSQL', 'Prisma'],
    bannerColor: 'from-stone-300 to-stone-400',
  },
  {
    title: 'Image Processing Pipeline',
    description:
      'Automated pipeline for product image processing — background removal, normalization, and multi-size/format export. Replaced manual editing and cut processing time from weeks to hours.',
    techStack: ['Node.js', 'TypeScript', 'Docker', 'AWS'],
    bannerColor: 'from-amber-200 to-amber-300',
  },
  {
    title: 'Real-time Tracking System',
    description:
      'Cross-platform real-time tracking feature for a corporate training platform, delivering live updates across web and mobile applications.',
    techStack: ['React Native', 'NestJS', 'Redis', 'Firebase'],
    bannerColor: 'from-emerald-200 to-emerald-300',
  },
];

export function ProjectsSection() {
  return (
    <section id="projects" className="mt-16">
      <h2 className="font-spectral font-bold text-[19px] text-foreground mb-7">Últimos Projetos</h2>

      <div className="space-y-9">
        {PROJECTS.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>

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
