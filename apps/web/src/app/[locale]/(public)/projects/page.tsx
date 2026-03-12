import { ChevronLeft } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';

import { Navbar } from '@/components/layout/Navbar';
import { Link } from '@/i18n/navigation';
import { getPublishedProjects } from '@/server/project';

import { ProjectsPageClient } from './ProjectsPageClient';

interface ProjectsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const { locale } = await params;
  const [projects, t] = await Promise.all([
    getPublishedProjects(locale),
    getTranslations('projects'),
  ]);

  const countText = projects.length > 0 ? t('count_other', { count: projects.length }) : t('empty');

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 lg:hidden">
        <Navbar />
      </div>

      <div className="mx-auto max-w-[1200px] px-5 md:px-8 lg:px-6 pb-16">
        <div className="hidden lg:block">
          <Navbar />
        </div>

        <header className="mb-10 pt-6 lg:pt-0">
          <Link
            href="/"
            className="inline-flex items-center gap-1 font-sans text-[13px] text-foreground/50 hover:text-olive transition-colors mb-4"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            {t('backHome')}
          </Link>
          <h1 className="font-spectral font-bold text-[26px] md:text-[32px] text-foreground">
            {t('pageHeading')}
          </h1>
          <p className="font-spectral text-[16px] text-foreground/60 mt-1">{countText}</p>
        </header>

        <Suspense>
          <ProjectsPageClient projects={projects} />
        </Suspense>
      </div>
    </div>
  );
}
