import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

import { Navbar } from '@/components/layout/Navbar';
import { getPublishedProjects } from '@/lib/project';

import { ProjectsPageClient } from './ProjectsPageClient';

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1200px] px-6 pb-16">
        <Navbar />

        <header className="mb-10">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-1 font-sans text-[13px] text-foreground/50 hover:text-olive transition-colors mb-4"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Início
          </Link>
          <h1 className="font-spectral font-bold text-[32px] text-foreground">Projetos</h1>
          <p className="font-spectral text-[16px] text-foreground/60 mt-1">
            {projects.length > 0
              ? `${projects.length} projeto${projects.length > 1 ? 's' : ''} publicado${projects.length > 1 ? 's' : ''}`
              : 'Nenhum projeto publicado ainda.'}
          </p>
        </header>

        <Suspense>
          <ProjectsPageClient projects={projects} />
        </Suspense>
      </div>
    </div>
  );
}
