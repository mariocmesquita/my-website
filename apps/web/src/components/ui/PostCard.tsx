import { type PostListItem } from '@my-website/schemas/post';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Heart, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function PostCard({ post }: { post: PostListItem }) {
  const formattedDate = post.publishDate
    ? format(new Date(post.publishDate), "dd 'de' MMM, yyyy", { locale: ptBR })
    : null;

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex items-start gap-5 -mx-4 px-4 py-3 rounded-2xl hover:bg-brand/5 transition-colors"
    >
      <div className="relative w-42 h-30 rounded-xl border-2 border-brand/60 overflow-hidden shrink-0 bg-gradient-to-br from-stone-200 to-stone-300">
        {post.bannerImage ? (
          <Image
            src={post.bannerImage}
            alt={post.title}
            fill
            sizes="168px"
            className="object-cover"
          />
        ) : null}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-spectral font-bold text-[16px] text-foreground group-hover:text-olive transition-colors">
          {post.title}
        </p>
        <p className="font-spectral text-[16px] text-foreground/80 leading-[1.65] mt-1 max-w-lg">
          {post.summary}
        </p>
        <div className="flex items-center gap-5 mt-2.5 font-sans text-[12px] text-foreground/60">
          {formattedDate && <span>{formattedDate}</span>}
          <span className="flex items-center gap-1">
            <Heart className="w-3.5 h-3.5" />{post.likesCount}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="w-3.5 h-3.5" />0
          </span>
        </div>
      </div>
    </Link>
  );
}
