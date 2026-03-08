import { type PostListItem } from '@my-website/schemas/post';
import { ArrowUpRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { PostCard } from '@/components/ui/PostCard';
import { Link } from '@/i18n/navigation';

interface PostsSectionProps {
  posts: PostListItem[];
  locale: string;
}

export function PostsSection({ posts, locale }: PostsSectionProps) {
  const t = useTranslations('posts');

  return (
    <section id="posts" className="mt-16">
      <h2 className="font-spectral font-bold text-[19px] text-foreground mb-7">{t('heading')}</h2>

      {posts.length > 0 ? (
        <div className="space-y-9">
          {posts.slice(0, 3).map((post) => (
            <PostCard key={post.id} post={post} locale={locale} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">{t('empty')}</p>
      )}

      <Link
        href="/blog"
        className="inline-flex items-center gap-1 mt-7 font-sans text-[14px] text-olive hover:opacity-75 transition-opacity"
      >
        {t('viewAll')}
        <ArrowUpRight className="w-3.5 h-3.5" />
      </Link>
    </section>
  );
}
