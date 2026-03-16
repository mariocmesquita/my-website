import { format } from 'date-fns';
import { enUS, ptBR } from 'date-fns/locale';
import { ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { Navbar } from '@/components/layout/Navbar';
import { LikeButton } from '@/components/ui/LikeButton';
import { NotTranslatedBanner } from '@/components/ui/NotTranslatedBanner';
import { TechBadge } from '@/components/ui/TechBadge';
import { Link } from '@/i18n/navigation';
import { getPostDetail } from '@/server/post';
import { getPublishedProjects } from '@/server/project';

import { PostContent } from './PostContent';
import { RelatedProjects } from './RelatedProjects';

interface PostDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { locale, slug } = await params;
  const [post, allProjects, t] = await Promise.all([
    getPostDetail(slug, locale),
    getPublishedProjects(locale),
    getTranslations('posts'),
  ]);

  if (!post) notFound();

  const relatedProjects = allProjects.filter((p) => post.relatedProjectIds.includes(p.id));

  const dateFnsLocale = locale === 'pt' ? ptBR : enUS;
  const datePattern = locale === 'pt' ? "dd 'de' MMMM 'de' yyyy" : 'MMMM dd, yyyy';

  const formattedDate = post.publishDate
    ? format(new Date(post.publishDate), datePattern, { locale: dateFnsLocale })
    : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 lg:hidden">
        <Navbar />
      </div>

      <div className="mx-auto max-w-[1200px] px-5 md:px-8 lg:px-6 pb-20">
        <div className="hidden lg:block">
          <Navbar />
        </div>

        <Link
          href="/blog"
          className="inline-flex items-center gap-1 font-sans text-[13px] text-foreground/50 hover:text-olive transition-colors mb-8 pt-6 lg:pt-0"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          {t('backToList')}
        </Link>

        {post.translated === false && <NotTranslatedBanner />}

        {/* Banner */}
        {post.bannerImage && (
          <div className="mb-10 mx-auto max-w-2xl overflow-hidden rounded-2xl border border-brand/15">
            <Image
              src={post.bannerImage}
              alt={post.title}
              width={1280}
              height={720}
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="w-full h-auto"
              priority
            />
          </div>
        )}

        {/* Header */}
        <header className="mb-10 pb-6 border-b border-brand/10">
          {formattedDate && (
            <p className="font-sans text-[12px] uppercase tracking-[0.14em] text-foreground/40 mb-3">
              {formattedDate}
            </p>
          )}
          <h1 className="font-spectral font-bold text-[26px] md:text-[34px] text-foreground leading-tight mb-3">
            {post.title}
          </h1>
          <p className="font-spectral text-[17px] text-foreground/65 leading-[1.7] mb-6">
            {post.summary}
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-6">
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center h-7 px-3 rounded-full bg-brand/10 font-sans text-[12px] text-brand/80"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <LikeButton
            slug={post.slug}
            initialLikesCount={post.likesCount}
            initialLiked={post.viewer.liked}
          />
        </header>

        {/* Tech stack */}
        {post.techStack.length > 0 && (
          <div className="mb-10">
            <p className="font-sans text-[11px] uppercase tracking-[0.14em] text-foreground/40 mb-3">
              {t('stackLabel')}
            </p>
            <div className="flex flex-wrap gap-2">
              {post.techStack.map((tech) => (
                <TechBadge key={tech} label={tech} />
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <section className="mb-10">
          <PostContent content={post.content} />
        </section>

        {/* Related projects */}
        {relatedProjects.length > 0 && <RelatedProjects projects={relatedProjects} />}
      </div>
    </div>
  );
}
