'use client';

import { Heart } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface LikeButtonProps {
  slug: string;
  initialLikesCount: number;
  initialLiked: boolean;
}

export function LikeButton({ slug, initialLikesCount, initialLiked }: LikeButtonProps) {
  const t = useTranslations('likeButton');
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [liked, setLiked] = useState(initialLiked);
  const [isLoading, setIsLoading] = useState(false);

  async function handleLike() {
    if (liked || isLoading) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/posts/${slug}/like`, { method: 'POST' });
      if (res.ok) {
        const json = await res.json();
        setLikesCount(json.data.likesCount);
        setLiked(true);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      onClick={handleLike}
      disabled={liked || isLoading}
      aria-label={liked ? t('liked') : t('notLiked')}
      className={[
        'inline-flex items-center gap-1 h-7 px-2 rounded-full border font-sans text-[13px] transition-all',
        liked
          ? 'bg-brand/10 border-brand/30 text-brand cursor-default'
          : 'border-brand/20 text-foreground/60 hover:bg-brand/5 hover:border-brand/30 hover:text-brand cursor-pointer',
        isLoading ? 'opacity-60' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <Heart
        className={['w-4 h-4 transition-all', liked ? 'fill-brand text-brand' : ''].join(' ')}
      />
      <span>{likesCount}</span>
    </button>
  );
}
