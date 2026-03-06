import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Navbar } from '@/components/layout/Navbar';
import { TechBadge } from '@/components/ui/TechBadge';
import { getPostDetail } from '@/lib/post';
import { getPublishedProjects } from '@/lib/project';

import { PostContent } from './PostContent';
import { RelatedProjects } from './RelatedProjects';

interface PostDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { slug } = await params;
  const [post, allProjects] = await Promise.all([getPostDetail(slug), getPublishedProjects()]);

  if (!post) notFound();

  const relatedProjects = allProjects.filter((p) => post.relatedProjectIds.includes(p.id));

  const formattedDate = post.publishDate
    ? format(new Date(post.publishDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
    : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1200px] px-6 pb-20">
        <Navbar />

        <Link
          href="/blog"
          className="inline-flex items-center gap-1 font-sans text-[13px] text-foreground/50 hover:text-olive transition-colors mb-8"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Todos os posts
        </Link>

        {/* Banner */}
        {post.bannerImage && (
          <div className="relative w-full aspect-video max-h-[420px] overflow-hidden rounded-2xl border border-brand/15 mb-10">
            <Image
              src={post.bannerImage}
              alt={post.title}
              fill
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Cabeçalho */}
        <header className="mb-10 pb-10 border-b border-brand/10">
          {formattedDate && (
            <p className="font-sans text-[12px] uppercase tracking-[0.14em] text-foreground/40 mb-3">
              {formattedDate}
            </p>
          )}
          <h1 className="font-spectral font-bold text-[34px] text-foreground leading-tight mb-3">
            {post.title}
          </h1>
          <p className="font-spectral text-[17px] text-foreground/65 leading-[1.7] mb-6">
            {post.summary}
          </p>

          <div className="flex flex-wrap gap-4">
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center h-6 px-3 rounded-full bg-brand/10 font-sans text-[12px] text-brand/80"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* Tech stack */}
        {post.techStack.length > 0 && (
          <div className="mb-10">
            <p className="font-sans text-[11px] uppercase tracking-[0.14em] text-foreground/40 mb-3">
              Stack
            </p>
            <div className="flex flex-wrap gap-2">
              {post.techStack.map((tech) => (
                <TechBadge key={tech} label={tech} />
              ))}
            </div>
          </div>
        )}

        {/* Conteúdo */}
        <section className="mb-10">
          <PostContent content={post.content} />
        </section>

        {/* Projetos relacionados */}
        {relatedProjects.length > 0 && <RelatedProjects projects={relatedProjects} />}
      </div>
    </div>
  );
}
