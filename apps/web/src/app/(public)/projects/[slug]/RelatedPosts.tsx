import { type PostListItem } from '@my-website/schemas/post';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Image from 'next/image';
import Link from 'next/link';

interface RelatedPostsProps {
  posts: PostListItem[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  return (
    <section className="mt-16 pt-10 border-t border-brand/10">
      <p className="font-sans text-[11px] uppercase tracking-[0.14em] text-foreground/40 mb-6">
        Posts relacionados
      </p>
      <div className="space-y-5">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group flex items-start gap-5 -mx-4 px-4 py-3 rounded-2xl hover:bg-brand/10 transition-colors"
          >
            <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-xl border-2 border-brand/60">
              {post.bannerImage ? (
                <Image
                  src={post.bannerImage}
                  alt={post.title}
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-stone-300 to-stone-400" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              {post.publishDate && (
                <p className="font-sans text-[11px] text-foreground/40 mb-0.5">
                  {format(new Date(post.publishDate), "dd 'de' MMM 'de' yyyy", { locale: ptBR })}
                </p>
              )}
              <p className="font-spectral font-bold text-[15px] text-foreground group-hover:text-olive transition-colors">
                {post.title}
              </p>
              <p className="font-spectral text-[14px] text-foreground/70 leading-[1.6] mt-0.5 line-clamp-2">
                {post.summary}
              </p>
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {post.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center h-5 px-2 rounded-full bg-brand/10 font-sans text-[11px] text-brand/70"
                    >
                      {tag}
                    </span>
                  ))}
                  {post.tags.length > 4 && (
                    <span className="inline-flex items-center h-5 px-2 font-sans text-[11px] text-foreground/40">
                      +{post.tags.length - 4}
                    </span>
                  )}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
