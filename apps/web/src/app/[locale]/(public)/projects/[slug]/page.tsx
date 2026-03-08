import { ArrowUpRight, ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { Navbar } from '@/components/layout/Navbar';
import { NotTranslatedBanner } from '@/components/ui/NotTranslatedBanner';
import { TechBadge } from '@/components/ui/TechBadge';
import { Link } from '@/i18n/navigation';
import { getPublishedPosts } from '@/server/post';
import { getProjectDetail } from '@/server/project';

import { RelatedPosts } from './RelatedPosts';
import { ScreenshotsLightbox } from './ScreenshotsLightbox';

interface ProjectDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { locale, slug } = await params;
  const [project, posts, t] = await Promise.all([
    getProjectDetail(slug, locale),
    getPublishedPosts(locale),
    getTranslations('projects'),
  ]);

  if (!project) notFound();

  const relatedPosts = posts.filter((p) => project.relatedPostIds.includes(p.id));

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1200px] px-6 pb-20">
        <Navbar />

        <Link
          href="/projects"
          className="inline-flex items-center gap-1 font-sans text-[13px] text-foreground/50 hover:text-olive transition-colors mb-8"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          {t('backToList')}
        </Link>

        {project.translated === false && <NotTranslatedBanner />}

        {/* Banner */}
        {project.bannerImage && (
          <div className="relative w-full aspect-video max-h-[420px] overflow-hidden rounded-2xl border border-brand/15 mb-10">
            <Image
              src={project.bannerImage}
              alt={project.title}
              fill
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Header */}
        <header className="mb-10 pb-10 border-b border-brand/10">
          <h1 className="font-spectral font-bold text-[34px] text-foreground leading-tight mb-3">
            {project.title}
          </h1>
          <p className="font-spectral text-[17px] text-foreground/65 leading-[1.7] mb-6">
            {project.summary}
          </p>
          {project.githubLink && (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-9 px-4 bg-brand text-brand-foreground rounded-xl font-sans text-[13px] hover:opacity-85 transition-opacity"
            >
              {t('viewOnGithub')}
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          )}
        </header>

        {/* Tech stack */}
        {project.techStack.length > 0 && (
          <div className="mb-10">
            <p className="font-sans text-[11px] uppercase tracking-[0.14em] text-foreground/40 mb-3">
              {t('stackLabel')}
            </p>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <TechBadge key={tech} label={tech} />
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        {project.description && (
          <section className="mb-10">
            <p className="font-sans text-[11px] uppercase tracking-[0.14em] text-foreground/40 mb-4">
              {t('aboutProject')}
            </p>
            <div className="font-spectral text-[16px] text-foreground/80 leading-[1.8] whitespace-pre-wrap">
              {project.description}
            </div>
          </section>
        )}

        {/* Screenshots */}
        <ScreenshotsLightbox project={project} />

        {relatedPosts.length > 0 && <RelatedPosts posts={relatedPosts} locale={locale} />}
      </div>
    </div>
  );
}
