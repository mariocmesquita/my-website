import { ChevronLeft } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';

import { Navbar } from '@/components/layout/Navbar';
import { Link } from '@/i18n/navigation';
import { getPublishedPosts } from '@/server/post';

import { BlogPageClient } from './BlogPageClient';

interface BlogPageProps {
  params: Promise<{ locale: string }>;
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params;
  const [posts, t] = await Promise.all([getPublishedPosts(locale), getTranslations('posts')]);

  const countText = posts.length > 0 ? t('count_other', { count: posts.length }) : t('empty');

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1200px] px-6 pb-16">
        <Navbar />

        <header className="mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1 font-sans text-[13px] text-foreground/50 hover:text-olive transition-colors mb-4"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            {t('backHome')}
          </Link>
          <h1 className="font-spectral font-bold text-[32px] text-foreground">
            {t('pageHeading')}
          </h1>
          <p className="font-spectral text-[16px] text-foreground/60 mt-1">{countText}</p>
        </header>

        <Suspense>
          <BlogPageClient posts={posts} locale={locale} />
        </Suspense>
      </div>
    </div>
  );
}
