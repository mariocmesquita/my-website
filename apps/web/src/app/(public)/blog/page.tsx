import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

import { Navbar } from '@/components/layout/Navbar';
import { getPublishedPosts } from '@/lib/post';

import { BlogPageClient } from './BlogPageClient';

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1200px] px-6 pb-16">
        <Navbar />

        <header className="mb-10">
          <Link
            href="/#posts"
            className="inline-flex items-center gap-1 font-sans text-[13px] text-foreground/50 hover:text-olive transition-colors mb-4"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Início
          </Link>
          <h1 className="font-spectral font-bold text-[32px] text-foreground">Blog</h1>
          <p className="font-spectral text-[16px] text-foreground/60 mt-1">
            {posts.length > 0
              ? `${posts.length} post${posts.length > 1 ? 's' : ''} publicado${posts.length > 1 ? 's' : ''}`
              : 'Nenhum post publicado ainda.'}
          </p>
        </header>

        <Suspense>
          <BlogPageClient posts={posts} />
        </Suspense>
      </div>
    </div>
  );
}
