import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

import type { Post } from '@/components/ui/PostCard';
import { PostCard } from '@/components/ui/PostCard';

const POSTS: Post[] = [
  {
    title: 'Building a High-Performance Query Layer with MongoDB',
    excerpt:
      'A look at how we migrated from Firebase Firestore to MongoDB and the query optimization techniques that achieved 85% performance gains.',
    date: 'Nov 03, 2025',
    likes: 122,
    comments: 3,
    bannerColor: 'from-stone-300 to-stone-400',
  },
  {
    title: 'Designing a Clean Monorepo with Turborepo and pnpm',
    excerpt:
      'Lessons learned setting up a production monorepo — package separation, shared configs, and keeping build times fast with proper caching.',
    date: 'Oct 25, 2025',
    likes: 184,
    comments: 7,
    bannerColor: 'from-blue-100 to-blue-200',
  },
  {
    title: 'Product Mindset for Engineers: Why It Changes Everything',
    excerpt:
      'Why thinking like a product engineer — not just a developer — leads to better technical decisions and more impactful work.',
    date: 'Oct 18, 2025',
    likes: 145,
    comments: 1,
    bannerColor: 'from-rose-100 to-rose-200',
  },
];

export function PostsSection() {
  return (
    <section id="posts" className="mt-16">
      <h2 className="font-spectral font-bold text-[19px] text-foreground mb-7">Últimos posts</h2>

      <div className="space-y-9">
        {POSTS.map((post) => (
          <PostCard key={post.title} post={post} />
        ))}
      </div>

      <Link
        href="/blog"
        className="inline-flex items-center gap-1 mt-7 font-sans text-[14px] text-olive hover:opacity-75 transition-opacity"
      >
        Todos os posts
        <ArrowUpRight className="w-3.5 h-3.5" />
      </Link>
    </section>
  );
}
