import { type PostListItem } from '@my-website/schemas/post';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

import { PostCard } from '@/components/ui/PostCard';

interface PostsSectionProps {
  posts: PostListItem[];
}

export function PostsSection({ posts }: PostsSectionProps) {
  const visible = posts.slice(0, 3);

  return (
    <section id="posts" className="mt-16">
      <h2 className="font-spectral font-bold text-[19px] text-foreground mb-7">Últimos posts</h2>

      {visible.length > 0 ? (
        <div className="space-y-9">
          {visible.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Nenhum post publicado ainda.</p>
      )}

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
